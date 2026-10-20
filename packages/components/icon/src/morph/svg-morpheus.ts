import { curveCalc, path2curve, path2string } from 'svg-morpheus-ts/core'
import { renderPaths, transformPoint } from './types'
import type { MorphPlan, MorphShape } from './types'

type Curve = (string | number)[][]
const normalize = (shape: MorphShape): Curve => {
  const curve = path2curve(shape.d) as Curve
  return curve.map(([command, ...values]) => {
    const output: (string | number)[] = [command]
    for (let i = 0; i < values.length; i += 2)
      output.push(
        ...transformPoint(
          [Number(values[i]), Number(values[i + 1])],
          shape.matrix,
        ),
      )
    return output
  })
}

/** Use the published library's Bézier normalization, balancing and interpolation. */
export const createMorpheusPlan = (
  from: MorphShape[],
  to: MorphShape[],
): MorphPlan => {
  const pairs = Array.from(
    { length: Math.max(from.length, to.length) },
    (_, index) => {
      const source = from[index],
        target = to[index]
      const a = source
        ? normalize(source)
        : [
            ['M', 12, 12],
            ['C', 12, 12, 12, 12, 12, 12],
          ]
      const b = target
        ? normalize(target)
        : [
            ['M', 12, 12],
            ['C', 12, 12, 12, 12, 12, 12],
          ]
      const [start, end] = path2curve(a, b) as [Curve, Curve]
      return { start, end, shape: target || { ...source, group: 1000 + index } }
    },
  )
  return {
    frame: (progress) =>
      renderPaths(
        pairs.map(({ start, end, shape }) => ({
          shape,
          d: path2string(curveCalc(start, end, progress)),
        })),
      ),
  }
}
