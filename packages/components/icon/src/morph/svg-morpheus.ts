import {
  createMorphPlan,
  createPaintPlan,
  path2curve,
  path2string,
  renderPaintFrame,
  transformPaint,
} from 'svg-morpheus-ts/core'
import { transformPoint } from './types'
import type { CurveData, PaintStyle } from 'svg-morpheus-ts/core'
import type { MorphPlan, MorphShape } from './types'

export { springProgress } from 'svg-morpheus-ts/core'
let sequence = 0

/** Normalize DOM coordinates while retaining each filled path's compound contours. */
const normalize = (shapes: MorphShape[]) => {
  const groups = new Map<
    number,
    { d: string; allowReverse: boolean; paint: PaintStyle }
  >()
  for (const shape of shapes) {
    const d = path2string(
      (path2curve(shape.d) as CurveData).map(([command, ...values]) => {
        const output: (string | number)[] = [command]
        for (let i = 0; i < values.length; i += 2)
          output.push(
            ...transformPoint(
              [Number(values[i]), Number(values[i + 1])],
              shape.matrix,
            ),
          )
        return output
      }),
    )
    const existing = groups.get(shape.group)
    if (existing) existing.d += d
    else {
      const paint = shape.paint ?? { attributes: shape.attributes }
      groups.set(shape.group, {
        d,
        allowReverse: shape.attributes.fill === 'none',
        paint: {
          ...paint,
          fill: transformPaint(
            paint.fill ?? shape.attributes.fill,
            shape.matrix,
          ),
          stroke: transformPaint(
            paint.stroke ?? shape.attributes.stroke,
            shape.matrix,
          ),
        },
      })
    }
  }
  return [...groups.values()]
}

/** Geometry, paint interpolation, gradient IDs and group compositing use the published core. */
export const createMorpheusPlan = (
  from: MorphShape[],
  to: MorphShape[],
): MorphPlan => {
  const a = normalize(from),
    b = normalize(to)
  const plan = createMorphPlan(a, b)
  const transparent = (paint: PaintStyle): PaintStyle => ({
    ...paint,
    attributes: { ...paint.attributes, opacity: '0' },
  })
  const paint = createPaintPlan(
    plan.pairs.map((pair) =>
      pair.fromIndex === null
        ? transparent(b[pair.toIndex!].paint)
        : a[pair.fromIndex].paint,
    ),
    plan.pairs.map((pair) =>
      pair.toIndex === null
        ? transparent(a[pair.fromIndex!].paint)
        : b[pair.toIndex].paint,
    ),
  )
  const prefix = `sax-morph-${++sequence}`
  return {
    frame: (progress) =>
      renderPaintFrame(plan.frame(progress), paint.frame(progress), prefix),
  }
}
