import { UPDATE_MODEL_EVENT } from '@vuesax-alpha/constants'
import { buildProps, definePropType, isArray } from '@vuesax-alpha/utils'

import type { ExtractPropTypes } from 'vue'
import type { CheckboxValueType } from './checkbox'
import type CheckboxGroup from './checkbox-group.vue'

export type CheckboxGroupValueType = CheckboxValueType[]

export interface CheckboxGroupOption {
  label: string
  value: CheckboxValueType
  disabled?: boolean
  description?: string
  span?: number
}

export interface CheckboxGroupSection {
  label: string
  value: CheckboxValueType
  options: CheckboxGroupOption[]
  disabled?: boolean
  columns?: number
}

export type CheckboxGroupItem = CheckboxGroupOption | CheckboxGroupSection

export const isCheckboxGroupSection = (
  item: CheckboxGroupItem,
): item is CheckboxGroupSection =>
  isArray((item as CheckboxGroupSection).options)

export const flattenCheckboxGroupOptions = (
  options: CheckboxGroupItem[],
): CheckboxGroupOption[] =>
  options.reduce<CheckboxGroupOption[]>((result, item) => {
    result.push(...(isCheckboxGroupSection(item) ? item.options : [item]))
    return result
  }, [])

export const checkboxGroupProps = buildProps({
  /**
   * @description binding value
   */
  modelValue: {
    type: definePropType<CheckboxGroupValueType>(Array),
    default: () => [],
  },
  /**
   * @description data-driven checkbox options. Sections use an `options` array
   */
  options: {
    type: definePropType<CheckboxGroupItem[]>(Array),
    default: () => [],
  },
  /**
   * @description whether the nesting checkboxes are disabled
   */
  disabled: {
    type: Boolean,
    default: false,
  },
  /**
   * @description minimum number of checkbox checked
   */
  min: {
    type: Number,
  },
  /**
   * @description maximum number of checkbox checked
   */
  max: {
    type: Number,
  },
  /** @description number of option columns */
  columns: {
    type: Number,
    default: 1,
  },
  /** @description spacing between rows and columns */
  gap: {
    type: definePropType<number | string>([Number, String]),
    default: 12,
  },
  /** @description disabled option values */
  disabledValues: {
    type: definePropType<CheckboxGroupValueType>(Array),
    default: () => [],
  },
  /** @description group values whose select-all control is disabled */
  disabledGroupValues: {
    type: definePropType<CheckboxGroupValueType>(Array),
    default: () => [],
  },
} as const)

export type CheckboxGroupProps = ExtractPropTypes<typeof checkboxGroupProps>
export type CheckboxGroupInstance = InstanceType<typeof CheckboxGroup>

export const checkboxGroupEmits = {
  [UPDATE_MODEL_EVENT]: (val: CheckboxGroupValueType) => isArray(val),
  change: (val: CheckboxGroupValueType) => isArray(val),
}

export type CheckboxGroupEmits = typeof checkboxGroupEmits
