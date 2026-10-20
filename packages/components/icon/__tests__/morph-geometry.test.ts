import { describe, expect, it } from 'vitest'
import { curvePathBBox, path2curve } from 'svg-morpheus-ts/core'
import { alignPoints, springProgress } from '../src/morph/builtin'
import {
  createMorpheusPlan,
  springProgress as morpheusSpring,
} from '../src/morph/svg-morpheus'
import { readMorphShapes, splitSubpaths } from '../src/morph/svg'
import { renderPaths } from '../src/morph/types'
import { builtinCarbonIcons } from '../src/builtin-carbon-icons'
import type { MorphShape, Point } from '../src/morph/types'

const shape = (d: string): MorphShape => ({
  d,
  group: 0,
  closed: true,
  matrix: [1, 0, 0, 1, 0, 0],
  attributes: { fill: 'currentColor', 'fill-rule': 'evenodd' },
})

describe('Icon morph geometry', () => {
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
  it('rotates a line without collapsing its midpoint', () => {
    const from: Point[] = [
      [-1, 0],
      [0, 0],
      [1, 0],
    ]
    const to: Point[] = [
      [0, -1],
      [0, 0],
      [0, 1],
    ]
    const plan = alignPoints(from, to, false, false)
    const halfway = plan(0.5)
    expect(Math.hypot(...halfway[0])).toBeCloseTo(1)
    plan(1).forEach((point, index) => {
      expect(point[0]).toBeCloseTo(to[index][0])
      expect(point[1]).toBeCloseTo(to[index][1])
    })
  })
  it('matches a shifted closed contour and handles degenerate contours', () => {
    const a: Point[] = [
      [0, 0],
      [2, 0],
      [2, 2],
      [0, 2],
    ]
    const b = [...a.slice(2), ...a.slice(0, 2)]
    const at = alignPoints(a, b, true, false)(0.5)
    expect(at).toEqual(a)
    const collapsed = a.map((): Point => [1, 1])
    expect(
      alignPoints(collapsed, a, true)(0.5).flat().every(Number.isFinite),
    ).toBe(true)
    expect(
      alignPoints(a, collapsed, true)(1).flat().every(Number.isFinite),
    ).toBe(true)
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
  it('keeps hole contours within the same compound path', () => {
    const markup = renderPaths([
      { d: 'M0 0L10 0L10 10Z', shape: shape('') },
      { d: 'M2 2L2 4L4 4Z', shape: shape('') },
    ])
    expect(markup.match(/<path/g)).toHaveLength(1)
    expect(markup).toContain('fill-rule="evenodd"')
    expect(markup).toContain('M2 2')
  })
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
  it.each(['smooth', 'snappy', 'bouncy'] as const)(
    'uses identical %s easing for both comparison engines',
    (profile) => {
      for (const t of [0, 0.1, 0.25, 0.5, 0.9, 1])
        expect(morpheusSpring(t, profile)).toBeCloseTo(
          springProgress(t, profile),
          12,
        )
    },
  )
  it('rejects paint servers before attaching a temporary SVG', () => {
    const before = document.body.childElementCount
    expect(() =>
      readMorphShapes({ attributes: {}, body: '<defs/><path d="M0 0L2 2"/>' }),
    ).toThrow()
    expect(document.body.childElementCount).toBe(before)
  })
})
