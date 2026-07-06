import { buildProps } from '@vuesax-alpha/utils'

import type { ExtractPropTypes } from 'vue'
import type Collapse from './collapse.vue'

export const collapseProps = buildProps({
  accordion: Boolean,
  type: {
    type: String,
    default: 'default',
  },
  openHover: Boolean,
} as const)

export const collapseEmits = {
  change: () => true,
}

export type CollapseProps = ExtractPropTypes<typeof collapseProps>
export type CollapseInstance = InstanceType<typeof Collapse>
