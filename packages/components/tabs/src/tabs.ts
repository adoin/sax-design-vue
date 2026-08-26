import { UPDATE_MODEL_EVENT } from '@vuesax-alpha/constants'
import { useColorProp } from '@vuesax-alpha/hooks'
import {
  buildProps,
  definePropType,
  isNumber,
  isString,
} from '@vuesax-alpha/utils'

import type { ExtractPropTypes } from 'vue'
import type Tabs from './tabs.vue'
import type {
  TabPaneContext,
  TabValue,
  TabsOverflow,
  TabsPosition,
  TabsSize,
  TabsType,
} from './constants'

const isTabValue = (value: unknown): value is TabValue =>
  isString(value) || isNumber(value)

export const tabsProps = buildProps({
  modelValue: {
    type: [Number, String],
    default: 0,
  },
  color: { ...useColorProp, default: 'primary' },
  alignment: {
    type: String,
    values: ['left', 'center', 'right', 'fixed'],
    default: 'left',
  },
  position: {
    type: definePropType<TabsPosition>(String),
    values: ['top', 'bottom', 'left', 'right'],
    default: 'top',
  },
  type: {
    type: definePropType<TabsType>(String),
    values: ['line', 'pill', 'card', 'connected-card', 'editable-card'],
    default: 'line',
  },
  overflow: {
    type: definePropType<TabsOverflow>(String),
    values: ['collapse', 'scroll', 'wrap'],
    default: 'collapse',
  },
  size: {
    type: definePropType<TabsSize>(String),
    values: ['small', 'default', 'large'],
    default: 'default',
  },
  animated: { type: Boolean, default: true },
  /** Show add and close controls independently from the visual type. */
  editable: Boolean,
  /** Mount a pane only after its first activation, then keep it mounted. */
  lazy: Boolean,
  destroyOnHide: Boolean,
  hideAdd: Boolean,
  ariaLabel: String,
} as const)

export const tabsEmits = {
  [UPDATE_MODEL_EVENT]: isTabValue,
  change: (value: TabValue, pane: TabPaneContext) =>
    isTabValue(value) && !!pane,
  tabClick: (
    value: TabValue,
    event: MouseEvent | KeyboardEvent,
    pane: TabPaneContext,
  ) => isTabValue(value) && !!event && !!pane,
  tabContextmenu: (value: TabValue, event: MouseEvent, pane: TabPaneContext) =>
    isTabValue(value) && !!event && !!pane,
  add: (event: MouseEvent) => !!event,
  remove: (value: TabValue, event: MouseEvent) => isTabValue(value) && !!event,
  edit: (target: TabValue | MouseEvent, action: 'add' | 'remove') =>
    (isTabValue(target) || target instanceof MouseEvent) &&
    (action === 'add' || action === 'remove'),
}

export type TabsProps = ExtractPropTypes<typeof tabsProps>
export type TabsInstance = InstanceType<typeof Tabs>
