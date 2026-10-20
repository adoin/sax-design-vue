// Independent implementation of arc-length sampling, Procrustes alignment and
// separated rotation/scale/shape interpolation. No Morphicons runtime or source.
import { renderPaths, transformPoint } from './types'
import type { MorphPlan, MorphShape, Point } from './types'

const count = 64
const center = (points: Point[]): Point => [
  points.reduce((sum, p) => sum + p[0], 0) / points.length,
  points.reduce((sum, p) => sum + p[1], 0) / points.length,
]
const rotate = ([x, y]: Point, angle: number): Point => [
  x * Math.cos(angle) - y * Math.sin(angle),
  x * Math.sin(angle) + y * Math.cos(angle),
]
const mix = (a: number, b: number, t: number) => a + (b - a) * t

const sample = (shape: MorphShape): Point[] => {
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  path.setAttribute('d', shape.d)
  const length = path.getTotalLength()
  if (!Number.isFinite(length)) throw new Error('Invalid path length')
  return Array.from({ length: count }, (_, index) => {
    const point = path.getPointAtLength(
      (length * index) / (shape.closed ? count : count - 1),
    )
    return transformPoint([point.x, point.y], shape.matrix)
  })
}

/** Search cyclic origins and path direction, then solve the best 2D similarity. */
export const alignPoints = (
  from: Point[],
  to: Point[],
  closed: boolean,
  reverse = true,
) => {
  const aCenter = center(from),
    bCenter = center(to)
  const a = from.map(([x, y]): Point => [x - aCenter[0], y - aCenter[1]])
  const b = to.map(([x, y]): Point => [x - bCenter[0], y - bCenter[1]])
  const energy = a.reduce((sum, [x, y]) => sum + x * x + y * y, 0)
  let best = { cost: Infinity, angle: 0, scale: 1, target: b }
  for (const direction of reverse ? [1, -1] : [1]) {
    for (let offset = 0; offset < (closed ? b.length : 1); offset++) {
      const target = a.map(
        (_, i) =>
          b[(offset + (direction === 1 ? i : b.length - 1 - i)) % b.length],
      )
      let dot = 0,
        cross = 0
      for (const [i, element] of a.entries()) {
        dot += element[0] * target[i][0] + element[1] * target[i][1]
        cross += element[0] * target[i][1] - element[1] * target[i][0]
      }
      const angle = energy > 1e-8 ? Math.atan2(cross, dot) : 0
      const scale =
        energy > 1e-8 ? Math.max(1e-4, Math.hypot(dot, cross) / energy) : 1
      const local = target.map(
        (point) => rotate(point, -angle).map((value) => value / scale) as Point,
      )
      const error = local.reduce(
        (sum, p, i) => sum + (p[0] - a[i][0]) ** 2 + (p[1] - a[i][1]) ** 2,
        0,
      )
      const cost = error + (Math.abs(angle) / Math.PI) * 0.05
      if (cost < best.cost) best = { cost, angle, scale, target: local }
    }
  }
  return (progress: number): Point[] => {
    const scale = best.scale ** progress
    return a.map((p, i) => {
      const local: Point = [
        mix(p[0], best.target[i][0], progress),
        mix(p[1], best.target[i][1], progress),
      ]
      const turned = rotate(local, best.angle * progress)
      return [
        turned[0] * scale + mix(aCenter[0], bCenter[0], progress),
        turned[1] * scale + mix(aCenter[1], bCenter[1], progress),
      ]
    })
  }
}

export const createBuiltinPlan = (
  from: MorphShape[],
  to: MorphShape[],
): MorphPlan => {
  const source = from.map((shape) => ({ shape, points: sample(shape) }))
  const targets = to.map((shape) => ({ shape, points: sample(shape) }))
  const available = new Set(source.map((_, index) => index))
  const pairs: { shape: MorphShape; points: (t: number) => Point[] }[] = []
  // Greedy spatial pairing prevents unrelated contours from crossing the icon.
  for (const target of targets) {
    const tc = center(target.points)
    const candidates = [...available].sort((a, b) => {
      const score = (index: number) => {
        const c = center(source[index].points)
        return (
          (c[0] - tc[0]) ** 2 +
          (c[1] - tc[1]) ** 2 +
          (source[index].shape.closed === target.shape.closed ? 0 : 1000)
        )
      }
      return score(a) - score(b)
    })
    const index = candidates[0]
    const points =
      index === undefined ? target.points.map(() => tc) : source[index].points
    available.delete(index)
    pairs.push({
      shape: target.shape,
      points: alignPoints(
        points,
        target.points,
        target.shape.closed,
        target.shape.attributes.fill === 'none',
      ),
    })
  }
  for (const index of available) {
    const item = source[index],
      c = center(item.points)
    pairs.push({
      shape: { ...item.shape, group: to.length + item.shape.group + 1000 },
      points: alignPoints(
        item.points,
        item.points.map(() => c),
        item.shape.closed,
      ),
    })
  }
  return {
    frame: (t) =>
      renderPaths(
        pairs.map(({ shape, points }) => ({
          shape,
          d:
            points(t)
              .map(
                ([x, y], index) =>
                  `${index ? 'L' : 'M'}${x.toFixed(4)} ${y.toFixed(4)}`,
              )
              .join('') + (shape.closed ? 'Z' : ''),
        })),
      ),
  }
}

/** Analytic damped spring, sampled by the shared animation driver. */
export const springProgress = (
  t: number,
  profile: 'smooth' | 'snappy' | 'bouncy',
) => {
  if (t >= 1) return 1
  const [frequency, damping] =
    profile === 'bouncy' ? [18, 7] : profile === 'snappy' ? [20, 12] : [14, 14]
  if (frequency === damping)
    return 1 - (1 + frequency * t) * Math.exp(-frequency * t)
  const omega = Math.sqrt(frequency * frequency - damping * damping)
  return (
    1 -
    Math.exp(-damping * t) *
      (Math.cos(omega * t) + (damping / omega) * Math.sin(omega * t))
  )
}
