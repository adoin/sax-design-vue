import { describe, expect, it } from 'vitest'
import {
  emptyFlapCorners,
  emptyFlaps,
  emptyOpeningProgress,
  projectEmptyPoint,
} from '../src/empty-geometry'
import type { EmptyFlapSide, EmptyPoint } from '../src/empty-geometry'

const length = (a: EmptyPoint, b: EmptyPoint) =>
  Math.hypot(...a.map((value, index) => value - b[index]))
const vector = (a: EmptyPoint, b: EmptyPoint) =>
  a.map((value, index) => value - b[index])
type Point2 = readonly [number, number]
const intersect = ([a, b]: readonly Point2[], [c, d]: readonly Point2[]) => {
  const dx = b[0] - a[0],
    dy = b[1] - a[1]
  const ex = d[0] - c[0],
    ey = d[1] - c[1]
  const amount = ((c[0] - a[0]) * ey - (c[1] - a[1]) * ex) / (dx * ey - dy * ex)
  return [a[0] + amount * dx, a[1] + amount * dy]
}

describe('Empty box perspective', () => {
  it.each<EmptyFlapSide>(['back', 'left', 'right'])(
    'keeps the %s flap rectangular and hinged throughout its rotation',
    (side) => {
      const original = emptyFlapCorners(side, 42)
      for (const angle of [24, 38, 68, 90, 112]) {
        const corners = emptyFlapCorners(side, angle)
        expect(corners.slice(0, 2)).toEqual(original.slice(0, 2))
        for (let index = 0; index < 4; index++) {
          const next = (index + 1) % 4
          expect(length(corners[index], corners[next])).toBeCloseTo(
            length(original[index], original[next]),
            10,
          )
        }
        const across = vector(corners[1], corners[0])
        const outward = vector(corners[3], corners[0])
        expect(
          across.reduce((sum, value, index) => sum + value * outward[index], 0),
        ).toBeCloseTo(0, 10)
        expect(
          corners[2].map((value, index) => value - corners[1][index]),
        ).toEqual(corners[3].map((value, index) => value - corners[0][index]))
      }
    },
  )

  it('projects parallel box edges toward the same vanishing point', () => {
    const edge = (y: number, z: number) => [
      projectEmptyPoint([-0.82, y, z]),
      projectEmptyPoint([0.82, y, z]),
    ]
    const top = intersect(edge(0, 0.55), edge(0, -0.55))
    const bottom = intersect(edge(-0.62, 0.55), edge(-0.62, -0.55))
    expect(bottom[0]).toBeCloseTo(top[0], 7)
    expect(bottom[1]).toBeCloseTo(top[1], 7)
  })

  it('opens each flap once with fixed hinges and holds the fully open pose', () => {
    for (const flap of emptyFlaps) {
      expect(flap.frames.at(-1)).toEqual(flap.rest)
      expect(flap.frames.at(-2)).toEqual(flap.rest)
      expect(flap.frames[0].outline).not.toBe(flap.rest.outline)
      const frames = flap.frames.map((frame) =>
        frame.outline.match(/-?\d+(?:\.\d+)?/g)!.map(Number),
      )
      for (const frame of frames)
        expect(frame.slice(0, 4)).toEqual(frames[0].slice(0, 4))
      const travel = Math.hypot(
        frames[0][4] - frames.at(-1)![4],
        frames[0][5] - frames.at(-1)![5],
      )
      expect(travel).toBeGreaterThan(12)
      for (const frame of frames) {
        for (let index = 0; index < frame.length; index += 2) {
          expect(frame[index]).toBeGreaterThan(10)
          expect(frame[index]).toBeLessThan(250)
          expect(frame[index + 1]).toBeGreaterThan(10)
          expect(frame[index + 1]).toBeLessThan(190)
        }
      }
    }
  })
  it('uses a single monotone opening progress for all flaps', () => {
    const progress = Array.from({ length: 25 }, (_, index) =>
      emptyOpeningProgress(index / 24),
    )
    expect(progress[0]).toBe(0)
    expect(progress.at(-1)).toBe(1)
    for (let index = 1; index < progress.length; index++)
      expect(progress[index]).toBeGreaterThanOrEqual(progress[index - 1])
  })
})
