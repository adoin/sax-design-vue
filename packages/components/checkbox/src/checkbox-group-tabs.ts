import { UPDATE_MODEL_EVENT } from '@vuesax-alpha/constants'
import {
  buildProps,
  definePropType,
  isArray,
  isObject,
} from '@vuesax-alpha/utils'
import type { ExtractPropTypes } from 'vue'
import type {
  CheckboxGroupItem,
  CheckboxGroupValueType,
} from './checkbox-group'
import type CheckboxGroupTabs from './checkbox-group-tabs.vue'

export type CheckboxGroupTabValue = string | number
export type CheckboxGroupTabsModelValue = Record<string, CheckboxGroupValueType>

export interface CheckboxGroupTab {
  label: string
  value: CheckboxGroupTabValue
  options: CheckboxGroupItem[]
  disabled?: boolean
  columns?: number
  disabledValues?: CheckboxGroupValueType
  disabledGroupValues?: CheckboxGroupValueType
}

export const checkboxGroupTabsProps = buildProps({
  modelValue: {
    type: definePropType<CheckboxGroupTabsModelValue>(Object),
    default: () => ({}),
  },
  tabs: {
    type: definePropType<CheckboxGroupTab[]>(Array),
    default: () => [],
  },
  activeKey: {
    type: definePropType<CheckboxGroupTabValue>([String, Number]),
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

export const checkboxGroupTabsEmits = {
  [UPDATE_MODEL_EVENT]: (value: CheckboxGroupTabsModelValue) => isObject(value),
  'update:activeKey': (value: CheckboxGroupTabValue) =>
    typeof value === 'string' || typeof value === 'number',
  change: (
    value: CheckboxGroupTabsModelValue,
    activeKey: CheckboxGroupTabValue,
  ) =>
    isObject(value) &&
    (typeof activeKey === 'string' || typeof activeKey === 'number'),
  tabChange: (value: CheckboxGroupTabValue) =>
    typeof value === 'string' || typeof value === 'number',
}

export type CheckboxGroupTabsProps = ExtractPropTypes<
  typeof checkboxGroupTabsProps
>
export type CheckboxGroupTabsEmits = typeof checkboxGroupTabsEmits
export type CheckboxGroupTabsInstance = InstanceType<typeof CheckboxGroupTabs>

export const normalizeCheckboxGroupTabValues = (
  value: CheckboxGroupValueType | undefined,
) => (isArray(value) ? value : [])
