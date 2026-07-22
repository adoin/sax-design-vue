import { buildProps, definePropType } from '@vuesax-alpha/utils'
import type { ExtractPropTypes } from 'vue'
import type Calendar from './calendar.vue'

export type CalendarValue = string | string[]
export interface CalendarCell {
  date: Date
  value: string
  day: number
  isCurrentMonth: boolean
  isToday: boolean
  isSelected: boolean
  isInRange: boolean
  disabled: boolean
}

export const calendarProps = buildProps({
  modelValue: {
    type: definePropType<CalendarValue>([String, Array]),
    default: '',
  },
  range: Boolean,
  firstDayOfWeek: { type: Number, default: 1 },
  showWeekNumber: Boolean,
  disabledDate: { type: definePropType<(date: Date) => boolean>(Function) },
} as const)

export const calendarEmits = {
  'update:modelValue': (value: CalendarValue) =>
    typeof value === 'string' || Array.isArray(value),
  change: (value: CalendarValue) =>
    typeof value === 'string' || Array.isArray(value),
  panelChange: (date: Date) => date instanceof Date,
}

export type CalendarProps = ExtractPropTypes<typeof calendarProps>
export type CalendarInstance = InstanceType<typeof Calendar>
