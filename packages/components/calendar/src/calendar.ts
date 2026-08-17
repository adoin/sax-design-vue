import { buildProps, definePropType } from '@vuesax-alpha/utils'
import type { ContextMenuItem } from '@vuesax-alpha/components/context-menu'
import type { ExtractPropTypes } from 'vue'
import type Calendar from './calendar.vue'

export type CalendarValue = string | string[]
export type CalendarView = 'month' | 'week' | 'day'
export type CalendarHourFormat = '12' | '24'
export type CalendarSize = 'small' | 'medium' | 'large'
export type CalendarEventSegment =
  'all-day' | 'point' | 'range' | 'range-start' | 'range-middle' | 'range-end'

/** A framework-native event model. Dates use `YYYY-MM-DD`; timed events use ISO local datetimes. */
export interface CalendarEvent {
  id: string | number
  title: string
  content?: string
  start: string
  end?: string
  allDay?: boolean
  color?: string
  disabled?: boolean
  /** Per-event compact label override. Useful when one record represents a point in time. */
  display?: CalendarEventDisplay
  data?: Record<string, unknown>
}

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

export interface CalendarEventChange {
  event: CalendarEvent
  start: string
  end?: string
  source: 'drag'
}

/** The visual label rendered for one event occurrence in a calendar cell. */
export interface CalendarEventDisplay {
  title?: string
  /** A compact time marker, such as `08:00`, `08:00~`, or `~18:00`. */
  time?: string
  segment?: CalendarEventSegment
}

export interface CalendarEventDisplayContext {
  date: string
  view: CalendarView
  allDay: boolean
  segment: CalendarEventSegment
}

/**
 * Lets applications customize the compact label without replacing Calendar's
 * event layout. Return a string to replace the title, or an object to replace
 * individual display fields. Use the `event` / `time-event` slots for full
 * markup control.
 */
export type CalendarEventDisplayResolver = (
  event: CalendarEvent,
  context: CalendarEventDisplayContext,
) => CalendarEventDisplay | string | null | undefined

export interface CalendarContextMenuContext {
  type: 'event' | 'date' | 'time'
  date: string
  /** Selected calendar days. Context actions should target these dates. */
  dates: string[]
  event?: CalendarEvent
}

export interface CalendarEventAdapterContext {
  view: CalendarView
  start: string
  end: string
}

/** Context for a month-cell overflow menu. All events belong to `date`. */
export interface CalendarEventOverflowContext {
  date: string
  events: CalendarEvent[]
}

/** Maps application-owned schedule data into the flat display events Calendar renders. */
export type CalendarEventAdapter = (
  data: unknown[],
  context: CalendarEventAdapterContext,
) => CalendarEvent[]

export const calendarProps = buildProps({
  /** Visual density. Medium is the default; large preserves the original cell dimensions. */
  size: {
    type: String as () => CalendarSize,
    values: ['small', 'medium', 'large'] as const,
    default: 'medium',
  },
  modelValue: {
    type: definePropType<CalendarValue>([String, Array]),
    default: '',
  },
  /** Visible day. Supports `v-model:date` without affecting date selection. */
  date: { type: String, default: '' },
  /** Active scheduler view. Supports `v-model:view`. */
  view: {
    type: String as () => CalendarView,
    default: 'month',
  },
  views: {
    type: definePropType<CalendarView[]>(Array),
    default: () => ['month', 'week', 'day'],
  },
  events: {
    type: definePropType<CalendarEvent[]>(Array),
    default: () => [],
  },
  /** Application-owned schedule data. Kept opaque until eventAdapter maps it to display events. */
  eventData: {
    type: definePropType<unknown[]>(Array),
    default: () => [],
  },
  /** Optional adapter for arbitrary schedule models. Calendar does not interpret domain event types. */
  eventAdapter: {
    type: definePropType<CalendarEventAdapter>(Function),
  },
  /** Customizes compact event labels while preserving Calendar's event layout. */
  eventDisplay: {
    type: definePropType<CalendarEventDisplayResolver>(Function),
  },
  /**
   * Number of events rendered directly inside one month/all-day cell.
   * Remaining events stay available through the `+n` overflow menu.
   */
  eventLimit: { type: Number, default: 1 },
  range: Boolean,
  /** Allows arbitrary date toggling. Drag and Shift add contiguous dates to the selection. */
  multiple: Boolean,
  firstDayOfWeek: { type: Number, default: 1 },
  showWeekNumber: Boolean,
  hourStart: { type: Number, default: 0 },
  hourEnd: { type: Number, default: 24 },
  /** Controls time labels without changing stored local ISO times. */
  hourFormat: {
    type: String as () => CalendarHourFormat,
    values: ['12', '24'] as const,
    default: '24',
  },
  /** Maximum height of the scrollable week/day schedule. Set 0 to show all hours. */
  scheduleHeight: { type: Number, default: 640 },
  eventColor: { type: String, default: '' },
  editable: Boolean,
  /** Static menu items displayed for a calendar right-click. */
  contextMenuItems: {
    type: definePropType<ContextMenuItem[]>(Array),
    default: () => [],
  },
  /** Resolves menu items from the currently right-clicked event, date, or time. */
  getContextMenuItems: {
    type: definePropType<
      (context: CalendarContextMenuContext) => ContextMenuItem[]
    >(Function),
  },
  contextMenuMinWidth: { type: Number, default: 184 },
  disabledDate: { type: definePropType<(date: Date) => boolean>(Function) },
} as const)

export const calendarEmits = {
  'update:modelValue': (value: CalendarValue) =>
    typeof value === 'string' || Array.isArray(value),
  'update:date': (value: string) => typeof value === 'string',
  'update:view': (value: CalendarView) =>
    ['month', 'week', 'day'].includes(value),
  change: (value: CalendarValue) =>
    typeof value === 'string' || Array.isArray(value),
  panelChange: (date: Date) => date instanceof Date,
  viewChange: (view: CalendarView) => ['month', 'week', 'day'].includes(view),
  cellClick: (value: string) => typeof value === 'string',
  eventClick: (event: CalendarEvent) => Boolean(event?.id),
  /** Emits on a double-clicked event so the application can open its editor. */
  eventEdit: (event: CalendarEvent) => Boolean(event?.id),
  /** Emits when a user removes an event from a cell overflow menu. */
  eventDelete: (event: CalendarEvent) => Boolean(event?.id),
  /** Emits when a month-cell overflow menu opens. */
  eventOverflow: (context: CalendarEventOverflowContext) =>
    Boolean(context?.date),
  eventChange: (change: CalendarEventChange) => Boolean(change?.event),
  contextMenu: (context: CalendarContextMenuContext) => Boolean(context?.date),
  contextMenuSelect: (payload: {
    item: ContextMenuItem
    context: CalendarContextMenuContext
  }) => Boolean(payload?.item && payload.context?.date),
}

export type CalendarProps = ExtractPropTypes<typeof calendarProps>
export type CalendarInstance = InstanceType<typeof Calendar>
