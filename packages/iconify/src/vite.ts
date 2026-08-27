import { createRequire } from 'node:module'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { getIconData, iconToSVG } from '@iconify/utils'
import {
  DEFAULT_API_ENDPOINTS,
  type SaxIconCollections,
  type SaxIconData,
  type SaxIconViteOptions,
} from './index'
import type { IconifyJSON } from '@iconify/types'

export interface SaxIconVitePlugin {
  name: string
  enforce: 'pre'
  configResolved: (config: { root: string }) => void
  transform: (
    code: string,
    id: string,
  ) => { code: string; map: null } | undefined
  resolveId: (id: string) => string | undefined
  load: (id: string) => Promise<string | undefined>
  transformIndexHtml: {
    order: 'pre'
    handler: () =>
      | Array<{
          tag: 'script'
          attrs: { type: 'module'; src: string }
          injectTo: 'head-prepend'
        }>
      | undefined
  }
}

const require = createRequire(import.meta.url)
const VIRTUAL_PREFIX = '\0sax-icon_'
const PUBLIC_PREFIX = 'virtual:sax-icon/'
const REGISTER_ID = 'virtual:sax-icons/register'
const RESOLVED_REGISTER_ID = '\0sax-icons:register'

const DEFAULT_COMPONENT_NAMES = ['s-icon', 'SIcon']
const DEFAULT_API_CACHE_DIR = 'node_modules/.cache/sax-design-vue-iconify'
const DEFAULT_API_TIMEOUT = 10_000

interface ParsedIconName {
  publicName: string
  sourcePrefix: string
  iconName: string
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function resolveCollection(
  collections: SaxIconCollections,
  publicPrefix: string,
) {
  const collection = collections[publicPrefix]
  return typeof collection === 'string' ? collection : collection?.source
}

function parseIconName(
  value: string,
  collections: SaxIconCollections,
): ParsedIconName | undefined {
  const separator = value.indexOf(':')
  if (separator <= 0 || separator === value.length - 1) return

  const publicPrefix = value.slice(0, separator)
  const iconName = value.slice(separator + 1)
  const sourcePrefix = resolveCollection(collections, publicPrefix)
  if (
    !sourcePrefix ||
    !/^[a-z0-9-]+$/i.test(sourcePrefix) ||
    !/^[a-z0-9-]+$/i.test(iconName)
  )
    return

  return { publicName: value, sourcePrefix, iconName }
}

function virtualId(icon: ParsedIconName) {
  return `${PUBLIC_PREFIX}${encodeURIComponent(icon.publicName)}`
}

function addImportsToVueSfc(code: string, imports: string[]) {
  if (!imports.length) return code
  const block = `${imports.join('\n')}\n`
  const scriptSetup = /<script\b([^>]*\bsetup\b[^>]*)>/i

  if (scriptSetup.test(code)) {
    return code.replace(scriptSetup, (match) => `${match}\n${block}`)
  }

  return `<script setup lang="ts">\n${block}</script>\n${code}`
}

function transformStaticIcons(
  code: string,
  id: string,
  options: Required<Pick<SaxIconViteOptions, 'componentNames'>> &
    SaxIconViteOptions,
) {
  const cleanId = id.split('?', 1)[0]
  const isVue = cleanId.endsWith('.vue')
  const isJsx = /\.[jt]sx$/.test(cleanId)
  if (!isVue && !isJsx) return

  const componentPattern = options.componentNames.map(escapeRegExp).join('|')
  const tagPattern = new RegExp(
    `<(?:${componentPattern})\\b([^<>]*?)(\\/?)>`,
    'g',
  )
  const imports: string[] = []
  const importNames = new Map<string, string>()
  let changed = false

  const transformed = code.replace(
    tagPattern,
    (tag, attributes: string, selfClosing: string) => {
      if (/\b(?:icon-data|iconData)\s*=/.test(attributes)) return tag
      const nameMatch = attributes.match(/(?:^|\s)name\s*=\s*(["'])([^"']+)\1/)
      if (!nameMatch) return tag

      const icon = parseIconName(nameMatch[2], options.collections)
      if (!icon) {
        const message = `[sax-iconify] Unregistered or invalid icon name "${nameMatch[2]}" in ${cleanId}`
        if (options.strict) throw new Error(message)
        return tag
      }

      let importName = importNames.get(icon.publicName)
      if (!importName) {
        importName = `__sax_icon_${importNames.size}`
        importNames.set(icon.publicName, importName)
        imports.push(`import ${importName} from '${virtualId(icon)}'`)
      }

      changed = true
      const withoutStaticName = tag.replace(
        /(?:^|\s)name\s*=\s*(["'])[^"']+\1/,
        '',
      )
      const binding = isJsx
        ? ` iconData={${importName}}`
        : ` :icon-data="${importName}"`
      return withoutStaticName.replace(
        new RegExp(`${escapeRegExp(selfClosing)}>$`),
        `${binding}${selfClosing}>`,
      )
    },
  )

  if (!changed) return
  const result = isVue
    ? addImportsToVueSfc(transformed, imports)
    : `${imports.join('\n')}\n${transformed}`
  return { code: result, map: null }
}

function transformLiteralIcons(
  code: string,
  id: string,
  collections: SaxIconCollections,
) {
  const cleanId = id.split('?', 1)[0].replace(/\\/g, '/')
  const isSaxDesignModule =
    /\/node_modules\/(?:@vuesax-alpha\/components|sax-design-vue)(?:\/|$)/.test(
      cleanId,
    )
  if (
    (cleanId.includes('/node_modules/') && !isSaxDesignModule) ||
    cleanId.includes('/packages/iconify/') ||
    cleanId.endsWith('.d.ts') ||
    !/\.(?:vue|[cm]?[jt]sx?)$/.test(cleanId)
  )
    return

  const prefixes = Object.keys(collections)
  if (!prefixes.length) return
  const namePattern = new RegExp(
    `(["'])((?:${prefixes.map(escapeRegExp).join('|')}):[a-z0-9-]+)\\1`,
    'gi',
  )
  const icons = new Map<string, ParsedIconName>()

  for (const match of code.matchAll(namePattern)) {
    const icon = parseIconName(match[2], collections)
    if (icon) icons.set(icon.publicName, icon)
  }
  if (!icons.size) return

  const imports: string[] = []
  const entries: string[] = []
  Array.from(icons.values()).forEach((icon, index) => {
    const importName = `__sax_literal_icon_${index}`
    imports.push(`import ${importName} from '${virtualId(icon)}'`)
    entries.push(`${JSON.stringify(icon.publicName)}: ${importName}`)
  })
  imports.push(
    `import { addIconDataRecord as __sax_add_icon_data_record } from 'sax-design-vue-iconify'`,
    `__sax_add_icon_data_record({${entries.join(',')}})`,
  )

  const result = cleanId.endsWith('.vue')
    ? addImportsToVueSfc(code, imports)
    : `${imports.join('\n')}\n${code}`
  return { code: result, map: null }
}

export function saxIcons(userOptions: SaxIconViteOptions): SaxIconVitePlugin {
  const options = {
    mode: 'local' as const,
    autoRegister: true,
    componentNames: DEFAULT_COMPONENT_NAMES,
    strict: true,
    ...userOptions,
  }
  const iconSets = new Map<string, Promise<IconifyJSON>>()
  const apiIconSets = new Map<string, Promise<IconifyJSON>>()
  const resolvedIcons = new Map<string, string>()
  let projectRoot = process.cwd()

  const loadCollection = (prefix: string) => {
    let pending = iconSets.get(prefix)
    if (!pending) {
      pending = (async () => {
        let filename: string
        try {
          filename = require.resolve(`@iconify-json/${prefix}/icons.json`)
        } catch {
          throw new Error(
            `[sax-iconify] Missing collection "${prefix}". Install @iconify-json/${prefix} as a development dependency.`,
          )
        }
        return JSON.parse(await readFile(filename, 'utf8')) as IconifyJSON
      })()
      iconSets.set(prefix, pending)
    }
    return pending
  }

  const apiBaseUrl = () =>
    `${options.api?.baseUrl || DEFAULT_API_ENDPOINTS[0]}`.replace(/\/+$/, '')

  const apiCacheFile = (icon: ParsedIconName) => {
    if (options.api?.cacheDir === false) return
    const cacheRoot = path.resolve(
      projectRoot,
      options.api?.cacheDir || DEFAULT_API_CACHE_DIR,
    )
    const endpoint = new URL(apiBaseUrl())
    const provider =
      `${endpoint.protocol.slice(0, -1)}-${endpoint.host}`.replace(
        /[^a-z0-9.-]+/gi,
        '-',
      )
    return path.join(
      cacheRoot,
      provider,
      icon.sourcePrefix,
      `${icon.iconName}.json`,
    )
  }

  const readApiCache = async (filename: string, iconName: string) => {
    try {
      const iconSet = JSON.parse(
        await readFile(filename, 'utf8'),
      ) as IconifyJSON
      return getIconData(iconSet, iconName) ? iconSet : undefined
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code
      if (code !== 'ENOENT' && !(error instanceof SyntaxError)) throw error
    }
  }

  const fetchApiIcon = async (icon: ParsedIconName) => {
    const url = new URL(`${icon.sourcePrefix}.json`, `${apiBaseUrl()}/`)
    url.searchParams.set('icons', icon.iconName)
    const controller = new AbortController()
    const timeout = setTimeout(
      () => controller.abort(),
      options.api?.timeout ?? DEFAULT_API_TIMEOUT,
    )

    try {
      const response = await fetch(url, { signal: controller.signal })
      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`.trim())
      }
      const iconSet = (await response.json()) as IconifyJSON
      if (!getIconData(iconSet, icon.iconName)) {
        throw new Error(`Icon "${icon.iconName}" was not returned by the API.`)
      }
      return iconSet
    } catch (error) {
      throw new Error(
        `[sax-iconify] Failed to fetch "${icon.publicName}" from ${url}: ${
          error instanceof Error ? error.message : String(error)
        }`,
      )
    } finally {
      clearTimeout(timeout)
    }
  }

  const loadApiIcon = (icon: ParsedIconName) => {
    const key = `${icon.sourcePrefix}:${icon.iconName}`
    let pending = apiIconSets.get(key)
    if (!pending) {
      pending = (async () => {
        const filename = apiCacheFile(icon)
        if (filename) {
          const cached = await readApiCache(filename, icon.iconName)
          if (cached) return cached
        }

        const iconSet = await fetchApiIcon(icon)
        if (filename) {
          await mkdir(path.dirname(filename), { recursive: true })
          await writeFile(filename, JSON.stringify(iconSet), 'utf8')
        }
        return iconSet
      })()
      apiIconSets.set(key, pending)
    }
    return pending
  }

  const renderIcon = async (icon: ParsedIconName): Promise<SaxIconData> => {
    const iconSet =
      options.mode === 'api'
        ? await loadApiIcon(icon)
        : await loadCollection(icon.sourcePrefix)
    const data = getIconData(iconSet, icon.iconName)
    if (!data) {
      throw new Error(
        `[sax-iconify] Icon "${icon.iconName}" does not exist in collection "${icon.sourcePrefix}".`,
      )
    }
    const rendered = iconToSVG(data, { width: '1em', height: '1em' })
    return { body: rendered.body, attributes: rendered.attributes }
  }

  return {
    name: 'sax-design-iconify',
    enforce: 'pre',
    configResolved(config) {
      projectRoot = config.root
    },
    transformIndexHtml: {
      order: 'pre',
      handler() {
        if (!options.autoRegister || !options.safelist?.length) return
        return [
          {
            tag: 'script',
            attrs: { type: 'module', src: REGISTER_ID },
            injectTo: 'head-prepend',
          },
        ]
      },
    },
    transform(code, id) {
      if (id.includes('?vue&type=')) return
      const staticResult = transformStaticIcons(code, id, options)
      const source = staticResult?.code || code
      return (
        transformLiteralIcons(source, id, options.collections) || staticResult
      )
    },
    resolveId(id) {
      if (id === REGISTER_ID) return RESOLVED_REGISTER_ID
      if (!id.startsWith(PUBLIC_PREFIX)) return
      const encodedName = id.slice(PUBLIC_PREFIX.length)
      const resolvedId = `${VIRTUAL_PREFIX}${encodedName.replace(/%/g, '_')}`
      resolvedIcons.set(resolvedId, decodeURIComponent(encodedName))
      return resolvedId
    },
    async load(id) {
      if (id === RESOLVED_REGISTER_ID) {
        const icons = options.safelist || []
        const imports: string[] = []
        const entries: string[] = []

        icons.forEach((name, index) => {
          const icon = parseIconName(name, options.collections)
          if (!icon) {
            throw new Error(
              `[sax-iconify] Safelisted icon "${name}" uses an unregistered collection or invalid name.`,
            )
          }
          const importName = `__sax_safe_icon_${index}`
          imports.push(`import ${importName} from '${virtualId(icon)}'`)
          entries.push(`${JSON.stringify(name)}: ${importName}`)
        })

        return `${imports.join('\n')}\nimport { addIconDataRecord } from 'sax-design-vue-iconify'\naddIconDataRecord({${entries.join(',')}})\nexport default true`
      }
      if (!id.startsWith(VIRTUAL_PREFIX)) return
      const publicName = resolvedIcons.get(id)
      if (!publicName) {
        throw new Error(`[sax-iconify] Unknown virtual icon module "${id}".`)
      }
      const icon = parseIconName(publicName, options.collections)
      if (!icon) {
        throw new Error(
          `[sax-iconify] Collection for "${publicName}" is not registered.`,
        )
      }
      const data = await renderIcon(icon)
      return `export default ${JSON.stringify(data)}`
    },
  }
}
