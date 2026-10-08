import { describe, expect, it } from 'vitest'
import {
  defineSvgFilterAnimation,
  svgFilterAnimations,
} from '../svg-filter-animation'

const declaration = (name: string) => ({
  name,
  definition: {
    key: name,
    nodes: [{ tag: 'feGaussianBlur' as const, attrs: { stdDeviation: 0 } }],
  },
  bindings: [{ path: [0], attribute: 'stdDeviation', channel: 'blur' }],
  frame: (progress: number) => ({ blur: progress * 8 }),
})
describe('SVG animation modules', () => {
  it('registers immutable module definitions without allocating DOM', () => {
    const source = declaration('blur-module-test')
    const module = defineSvgFilterAnimation(source)
    expect(Object.isFrozen(module.definition.nodes[0].attrs)).toBe(true)
    expect(Object.isFrozen(module.bindings[0].path)).toBe(true)
    expect(svgFilterAnimations.add(module)).toBe(module)
    expect(svgFilterAnimations.add(module)).toBe(module)
    source.definition.nodes[0].attrs.stdDeviation = 42
    expect(
      svgFilterAnimations.get(module.name).definition.nodes[0].attrs
        ?.stdDeviation,
    ).toBe('0')
    expect(document.querySelector('[data-sax-svg-filters]')).toBeNull()
  })
  it('rejects ambiguous module names, unknown names and invalid binding paths', () => {
    const source = declaration('collision-module-test')
    svgFilterAnimations.add(source)
    expect(() => svgFilterAnimations.add(declaration(source.name))).toThrow(
      'already registered',
    )
    expect(() => svgFilterAnimations.get('missing-module')).toThrow('Unknown')
    expect(() =>
      defineSvgFilterAnimation({
        ...declaration('invalid-module'),
        bindings: [{ path: [7], attribute: 'scale', channel: 'blur' }],
      }),
    ).toThrow('Invalid')
  })
})
