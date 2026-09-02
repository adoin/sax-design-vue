import { UPDATE_MODEL_EVENT } from '@vuesax-alpha/constants'
import { useColorProp, useShapeProp, useSizeProp } from '@vuesax-alpha/hooks'
import {
  buildProps,
  definePropType,
  isValidTimeZone,
} from '@vuesax-alpha/utils'
import type { ExtractPropTypes } from 'vue'
import type TimePicker from './time-picker.vue'
import type { TimePickerConfig } from '../../date-picker/src/utils'

export type TimePickerValue = Date | string | number | null | undefined

export const timePickerProps = buildProps({
  shape: useShapeProp,
  color: useColorProp,
  size: useSizeProp,
  labelFloat: Boolean,
  label: String,
  modelValue: {
    type: definePropType<TimePickerValue>([Date, String, Number]),
  },
  format: {
    type: String,
    default: 'HH:mm:ss',
  },
  valueFormat: String,
  /** IANA time zone. Overrides ConfigProvider's global time zone. */
  timezone: {
    type: String,
    validator: (value: string) => isValidTimeZone(value),
  },
  /** Override whether the "Now" action immediately commits and closes. */
  autoApplyNow: {
    type: Boolean,
    default: undefined,
  },
  placeholder: String,
  disabled: Boolean,
  clearable: {
    type: Boolean,
    default: true,
  },
  editable: {
    type: Boolean,
    default: true,
  },
  disabledHours: {
    type: definePropType<(role: string) => number[]>(Function),
  },
  disabledMinutes: {
    type: definePropType<(hour: number, role: string) => number[]>(Function),
  },
  disabledSeconds: {
    type: definePropType<
      (hour: number, minute: number, role: string) => number[]
    >(Function),
  },
  timeConfig: {
    type: definePropType<TimePickerConfig>(Object),
  },
  block: Boolean,
  readonly: Boolean,
} as const)

export type TimePickerProps = ExtractPropTypes<typeof timePickerProps>

export const timePickerEmits = {
  [UPDATE_MODEL_EVENT]: (val: TimePickerValue) => {
    return Boolean(val) || !val
  },
  change: (val: TimePickerValue) => {
    return Boolean(val) || !val
  },
  focus: (evt: FocusEvent) => evt instanceof FocusEvent,
  blur: (evt: FocusEvent) => evt instanceof FocusEvent,
  clear: () => true,
}

export type TimePickerInstance = InstanceType<typeof TimePicker>
