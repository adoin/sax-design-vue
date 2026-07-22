<template>
  <section :class="ns.b()">
    <header :class="ns.e('header')">
      <button
        type="button"
        :class="ns.e('nav')"
        aria-label="Previous month"
        @click="moveMonth(-1)"
      >
        <SIcon icon="chevron_left" icon-pack="material-icons" />
      </button>
      <strong>{{ title }}</strong>
      <div :class="ns.e('actions')">
        <button type="button" @click="goToday">Today</button>
        <button
          type="button"
          :class="ns.e('nav')"
          aria-label="Next month"
          @click="moveMonth(1)"
        >
          <SIcon icon="chevron_right" icon-pack="material-icons" />
        </button>
      </div>
    </header>
    <div
      :class="[ns.e('grid'), ns.is('week-number', showWeekNumber)]"
      role="grid"
    >
      <div v-if="showWeekNumber" :class="ns.e('weekday')">Wk</div>
      <div v-for="name in weekdays" :key="name" :class="ns.e('weekday')">
        {{ name }}
      </div>
      <template v-for="(week, weekIndex) in weeks" :key="weekIndex">
        <div v-if="showWeekNumber" :class="ns.e('week-number')">
          {{ getWeekNumber(week[0].date) }}
        </div>
        <button
          v-for="cell in week"
          :key="cell.value"
          :class="[
            ns.e('cell'),
            ns.is('outside', !cell.isCurrentMonth),
            ns.is('today', cell.isToday),
            ns.is('selected', cell.isSelected),
            ns.is('in-range', cell.isInRange),
            ns.is('disabled', cell.disabled),
          ]"
          type="button"
          :disabled="cell.disabled"
          :aria-label="cell.value"
          @click="selectDate(cell)"
        >
          <span :class="ns.e('day')">{{ cell.day }}</span>
          <slot name="date-cell" :cell="cell" />
        </button>
      </template>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { SIcon } from '@vuesax-alpha/components/icon'
import { useNamespace } from '@vuesax-alpha/hooks'
import { calendarEmits, calendarProps } from './calendar'
import type { CalendarCell } from './calendar'

defineOptions({ name: 'SCalendar' })

const props = defineProps(calendarProps)
const emit = defineEmits(calendarEmits)
const ns = useNamespace('calendar')
const viewDate = ref(new Date())
const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const pad = (value: number) => String(value).padStart(2, '0')
const toValue = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
const toDate = (value: string) => {
  const date = new Date(`${value}T00:00:00`)
  return Number.isNaN(date.getTime()) ? undefined : date
}
const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate())
const selectedValues = computed(() =>
  Array.isArray(props.modelValue)
    ? props.modelValue
    : props.modelValue
      ? [props.modelValue]
      : [],
)
const weekdays = computed(() =>
  weekdayNames
    .slice(props.firstDayOfWeek)
    .concat(weekdayNames.slice(0, props.firstDayOfWeek)),
)
const title = computed(
  () =>
    `${viewDate.value.toLocaleString('en-US', { month: 'long' })} ${viewDate.value.getFullYear()}`,
)

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
        isToday: time === startOfDay(new Date()).getTime(),
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

const moveMonth = (offset: number) => {
  viewDate.value = new Date(
    viewDate.value.getFullYear(),
    viewDate.value.getMonth() + offset,
    1,
  )
  emit('panelChange', viewDate.value)
}
const goToday = () => {
  viewDate.value = new Date()
  emit('panelChange', viewDate.value)
}
const selectDate = (cell: CalendarCell) => {
  if (cell.disabled) return
  let value: string | string[] = cell.value
  if (props.range) {
    const values = selectedValues.value
    if (values.length !== 1) value = [cell.value]
    else value = [values[0], cell.value].sort()
  }
  emit('update:modelValue', value)
  emit('change', value)
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

watch(
  selectedValues,
  (values) => {
    const selected = values[0] && toDate(values[0])
    if (selected) viewDate.value = selected
  },
  { immediate: true },
)
</script>
