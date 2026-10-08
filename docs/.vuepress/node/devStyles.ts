import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  renameSync,
  writeFileSync,
} from 'node:fs'
import path from 'node:path'
import { contentKey, fileKey } from './persistentCache'
import type { Plugin } from 'vite'

/** Warm restarts reuse Sass output; source changes still regenerate live CSS. */
export const documentationStylesPlugin = (projectRoot: string): Plugin => {
  const sourceRoot = path.join(projectRoot, 'packages/theme-chalk/src')
  const outputRoot = path.join(projectRoot, 'docs/.vuepress/.cache/sax-styles')
  const entries = ['index.scss', 'dark/css-vars.scss']
  let signature = ''
  let pending: Promise<void> | undefined
  let changedDuringCompile = false
  const writeAtomic = (file: string, value: string) => {
    const temporary = `${file}.${process.pid}.tmp`
    writeFileSync(temporary, value)
    renameSync(temporary, file)
  }
  const files = () => {
    const result: string[] = []
    const visit = (root: string) => {
      for (const entry of readdirSync(root, { withFileTypes: true })) {
        const file = path.join(root, entry.name)
        if (entry.isDirectory()) visit(file)
        else if (entry.name.endsWith('.scss')) result.push(file)
      }
    }
    visit(sourceRoot)
    return result.sort()
  }
  const prepare = async () => {
    const next = contentKey(
      files().map(fileKey).join('\n') +
        readFileSync(path.join(projectRoot, 'pnpm-lock.yaml'), 'utf8') +
        readFileSync(
          path.join(projectRoot, 'docs/.vuepress/node/devStyles.ts'),
          'utf8',
        ),
    )
    if (signature === next) return
    if (!signature && existsSync(path.join(outputRoot, 'signature'))) {
      signature = readFileSync(path.join(outputRoot, 'signature'), 'utf8')
      if (
        signature === next &&
        entries.every((_, i) => existsSync(path.join(outputRoot, `${i}.css`)))
      )
        return
    }
    const { compileAsync } = await import('sass')
    mkdirSync(outputRoot, { recursive: true })
    await Promise.all(
      entries.map(async (entry, index) => {
        const result = await compileAsync(path.join(sourceRoot, entry), {
          style: 'expanded',
          sourceMap: false,
          silenceDeprecations: [
            'global-builtin',
            'color-functions',
            'if-function',
            'import',
            'new-global',
          ],
        })
        writeAtomic(path.join(outputRoot, `${index}.css`), result.css)
      }),
    )
    signature = next
    writeAtomic(path.join(outputRoot, 'signature'), signature)
  }
  const ensure = async () => {
    pending ??= (async () => {
      do {
        changedDuringCompile = false
        await prepare()
      } while (changedDuringCompile)
    })().finally(() => {
      pending = undefined
    })
    await pending
  }
  return {
    name: 'sax-documentation-style-cache',
    apply: 'serve',
    enforce: 'pre',
    async resolveId(id) {
      const normalized = id.replaceAll('\\', '/')
      const index = entries.findIndex(
        (entry) =>
          normalized === `@vuesax-alpha/theme-chalk/src/${entry}` ||
          normalized === path.join(sourceRoot, entry).replaceAll('\\', '/'),
      )
      if (index < 0) return
      await ensure()
      return path.join(outputRoot, `${index}.css`)
    },
    configureServer(server) {
      server.watcher.add(sourceRoot)
      let timer: ReturnType<typeof setTimeout> | undefined
      const changed = (file: string) => {
        if (
          !file
            .replaceAll('\\', '/')
            .startsWith(`${sourceRoot.replaceAll('\\', '/')}/`) ||
          !file.endsWith('.scss')
        )
          return
        changedDuringCompile = true
        clearTimeout(timer)
        timer = setTimeout(() => {
          ensure()
            .then(() => {
              // Cached CSS is outside Vite's normal filesystem watch scope.
              entries.forEach((_, index) =>
                server.watcher.emit(
                  'change',
                  path.join(outputRoot, `${index}.css`),
                ),
              )
            })
            .catch((error) => server.config.logger.error(String(error)))
        }, 100)
      }
      server.watcher
        .on('change', changed)
        .on('add', changed)
        .on('unlink', changed)
      server.httpServer?.once('close', () => {
        clearTimeout(timer)
        server.watcher
          .off('change', changed)
          .off('add', changed)
          .off('unlink', changed)
      })
    },
  }
}
