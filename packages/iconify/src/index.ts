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

const iconRegistry = new Map<string, SaxIconData>()

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

export function getIconData(name: string) {
  return iconRegistry.get(name)
}
