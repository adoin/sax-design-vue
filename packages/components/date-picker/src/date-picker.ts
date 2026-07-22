import { UPDATE_MODEL_EVENT } from '@vuesax-alpha/constants'
import { buildProps, definePropType } from '@vuesax-alpha/utils'
import type { ExtractPropTypes, PropType } from 'vue'
import type DatePicker from './date-picker.vue'
import type {
  DateFestivalMethod,
  DatePickerType,
  DatePickerValue,
  DateShortcut,
  TimePickerConfig,
} from './utils'

type DateLike = Date | string | number

export interface DatePickerPopupConfig {
  placement?: 'top' | 'bottom'
  trigger?: 'default' | 'icon' | 'manual'
  transfer?: boolean
  width?: string | number
  height?: string | number
  zIndex?: number
  className?: string
}

export const datePickerProps = buildProps({
  type: {
    type: String as PropType<DatePickerType>,
    default: 'date',
  },
  modelValue: {
    type: definePropType<DatePickerValue>([Date, String, Number, Array]),
  },
  format: String,
  /** VXE-compatible alias for the text shown in the input. */
  labelFormat: String,
  valueFormat: String,
  /** Override only the time segment of datetime display formats. */
  timeFormat: String,
  placeholder: String,
  startPlaceholder: String,
  endPlaceholder: String,
  disabled: Boolean,
  clearable: {
    type: Boolean,
    default: true,
  },
  showClearButton: {
    type: Boolean,
    default: true,
  },
  showConfirmButton: {
    type: Boolean,
    default: true,
  },
  multiple: Boolean,
  limitCount: Number,
  autoClose: {
    type: Boolean,
    default: false,
  },
  editable: {
    type: Boolean,
    default: true,
  },
  disabledDate: {
    type: definePropType<(date: Date) => boolean>(Function),
  },
  festivalMethod: {
    type: definePropType<DateFestivalMethod>(Function),
  },
  startDate: {
    type: definePropType<DateLike>([Date, String, Number]),
  },
  endDate: {
    type: definePropType<DateLike>([Date, String, Number]),
  },
  minDate: {
    type: definePropType<DateLike>([Date, String, Number]),
  },
  maxDate: {
    type: definePropType<DateLike>([Date, String, Number]),
  },
  defaultDate: {
    type: definePropType<DateLike | [DateLike, DateLike]>([
      Date,
      String,
      Number,
      Array,
    ]),
  },
  defaultTime: {
    type: definePropType<DateLike | [DateLike, DateLike]>([
      Date,
      String,
      Number,
      Array,
    ]),
  },
  startDay: {
    type: Number,
    default: 0,
  },
  selectDay: Number,
  timeConfig: {
    type: definePropType<TimePickerConfig>(Object),
  },
  popupConfig: {
    type: definePropType<DatePickerPopupConfig>(Object),
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
  [UPDATE_MODEL_EVENT]: (val: DatePickerValue) => {
    return Boolean(val) || !val
  },
  change: (val: DatePickerValue) => {
    return Boolean(val) || !val
  },
  focus: (evt: FocusEvent) => evt instanceof FocusEvent,
  blur: (evt: FocusEvent) => evt instanceof FocusEvent,
  clear: () => true,
}

export type DatePickerInstance = InstanceType<typeof DatePicker>
