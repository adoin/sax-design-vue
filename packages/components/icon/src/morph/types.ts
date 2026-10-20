export type Point = [number, number]
export type Matrix = [number, number, number, number, number, number]
export interface MorphShape {
  paint?: import('svg-morpheus-ts/core').PaintStyle
  d: string
  matrix: Matrix
  attributes: Record<string, string>
  closed: boolean
  group: number
}
export interface MorphPlan {
  frame: (progress: number) => string
}
export interface IconMorphOptions {
  /** Animation budget in milliseconds. */
  duration?: number
  /** Spring profile from the shared core. */
  spring?: 'smooth' | 'snappy' | 'bouncy'
}
export interface IconMorphDetail {
  elapsed: number
}

export const transformPoint = ([x, y]: Point, m: Matrix): Point => [
  m[0] * x + m[2] * y + m[4],
  m[1] * x + m[3] * y + m[5],
]
