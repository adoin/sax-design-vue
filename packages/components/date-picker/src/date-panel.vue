<template>
  <div :class="ns.b()" :style="themeStyle" @mouseleave="emit('hover', null)">
    <div :class="ns.e('header')">
      <button
        type="button"
        :class="ns.e('icon-btn')"
        :title="t('vs.datepicker.prevYear')"
        @click="changeYear(-1)"
      >
        <s-icon name="cb:double-chevron-left" size="16" />
      </button>
      <button
        v-if="viewMode === 'date' || viewMode === 'week'"
        type="button"
        :class="ns.e('icon-btn')"
        :title="t('vs.datepicker.prevMonth')"
        @click="changeMonth(-1)"
      >
        <s-icon name="cb:chevron-left" size="16" />
      </button>
      <button
        type="button"
        :class="ns.e('label-btn')"
        @click="switchView('month')"
      >
        {{ monthLabel }}
      </button>
      <button
        type="button"
        :class="ns.e('label-btn')"
        @click="switchView('year')"
      >
        {{ yearLabel }}
      </button>
      <button
        v-if="viewMode === 'date' || viewMode === 'week'"
        type="button"
        :class="ns.e('icon-btn')"
        :title="t('vs.datepicker.nextMonth')"
        @click="changeMonth(1)"
      >
        <s-icon name="cb:chevron-right" size="16" />
      </button>
      <button
        type="button"
        :class="ns.e('icon-btn')"
        :title="t('vs.datepicker.nextYear')"
        @click="changeYear(1)"
      >
        <s-icon name="cb:double-chevron-right" size="16" />
      </button>
    </div>

    <div
      v-if="viewMode === 'date' || viewMode === 'week'"
      :class="ns.e('body')"
    >
      <div :class="ns.e('weekdays')">
        <span v-for="week in weekLabels" :key="week">{{ week }}</span>
      </div>
      <div v-if="pickerType === 'week'" :class="ns.e('week-rows')">
        <button
          v-for="week in calendarWeeks"
          :key="week[0].date.valueOf()"
          type="button"
          :class="[
            ns.e('week-row'),
            ns.is('today', sameWeek(week[0].date, today)),
            ns.is(
              'selected',
              selectedValues.some((value) => sameWeek(week[0].date, value)),
            ),
          ]"
          :disabled="week.some((cell) => cell.disabled)"
          :aria-label="`${week[0].date.format('YYYY-MM-DD')} – ${week[6].date.format('YYYY-MM-DD')}`"
          :aria-pressed="
            selectedValues.some((value) => sameWeek(week[0].date, value))
          "
          @click="pickDate(week[0].date)"
          @keydown="handleWeekKeydown"
        >
          <span
            v-for="cell in week"
            :key="cell.date.valueOf()"
            :class="[
              ns.e('week-day'),
              ns.is(cell.type, true),
              ns.is('today', cell.date.isSame(today, 'day')),
            ]"
            :title="cell.festival?.label"
          >
            {{ cell.date.date() }}
          </span>
        </button>
      </div>
      <div v-else :class="ns.e('dates')" @mouseleave="emit('hover', null)">
        <button
          v-for="cell in dateCells"
          :key="cell.date.valueOf()"
          type="button"
          :class="cellClass(cell)"
          :style="cell.festival?.style"
          :disabled="cell.disabled"
          @click="pickDate(cell.date)"
          @mouseenter="emit('hover', cell.disabled ? null : cell.date)"
          @focus="emit('hover', cell.disabled ? null : cell.date)"
          @mouseleave="emit('hover', null)"
          @blur="emit('hover', null)"
        >
          <span :class="ns.e('cell-value')">{{ cell.date.date() }}</span>
          <span
            v-if="cell.festival?.notice"
            :class="ns.e('cell-notice')"
            aria-hidden="true"
          />
          <span
            v-if="cell.festival?.label"
            :class="ns.e('cell-label')"
            :title="cell.festival?.label"
          >
            {{ cell.festival?.label }}
          </span>
          <span v-else-if="cell.festival?.extra" :class="ns.e('cell-extra')">
            {{ cell.festival?.extra }}
          </span>
        </button>
      </div>
    </div>

    <div v-else-if="viewMode === 'month'" :class="ns.e('months')">
      <button
        v-for="month in monthTable"
        :key="month.month()"
        type="button"
        :class="monthClass(month)"
        :disabled="isMonthDisabled(month)"
        @click="pickMonth(month)"
      >
        {{ month.month() + 1 }}
      </button>
    </div>

    <div v-else-if="viewMode === 'quarter'" :class="ns.e('quarters')">
      <button
        v-for="quarter in quarterTable"
        :key="Math.floor(quarter.month() / 3)"
        type="button"
        :class="quarterClass(quarter)"
        :disabled="isQuarterDisabled(quarter)"
        @click="pickQuarter(quarter)"
      >
        Q{{ Math.floor(quarter.month() / 3) + 1 }}
      </button>
    </div>

    <div v-else :class="ns.e('years')">
      <button
        v-for="year in yearTable"
        :key="year.year()"
        type="button"
        :class="yearClass(year)"
        :disabled="isYearDisabled(year)"
        @click="pickYear(year)"
      >
        {{ year.year() }}
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import SIcon from '@vuesax-alpha/components/icon'
import {
  useGlobalConfig,
  useLocale,
  useNamespace,
  useWeekConfig,
} from '@vuesax-alpha/hooks'
import { getTimeZoneNow, getVsColor } from '@vuesax-alpha/utils'
import {
  getCalendarCells,
  getMonthTable,
  getQuarterTable,
  getYearTable,
  isDateInRange,
  isSameDay,
  isSameMonth,
  isSameYear,
  startOfConfiguredWeek,
} from './utils'
import type dayjs from 'dayjs'
import type {
  DateFestivalInfo,
  DateFestivalMethod,
  DatePickerType,
} from './utils'

defineOptions({ name: 'SDatePanel' })

const props = defineProps<{
  pickerType: DatePickerType
  color?: string
  modelValue?: dayjs.Dayjs | null
  selectedDates?: dayjs.Dayjs[]
  rangeStart?: dayjs.Dayjs | null
  rangeEnd?: dayjs.Dayjs | null
  rangeHover?: dayjs.Dayjs | null
  disabledDate?: (date: Date) => boolean
  festivalMethod?: DateFestivalMethod
  defaultDate?: dayjs.Dayjs | null
  startDay?: number
  selectDay?: number
  currentDate?: dayjs.Dayjs
}>()

const emit = defineEmits<{
  pick: [value: dayjs.Dayjs]
  hover: [value: dayjs.Dayjs | null]
  'panel-change': [value: dayjs.Dayjs]
}>()

const ns = useNamespace('date-panel')
const { t } = useLocale()
const themeStyle = computed(() =>
  ns.cssVar({ color: getVsColor(props.color ?? 'primary') }),
)

type ViewMode = 'date' | 'month' | 'quarter' | 'year' | 'week'

const viewMode = ref<ViewMode>(
  props.pickerType === 'month'
    ? 'month'
    : props.pickerType === 'quarter'
      ? 'quarter'
      : props.pickerType === 'year'
        ? 'year'
        : 'date',
)

const timezone = useGlobalConfig('timezone')
const today = computed(
  () => props.currentDate ?? getTimeZoneNow(timezone.value),
)

const panelDate = ref(
  props.modelValue || props.defaultDate || props.rangeStart || today.value,
)

watch(
  () => props.defaultDate,
  (val) => {
    if (val?.isValid()) panelDate.value = val
  },
  { immediate: true },
)

watch(
  () => props.modelValue,
  (val) => {
    if (val?.isValid()) panelDate.value = val
  },
)

watch(
  () => props.pickerType,
  (type) => {
    if (type === 'month') viewMode.value = 'month'
    else if (type === 'quarter') viewMode.value = 'quarter'
    else if (type === 'year') viewMode.value = 'year'
    else viewMode.value = 'date'
  },
)

const { firstDayOfWeek: normalizedStartDay } = useWeekConfig(
  () => props.startDay,
)
const sameWeek = (a: dayjs.Dayjs | null, b: dayjs.Dayjs | null) =>
  Boolean(
    a &&
    b &&
    startOfConfiguredWeek(a, normalizedStartDay.value).isSame(
      startOfConfiguredWeek(b, normalizedStartDay.value),
      'day',
    ),
  )
const calendarWeeks = computed(() =>
  Array.from({ length: dateCells.value.length / 7 }, (_, index) =>
    dateCells.value.slice(index * 7, index * 7 + 7),
  ),
)
const handleWeekKeydown = (event: KeyboardEvent) => {
  if (!['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return
  event.preventDefault()
  const button = event.currentTarget as HTMLButtonElement
  const rows = Array.from(
    button.parentElement!.querySelectorAll<HTMLButtonElement>(
      'button:not(:disabled)',
    ),
  )
  const index = rows.indexOf(button)
  const next =
    event.key === 'Home'
      ? 0
      : event.key === 'End'
        ? rows.length - 1
        : Math.max(
            0,
            Math.min(
              rows.length - 1,
              index + (event.key === 'ArrowUp' ? -1 : 1),
            ),
          )
  rows[next]?.focus()
}

const weekLabels = computed(() =>
  ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
    .slice(normalizedStartDay.value)
    .concat(
      ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'].slice(
        0,
        normalizedStartDay.value,
      ),
    )
    .map((key) => t(`vs.datepicker.weeks.${key}`)),
)

const monthLabel = computed(() => {
  const monthKey = `month${panelDate.value.month() + 1}`
  return t(`vs.datepicker.${monthKey}`)
})

const yearLabel = computed(() => `${panelDate.value.year()}`)

const calendarCells = computed(() =>
  getCalendarCells(
    panelDate.value.year(),
    panelDate.value.month(),
    normalizedStartDay.value,
  ),
)

const monthTable = computed(() => getMonthTable(panelDate.value.year()))
const quarterTable = computed(() => getQuarterTable(panelDate.value.year()))
const yearTable = computed(() => getYearTable(panelDate.value.year()))
const selectedValues = computed(() =>
  props.selectedDates?.length
    ? props.selectedDates
    : [props.modelValue].filter((value): value is dayjs.Dayjs => !!value),
)

const isCellDisabled = (date: dayjs.Dayjs) =>
  props.disabledDate?.(date.toDate()) ?? false

const festival = (date: dayjs.Dayjs): DateFestivalInfo | undefined =>
  props.festivalMethod?.({
    date: date.toDate(),
    type: props.pickerType,
    viewType: props.pickerType === 'week' ? 'week' : 'date',
  }) || undefined

// Decorations and disabled callbacks are shared by every binding for a cell.
// Hover/selection changes do not need to evaluate them again for all 42 dates.
const dateCells = computed(() =>
  calendarCells.value.map((cell) => ({
    ...cell,
    disabled: isCellDisabled(cell.date),
    festival: festival(cell.date),
  })),
)

const isMonthDisabled = (month: dayjs.Dayjs) =>
  props.disabledDate?.(month.toDate()) ?? false

const isYearDisabled = (year: dayjs.Dayjs) =>
  props.disabledDate?.(year.toDate()) ?? false

const isQuarterDisabled = (quarter: dayjs.Dayjs) =>
  props.disabledDate?.(quarter.toDate()) ?? false

const switchView = (mode: ViewMode) => {
  if (props.pickerType === 'week' && mode === 'month') {
    viewMode.value = 'month'
    return
  }
  if (props.pickerType === 'year') return
  if (props.pickerType === 'quarter' && mode === 'year') {
    viewMode.value = 'year'
    return
  }
  if (props.pickerType === 'month' && mode === 'year') {
    viewMode.value = 'year'
    return
  }
  viewMode.value = mode
}

const changeMonth = (offset: number) => {
  panelDate.value = panelDate.value.add(offset, 'month')
  emit('panel-change', panelDate.value)
}

const changeYear = (offset: number) => {
  panelDate.value = panelDate.value.add(offset, 'year')
  emit('panel-change', panelDate.value)
}

const pickDate = (date: dayjs.Dayjs) => {
  if (isCellDisabled(date)) return
  if (props.pickerType === 'week') {
    const weekStart = date.subtract(
      (date.day() - normalizedStartDay.value + 7) % 7,
      'day',
    )
    const selectedDay =
      props.selectDay === undefined
        ? weekStart
        : weekStart.add(
            (props.selectDay - normalizedStartDay.value + 7) % 7,
            'day',
          )
    emit('pick', selectedDay)
    return
  }
  emit('pick', date)
}

const pickMonth = (month: dayjs.Dayjs) => {
  if (isMonthDisabled(month)) return
  if (props.pickerType === 'month') {
    emit('pick', month)
    return
  }
  panelDate.value = month
  viewMode.value = 'date'
  emit('panel-change', panelDate.value)
}

const pickQuarter = (quarter: dayjs.Dayjs) => {
  if (isQuarterDisabled(quarter)) return
  if (props.pickerType === 'quarter') {
    emit(
      'pick',
      quarter.month(Math.floor(quarter.month() / 3) * 3).startOf('month'),
    )
    return
  }
  panelDate.value = quarter
  viewMode.value = 'month'
  emit('panel-change', panelDate.value)
}

const pickYear = (year: dayjs.Dayjs) => {
  if (isYearDisabled(year)) return
  if (props.pickerType === 'year') {
    emit('pick', year)
    return
  }
  panelDate.value = year
  viewMode.value =
    props.pickerType === 'month'
      ? 'month'
      : props.pickerType === 'quarter'
        ? 'quarter'
        : 'date'
  emit('panel-change', panelDate.value)
}

const cellClass = (cell: {
  type: string
  date: dayjs.Dayjs
  festival?: DateFestivalInfo
}) => {
  const { date, type } = cell
  let start = props.rangeStart ?? null
  let end = props.rangeEnd ?? props.rangeHover ?? null
  const preview = Boolean(start && !props.rangeEnd && props.rangeHover)
  if (start && end && end.isBefore(start, 'day')) [start, end] = [end, start]
  const selected = selectedValues.value.some((value) =>
    props.pickerType === 'week'
      ? sameWeek(date, value)
      : isSameDay(date, value),
  )

  return [
    ns.e('cell'),
    ns.is(type, true),
    ns.is('today', date.isSame(today.value, 'day')),
    ns.is('selected', selected),
    cell.festival?.className,
    ns.is('festival-important', cell.festival?.important),
    ns.is('range-preview', preview && isDateInRange(date, start, end)),
    ns.is(
      'preview-target',
      preview && isSameDay(date, props.rangeHover ?? null),
    ),
    ns.is('in-range', isDateInRange(date, start, end)),
    ns.is(
      'range-start',
      isSameDay(date, start) ||
        (props.pickerType === 'week' &&
          sameWeek(date, props.rangeStart ?? null)),
    ),
    ns.is(
      'range-end',
      isSameDay(date, end) ||
        (props.pickerType === 'week' && sameWeek(date, props.rangeEnd ?? null)),
    ),
  ]
}

const quarterClass = (quarter: dayjs.Dayjs) => [
  ns.e('quarter'),
  ns.is(
    'today',
    quarter.year() === today.value.year() &&
      Math.floor(quarter.month() / 3) === Math.floor(today.value.month() / 3),
  ),
  ns.is(
    'selected',
    selectedValues.value.some(
      (value) =>
        quarter.year() === value.year() &&
        Math.floor(quarter.month() / 3) === Math.floor(value.month() / 3),
    ),
  ),
]

const monthClass = (month: dayjs.Dayjs) => [
  ns.e('month'),
  ns.is(
    'selected',
    selectedValues.value.some((value) => isSameMonth(month, value)),
  ),
  ns.is('today', month.isSame(today.value, 'month')),
]

const yearClass = (year: dayjs.Dayjs) => [
  ns.e('year'),
  ns.is(
    'selected',
    selectedValues.value.some((value) => isSameYear(year, value)),
  ),
  ns.is('today', year.isSame(today.value, 'year')),
]
</script>
