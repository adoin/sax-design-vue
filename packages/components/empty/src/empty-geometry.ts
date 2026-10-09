import { easeInOutCubic } from '@vuesax-alpha/utils'

export type EmptyPoint = readonly [x: number, y: number, z: number]
export type EmptyFlapSide = 'back' | 'left' | 'right'
export const emptyMotionDuration = '1.4s'
export const emptyCompletionDuration = '2.4s'
export const emptyOpeningProgress = (time: number) =>
  easeInOutCubic(Math.min(1, Math.max(0, (time - 0.1) / 0.72)))
const halfWidth = 0.82
const halfDepth = 0.55
const boxHeight = 0.62
const flapLength = 0.74
const yaw = (-12 * Math.PI) / 180
const pitch = (40 * Math.PI) / 180

/** One camera is shared by every plane, hinge and material detail. */
export const projectEmptyPoint = ([x, y, z]: EmptyPoint): readonly [
  number,
  number,
] => {
  const horizontal = Math.cos(yaw) * x - Math.sin(yaw) * z
  const depth = Math.sin(yaw) * x + Math.cos(yaw) * z
  const perspective = 6 / (6 + Math.cos(pitch) * depth - Math.sin(pitch) * y)
  return [
    130 + 65 * horizontal * perspective,
    99 - 65 * (Math.cos(pitch) * y + Math.sin(pitch) * depth) * perspective,
  ]
}

/** A rectangle folds around its two fixed rim vertices, with constant edge lengths. */
export const emptyFlapCorners = (
  side: EmptyFlapSide,
  degrees: number,
): readonly EmptyPoint[] => {
  const angle = (degrees * Math.PI) / 180
  const outward = flapLength * Math.cos(angle)
  const height = flapLength * Math.sin(angle)
  if (side === 'back')
    return [
      [-halfWidth, 0, halfDepth],
      [halfWidth, 0, halfDepth],
      [halfWidth, height, halfDepth + outward],
      [-halfWidth, height, halfDepth + outward],
    ]
  const x = side === 'left' ? -halfWidth : halfWidth
  const freeX = x + (side === 'left' ? -outward : outward)
  return [
    [x, 0, -halfDepth],
    [x, 0, halfDepth],
    [freeX, height, halfDepth],
    [freeX, height, -halfDepth],
  ]
}

const path = (points: readonly EmptyPoint[], close = true) =>
  points
    .map(
      (point, index) =>
        `${index ? 'L' : 'M'}${projectEmptyPoint(point)
          .map((value) => value.toFixed(3))
          .join(' ')}`,
    )
    .join('') + (close ? 'Z' : '')
const between = (a: EmptyPoint, b: EmptyPoint, amount: number): EmptyPoint => [
  a[0] + (b[0] - a[0]) * amount,
  a[1] + (b[1] - a[1]) * amount,
  a[2] + (b[2] - a[2]) * amount,
]
const detail = (
  corners: readonly EmptyPoint[],
  depth: number,
  inset = 0.08,
) => {
  const a = between(corners[0], corners[3], depth)
  const b = between(corners[1], corners[2], depth)
  return path([between(a, b, inset), between(a, b, 1 - inset)], false)
}

export interface EmptyFlapFrame {
  outline: string
  edge: string
  crease: string
  fold: string
  highlight: string
  shade: number
}
export interface EmptyFlapAnimation {
  side: EmptyFlapSide
  frames: readonly EmptyFlapFrame[]
  rest: EmptyFlapFrame
  outlines: string
  edges: string
  creases: string
  folds: string
  highlights: string
  shades: string
}

const configurations = [
  { side: 'back', open: 38 },
  { side: 'left', open: 24 },
  { side: 'right', open: 24 },
] as const

// Cached once per module; browsers interpolate paths without Vue/frame callbacks.
export const emptyFlaps: readonly EmptyFlapAnimation[] = configurations.map(
  (config) => {
    const frames = Array.from({ length: 25 }, (_, index): EmptyFlapFrame => {
      const degrees =
        112 + (config.open - 112) * emptyOpeningProgress(index / 24)
      const corners = emptyFlapCorners(config.side, degrees)
      const hinge = corners[1].map((value, axis) => value - corners[0][axis])
      const outward = corners[3].map((value, axis) => value - corners[0][axis])
      const normal = [
        hinge[1] * outward[2] - hinge[2] * outward[1],
        hinge[2] * outward[0] - hinge[0] * outward[2],
        hinge[0] * outward[1] - hinge[1] * outward[0],
      ]
      const thickness =
        (config.side === 'right' ? -0.018 : 0.018) / Math.hypot(...normal)
      const underside = (point: EmptyPoint): EmptyPoint => [
        point[0] + normal[0] * thickness,
        point[1] + normal[1] * thickness,
        point[2] + normal[2] * thickness,
      ]
      return {
        outline: path(corners),
        edge: path([
          corners[3],
          corners[2],
          underside(corners[2]),
          underside(corners[3]),
        ]),
        crease: path([
          corners[0],
          corners[1],
          between(corners[1], corners[2], 0.07),
          between(corners[0], corners[3], 0.07),
        ]),
        fold: detail(corners, 0.08),
        highlight: detail(corners, 0.92),
        shade: Number(
          (0.035 + 0.055 * Math.sin((degrees * Math.PI) / 180)).toFixed(3),
        ),
      }
    })
    return {
      side: config.side,
      frames,
      rest: frames[frames.length - 1],
      outlines: frames.map((frame) => frame.outline).join(';'),
      edges: frames.map((frame) => frame.edge).join(';'),
      creases: frames.map((frame) => frame.crease).join(';'),
      folds: frames.map((frame) => frame.fold).join(';'),
      highlights: frames.map((frame) => frame.highlight).join(';'),
      shades: frames.map((frame) => frame.shade).join(';'),
    }
  },
)

const a: EmptyPoint = [-halfWidth, 0, halfDepth]
const b: EmptyPoint = [halfWidth, 0, halfDepth]
const c: EmptyPoint = [halfWidth, 0, -halfDepth]
const d: EmptyPoint = [-halfWidth, 0, -halfDepth]
const bottom = ([x, , z]: EmptyPoint): EmptyPoint => [x, -boxHeight, z]
export const emptyBox = {
  opening: path([a, b, c, d]),
  floor: path([bottom(a), bottom(b), bottom(c), bottom(d)]),
  backWall: path([a, b, bottom(b), bottom(a)]),
  leftWall: path([a, d, bottom(d), bottom(a)]),
  front: path([d, c, bottom(c), bottom(d)]),
  right: path([c, b, bottom(b), bottom(c)]),
  rim: path([a, b, c, d]),
  handle: path(
    [
      [-0.13, -0.38, -halfDepth],
      [0.13, -0.38, -halfDepth],
    ],
    false,
  ),
  label: path([
    [-0.25, -0.28, -halfDepth],
    [0.25, -0.28, -halfDepth],
    [0.25, -0.49, -halfDepth],
    [-0.25, -0.49, -halfDepth],
  ]),
  frontHighlight: path(
    [between(d, bottom(d), 0.08), between(c, bottom(c), 0.08)],
    false,
  ),
  rightHighlight: path(
    [between(c, bottom(c), 0.08), between(b, bottom(b), 0.08)],
    false,
  ),
}
