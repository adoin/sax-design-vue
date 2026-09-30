export type SvgFilterPrimitive =
  | 'feTurbulence'
  | 'feGaussianBlur'
  | 'feDisplacementMap'
  | 'feComponentTransfer'
  | 'feFuncR'
  | 'feFuncG'
  | 'feFuncB'
  | 'feFuncA'
  | 'feComposite'
  | 'feMorphology'
  | 'feOffset'
  | 'feFlood'
  | 'feMerge'
  | 'feMergeNode'
  | 'feSpecularLighting'
  | 'feDiffuseLighting'
  | 'fePointLight'
  | 'feDistantLight'
  | 'feSpotLight'
  | 'feColorMatrix'
  | 'feBlend'
  | 'feConvolveMatrix'
  | 'feDropShadow'
  | 'feImage'
  | 'feTile'

export interface SvgFilterNode {
  tag: SvgFilterPrimitive
  attrs?: Readonly<Record<string, string | number>>
  children?: readonly SvgFilterNode[]
}
export interface SvgFilterDefinition {
  key: string
  attrs?: Readonly<Record<string, string | number>>
  nodes: readonly SvgFilterNode[]
}
export interface SvgFilterOptions {
  document?: Document
  /** Keep this immutable graph after the final release for later reuse. */
  cache?: boolean
  /** Use a stable instance key for independently animated filter definitions. */
  scope?: string
}
export interface SvgFilterLease {
  id: string
  url: string
  attached: boolean
  element?: SVGFilterElement
  release: () => void
}

const svgNamespace = 'http://www.w3.org/2000/svg'
const registrySymbol = Symbol.for('sax-design-vue.svg-filters.v1')
const normalizedCache = new WeakMap<SvgFilterDefinition, NormalizedDefinition>()
const immutableDefinitions = new WeakSet<SvgFilterDefinition>()
interface NormalizedDefinition {
  definition: SvgFilterDefinition
  signature: string
}
interface FilterEntry {
  element: SVGFilterElement
  references: number
  cached: boolean
}
interface FilterRegistry {
  host: SVGSVGElement
  defs: SVGDefsElement
  entries: Map<string, FilterEntry>
}

const copyAttrs = (attrs: SvgFilterDefinition['attrs']) => {
  const result: Record<string, string> = {}
  for (const key of Object.keys(attrs ?? {}).sort())
    result[key] = String(attrs![key])
  return Object.freeze(result)
}
const copyNode = (node: SvgFilterNode): SvgFilterNode =>
  Object.freeze({
    tag: node.tag,
    attrs: copyAttrs(node.attrs),
    children: Object.freeze((node.children ?? []).map(copyNode)),
  })

/** Freeze a reusable graph so repeated registrations can reuse its fingerprint. */
export const defineSvgFilter = (
  definition: SvgFilterDefinition,
): SvgFilterDefinition => {
  if (!definition.key.trim())
    throw new Error('SVG filter key must not be empty')
  const frozen = Object.freeze({
    key: definition.key,
    attrs: copyAttrs(definition.attrs),
    nodes: Object.freeze(definition.nodes.map(copyNode)),
  })
  immutableDefinitions.add(frozen)
  return frozen
}
const normalize = (definition: SvgFilterDefinition): NormalizedDefinition => {
  const cached = normalizedCache.get(definition)
  if (cached) return cached
  const snapshot = immutableDefinitions.has(definition)
    ? definition
    : defineSvgFilter(definition)
  const normalized = {
    definition: snapshot,
    signature: JSON.stringify(snapshot),
  }
  if (immutableDefinitions.has(definition))
    normalizedCache.set(definition, normalized)
  return normalized
}
const fingerprint = (value: string) => {
  let first = 2166136261
  let second = 2246822519
  for (let index = 0; index < value.length; index++) {
    first = Math.imul(first ^ value.charCodeAt(index), 16777619)
    second = Math.imul(second ^ value.charCodeAt(index), 3266489917)
  }
  return `${(first >>> 0).toString(36)}-${(second >>> 0).toString(36)}`
}
const getKey = (definition: SvgFilterDefinition, scope = '') =>
  JSON.stringify([normalize(definition).signature, scope])

export const getSvgFilterId = (definition: SvgFilterDefinition, scope = '') => {
  const name = definition.key.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 48)
  return `sax-svg-filter-${name}-${fingerprint(getKey(definition, scope))}`
}
const applyAttrs = (element: Element, attrs: SvgFilterDefinition['attrs']) => {
  for (const key of Object.keys(attrs ?? {}))
    element.setAttribute(key, String(attrs![key]))
}
const createPrimitive = (owner: Document, node: SvgFilterNode): SVGElement => {
  const element = owner.createElementNS(svgNamespace, node.tag)
  applyAttrs(element, node.attrs)
  for (const child of node.children ?? [])
    element.appendChild(createPrimitive(owner, child))
  return element
}
const getRegistry = (owner: Document): FilterRegistry => {
  const storage = owner as Document & { [registrySymbol]?: FilterRegistry }
  let registry = storage[registrySymbol]
  if (!registry) {
    const host = owner.createElementNS(svgNamespace, 'svg')
    host.dataset.saxSvgFilters = ''
    host.setAttribute('width', '0')
    host.setAttribute('height', '0')
    host.setAttribute('aria-hidden', 'true')
    host.setAttribute('focusable', 'false')
    host.style.cssText =
      'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none'
    const defs = owner.createElementNS(svgNamespace, 'defs')
    host.appendChild(defs)
    registry = { host, defs, entries: new Map() }
    storage[registrySymbol] = registry
  }
  // Restore a pool detached by application replacement or test DOM cleanup.
  if (!registry.host.isConnected)
    (owner.body ?? owner.documentElement).appendChild(registry.host)
  return registry
}

/** Acquire one document-wide definition; the last release removes its graph. */
export const acquireSvgFilter = (
  definition: SvgFilterDefinition,
  options: SvgFilterOptions = {},
): SvgFilterLease => {
  const normalized = normalize(definition)
  const key = getKey(normalized.definition, options.scope)
  const id = getSvgFilterId(normalized.definition, options.scope)
  const url = `url("#${id}")`
  const owner =
    options.document ?? (typeof document === 'undefined' ? undefined : document)
  if (!owner) return { id, url, attached: false, release: () => {} }
  const registry = getRegistry(owner)
  let entry = registry.entries.get(key)
  if (!entry) {
    let element: SVGFilterElement
    try {
      if (owner.querySelector(`#${id}`))
        throw new Error(`SVG filter id collision: ${id}`)
      element = owner.createElementNS(svgNamespace, 'filter')
      applyAttrs(element, normalized.definition.attrs)
      element.id = id
      for (const node of normalized.definition.nodes)
        element.appendChild(createPrimitive(owner, node))
    } catch (error) {
      if (!registry.entries.size) registry.host.remove()
      throw error
    }
    entry = { element, references: 0, cached: false }
    registry.entries.set(key, entry)
    registry.defs.appendChild(element)
  }
  if (entry.element.parentNode !== registry.defs)
    registry.defs.appendChild(entry.element)
  entry.cached ||= options.cache === true
  entry.references++
  let released = false
  return {
    id,
    url,
    attached: true,
    element: entry.element,
    release: () => {
      if (released) return
      released = true
      entry!.references--
      if (entry!.references === 0 && !entry!.cached) {
        entry!.element.remove()
        registry.entries.delete(key)
      }
      if (registry.entries.size === 0) registry.host.remove()
    },
  }
}

/** Clear dormant cached graphs without disturbing consumers in another app. */
export const clearUnusedSvgFilters = (owner?: Document) => {
  const target =
    owner ?? (typeof document === 'undefined' ? undefined : document)
  const registry = target
    ? (target as Document & { [registrySymbol]?: FilterRegistry })[
        registrySymbol
      ]
    : undefined
  if (!registry) return 0
  let removed = 0
  for (const [key, entry] of registry.entries) {
    if (entry.references) continue
    entry.element.remove()
    registry.entries.delete(key)
    removed++
  }
  if (!registry.entries.size) registry.host.remove()
  return removed
}
export interface SvgFilterManager {
  acquire: typeof acquireSvgFilter
  getId: typeof getSvgFilterId
  define: typeof defineSvgFilter
  clearUnused: typeof clearUnusedSvgFilters
}
export const svgFilter: SvgFilterManager = {
  acquire: acquireSvgFilter,
  getId: getSvgFilterId,
  define: defineSvgFilter,
  clearUnused: clearUnusedSvgFilters,
}
