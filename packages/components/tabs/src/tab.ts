import { buildProps } from '@vuesax-alpha/utils'

import type { ExtractPropTypes } from 'vue'
import type Tab from './tab.vue'

export const tabProps = buildProps({
  label: {
    type: String,
    default: 'Label',
  },
  icon: {
    type: String,
    default: '',
  },
  disabled: Boolean,
} as const)

export type TabProps = ExtractPropTypes<typeof tabProps>
export type TabInstance = InstanceType<typeof Tab>
