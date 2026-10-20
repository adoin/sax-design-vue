import { describe, expect, it } from 'vitest'
import { curvePathBBox, path2curve, springProgress } from 'svg-morpheus-ts/core'
import { createMorpheusPlan } from '../src/morph/svg-morpheus'
import { readMorphShapes, splitSubpaths } from '../src/morph/svg'
import { builtinCarbonIcons } from '../src/builtin-carbon-icons'
import type { MorphShape } from '../src/morph/types'

const shape = (d: string): MorphShape => ({
  d,
  group: 0,
  closed: true,
  matrix: [1, 0, 0, 1, 0, 0],
  attributes: { fill: 'currentColor', 'fill-rule': 'evenodd' },
})

describe('Icon morph geometry', () => {
  it('retains logical geometry through repeated interrupted paint snapshots', () => {
    const line = (d: string, group: number): MorphShape => ({
      ...shape(d),
      group,
      closed: false,
      attributes: {
        fill: 'none',
        stroke: '#43546e',
        'stroke-width': '2',
        'stroke-linecap': 'round',
      },
    })
    const a = [line('M3 3L21 21', 0), line('M3 21L21 3', 1)]
    const b = [
      {
        ...shape('M3 12A9 9 0 1 0 21 12A9 9 0 1 0 3 12Z'),
        attributes: { fill: '#ee5577', stroke: 'none' },
      },
    ]
    let source = a
    for (let i = 0; i < 80; i++) {
      const plan = createMorpheusPlan(source, i % 2 ? a : b)
      expect(plan.frame(0.23)).not.toMatch(/NaN|Infinity/)
      source = plan.snapshot!(0.23)
      expect(source.length).toBeLessThanOrEqual(2)
    }
    const final = createMorpheusPlan(source, b)
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.innerHTML = final.frame(1)
    const visible = [...svg.querySelectorAll('path[data-morph-index]')].filter(
      (node) => Number(node.getAttribute('opacity') ?? 1) > 0,
    )
    expect(visible).toHaveLength(1)
  })
  it('draws newly introduced stroke geometry from its starting point', () => {
    const line = (d: string, group: number): MorphShape => ({
      ...shape(d),
      group,
      closed: false,
      attributes: { fill: 'none', stroke: '#43546e', 'stroke-width': '2' },
    })
    const plan = createMorpheusPlan(
      [line('M2 12H22', 0)],
      [line('M2 12H22', 0), line('M12 2V22', 1)],
    )
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.innerHTML = plan.frame(0.5)
    const d = svg
      .querySelector('path[data-morph-index="1"]')!
      .getAttribute('d')!
    const box = curvePathBBox(path2curve(d))
    expect(box.y).toBeCloseTo(2)
    expect(box.h).toBeCloseTo(10)
  })
  it('keeps a removed hole collapsed throughout both bounce presets', () => {
    const from = shape('M2 2H22V22H2ZM6 6V18H18V6Z')
    const to = shape('M2 2H22V22H2Z')
    const plan = createMorpheusPlan([from], [to])
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    for (const profile of ['snappy', 'bouncy'] as const) {
      const progress = Math.max(
        ...Array.from({ length: 101 }, (_, i) =>
          springProgress(i / 100, profile),
        ),
      )
      expect(progress).toBeGreaterThan(1)
      svg.innerHTML = plan.frame(progress)
      const contours = splitSubpaths(
        svg.querySelector('path')!.getAttribute('d')!,
      )
      expect(contours).toHaveLength(2)
      const hole = curvePathBBox(path2curve(contours[1]))
      expect(hole.w).toBeCloseTo(0)
      expect(hole.h).toBeCloseTo(0)
    }
  })
  it('keeps the real Carbon eye pupil circular through arc normalization and scaling', () => {
    const pupil = Array.from(
      builtinCarbonIcons.view.body.matchAll(/<path[^>]*\bd="([^"]+)"/g),
    )[1][1]
    const target = splitSubpaths(pupil).map((d) => ({
      ...shape(d),
      closed: false,
      matrix: [0.75, 0, 0, 0.75, 0, 0] as [
        number,
        number,
        number,
        number,
        number,
        number,
      ],
    }))
    const plan = createMorpheusPlan([shape('M9 12L12 9L15 12Z')], target)
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    for (const progress of [0.9999, 1]) {
      svg.innerHTML = plan.frame(progress)
      expect(svg.innerHTML).not.toMatch(/NaN|Infinity|undefined/)
      const bounds = curvePathBBox(
        path2curve(svg.querySelector('path')!.getAttribute('d')),
      )
      expect(bounds.cx).toBeCloseTo(12, 1)
      expect(bounds.cy).toBeCloseTo(12, 1)
      expect(bounds.w).toBeCloseTo(9, 1)
      expect(bounds.h).toBeCloseTo(9, 1)
    }
  })
  it('resolves relative moves, repeated coordinates and horizontal/vertical commands', () => {
    expect(splitSubpaths('m2 3 4 0v4h-4z m10 0l2 0 0 2z')).toEqual([
      'M2 3 L6 3 L6 7 L2 7 Z',
      'M12 3 L14 3 L14 5 Z',
    ])
    expect(() => splitSubpaths('M0 0Lfoo')).toThrow()
  })
  it('keeps curve controls, arc parameters and exponents intact', () => {
    expect(splitSubpaths('M1e1 2c1 2 3 4 5 6a2 3 0 0 1 4 5')).toEqual([
      'M10 2 C11 4 13 6 15 8 A2 3 0 0 1 19 13 ',
    ])
  })
  it.each(['smooth', 'snappy', 'bouncy'] as const)(
    'has finite %s spring endpoints',
    (profile) => {
      expect(springProgress(0, profile)).toBe(0)
      expect(springProgress(1, profile)).toBe(1)
      expect(
        Array.from({ length: 101 }, (_, i) =>
          springProgress(i / 100, profile),
        ).every(Number.isFinite),
      ).toBe(true)
    },
  )
  it('uses the published Morpheus core for transformed unequal path counts', () => {
    const a = shape('M0 0L16 0L16 16Z')
    a.matrix = [0.5, 0, 0, 0.5, 4, 4]
    const b = shape('M2 2C4 0 8 0 10 2Z')
    const extra = { ...shape('M4 4L6 4L6 6Z'), group: 1 }
    const plan = createMorpheusPlan([a], [b, extra])
    for (const progress of [0, 0.25, 0.5, 1]) {
      expect(plan.frame(progress)).not.toMatch(/NaN|Infinity|undefined/)
      expect(plan.frame(progress)).toContain('<path')
    }
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.innerHTML = plan.frame(0)
    const first = path2curve(svg.querySelector('path')!.getAttribute('d'))[0]
    expect(first[1]).toBeCloseTo(4)
    expect(first[2]).toBeCloseTo(4)
  })
  it('delegates matched rotation to the updated library without midpoint contraction', () => {
    const source = {
      ...shape('M2 12L22 12'),
      closed: false,
      attributes: { fill: 'none', stroke: 'currentColor' },
    }
    const target = { ...source, d: 'M12 2L12 22' }
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.innerHTML = createMorpheusPlan([source], [target]).frame(0.5)
    const bounds = curvePathBBox(
      path2curve(svg.querySelector('path')!.getAttribute('d')),
    )
    expect(Math.hypot(bounds.w, bounds.h)).toBeCloseTo(20)
    expect(svg.innerHTML).toContain('C')
  })
  it('interpolates colors and gradients through the shared core and scopes IDs per icon', () => {
    const from = {
      ...shape('M2 2H22V22H2Z'),
      attributes: { fill: '#ff000080' },
    }
    const target = {
      ...shape('M2 2H22V22H2Z'),
      paint: {
        attributes: {},
        fill: {
          type: 'linearGradient' as const,
          attributes: { x2: '0%', y2: '100%' },
          stops: [
            { offset: 0, color: 'blue' },
            { offset: 1, color: 'white' },
          ],
        },
      },
    }
    const a = createMorpheusPlan([from], [target]),
      b = createMorpheusPlan([from], [target])
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.innerHTML = a.frame(0.5)
    const gradient = svg.querySelector('linearGradient')!
    expect(gradient).not.toBeNull()
    expect(gradient.querySelector('stop')!.getAttribute('stop-color')).not.toBe(
      'blue',
    )
    expect(svg.querySelector('path')!.getAttribute('fill')).toBe(
      `url(#${gradient.id})`,
    )
    expect(b.frame(0.5)).not.toContain(gradient.id)
  })
  it('preserves compound holes and shared group compositing during color interpolation', () => {
    const a = shape('M0 0H20V20H0ZM4 4V16H16V4Z')
    a.paint = {
      attributes: { 'fill-rule': 'evenodd' },
      fill: 'red',
      groups: [{ id: 'a', opacity: 0.5 }],
    }
    const b = {
      ...a,
      paint: { ...a.paint, fill: 'blue', groups: [{ id: 'b', opacity: 0.9 }] },
    }
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.innerHTML = createMorpheusPlan([a], [b]).frame(0.5)
    expect(svg.querySelectorAll('path')).toHaveLength(1)
    expect(
      svg.querySelector('path')!.getAttribute('d')!.match(/M/g),
    ).toHaveLength(2)
    expect(svg.querySelector('path')!.getAttribute('fill')).toBe(
      'rgba(128,0,128,1)',
    )
    expect(svg.querySelector('g[opacity="0.7"]')).not.toBeNull()
  })
  it('rejects unsupported filters before attaching a temporary SVG', () => {
    const before = document.body.childElementCount
    expect(() =>
      readMorphShapes({
        attributes: {},
        body: '<filter id="f"/><path d="M0 0L2 2"/>',
      }),
    ).toThrow()
    expect(document.body.childElementCount).toBe(before)
  })
})
