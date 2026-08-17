import { buildProps, definePropType } from '@vuesax-alpha/utils'

import type { ExtractPropTypes } from 'vue'
import type Affix from './affix.vue'

export const affixProps = buildProps({
  offsetTop: { type: Number, default: 0 },
  offsetBottom: { type: Number, default: undefined },
  target: {
    type: definePropType<() => HTMLElement | Window>(Function),
    default: undefined,
  },
  zIndex: { type: Number, default: 100 },
} as const)

export const affixEmits = {
  change: (affixed: boolean) => typeof affixed === 'boolean',
}

export type AffixProps = ExtractPropTypes<typeof affixProps>
export type AffixInstance = InstanceType<typeof Affix>
