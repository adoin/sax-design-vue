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
          :disabled="isCellDisabled(cell.date)"
          @click="pickDate(cell.date)"
        >
          {{ cell.date.date() }}
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
  getYearTable,
  isDateInRange,
  isSameDay,
  isSameMonth,
  isSameWeek,
  isSameYear,
} from './utils'
import type { DatePickerType } from './utils'

defineOptions({ name: 'SDatePanel' })

const props = defineProps<{
  pickerType: DatePickerType
  modelValue?: dayjs.Dayjs | null
  rangeStart?: dayjs.Dayjs | null
  rangeEnd?: dayjs.Dayjs | null
  disabledDate?: (date: Date) => boolean
  defaultDate?: dayjs.Dayjs | null
}>()

const emit = defineEmits<{
  pick: [value: dayjs.Dayjs]
  'panel-change': [value: dayjs.Dayjs]
}>()

const ns = useNamespace('date-panel')
const { t } = useLocale()

type ViewMode = 'date' | 'month' | 'year' | 'week'

const viewMode = ref<ViewMode>(
  props.pickerType === 'month'
    ? 'month'
    : props.pickerType === 'year'
    ? 'year'
    : 'date'
)

const panelDate = ref(
  props.modelValue || props.defaultDate || props.rangeStart || dayjs()
)

watch(
  () => props.defaultDate,
  (val) => {
    if (val?.isValid()) panelDate.value = val
  },
  { immediate: true }
)

watch(
  () => props.modelValue,
  (val) => {
    if (val?.isValid()) panelDate.value = val
  }
)

watch(
  () => props.pickerType,
  (type) => {
    if (type === 'month') viewMode.value = 'month'
    else if (type === 'year') viewMode.value = 'year'
    else viewMode.value = 'date'
  }
)

const weekLabels = computed(() =>
  ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'].map((key) =>
    t(`vs.datepicker.weeks.${key}`)
  )
)

const monthLabel = computed(() => {
  const monthKey = `month${panelDate.value.month() + 1}`
  return t(`vs.datepicker.${monthKey}`)
})

const yearLabel = computed(() => `${panelDate.value.year()}`)

const calendarCells = computed(() =>
  getCalendarCells(panelDate.value.year(), panelDate.value.month())
)

const monthTable = computed(() => getMonthTable(panelDate.value.year()))
const yearTable = computed(() => getYearTable(panelDate.value.year()))

const isCellDisabled = (date: dayjs.Dayjs) =>
  props.disabledDate?.(date.toDate()) ?? false

const isMonthDisabled = (month: dayjs.Dayjs) =>
  props.disabledDate?.(month.toDate()) ?? false

const isYearDisabled = (year: dayjs.Dayjs) =>
  props.disabledDate?.(year.toDate()) ?? false

const switchView = (mode: ViewMode) => {
  if (props.pickerType === 'week' && mode === 'month') {
    viewMode.value = 'month'
    return
  }
  if (props.pickerType === 'year') return
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
    emit('pick', date.startOf('week'))
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

const pickYear = (year: dayjs.Dayjs) => {
  if (isYearDisabled(year)) return
  if (props.pickerType === 'year') {
    emit('pick', year)
    return
  }
  panelDate.value = year
  viewMode.value = props.pickerType === 'month' ? 'month' : 'date'
  emit('panel-change', panelDate.value)
}

const cellClass = (cell: { type: string; date: dayjs.Dayjs }) => {
  const { date, type } = cell
  const selected =
    props.pickerType === 'week'
      ? isSameWeek(date, props.modelValue ?? null)
      : isSameDay(date, props.modelValue ?? null)

  return [
    ns.e('cell'),
    ns.is(type, true),
    ns.is('today', date.isSame(dayjs(), 'day')),
    ns.is('selected', selected),
    ns.is(
      'in-range',
      isDateInRange(date, props.rangeStart ?? null, props.rangeEnd ?? null)
    ),
    ns.is(
      'range-start',
      isSameDay(date, props.rangeStart ?? null) ||
        (props.pickerType === 'week' &&
          isSameWeek(date, props.rangeStart ?? null))
    ),
    ns.is(
      'range-end',
      isSameDay(date, props.rangeEnd ?? null) ||
        (props.pickerType === 'week' &&
          isSameWeek(date, props.rangeEnd ?? null))
    ),
  ]
}

const monthClass = (month: dayjs.Dayjs) => [
  ns.e('month'),
  ns.is('selected', isSameMonth(month, props.modelValue ?? null)),
  ns.is('today', month.isSame(dayjs(), 'month')),
]

const yearClass = (year: dayjs.Dayjs) => [
  ns.e('year'),
  ns.is('selected', isSameYear(year, props.modelValue ?? null)),
  ns.is('today', year.isSame(dayjs(), 'year')),
]
</script>
