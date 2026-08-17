<template>
  <div :class="ns.e('context-menu')">
    <SContextMenu
      :items="resolvedContextMenuItems"
      :disabled="!hasContextMenu"
      :min-width="contextMenuMinWidth"
      @open="emit('contextMenu', contextMenuContext)"
      @select="onContextMenuSelect"
    >
      <section
        :class="[ns.b(), ns.m(props.size)]"
        @contextmenu.capture="captureContextMenu"
      >
        <header :class="ns.e('header')">
          <div :class="ns.e('navigation')">
            <button type="button" :class="ns.e('today')" @click="goToday">
              {{ t('vs.calendar.today') }}
            </button>
            <button
              type="button"
              :class="ns.e('nav')"
              :aria-label="t('vs.calendar.previousMonth')"
              @click="movePeriod(-1)"
            >
              <SIcon name="cb:chevron-left" />
            </button>
            <button
              type="button"
              :class="ns.e('nav')"
              :aria-label="t('vs.calendar.nextMonth')"
              @click="movePeriod(1)"
            >
              <SIcon name="cb:chevron-right" />
            </button>
            <strong :class="ns.e('title')">{{ title }}</strong>
          </div>
          <div v-if="views.length > 1" :class="ns.e('views')" role="tablist">
            <button
              v-for="calendarView in views"
              :key="calendarView"
              type="button"
              :class="[
                ns.e('view'),
                ns.is('active', activeView === calendarView),
              ]"
              role="tab"
              :aria-selected="activeView === calendarView"
              @click="setView(calendarView)"
            >
              {{ viewLabel(calendarView) }}
            </button>
          </div>
        </header>

        <div v-if="activeView === 'month'" :class="ns.e('month')">
          <div
            :class="[ns.e('grid'), ns.is('week-number', showWeekNumber)]"
            role="grid"
          >
            <div v-if="showWeekNumber" :class="ns.e('weekday')">
              {{ t('vs.calendar.weekNumber') }}
            </div>
            <div v-for="name in weekdays" :key="name" :class="ns.e('weekday')">
              {{ name }}
            </div>
            <template v-for="(week, weekIndex) in weeks" :key="weekIndex">
              <div v-if="showWeekNumber" :class="ns.e('week-number')">
                {{ getWeekNumber(week[0].date) }}
              </div>
              <STooltip
                v-for="cell in week"
                :key="cell.value"
                :disabled="eventsForDate(cell.date).length === 0"
                placement="top"
                type="shadow"
              >
                <div
                  :class="[
                    ns.e('cell'),
                    ns.is('outside', !cell.isCurrentMonth),
                    ns.is('today', cell.isToday),
                    ns.is('selected', isDateSelected(cell.value)),
                    ns.is('in-range', isDateInRange(cell.value)),
                    ns.is('range-preview', isDateInPreview(cell.value)),
                    ns.is('disabled', cell.disabled),
                  ]"
                  :role="'gridcell'"
                  :tabindex="cell.disabled ? -1 : 0"
                  :aria-disabled="cell.disabled || undefined"
                  :aria-label="cell.value"
                  :data-calendar-date="cell.value"
                  @click="handleDateClick(cell, $event)"
                  @keydown.enter.prevent="selectDate(cell)"
                  @keydown.space.prevent="selectDate(cell)"
                  @pointerdown.left="beginDateSelection(cell.value, $event)"
                  @pointerenter="extendDateSelection(cell.value)"
                  @pointermove="extendDateSelection(cell.value)"
                  @pointerup="endDateSelection"
                  @mouseenter="hoveredOverflowKey = cell.value"
                  @mouseleave="hoveredOverflowKey = ''"
                >
                  <span :class="ns.e('day')">{{ cell.day }}</span>
                  <div
                    :class="[
                      ns.e('event-list'),
                      ns.is('inline', effectiveEventLimit === 1),
                    ]"
                  >
                    <button
                      v-for="event in inlineEventsForDate(cell.date)"
                      :key="`${event.id}-${cell.value}`"
                      type="button"
                      :class="[
                        ns.e('event'),
                        ns.is('all-day', isAllDay(event)),
                      ]"
                      :style="eventStyle(event)"
                      :data-calendar-event-id="event.id"
                      :data-calendar-date="cell.value"
                      :draggable="editable && !event.disabled"
                      @click.stop="emit('eventClick', event)"
                      @dblclick.stop="emit('eventEdit', event)"
                      @dragstart="startDrag(event)"
                    >
                      <slot
                        name="event"
                        :event="event"
                        :date="cell.value"
                        :display="getEventDisplay(event, cell.date)"
                        :all-day="isAllDay(event)"
                      >
                        <span
                          v-if="getEventDisplay(event, cell.date).time"
                          :class="ns.e('event-time')"
                        >
                          {{ getEventDisplay(event, cell.date).time }}
                        </span>
                        <span :class="ns.e('event-title')">
                          {{ getEventDisplay(event, cell.date).title }}
                        </span>
                      </slot>
                    </button>
                    <SPopper
                      v-if="overflowEventsForDate(cell.date).length"
                      :visible="overflowDate === cell.value"
                      trigger="click"
                      placement="bottom-start"
                      strategy="fixed"
                      :offset="8"
                      :show-arrow="false"
                      popper-class="s-calendar__overflow-popper"
                      @update:visible="setOverflowVisible(cell.value, $event)"
                    >
                      <button
                        type="button"
                        :class="ns.e('more')"
                        :aria-label="t('vs.calendar.moreEvents')"
                        @click.stop
                        @pointerdown.stop
                      >
                        <Transition :name="ns.e('more-switch')" mode="out-in">
                          <span
                            v-if="hoveredOverflowKey !== cell.value"
                            key="count"
                            :class="ns.e('more-count')"
                          >
                            +{{ overflowEventsForDate(cell.date).length }}
                          </span>
                          <SIcon
                            v-else
                            key="icon"
                            :class="ns.e('more-icon')" name="cb:overflow-menu-vertical"
                            aria-hidden="true"
                          />
                        </Transition>
                      </button>
                      <template #content>
                        <div :class="ns.e('overflow')" @click.stop>
                          <div :class="ns.e('overflow-head')">
                            <strong>{{ formatOverflowDate(cell.date) }}</strong>
                            <span>
                              {{ eventsForDate(cell.date).length }}
                              {{ t('vs.calendar.events') }}
                            </span>
                          </div>
                          <div :class="ns.e('overflow-list')">
                            <slot
                              v-for="event in eventsForDate(cell.date)"
                              :key="`${event.id}-${cell.value}`"
                              name="event-overflow"
                              :event="event"
                              :date="cell.value"
                              :display="getEventDisplay(event, cell.date)"
                              :all-day="isAllDay(event)"
                              :edit="() => editOverflowEvent(event)"
                              :remove="() => removeOverflowEvent(event)"
                            >
                              <div :class="ns.e('overflow-event')">
                                <button
                                  type="button"
                                  :class="ns.e('overflow-event-main')"
                                  :style="eventStyle(event)"
                                  @click.stop="emit('eventClick', event)"
                                  @dblclick.stop="editOverflowEvent(event)"
                                >
                                  <span
                                    v-if="
                                      getEventDisplay(event, cell.date).time
                                    "
                                    :class="ns.e('overflow-event-time')"
                                  >
                                    {{ getEventDisplay(event, cell.date).time }}
                                  </span>
                                  <span :class="ns.e('overflow-event-title')">
                                    {{
                                      getEventDisplay(event, cell.date).title
                                    }}
                                  </span>
                                  <span
                                    v-if="event.content"
                                    :class="ns.e('overflow-event-content')"
                                  >
                                    {{ event.content }}
                                  </span>
                                </button>
                                <div :class="ns.e('overflow-event-actions')">
                                  <button
                                    type="button"
                                    :disabled="event.disabled"
                                    :aria-label="t('vs.calendar.editEvent')"
                                    @click.stop="editOverflowEvent(event)"
                                  >
                                    <SIcon name="cb:edit"
                                    />
                                  </button>
                                  <button
                                    type="button"
                                    :disabled="event.disabled"
                                    :aria-label="t('vs.calendar.deleteEvent')"
                                    @click.stop="removeOverflowEvent(event)"
                                  >
                                    <SIcon name="cb:trash-can"
                                    />
                                  </button>
                                </div>
                              </div>
                            </slot>
                          </div>
                        </div>
                      </template>
                    </SPopper>
                  </div>
                  <slot name="date-cell" :cell="cell" />
                </div>
                <template #content>
                  <div :class="ns.e('event-tooltip')">
                    <div
                      v-for="event in eventsForDate(cell.date)"
                      :key="event.id"
                    >
                      <strong>{{ event.title }}</strong>
                      <span v-if="event.content || !isAllDay(event)">
                        {{ event.content || timeRange(event) }}
                      </span>
                    </div>
                  </div>
                </template>
              </STooltip>
            </template>
          </div>
        </div>

        <div v-else :class="ns.e('schedule')" :style="scheduleStyle">
          <div :class="ns.e('schedule-head')">
            <div :class="ns.e('time-gutter')" />
            <div
              v-for="day in visibleDays"
              :key="toValue(day)"
              :class="[
                ns.e('schedule-day'),
                ns.is('today', isToday(day)),
                ns.is('selected', selectedValues.includes(toValue(day))),
              ]"
            >
              <span>{{ weekdayLabel(day) }}</span>
              <strong>{{ day.getDate() }}</strong>
            </div>
          </div>
          <div :class="ns.e('all-day-row')">
            <span :class="ns.e('all-day-label')">{{
              t('vs.calendar.allDay')
            }}</span>
            <div
              v-for="day in visibleDays"
              :key="`all-day-${toValue(day)}`"
              :class="[
                ns.e('all-day-cell'),
                ns.is('selected', isDateSelected(toValue(day))),
                ns.is('in-range', isDateInRange(toValue(day))),
                ns.is('range-preview', isDateInPreview(toValue(day))),
              ]"
              :data-calendar-date="toValue(day)"
              @click="handleDateValueClick(toValue(day), $event)"
              @pointerdown.left="beginDateSelection(toValue(day), $event)"
              @pointerenter="extendDateSelection(toValue(day))"
              @pointermove="extendDateSelection(toValue(day))"
              @pointerup="endDateSelection"
              @mouseenter="hoveredOverflowKey = `all-day-${toValue(day)}`"
              @mouseleave="hoveredOverflowKey = ''"
            >
              <div
                :class="[
                  ns.e('event-list'),
                  ns.is('inline', effectiveEventLimit === 1),
                ]"
              >
                <button
                  v-for="event in inlineAllDayEventsForDate(day)"
                  :key="`${event.id}-${toValue(day)}`"
                  type="button"
                  :class="[ns.e('event'), ns.is('all-day', true)]"
                  :style="eventStyle(event)"
                  :data-calendar-event-id="event.id"
                  :data-calendar-date="toValue(day)"
                  :draggable="editable && !event.disabled"
                  @click.stop="emit('eventClick', event)"
                  @dblclick.stop="emit('eventEdit', event)"
                  @dragstart="startDrag(event)"
                >
                  <slot
                    name="event"
                    :event="event"
                    :date="toValue(day)"
                    :display="getEventDisplay(event, day)"
                    :all-day="true"
                  >
                    <span
                      v-if="getEventDisplay(event, day).time"
                      :class="ns.e('event-time')"
                    >
                      {{ getEventDisplay(event, day).time }}
                    </span>
                    <span :class="ns.e('event-title')">
                      {{ getEventDisplay(event, day).title }}
                    </span>
                  </slot>
                </button>
                <SPopper
                  v-if="overflowAllDayEventsForDate(day).length"
                  :visible="overflowDate === `all-day-${toValue(day)}`"
                  trigger="click"
                  placement="bottom-start"
                  strategy="fixed"
                  :offset="8"
                  :show-arrow="false"
                  popper-class="s-calendar__overflow-popper"
                  @update:visible="
                    setOverflowVisible(`all-day-${toValue(day)}`, $event)
                  "
                >
                  <button
                    type="button"
                    :class="ns.e('more')"
                    :aria-label="t('vs.calendar.moreEvents')"
                    @click.stop
                    @pointerdown.stop
                  >
                    <Transition :name="ns.e('more-switch')" mode="out-in">
                      <span
                        v-if="hoveredOverflowKey !== `all-day-${toValue(day)}`"
                        key="count"
                        :class="ns.e('more-count')"
                      >
                        +{{ overflowAllDayEventsForDate(day).length }}
                      </span>
                      <SIcon
                        v-else
                        key="icon"
                        :class="ns.e('more-icon')" name="cb:overflow-menu-vertical"
                        aria-hidden="true"
                      />
                    </Transition>
                  </button>
                  <template #content>
                    <div :class="ns.e('overflow')" @click.stop>
                      <div :class="ns.e('overflow-head')">
                        <strong>{{ formatOverflowDate(day) }}</strong>
                        <span>
                          {{ allDayEventsForDate(day).length }}
                          {{ t('vs.calendar.events') }}
                        </span>
                      </div>
                      <div :class="ns.e('overflow-list')">
                        <slot
                          v-for="event in allDayEventsForDate(day)"
                          :key="`${event.id}-${toValue(day)}`"
                          name="event-overflow"
                          :event="event"
                          :date="toValue(day)"
                          :display="getEventDisplay(event, day)"
                          :all-day="true"
                          :edit="() => editOverflowEvent(event)"
                          :remove="() => removeOverflowEvent(event)"
                        >
                          <div :class="ns.e('overflow-event')">
                            <button
                              type="button"
                              :class="ns.e('overflow-event-main')"
                              :style="eventStyle(event)"
                              @click.stop="emit('eventClick', event)"
                              @dblclick.stop="editOverflowEvent(event)"
                            >
                              <span :class="ns.e('overflow-event-title')">
                                {{ getEventDisplay(event, day).title }}
                              </span>
                              <span
                                v-if="event.content"
                                :class="ns.e('overflow-event-content')"
                              >
                                {{ event.content }}
                              </span>
                            </button>
                            <div :class="ns.e('overflow-event-actions')">
                              <button
                                type="button"
                                :disabled="event.disabled"
                                :aria-label="t('vs.calendar.editEvent')"
                                @click.stop="editOverflowEvent(event)"
                              >
                                <SIcon name="cb:edit" />
                              </button>
                              <button
                                type="button"
                                :disabled="event.disabled"
                                :aria-label="t('vs.calendar.deleteEvent')"
                                @click.stop="removeOverflowEvent(event)"
                              >
                                <SIcon name="cb:trash-can"
                                />
                              </button>
                            </div>
                          </div>
                        </slot>
                      </div>
                    </div>
                  </template>
                </SPopper>
              </div>
            </div>
          </div>
          <div :class="ns.e('time-grid')">
            <div :class="ns.e('time-axis')">
              <span
                v-for="hour in hours"
                :key="hour"
                :class="ns.e('time-label')"
              >
                {{ formatHour(hour) }}
              </span>
            </div>
            <div
              v-for="day in visibleDays"
              :key="`time-${toValue(day)}`"
              :class="[
                ns.e('time-column'),
                ns.is('today', isToday(day)),
                ns.is('selected', isDateSelected(toValue(day))),
                ns.is('in-range', isDateInRange(toValue(day))),
                ns.is('range-preview', isDateInPreview(toValue(day))),
              ]"
              :data-calendar-date="toValue(day)"
              @click="handleScheduleDateClick(day, $event)"
              @pointerdown.left="beginDateSelection(toValue(day), $event)"
              @pointerenter="extendDateSelection(toValue(day))"
              @pointermove="extendDateSelection(toValue(day))"
              @pointerup="endDateSelection"
              @dragover.prevent
              @drop="dropEvent(day, $event)"
            >
              <span
                v-for="hour in hours"
                :key="hour"
                :class="ns.e('time-line')"
              />
              <STooltip
                v-for="event in timedEventsForDate(day)"
                :key="event.id"
                placement="right"
                type="shadow"
              >
                <button
                  type="button"
                  :class="ns.e('time-event')"
                  :style="timeEventStyle(event)"
                  :data-calendar-event-id="event.id"
                  :data-calendar-date="toValue(day)"
                  :draggable="editable && !event.disabled"
                  @click.stop="emit('eventClick', event)"
                  @dblclick.stop="emit('eventEdit', event)"
                  @dragstart="startDrag(event)"
                >
                  <slot
                    name="time-event"
                    :event="event"
                    :date="toValue(day)"
                    :display="getEventDisplay(event, day)"
                  >
                    <strong>{{ getEventDisplay(event, day).title }}</strong>
                    <span>{{ timeRange(event) }}</span>
                  </slot>
                </button>
                <template #content>
                  <div :class="ns.e('event-tooltip')">
                    <strong>{{ event.title }}</strong>
                    <span>{{ event.content || timeRange(event) }}</span>
                  </div>
                </template>
              </STooltip>
            </div>
          </div>
        </div>
      </section>
      <template #menu="{ close }">
        <slot
          name="context-menu"
          :context="contextMenuContext"
          :close="close"
        />
      </template>
    </SContextMenu>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref, useSlots, watch } from 'vue'
import { SContextMenu } from '@vuesax-alpha/components/context-menu'
import { SIcon } from '@vuesax-alpha/components/icon'
import { SPopper } from '@vuesax-alpha/components/popper'
import { STooltip } from '@vuesax-alpha/components/tooltip'
import { useLocale, useNamespace } from '@vuesax-alpha/hooks'
import { calendarEmits, calendarProps } from './calendar'
import type {
  CalendarCell,
  CalendarContextMenuContext,
  CalendarEvent,
  CalendarEventAdapterContext,
  CalendarEventDisplay,
  CalendarEventSegment,
  CalendarView,
} from './calendar'
import type { ContextMenuItem } from '@vuesax-alpha/components/context-menu'

defineOptions({ name: 'SCalendar' })

const props = defineProps(calendarProps)
const emit = defineEmits(calendarEmits)
const slots = useSlots()
const ns = useNamespace('calendar')
const { lang, t } = useLocale()
const viewDate = ref(new Date())
const normalizeView = (view: CalendarView) =>
  props.views.includes(view) || !props.views.length
    ? view
    : (props.views[0] ?? view)
const activeView = ref<CalendarView>(normalizeView(props.view))
const draggedEvent = ref<CalendarEvent>()
const overflowDate = ref('')
const hoveredOverflowKey = ref('')
const weekdayKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const
const pad = (value: number) => String(value).padStart(2, '0')
const toValue = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
const contextMenuContext = ref<CalendarContextMenuContext>({
  type: 'date',
  date: toValue(viewDate.value),
  dates: [],
})
const rangeSelectionAnchor = ref<string>()
const rangeSelectionPreview = ref<string>()
const rangeSelectionMoved = ref(false)
const multipleSelectionAnchor = ref<string>()
const suppressDateClick = ref(false)
const toDate = (value: string) => {
  const date = new Date(value.includes('T') ? value : `${value}T00:00:00`)
  return Number.isNaN(date.getTime()) ? undefined : date
}
const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate())
const sameDay = (left: Date, right: Date) => toValue(left) === toValue(right)
const selectedValues = computed(() =>
  Array.isArray(props.modelValue)
    ? props.modelValue
    : props.modelValue
      ? [props.modelValue]
      : [],
)
const dateRangeValues = (start: string, end: string) => {
  const first = toDate(start)
  const last = toDate(end)
  if (!first || !last) return []
  const dates: string[] = []
  const cursor = startOfDay(first)
  const limit = startOfDay(last)
  while (cursor <= limit) {
    dates.push(toValue(cursor))
    cursor.setDate(cursor.getDate() + 1)
  }
  return dates
}
const selectedDateValues = computed(() => {
  const values = selectedValues.value.map((value) => value.slice(0, 10))
  if (props.multiple || !props.range || values.length !== 2) return values
  const [start, end] = values.sort()
  return dateRangeValues(start, end)
})
const isDateSelected = (value: string) => selectedValues.value.includes(value)
const isDateInRange = (value: string) =>
  props.range &&
  selectedDateValues.value.includes(value) &&
  !isDateSelected(value)
const isDateInPreview = (value: string) => {
  const anchor = rangeSelectionAnchor.value
  const preview = rangeSelectionPreview.value
  return Boolean(
    anchor &&
    preview &&
    anchor !== preview &&
    dateRangeValues(anchor, preview).includes(value),
  )
}
const weekdays = computed(() =>
  weekdayKeys
    .slice(props.firstDayOfWeek)
    .concat(weekdayKeys.slice(0, props.firstDayOfWeek))
    .map((day) => t(`vs.datepicker.weeks.${day}`)),
)
// A schedule never renders past midnight. Clamp public inputs here so an
// accidental hourEnd above 24 cannot create invisible / empty time rows.
const scheduleHourStart = computed(() =>
  Math.min(Math.max(Math.floor(props.hourStart), 0), 23),
)
const scheduleHourEnd = computed(() =>
  Math.min(Math.max(Math.ceil(props.hourEnd), scheduleHourStart.value + 1), 24),
)
const scheduleMinutes = computed(
  () => (scheduleHourEnd.value - scheduleHourStart.value) * 60,
)
const hours = computed(() =>
  Array.from(
    { length: Math.max(scheduleHourEnd.value - scheduleHourStart.value, 1) },
    (_, index) => scheduleHourStart.value + index,
  ),
)
const scheduleStyle = computed(() => ({
  '--sax-calendar-columns': String(activeView.value === 'day' ? 1 : 7),
  '--sax-calendar-hours': String(hours.value.length),
  ...(props.scheduleHeight > 0
    ? { '--sax-calendar-schedule-height': `${props.scheduleHeight}px` }
    : {}),
}))
const resolvedContextMenuItems = computed<ContextMenuItem[]>(() =>
  props.getContextMenuItems
    ? props.getContextMenuItems(contextMenuContext.value)
    : props.contextMenuItems,
)
const hasContextMenu = computed(
  () =>
    resolvedContextMenuItems.value.length > 0 || Boolean(slots['context-menu']),
)
const visibleDays = computed(() => {
  if (activeView.value === 'day') return [startOfDay(viewDate.value)]
  const start = startOfDay(viewDate.value)
  const offset = (start.getDay() - props.firstDayOfWeek + 7) % 7
  start.setDate(start.getDate() - offset)
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start)
    date.setDate(start.getDate() + index)
    return date
  })
})
const eventAdapterContext = computed<CalendarEventAdapterContext>(() => {
  const start =
    activeView.value === 'month'
      ? new Date(viewDate.value.getFullYear(), viewDate.value.getMonth(), 1)
      : visibleDays.value[0]
  const end =
    activeView.value === 'month'
      ? new Date(viewDate.value.getFullYear(), viewDate.value.getMonth() + 1, 0)
      : visibleDays.value[visibleDays.value.length - 1]
  return {
    view: activeView.value,
    start: toValue(start),
    end: toValue(end),
  }
})
const resolvedEvents = computed(() =>
  props.eventAdapter
    ? props.eventAdapter(props.eventData, eventAdapterContext.value)
    : props.events,
)
const title = computed(() => {
  if (activeView.value === 'month') {
    return new Intl.DateTimeFormat(lang.value, {
      month: 'long',
      year: 'numeric',
    }).format(viewDate.value)
  }
  if (activeView.value === 'day') {
    return new Intl.DateTimeFormat(lang.value, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(viewDate.value)
  }
  const start = visibleDays.value[0]
  const end = visibleDays.value[visibleDays.value.length - 1]
  const formatter = new Intl.DateTimeFormat(lang.value, {
    month: 'short',
    day: 'numeric',
  })
  return `${formatter.format(start)} — ${new Intl.DateTimeFormat(lang.value, { month: 'short', day: 'numeric', year: 'numeric' }).format(end)}`
})
const weeks = computed<CalendarCell[][]>(() => {
  const year = viewDate.value.getFullYear()
  const month = viewDate.value.getMonth()
  const first = new Date(year, month, 1)
  const offset = (first.getDay() - props.firstDayOfWeek + 7) % 7
  const start = new Date(year, month, 1 - offset)
  const range = selectedValues.value
    .map(toDate)
    .filter(Boolean)
    .sort((a, b) => a!.getTime() - b!.getTime()) as Date[]
  return Array.from({ length: 6 }, (_, weekIndex) =>
    Array.from({ length: 7 }, (_, dayIndex) => {
      const date = new Date(start)
      date.setDate(start.getDate() + weekIndex * 7 + dayIndex)
      const value = toValue(date)
      const time = startOfDay(date).getTime()
      return {
        date,
        value,
        day: date.getDate(),
        isCurrentMonth: date.getMonth() === month,
        isToday: isToday(date),
        isSelected: selectedValues.value.includes(value),
        isInRange:
          range.length === 2 &&
          time > startOfDay(range[0]).getTime() &&
          time < startOfDay(range[1]).getTime(),
        disabled: props.disabledDate?.(date) ?? false,
      }
    }),
  )
})

const isToday = (date: Date) => sameDay(date, new Date())
const eventStart = (event: CalendarEvent) => toDate(event.start)
const eventEnd = (event: CalendarEvent) => toDate(event.end || event.start)
const isAllDay = (event: CalendarEvent) =>
  event.allDay || !event.start.includes('T')
const isStartOfDay = (date: Date) =>
  date.getHours() === 0 && date.getMinutes() === 0 && date.getSeconds() === 0
const isEndOfDay = (date: Date) =>
  date.getHours() === 23 && date.getMinutes() === 59
const eventSegment = (
  event: CalendarEvent,
  date: Date,
): CalendarEventSegment => {
  if (isAllDay(event)) return 'all-day'
  if (event.display?.segment) return event.display.segment

  const start = eventStart(event)
  const end = eventEnd(event)
  if (!start || !end || start.getTime() === end.getTime()) return 'point'
  if (sameDay(start, end)) return 'range'
  if (sameDay(start, date)) return 'range-start'
  if (sameDay(end, date)) return 'range-end'
  return 'range-middle'
}
const formatEventTime = (date: Date) =>
  new Intl.DateTimeFormat(lang.value, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: props.hourFormat === '12',
  }).format(date)
const defaultEventDisplay = (
  event: CalendarEvent,
  date: Date,
): CalendarEventDisplay => {
  const start = eventStart(event)
  const end = eventEnd(event)
  const segment = eventSegment(event, date)
  let time = ''

  if (start && end) {
    if (segment === 'point') time = formatEventTime(start)
    else if (segment === 'range') {
      if (!isStartOfDay(start) || !isEndOfDay(end))
        time = `${formatEventTime(start)}–${formatEventTime(end)}`
    } else if (segment === 'range-start' && !isStartOfDay(start))
      time = `${formatEventTime(start)}~`
    else if (segment === 'range-end' && !isEndOfDay(end) && !isStartOfDay(end))
      time = `~${formatEventTime(end)}`
  }

  return {
    title: event.title,
    time,
    segment,
    ...event.display,
  }
}
const getEventDisplay = (event: CalendarEvent, date: Date) => {
  const display = defaultEventDisplay(event, date)
  const custom = props.eventDisplay?.(event, {
    date: toValue(date),
    view: activeView.value,
    allDay: isAllDay(event),
    segment: display.segment || 'all-day',
  })
  if (typeof custom === 'string') return { ...display, title: custom }
  return custom ? { ...display, ...custom } : display
}
const eventMatchesDate = (event: CalendarEvent, date: Date) => {
  const start = eventStart(event)
  const end = eventEnd(event)
  return Boolean(
    start &&
    end &&
    startOfDay(date) >= startOfDay(start) &&
    startOfDay(date) <= startOfDay(end),
  )
}
const eventOccurrenceTime = (event: CalendarEvent, date: Date) => {
  const start = eventStart(event)
  if (!start) return Number.MAX_SAFE_INTEGER
  return Math.max(start.getTime(), startOfDay(date).getTime())
}
const sortEventsForDate = (events: CalendarEvent[], date: Date) =>
  events
    .map((event, index) => ({ event, index }))
    .sort(
      (left, right) =>
        eventOccurrenceTime(left.event, date) -
          eventOccurrenceTime(right.event, date) || left.index - right.index,
    )
    .map(({ event }) => event)
const eventsForDate = (date: Date) =>
  sortEventsForDate(
    resolvedEvents.value.filter((event) => eventMatchesDate(event, date)),
    date,
  )
const allDayEventsForDate = (date: Date) =>
  sortEventsForDate(
    resolvedEvents.value.filter(
      (event) => isAllDay(event) && eventMatchesDate(event, date),
    ),
    date,
  )
const effectiveEventLimit = computed(() => {
  const limit = Number(props.eventLimit)
  return Number.isFinite(limit) ? Math.max(Math.floor(limit), 0) : 1
})
const inlineEventsForDate = (date: Date) =>
  eventsForDate(date).slice(0, effectiveEventLimit.value)
const overflowEventsForDate = (date: Date) =>
  eventsForDate(date).slice(effectiveEventLimit.value)
const inlineAllDayEventsForDate = (date: Date) =>
  allDayEventsForDate(date).slice(0, effectiveEventLimit.value)
const overflowAllDayEventsForDate = (date: Date) =>
  allDayEventsForDate(date).slice(effectiveEventLimit.value)
const overflowDateValue = (key: string) => key.replace(/^all-day-/, '')
const setOverflowVisible = (key: string, visible: boolean) => {
  if (!visible) {
    if (overflowDate.value === key) overflowDate.value = ''
    return
  }

  overflowDate.value = key
  const date = toDate(overflowDateValue(key))
  if (!date) return
  emit('eventOverflow', {
    date: toValue(date),
    events: key.startsWith('all-day-')
      ? allDayEventsForDate(date)
      : eventsForDate(date),
  })
}
const formatOverflowDate = (date: Date) =>
  new Intl.DateTimeFormat(lang.value, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(date)
const editOverflowEvent = (event: CalendarEvent) => {
  if (event.disabled) return
  overflowDate.value = ''
  emit('eventEdit', event)
}
const removeOverflowEvent = (event: CalendarEvent) => {
  if (event.disabled) return
  overflowDate.value = ''
  emit('eventDelete', event)
}
const timedEventsForDate = (date: Date) =>
  resolvedEvents.value.filter(
    (event) =>
      !isAllDay(event) &&
      eventStart(event) &&
      sameDay(eventStart(event)!, date),
  )
const eventStyle = (event: CalendarEvent) => ({
  '--sax-calendar-event-color':
    event.color || props.eventColor || 'rgb(var(--sax-primary))',
})
const timeEventStyle = (event: CalendarEvent) => {
  const start = eventStart(event)!
  const end = eventEnd(event)!
  const range = Math.max(scheduleMinutes.value, 1)
  const startMinutes =
    start.getHours() * 60 + start.getMinutes() - scheduleHourStart.value * 60
  const endMinutes =
    end.getHours() * 60 +
    end.getMinutes() -
    scheduleHourStart.value * 60 +
    Math.max(
      0,
      Math.round(
        (startOfDay(end).getTime() - startOfDay(start).getTime()) / 86400000,
      ),
    ) *
      24 *
      60
  const visibleStart = Math.min(Math.max(startMinutes, 0), range)
  const visibleEnd = Math.min(Math.max(endMinutes, 0), range)
  const top = (visibleStart / range) * 100
  const visibleHeight = Math.max(visibleEnd - visibleStart, 0)
  return {
    ...eventStyle(event),
    top: `${top}%`,
    // Clip events at the configured grid bounds. A late event therefore never
    // leaks below 24:00 even if upstream data contains a longer interval.
    height: `${Math.min(100 - top, Math.max((visibleHeight / range) * 100, visibleHeight ? 2 : 0))}%`,
  }
}
const timeRange = (event: CalendarEvent) => {
  const start = eventStart(event)
  const end = eventEnd(event)
  if (!start || !end) return ''
  if (event.display?.segment === 'point' || start.getTime() === end.getTime())
    return formatEventTime(start)
  return `${formatEventTime(start)} – ${formatEventTime(end)}`
}
const weekdayLabel = (date: Date) =>
  new Intl.DateTimeFormat(lang.value, { weekday: 'short' }).format(date)
const formatHour = (hour: number) =>
  new Intl.DateTimeFormat(lang.value, {
    hour: 'numeric',
    hour12: props.hourFormat === '12',
  }).format(new Date(2000, 0, 1, hour))
const viewLabel = (view: CalendarView) => t(`vs.calendar.views.${view}`)

const syncDate = () => {
  const value = toValue(viewDate.value)
  emit('update:date', value)
  emit('panelChange', viewDate.value)
}
const movePeriod = (offset: number) => {
  const next = new Date(viewDate.value)
  if (activeView.value === 'month') next.setMonth(next.getMonth() + offset)
  else if (activeView.value === 'week')
    next.setDate(next.getDate() + offset * 7)
  else next.setDate(next.getDate() + offset)
  viewDate.value = next
  syncDate()
}
const goToday = () => {
  viewDate.value = new Date()
  syncDate()
}
const setView = (view: CalendarView) => {
  if (props.views.length && !props.views.includes(view)) return
  activeView.value = view
  emit('update:view', view)
  emit('viewChange', view)
}
const emitDateSelection = (value: string | string[]) => {
  emit('update:modelValue', value)
  emit('change', value)
  emit('cellClick', Array.isArray(value) ? value[value.length - 1] : value)
}
const selectDateValue = (value: string, event?: MouseEvent) => {
  if (props.multiple) {
    const values = selectedDateValues.value
    const anchor = multipleSelectionAnchor.value || value
    const extendsRange = Boolean(
      event?.shiftKey && multipleSelectionAnchor.value,
    )
    const nextValue = extendsRange
      ? Array.from(
          new Set([...values, ...dateRangeValues(anchor, value)]),
        ).sort()
      : values.includes(value)
        ? values.filter((item) => item !== value)
        : [...values, value].sort()
    multipleSelectionAnchor.value = value
    emitDateSelection(nextValue)
    return
  }
  let nextValue: string | string[] = value
  if (props.range) {
    const values = selectedValues.value
    nextValue = values.length !== 1 ? [value] : [values[0], value].sort()
  }
  emitDateSelection(nextValue)
}
const selectDate = (cell: CalendarCell) => {
  if (cell.disabled) return
  selectDateValue(cell.value)
}
const handleDateClick = (cell: CalendarCell, event: MouseEvent) => {
  if (suppressDateClick.value) return
  if (cell.disabled) return
  selectDateValue(cell.value, event)
}
const handleDateValueClick = (value: string, event: MouseEvent) => {
  if (suppressDateClick.value) return
  selectDateValue(value, event)
}
const beginDateSelection = (value: string, event: PointerEvent) => {
  if (!props.range && !props.multiple) return
  if (props.multiple && event.shiftKey) return
  rangeSelectionAnchor.value = value
  rangeSelectionPreview.value = value
  rangeSelectionMoved.value = false
}
const extendDateSelection = (value: string) => {
  if (!rangeSelectionAnchor.value) return
  rangeSelectionPreview.value = value
  rangeSelectionMoved.value = value !== rangeSelectionAnchor.value
}
const endDateSelection = () => {
  const start = rangeSelectionAnchor.value
  const end = rangeSelectionPreview.value
  const moved = rangeSelectionMoved.value
  rangeSelectionAnchor.value = undefined
  rangeSelectionPreview.value = undefined
  rangeSelectionMoved.value = false
  if (!start || !end || !moved) return
  const value = [start, end].sort()
  suppressDateClick.value = true
  if (props.multiple) {
    multipleSelectionAnchor.value = end
    emitDateSelection(
      Array.from(
        new Set([
          ...selectedDateValues.value,
          ...dateRangeValues(value[0], value[1]),
        ]),
      ).sort(),
    )
  } else {
    emitDateSelection(value)
  }
  window.setTimeout(() => {
    suppressDateClick.value = false
  })
}
const selectTime = (day: Date, event: MouseEvent) => {
  const target = event.currentTarget as HTMLElement
  const position = Math.max(
    0,
    Math.min(
      event.clientY - target.getBoundingClientRect().top,
      target.clientHeight,
    ),
  )
  const minutes =
    Math.round(
      ((position / target.clientHeight) * scheduleMinutes.value) / 30,
    ) * 30
  const date = new Date(day)
  date.setHours(
    scheduleHourStart.value + Math.floor(minutes / 60),
    minutes % 60,
    0,
    0,
  )
  const value = toValue(date)
  emit('update:modelValue', value)
  emit('change', value)
  emit(
    'cellClick',
    `${value}T${pad(date.getHours())}:${pad(date.getMinutes())}`,
  )
}
const handleScheduleDateClick = (day: Date, event: MouseEvent) => {
  if (suppressDateClick.value) return
  if (props.range || props.multiple) {
    selectDateValue(toValue(day), event)
    return
  }
  selectTime(day, event)
}
const contextTimeValue = (target: HTMLElement, event: MouseEvent) => {
  const position = Math.max(
    0,
    Math.min(
      event.clientY - target.getBoundingClientRect().top,
      target.clientHeight,
    ),
  )
  const minutes =
    Math.round(
      ((position / target.clientHeight) * scheduleMinutes.value) / 30,
    ) * 30
  const date = new Date(target.dataset.calendarDate || toValue(viewDate.value))
  date.setHours(
    scheduleHourStart.value + Math.floor(minutes / 60),
    minutes % 60,
    0,
    0,
  )
  return `${toValue(date)}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}
const captureContextMenu = (event: MouseEvent) => {
  if (!hasContextMenu.value) return
  const target = event.target as HTMLElement
  const eventTarget = target.closest<HTMLElement>('[data-calendar-event-id]')
  const dateTarget = target.closest<HTMLElement>('[data-calendar-date]')
  const eventId = eventTarget?.dataset.calendarEventId
  const calendarEvent = resolvedEvents.value.find(
    (item) => String(item.id) === eventId,
  )
  const targetDate = (
    eventTarget?.dataset.calendarDate ||
    dateTarget?.dataset.calendarDate ||
    toValue(viewDate.value)
  ).slice(0, 10)
  const dates = selectedDateValues.value.includes(targetDate)
    ? selectedDateValues.value
    : [targetDate]
  if (!selectedDateValues.value.includes(targetDate)) {
    const value = props.range || props.multiple ? [targetDate] : targetDate
    emitDateSelection(value)
  }
  if (calendarEvent) {
    contextMenuContext.value = {
      type: 'event',
      date: targetDate,
      dates,
      event: calendarEvent,
    }
    return
  }
  const timeTarget = target.closest<HTMLElement>(`.${ns.e('time-column')}`)
  contextMenuContext.value = {
    type: timeTarget ? 'time' : 'date',
    date: timeTarget ? contextTimeValue(timeTarget, event) : targetDate,
    dates,
  }
}
const onContextMenuSelect = (item: ContextMenuItem) => {
  emit('contextMenuSelect', { item, context: contextMenuContext.value })
}
const startDrag = (event: CalendarEvent) => {
  draggedEvent.value = event
}
const dropEvent = (day: Date, mouseEvent: DragEvent) => {
  const event = draggedEvent.value
  if (!event || !props.editable) return
  const target = mouseEvent.currentTarget as HTMLElement
  const position = Math.max(
    0,
    Math.min(
      mouseEvent.clientY - target.getBoundingClientRect().top,
      target.clientHeight,
    ),
  )
  const minutes =
    Math.round(
      ((position / target.clientHeight) * scheduleMinutes.value) / 30,
    ) * 30
  const originalStart = eventStart(event)
  const originalEnd = eventEnd(event)
  if (!originalStart || !originalEnd) return
  const start = new Date(day)
  start.setHours(
    scheduleHourStart.value + Math.floor(minutes / 60),
    minutes % 60,
    0,
    0,
  )
  const end = new Date(
    start.getTime() + (originalEnd.getTime() - originalStart.getTime()),
  )
  emit('eventChange', {
    event,
    start: `${toValue(start)}T${pad(start.getHours())}:${pad(start.getMinutes())}`,
    end: `${toValue(end)}T${pad(end.getHours())}:${pad(end.getMinutes())}`,
    source: 'drag',
  })
  draggedEvent.value = undefined
}
const getWeekNumber = (date: Date) => {
  const target = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  )
  const day = target.getUTCDay() || 7
  target.setUTCDate(target.getUTCDate() + 4 - day)
  const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1))
  return Math.ceil(
    ((target.getTime() - yearStart.getTime()) / 86400000 + 1) / 7,
  )
}

const clearSelection = () => {
  rangeSelectionAnchor.value = undefined
  rangeSelectionPreview.value = undefined
  rangeSelectionMoved.value = false
  multipleSelectionAnchor.value = undefined
  emitDateSelection(props.range || props.multiple ? [] : '')
}

defineExpose({ clearSelection })

watch(
  () => props.view,
  (view) => {
    activeView.value = normalizeView(view)
  },
)
watch(
  () => props.views,
  () => {
    activeView.value = normalizeView(activeView.value)
  },
  { deep: true },
)
watch(
  () => props.date,
  (value) => {
    const date = value && toDate(value)
    if (date) viewDate.value = date
  },
  { immediate: true },
)
watch(
  selectedValues,
  (values) => {
    const selected = values[0] && toDate(values[0])
    if (selected && !props.date) viewDate.value = selected
  },
  { immediate: true },
)
onMounted(() => window.addEventListener('pointerup', endDateSelection))
onBeforeUnmount(() => window.removeEventListener('pointerup', endDateSelection))
</script>
