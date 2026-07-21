import { UPDATE_MODEL_EVENT } from '@vuesax-alpha/constants'
import { buildProps, definePropType } from '@vuesax-alpha/utils'
import type { ExtractPropTypes, PropType } from 'vue'
import type DatePicker from './date-picker.vue'
import type { DatePickerType, DatePickerValue, DateShortcut } from './utils'

export const datePickerProps = buildProps({
  type: {
    type: String as PropType<DatePickerType>,
    default: 'date',
  },
  modelValue: {
    type: definePropType<DatePickerValue>([Date, String, Number, Array]),
  },
  format: String,
  valueFormat: String,
  placeholder: String,
  startPlaceholder: String,
  endPlaceholder: String,
  disabled: Boolean,
  clearable: {
    type: Boolean,
    default: true,
  },
  editable: {
    type: Boolean,
    default: true,
  },
  disabledDate: {
    type: definePropType<(date: Date) => boolean>(Function),
  },
  shortcuts: {
    type: definePropType<DateShortcut[]>(Array),
    default: () => [],
  },
  separator: {
    type: String,
    default: ' - ',
  },
  block: Boolean,
  readonly: Boolean,
} as const)

export type DatePickerProps = ExtractPropTypes<typeof datePickerProps>

export const datePickerEmits = {
  [UPDATE_MODEL_EVENT]: (val: DatePickerValue) => true,
  change: (val: DatePickerValue) => true,
  focus: (evt: FocusEvent) => evt instanceof FocusEvent,
  blur: (evt: FocusEvent) => evt instanceof FocusEvent,
  clear: () => true,
}

export type DatePickerInstance = InstanceType<typeof DatePicker>
