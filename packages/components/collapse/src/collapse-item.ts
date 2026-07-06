import { buildProps } from '@vuesax-alpha/utils'

import type { ExtractPropTypes } from 'vue'
import type CollapseItem from './collapse-item.vue'

export const collapseItemProps = buildProps({
  open: Boolean,
  disabled: Boolean,
  notArrow: Boolean,
  iconArrow: {
    type: String,
    default: 'keyboard_arrow_down',
  },
} as const)

export type CollapseItemProps = ExtractPropTypes<typeof collapseItemProps>
export type CollapseItemInstance = InstanceType<typeof CollapseItem>
