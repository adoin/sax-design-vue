import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { createHash } from 'node:crypto'
import fg from 'fast-glob'
import { DOMParser, XMLSerializer } from '@xmldom/xmldom'
import { addIconImports, isApplicationIconSource } from './source'
import type { Plugin } from 'vite'
import type { SaxIconData } from './index'

export interface SaxSvgPreset {
  /** Namespace used in icon names, for example lo-home. */
  preset: string
  /** File or glob, resolved relative to Vite root. */
  url: string | string[]
}

const publicId = 'virtual:sax-svgs/register'
const resolvedId = '\0sax-svgs:register'
const namePrefix = 'virtual:sax-svg/register/'
const dataPrefix = 'virtual:sax-svg/data/'
const resolvedPrefix = '\0sax-svg/'

export interface SaxSvgOptions {
  /** Local names selected dynamically at runtime. */
  safelist?: string[]
}

function parseSvg(source: string, filename: string): SaxIconData {
  const fail = (message: string): never => {
    throw new Error(`[sax-svgs] ${filename}: ${message}`)
  }
  const document = new DOMParser({
    onError: (_level, message) => fail(message),
  }).parseFromString(source, 'image/svg+xml')
  const svg = document.documentElement
  if (!svg || svg.localName !== 'svg') return fail('Expected an SVG document.')
  const attributes: Record<string, string> = {}
  for (let index = 0; index < svg.attributes.length; index++) {
    const attribute = svg.attributes.item(index)!
    if (!['xmlns', 'width', 'height'].includes(attribute.name)) {
      attributes[attribute.name] = attribute.value
    }
  }
  if (!attributes.viewBox) {
    const width = svg.getAttribute('width') || ''
    const height = svg.getAttribute('height') || ''
    if (
      !/^\d+(?:\.\d+)?(?:px)?$/.test(width) ||
      !/^\d+(?:\.\d+)?(?:px)?$/.test(height) ||
      Number.parseFloat(width) <= 0 ||
      Number.parseFloat(height) <= 0
    ) {
      fail('Provide a viewBox, or positive numeric width and height.')
    }
    attributes.viewBox = `0 0 ${Number.parseFloat(width)} ${Number.parseFloat(height)}`
  }
  const serializer = new XMLSerializer()
  const body = Array.from(svg.childNodes)
    .map((node) => serializer.serializeToString(node))
    .join('')
  return { body, attributes }
}

/** Register project SVG files for SIcon and every component icon prop. */
export function signSvgs(
  presets: SaxSvgPreset[],
  options: SaxSvgOptions = {},
): Plugin {
  const namespaces = new Set<string>()
  for (const { preset, url } of presets) {
    if (!/^[a-z][a-z0-9-]*$/.test(preset) || namespaces.has(preset)) {
      throw new Error(
        `[sax-svgs] Expected a unique lowercase preset: "${preset}".`,
      )
    }
    const patterns = Array.isArray(url) ? url : [url]
    if (
      !patterns.length ||
      !patterns.every(
        (pattern) => typeof pattern === 'string' && pattern.trim(),
      )
    ) {
      throw new Error(`[sax-svgs] Empty file pattern for "${preset}".`)
    }
    namespaces.add(preset)
  }
  let root = process.cwd()
  let watchRoots: string[] = []
  let index: Promise<Map<string, string>> | undefined
  const data = new Map<string, SaxIconData>()
  const files = new Map<string, Promise<{ hash: string; filename: string }>>()
  const scan = () =>
    (index ??= (async () => {
      const names = new Map<string, string>()
      for (const { preset, url } of presets) {
        const matches = await fg(url, {
          cwd: root,
          absolute: true,
          onlyFiles: true,
          unique: true,
        })
        for (const filename of matches.sort()) {
          if (path.extname(filename).toLowerCase() !== '.svg') continue
          const name = `${preset}-${path.basename(filename, path.extname(filename))}`
          if (names.has(name))
            throw new Error(
              `[sax-svgs] Duplicate icon "${name}": ${names.get(name)} and ${filename}`,
            )
          names.set(name, filename)
        }
      }
      return names
    })())
  const reset = () => {
    index = undefined
    files.clear()
    data.clear()
  }
  const read = async (name: string) => {
    const filename = (await scan()).get(name)
    if (!filename) throw new Error(`[sax-svgs] Unknown local icon "${name}".`)
    let pending = files.get(filename)
    if (!pending) {
      pending = (async () => {
        const icon = parseSvg(await readFile(filename, 'utf8'), filename)
        const hash = createHash('sha256')
          .update(JSON.stringify(icon))
          .digest('hex')
        data.set(hash, icon)
        return { hash, filename }
      })()
      files.set(filename, pending)
    }
    return pending
  }

  return {
    name: 'sax-design-svgs',
    enforce: 'pre',
    api: { saxSvgPresets: [...namespaces] },
    configResolved(config) {
      root = config.root
      reset()
      watchRoots = presets.flatMap(({ url }) =>
        fg.generateTasks(url).map((task) => path.resolve(root, task.base)),
      )
      if (
        config.plugins.filter((plugin) => plugin.name === 'sax-design-svgs')
          .length > 1
      ) {
        throw new Error(
          '[sax-svgs] Use one signSvgs([...]) call for all presets.',
        )
      }
    },
    resolveId(id) {
      if (id === publicId) return { id: resolvedId, moduleSideEffects: true }
      if (id.startsWith(namePrefix))
        return {
          id: `${resolvedPrefix}register/${id.slice(namePrefix.length)}`,
          moduleSideEffects: true,
        }
      if (id.startsWith(dataPrefix))
        return {
          id: `${resolvedPrefix}data/${id.slice(dataPrefix.length)}`,
          moduleSideEffects: false,
        }
    },
    async load(id) {
      if (id === resolvedId) {
        return {
          code: `${(options.safelist || [])
            .map((name) => `import '${namePrefix}${encodeURIComponent(name)}'`)
            .join('\n')}\nexport default true`,
          moduleSideEffects: true,
        }
      }
      if (id.startsWith(`${resolvedPrefix}register/`)) {
        const name = decodeURIComponent(
          id.slice(`${resolvedPrefix}register/`.length),
        )
        const { hash, filename } = await read(name)
        this.addWatchFile(filename)
        return {
          code: `import data from '${dataPrefix}${hash}'\nimport { addIconData } from 'sax-design-vue-iconify'\naddIconData(${JSON.stringify(name)}, data)\nexport default data`,
          moduleSideEffects: true,
        }
      }
      if (id.startsWith(`${resolvedPrefix}data/`)) {
        const icon = data.get(id.slice(`${resolvedPrefix}data/`.length))
        if (!icon) throw new Error(`[sax-svgs] Unknown SVG data module: ${id}`)
        return {
          code: `export default ${JSON.stringify(icon)}`,
          moduleSideEffects: false,
        }
      }
    },
    buildStart() {
      return scan().then(() => undefined)
    },
    async transform(code, id) {
      if (!isApplicationIconSource(id)) return
      const names = await scan()
      const used = new Set<string>()
      for (const match of code.matchAll(/(["'`])([^"'`\\\r\n]+)\1/g)) {
        if (names.has(match[2])) used.add(match[2])
      }
      if (!used.size) return
      return {
        code: addIconImports(
          code,
          id,
          [...used].map(
            (name) => `import '${namePrefix}${encodeURIComponent(name)}'`,
          ),
        ),
        map: null,
      }
    },
    transformIndexHtml: {
      order: 'pre',
      handler: () =>
        options.safelist?.length
          ? [
              {
                tag: 'script',
                attrs: { type: 'module' },
                children: `import '${publicId}'`,
                injectTo: 'head-prepend',
              },
            ]
          : undefined,
    },
    configureServer(server) {
      server.watcher.add(watchRoots)
      const update = (filename: string) => {
        if (
          !filename.toLowerCase().endsWith('.svg') ||
          !watchRoots.some((base) => {
            const relative = path.relative(base, filename)
            return (
              relative !== '..' &&
              !relative.startsWith(`..${path.sep}`) &&
              !path.isAbsolute(relative)
            )
          })
        )
          return
        // A full reload also clears deleted names from the shared runtime store.
        reset()
        server.moduleGraph.invalidateAll()
        server.ws.send({ type: 'full-reload' })
      }
      server.watcher.on('add', update).on('change', update).on('unlink', update)
      server.httpServer?.once('close', () => {
        server.watcher
          .off('add', update)
          .off('change', update)
          .off('unlink', update)
      })
    },
  }
}
