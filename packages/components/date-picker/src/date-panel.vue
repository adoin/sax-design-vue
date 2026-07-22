<template>
  <div :class="ns.b()">
    <div :class="ns.e('header')">
      <button
        type="button"
        :class="ns.e('icon-btn')"
        :title="t('vs.datepicker.prevYear')"
        @click="changeYear(-1)"
      >
        <s-icon size="16"><chevron-left-double /></s-icon>
      </button>
      <button
        v-if="viewMode === 'date' || viewMode === 'week'"
        type="button"
        :class="ns.e('icon-btn')"
        :title="t('vs.datepicker.prevMonth')"
        @click="changeMonth(-1)"
      >
        <s-icon size="16"><chevron-left /></s-icon>
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
        <s-icon size="16"><chevron-right /></s-icon>
      </button>
      <button
        type="button"
        :class="ns.e('icon-btn')"
        :title="t('vs.datepicker.nextYear')"
        @click="changeYear(1)"
      >
        <s-icon size="16"><chevron-right-double /></s-icon>
      </button>
    </div>

    <div
      v-if="viewMode === 'date' || viewMode === 'week'"
      :class="ns.e('body')"
    >
      <div :class="ns.e('weekdays')">
        <span v-for="week in weekLabels" :key="week">{{ week }}</span>
      </div>
      <div :class="ns.e('dates')">
        <button
          v-for="cell in calendarCells"
          :key="cell.date.valueOf()"
          type="button"
          :class="cellClass(cell)"
          :style="festival(cell.date)?.style"
          :disabled="isCellDisabled(cell.date)"
          @click="pickDate(cell.date)"
        >
          <span :class="ns.e('cell-value')">{{ cell.date.date() }}</span>
          <span
            v-if="festival(cell.date)?.notice"
            :class="ns.e('cell-notice')"
            aria-hidden="true"
          />
          <span
            v-if="festival(cell.date)?.label"
            :class="ns.e('cell-label')"
            :title="festival(cell.date)?.label"
          >
            {{ festival(cell.date)?.label }}
          </span>
          <span
            v-else-if="festival(cell.date)?.extra"
            :class="ns.e('cell-extra')"
          >
            {{ festival(cell.date)?.extra }}
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
import dayjs from 'dayjs'
import {
  ChevronLeft,
  ChevronLeftDouble,
  ChevronRight,
  ChevronRightDouble,
} from '@vuesax-alpha/icons-vue'
import SIcon from '@vuesax-alpha/components/icon'
import { useLocale, useNamespace } from '@vuesax-alpha/hooks'
import {
  getCalendarCells,
  getMonthTable,
  getQuarterTable,
  getYearTable,
  isDateInRange,
  isSameDay,
  isSameMonth,
  isSameWeek,
  isSameYear,
} from './utils'
import type {
  DateFestivalInfo,
  DateFestivalMethod,
  DatePickerType,
} from './utils'

defineOptions({ name: 'SDatePanel' })

const props = defineProps<{
  pickerType: DatePickerType
  modelValue?: dayjs.Dayjs | null
  selectedDates?: dayjs.Dayjs[]
  rangeStart?: dayjs.Dayjs | null
  rangeEnd?: dayjs.Dayjs | null
  disabledDate?: (date: Date) => boolean
  festivalMethod?: DateFestivalMethod
  defaultDate?: dayjs.Dayjs | null
  startDay?: number
  selectDay?: number
}>()

const emit = defineEmits<{
  pick: [value: dayjs.Dayjs]
  'panel-change': [value: dayjs.Dayjs]
}>()

const ns = useNamespace('date-panel')
const { t } = useLocale()

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

const panelDate = ref(
  props.modelValue || props.defaultDate || props.rangeStart || dayjs(),
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

const normalizedStartDay = computed(() => ((props.startDay ?? 0) + 7) % 7)

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

const cellClass = (cell: { type: string; date: dayjs.Dayjs }) => {
  const { date, type } = cell
  const selected = selectedValues.value.some((value) =>
    props.pickerType === 'week'
      ? isSameWeek(date, value)
      : isSameDay(date, value),
  )

  return [
    ns.e('cell'),
    ns.is(type, true),
    ns.is('today', date.isSame(dayjs(), 'day')),
    ns.is('selected', selected),
    festival(date)?.className,
    ns.is('festival-important', festival(date)?.important),
    ns.is(
      'in-range',
      isDateInRange(date, props.rangeStart ?? null, props.rangeEnd ?? null),
    ),
    ns.is(
      'range-start',
      isSameDay(date, props.rangeStart ?? null) ||
        (props.pickerType === 'week' &&
          isSameWeek(date, props.rangeStart ?? null)),
    ),
    ns.is(
      'range-end',
      isSameDay(date, props.rangeEnd ?? null) ||
        (props.pickerType === 'week' &&
          isSameWeek(date, props.rangeEnd ?? null)),
    ),
  ]
}

const quarterClass = (quarter: dayjs.Dayjs) => [
  ns.e('quarter'),
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
  ns.is('today', month.isSame(dayjs(), 'month')),
]

const yearClass = (year: dayjs.Dayjs) => [
  ns.e('year'),
  ns.is(
    'selected',
    selectedValues.value.some((value) => isSameYear(year, value)),
  ),
  ns.is('today', year.isSame(dayjs(), 'year')),
]
</script>
