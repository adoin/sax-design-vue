import { toValue } from 'vue'
import { dissolveAnimation } from '@vuesax-alpha/utils/svg-filter-animation'
import { useSvgFilterAnimation } from '../use-svg-filter-animation'
import type { MaybeRefOrGetter, Ref } from 'vue'

export { svgDissolveFrame } from '@vuesax-alpha/utils/svg-filter-animation'

/** Compatibility adapter; graph/parameter mapping belongs to the module. */
export const useSvgDissolve = (
  dissolved: MaybeRefOrGetter<boolean>,
  filter: Readonly<Ref<SVGFilterElement | null>>,
  options: {
    dissolveDuration?: MaybeRefOrGetter<number>
    assembleDuration?: number
    onSettled?: (dissolved: boolean) => void
    initialDissolved?: boolean
    animateOnMount?: boolean
  } = {},
) =>
  useSvgFilterAnimation(
    dissolveAnimation,
    () => (toValue(dissolved) ? 1 : 0),
    filter,
    {
      duration: options.dissolveDuration,
      reverseDuration: options.assembleDuration,
      initialProgress:
        options.initialDissolved === undefined
          ? undefined
          : options.initialDissolved
            ? 1
            : 0,
      animateOnMount: options.animateOnMount,
      onSettled: (value) => options.onSettled?.(value === 1),
    },
  )
