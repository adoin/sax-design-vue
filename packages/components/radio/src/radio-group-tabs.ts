import { UPDATE_MODEL_EVENT } from '@vuesax-alpha/constants'
import { buildProps, definePropType, isObject } from '@vuesax-alpha/utils'
import type { ExtractPropTypes } from 'vue'
import type { RadioOption, RadioValue } from './radio-group'
import type RadioGroupTabs from './radio-group-tabs.vue'

export type RadioGroupTabValue = string | number
export type RadioGroupTabsModelValue = Record<string, RadioValue>

export interface RadioGroupTab {
  label: string
  value: RadioGroupTabValue
  options: RadioOption[]
  disabled?: boolean
  columns?: number
  disabledValues?: RadioValue[]
}

export const radioGroupTabsProps = buildProps({
  modelValue: {
    type: definePropType<RadioGroupTabsModelValue>(Object),
    default: () => ({}),
  },
  tabs: {
    type: definePropType<RadioGroupTab[]>(Array),
    default: () => [],
  },
  activeKey: {
    type: definePropType<RadioGroupTabValue>([String, Number]),
    default: undefined,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  columns: {
    type: Number,
    default: 2,
  },
  gap: {
    type: definePropType<number | string>([Number, String]),
    default: 12,
  },
} as const)

export const radioGroupTabsEmits = {
  [UPDATE_MODEL_EVENT]: (value: RadioGroupTabsModelValue) => isObject(value),
  'update:activeKey': (value: RadioGroupTabValue) =>
    typeof value === 'string' || typeof value === 'number',
  change: (value: RadioGroupTabsModelValue, activeKey: RadioGroupTabValue) =>
    isObject(value) &&
    (typeof activeKey === 'string' || typeof activeKey === 'number'),
  tabChange: (value: RadioGroupTabValue) =>
    typeof value === 'string' || typeof value === 'number',
}

export type RadioGroupTabsProps = ExtractPropTypes<typeof radioGroupTabsProps>
export type RadioGroupTabsEmits = typeof radioGroupTabsEmits
export type RadioGroupTabsInstance = InstanceType<typeof RadioGroupTabs>
