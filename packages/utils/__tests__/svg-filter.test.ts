import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineSvgFilter, svgFilter } from '../svg-filter'
import type { SvgFilterLease } from '../svg-filter'

const leases: SvgFilterLease[] = []
const acquire = (...args: Parameters<typeof svgFilter.acquire>) => {
  const lease = svgFilter.acquire(...args)
  leases.push(lease)
  return lease
}
const graph = defineSvgFilter({
  key: 'test-blur',
  nodes: [{ tag: 'feGaussianBlur', attrs: { stdDeviation: 2 } }],
})
afterEach(() => {
  leases.splice(0).forEach((lease) => lease.release())
  svgFilter.clearUnused()
  vi.restoreAllMocks()
})

describe('global SVG filter registry', () => {
  it('shares one node and retains it until all consumers release', () => {
    const first = acquire(graph)
    const second = acquire(graph)
    expect(first.element).toBe(second.element)
    expect(
      document.querySelectorAll('[data-sax-svg-filters] filter'),
    ).toHaveLength(1)
    first.release()
    first.release()
    expect(document.querySelector(`#${first.id}`)).toBe(second.element)
    second.release()
    expect(document.querySelector('[data-sax-svg-filters]')).toBeNull()
  })

  it('uses the same fingerprint regardless of attribute insertion order', () => {
    const a = acquire({ key: 'ordered', attrs: { x: 0, y: 1 }, nodes: [] })
    const b = acquire({ key: 'ordered', attrs: { y: 1, x: 0 }, nodes: [] })
    expect(a.id).toBe(b.id)
    expect(a.element).toBe(b.element)
    const strings = acquire({
      key: 'ordered',
      attrs: { x: '0', y: '1' },
      nodes: [],
    })
    expect(strings.element).toBe(a.element)
  })

  it('separates different parameters and independent instance scopes', () => {
    const a = acquire(graph, { scope: 'a' })
    const b = acquire(graph, { scope: 'b' })
    const changed = acquire({
      key: graph.key,
      nodes: [{ tag: 'feGaussianBlur', attrs: { stdDeviation: 4 } }],
    })
    expect(new Set([a.id, b.id, changed.id]).size).toBe(3)
  })

  it('reuses cached nodes across unmounts and clears only idle entries', () => {
    const first = acquire(graph, { cache: true })
    const original = first.element
    first.release()
    const second = acquire(graph)
    expect(second.element).toBe(original)
    expect(svgFilter.clearUnused()).toBe(0)
    second.release()
    expect(svgFilter.clearUnused()).toBe(1)
    expect(document.querySelector('[data-sax-svg-filters]')).toBeNull()
  })

  it('isolates documents and restores an externally detached pool', () => {
    const local = acquire(graph)
    const other = document.implementation.createHTMLDocument('other')
    const foreign = acquire(graph, { document: other })
    expect(local.id).toBe(foreign.id)
    expect(local.element).not.toBe(foreign.element)
    document.querySelector('[data-sax-svg-filters]')!.remove()
    const restored = acquire(graph)
    expect(restored.element).toBe(local.element)
    expect(document.querySelector(`#${local.id}`)).toBe(local.element)
    foreign.release()
    expect(other.querySelector('[data-sax-svg-filters]')).toBeNull()
  })

  it('shares a registry across multiple imported copies', async () => {
    const first = acquire(graph)
    vi.resetModules()
    const { svgFilter: secondManager } = await import('../svg-filter')
    const second = secondManager.acquire(graph)
    leases.push(second)
    expect(second.element).toBe(first.element)
  })

  it('does not leave a pool after a failed registration', () => {
    expect(() =>
      acquire({
        key: 'bad',
        attrs: { 'invalid attribute': 'value' },
        nodes: [],
      }),
    ).toThrow()
    expect(document.querySelector('[data-sax-svg-filters]')).toBeNull()
  })
})
