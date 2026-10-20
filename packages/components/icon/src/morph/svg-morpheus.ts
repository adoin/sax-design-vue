import { createMorphPlan, path2curve, path2string } from 'svg-morpheus-ts/core'
import { renderPaths, transformPoint } from './types'
import type { CurveData } from 'svg-morpheus-ts/core'
import type { MorphPlan, MorphShape } from './types'

export { springProgress } from 'svg-morpheus-ts/core'

const normalize = (shape: MorphShape) => ({
  d: path2string(
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
  ),
  closed: shape.closed,
  allowReverse: shape.attributes.fill === 'none',
})

/** Pairing, alignment and exact cubic interpolation belong to the published engine. */
export const createMorpheusPlan = (
  from: MorphShape[],
  to: MorphShape[],
): MorphPlan => {
  const plan = createMorphPlan(from.map(normalize), to.map(normalize))
  return {
    frame: (progress) =>
      renderPaths(
        plan.frame(progress).map((d, index) => {
          const pair = plan.pairs[index]
          const shape =
            pair.toIndex === null
              ? { ...from[pair.fromIndex!], group: 1000 + pair.fromIndex! }
              : to[pair.toIndex]
          return { d, shape }
        }),
      ),
  }
}
