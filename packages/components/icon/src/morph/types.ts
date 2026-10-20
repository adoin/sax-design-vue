export type Point = [number, number]
export type Matrix = [number, number, number, number, number, number]
export interface MorphShape {
  d: string
  matrix: Matrix
  attributes: Record<string, string>
  closed: boolean
  group: number
}
export interface MorphPlan {
  frame: (progress: number) => string
}
export type IconMorphEngine = 'builtin' | 'svg-morpheus'
export interface IconMorphOptions {
  engine?: IconMorphEngine
  /** Animation budget in milliseconds. */
  duration?: number
  /** Spring profile shared by both engines. */
  spring?: 'smooth' | 'snappy' | 'bouncy'
}
export interface IconMorphDetail {
  engine: IconMorphEngine
  elapsed: number
}

export const transformPoint = ([x, y]: Point, m: Matrix): Point => [
  m[0] * x + m[2] * y + m[4],
  m[1] * x + m[3] * y + m[5],
]

export const escapeAttribute = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

export const pathMarkup = (d: string, attrs: Record<string, string>) =>
  `<path d="${escapeAttribute(d)}" ${Object.entries(attrs)
    .map(([key, value]) => `${key}="${escapeAttribute(value)}"`)
    .join(' ')}/>`

export const renderPaths = (paths: { d: string; shape: MorphShape }[]) => {
  const groups = new Map<
    number,
    { d: string; attributes: Record<string, string> }
  >()
  for (const { d, shape } of paths) {
    const existing = groups.get(shape.group)
    if (existing) existing.d += ` ${d}`
    else groups.set(shape.group, { d, attributes: shape.attributes })
  }
  return [...groups.values()]
    .map(({ d, attributes }) => pathMarkup(d, attributes))
    .join('')
}
