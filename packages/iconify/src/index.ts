// eslint-disable-next-line @typescript-eslint/triple-slash-reference -- Include the ambient virtual module without creating a runtime import.
/// <reference path="./virtual.d.ts" />

export interface SaxIconData {
  body: string
  attributes: Record<string, string>
}

export interface SaxIconCollectionAlias {
  /** Iconify collection prefix, for example `bx` or `carbon`. */
  source: string
}

export type SaxIconCollections = Record<string, string | SaxIconCollectionAlias>

export const DEFAULT_API_ENDPOINTS = [
  'https://api.iconify.design',
  'https://api.simplesvg.com',
  'https://api.unisvg.com',
] as const

export type SaxIconApiEndpoint = (typeof DEFAULT_API_ENDPOINTS)[number]

export interface SaxIconApiOptions {
  /** Iconify-compatible API root. Defaults to DEFAULT_API_ENDPOINTS[0]. */
  baseUrl?: SaxIconApiEndpoint | (string & Record<never, never>)
  /** Cache directory relative to the Vite project root. Set false to disable. */
  cacheDir?: string | false
  /** Request timeout in milliseconds. */
  timeout?: number
}

export interface SaxIconViteOptions {
  /** Public collection names mapped to Iconify collection prefixes. */
  collections: SaxIconCollections
  /** Load installed JSON packages locally or fetch used icons at build time. */
  mode?: 'local' | 'api'
  /** API source and build-cache settings used in API mode. */
  api?: SaxIconApiOptions
  /** Icons referenced through dynamic bindings and therefore not discoverable. */
  safelist?: string[]
  /** Inject the dynamic icon registry into Vite HTML entries. */
  autoRegister?: boolean
  /** Component tags scanned for static name attributes. */
  componentNames?: string[]
  /** Throw instead of warning when an icon cannot be resolved. */
  strict?: boolean
}

// ESM, CommonJS and separately bundled copies must register into the same store.
const registryKey = Symbol.for('sax-design-vue-iconify.registry.v1')
const registryScope = globalThis as typeof globalThis & {
  [registryKey]?: Map<string, SaxIconData>
}
const iconRegistry = (registryScope[registryKey] ??= new Map<
  string,
  SaxIconData
>())

export function defineSaxIconConfig<T extends SaxIconViteOptions>(
  config: T,
): T {
  return config
}

export function addIconData(name: string, data: SaxIconData) {
  iconRegistry.set(name, data)
}

export function addIconDataRecord(icons: Record<string, SaxIconData>) {
  Object.entries(icons).forEach(([name, data]) => addIconData(name, data))
}

const scopesKey = Symbol.for('sax-design-vue-iconify.scopes.v1')
const scopesScope = globalThis as typeof globalThis & {
  [scopesKey]?: Map<string, Record<string, SaxIconData>>
}
const registryScopes = (scopesScope[scopesKey] ??= new Map())

/** Replace one registration group, removing stale names without deleting later overrides. */
export function replaceIconDataRecord(
  scope: string,
  icons: Record<string, SaxIconData>,
) {
  const previous = registryScopes.get(scope)
  if (previous) {
    for (const [name, data] of Object.entries(previous)) {
      if (iconRegistry.get(name) === data) iconRegistry.delete(name)
    }
  }
  addIconDataRecord(icons)
  registryScopes.set(scope, icons)
}

export function getIconData(name: string) {
  return iconRegistry.get(name)
}
