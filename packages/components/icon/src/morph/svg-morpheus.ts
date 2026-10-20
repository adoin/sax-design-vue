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
    { d: string; allowReverse: boolean; draw: boolean; paint: PaintStyle }
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
      const isStroke = (p: PaintStyle): boolean =>
        p.layers
          ? p.layers.every((l) => isStroke(l.style))
          : (p.fill ?? p.attributes.fill) === 'none'
      const draw = isStroke(paint)
      groups.set(shape.group, {
        d,
        allowReverse: draw,
        draw,
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
    layers: paint.layers?.map((layer) => ({ ...layer, weight: 0 })),
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
    snapshot: (progress) => {
      const geometry = plan.frame(progress),
        layers = paint.frame(progress)
      return geometry.map((d, group) => ({
        d,
        group,
        matrix: [1, 0, 0, 1, 0, 0],
        closed: /z\s*$/i.test(d),
        attributes: {},
        paint:
          layers[group].length === 1 && layers[group][0].weight === 1
            ? layers[group][0].style
            : { attributes: {}, layers: layers[group] },
      }))
    },
  }
}
