import { readFile } from 'node:fs/promises'
import path from 'node:path'
import fg from 'fast-glob'
import { DOMParser, XMLSerializer } from '@xmldom/xmldom'
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
export function signSvgs(presets: SaxSvgPreset[]): Plugin {
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

  return {
    name: 'sax-design-svgs',
    enforce: 'pre',
    api: { saxSvgPresets: [...namespaces] },
    configResolved(config) {
      root = config.root
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
    },
    async load(id) {
      if (id !== resolvedId) return
      const icons: Record<string, SaxIconData> = Object.create(null)
      const origins = new Map<string, string>()
      for (const { preset, url } of presets) {
        const files = await fg(url, {
          cwd: root,
          absolute: true,
          onlyFiles: true,
          unique: true,
        })
        for (const filename of files.sort()) {
          if (path.extname(filename).toLowerCase() !== '.svg') continue
          const basename = path.basename(filename, path.extname(filename))
          const name = `${preset}-${basename}`
          if (origins.has(name)) {
            throw new Error(
              `[sax-svgs] Duplicate icon "${name}": ${origins.get(name)} and ${filename}`,
            )
          }
          origins.set(name, filename)
          this.addWatchFile(filename)
          icons[name] = parseSvg(await readFile(filename, 'utf8'), filename)
        }
      }
      return {
        code: `import { replaceIconDataRecord } from 'sax-design-vue-iconify'\nreplaceIconDataRecord('sax-local-svgs', ${JSON.stringify(icons)})\nexport default true`,
        moduleSideEffects: true,
      }
    },
    transformIndexHtml: {
      order: 'pre',
      handler: () => [
        {
          tag: 'script',
          attrs: { type: 'module' },
          children: `import '${publicId}'`,
          injectTo: 'head-prepend',
        },
      ],
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
        const module = server.moduleGraph.getModuleById(resolvedId)
        if (module) server.moduleGraph.invalidateModule(module)
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
