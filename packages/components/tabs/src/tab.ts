import { buildProps, definePropType } from '@vuesax-alpha/utils'

import type { ExtractPropTypes } from 'vue'
import type Tab from './tab.vue'
import type { TabValue } from './constants'

export const tabProps = buildProps({
  label: {
    type: String,
    default: 'Label',
  },
  name: {
    type: definePropType<TabValue>([String, Number]),
  },
  icon: {
    type: String,
    default: '',
  },
  badge: {
    type: definePropType<string | number>([String, Number]),
  },
  disabled: Boolean,
  closable: { type: Boolean, default: true },
  forceRender: Boolean,
} as const)

export type TabProps = ExtractPropTypes<typeof tabProps>
export type TabInstance = InstanceType<typeof Tab>
