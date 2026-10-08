import { defineSvgFilter } from '../svg-filter'
import { dissolveAnimationDefinition } from './dissolve'
import type { SvgFilterDefinition } from '../svg-filter'

export type SvgFilterAnimationFrame = Readonly<Record<string, string | number>>
export interface SvgFilterAnimationBinding {
  /** Child-element indexes relative to the filter, including nested primitives. */
  path: readonly number[]
  attribute: string
  channel: string
}
export interface SvgFilterAnimationModule {
  name: string
  definition: SvgFilterDefinition
  bindings: readonly SvgFilterAnimationBinding[]
  frame: (progress: number) => SvgFilterAnimationFrame
  duration?: number
  reverseDuration?: number
  easing?: (progress: number) => number
  regions?: Readonly<Record<string, SvgFilterDefinition['attrs']>>
}

const snapshots = new WeakMap<
  SvgFilterAnimationModule,
  SvgFilterAnimationModule
>()
/** Immutable declarations may be shared; DOM nodes and playback never are. */
export const defineSvgFilterAnimation = (
  module: SvgFilterAnimationModule,
): SvgFilterAnimationModule => {
  const existing = snapshots.get(module)
  if (existing) return existing
  if (!module.name.trim())
    throw new Error('SVG animation module name must not be empty')
  const definition = defineSvgFilter(module.definition)
  const endpoints = [module.frame(0), module.frame(1)]
  for (const binding of module.bindings) {
    let nodes = definition.nodes
    let node
    for (const index of binding.path) {
      node = nodes[index]
      if (!node)
        throw new Error(`Invalid SVG animation binding: ${binding.channel}`)
      nodes = node.children ?? []
    }
    if (
      !node ||
      !binding.attribute ||
      endpoints.some((frame) => frame[binding.channel] === undefined)
    )
      throw new Error(`Invalid SVG animation binding: ${binding.channel}`)
  }
  const regions: Record<string, SvgFilterDefinition['attrs']> = {}
  for (const [name, attrs] of Object.entries(module.regions ?? {}))
    regions[name] = Object.freeze({ ...attrs })
  const frozen = Object.freeze({
    ...module,
    definition,
    bindings: Object.freeze(
      module.bindings.map((binding) =>
        Object.freeze({ ...binding, path: Object.freeze([...binding.path]) }),
      ),
    ),
    regions: Object.freeze(regions),
  })
  snapshots.set(module, frozen)
  snapshots.set(frozen, frozen)
  return frozen
}

export const dissolveAnimation = defineSvgFilterAnimation(
  dissolveAnimationDefinition,
)
const modules = new Map<string, SvgFilterAnimationModule>([
  ['dissolve', dissolveAnimation],
])
export const svgFilterAnimations = {
  add(module: SvgFilterAnimationModule) {
    const frozen = defineSvgFilterAnimation(module)
    const previous = modules.get(frozen.name)
    if (previous === frozen) return frozen
    if (previous)
      throw new Error(`SVG animation module already registered: ${frozen.name}`)
    modules.set(frozen.name, frozen)
    return frozen
  },
  get(name: string) {
    const module = modules.get(name)
    if (!module) throw new Error(`Unknown SVG animation module: ${name}`)
    return module
  },
}
export { svgDissolveFrame } from './dissolve'
