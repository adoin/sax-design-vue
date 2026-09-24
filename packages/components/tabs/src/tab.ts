import { buildProps, definePropType } from '@vuesax-alpha/utils'

import { tabsRenderModes } from './constants'
import type { ExtractPropTypes } from 'vue'
import type Tab from './tab.vue'
import type { TabValue, TabsRenderMode } from './constants'

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
  /** Override the parent Tabs mounting policy for this pane. */
  renderMode: {
    type: definePropType<TabsRenderMode>(String),
    values: tabsRenderModes,
  },
  /** @deprecated use renderMode="all" on this pane instead. */
  forceRender: Boolean,
} as const)

export type TabProps = ExtractPropTypes<typeof tabProps>
export type TabInstance = InstanceType<typeof Tab>
