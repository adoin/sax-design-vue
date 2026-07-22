import {
  datePickerEmits,
  datePickerProps,
} from '@vuesax-alpha/components/date-picker'
import type { ExtractPropTypes } from 'vue'
import type DateRangePicker from './date-range-picker.vue'

export const dateRangePickerProps = datePickerProps
export const dateRangePickerEmits = datePickerEmits
export type DateRangePickerProps = ExtractPropTypes<typeof dateRangePickerProps>
export type DateRangePickerInstance = InstanceType<typeof DateRangePicker>
