<template>
  <div :class="ns.b()">
    <div :class="ns.e('spinner')">
      <s-scrollbar :always="false" :thickness="4">
        <ul :class="ns.e('list')">
          <li
            v-for="hour in hours"
            :key="hour.value"
            :class="[
              ns.e('item'),
              ns.is('active', hour.value === currentHour),
              ns.is('disabled', hour.disabled || isHourDisabled(hour.value)),
            ]"
            @click="selectHour(hour.value)"
          >
            {{ hour.label }}
          </li>
        </ul>
      </s-scrollbar>
      <s-scrollbar :always="false" :thickness="4">
        <ul :class="ns.e('list')">
          <li
            v-for="minute in minutes"
            :key="minute.value"
            :class="[
              ns.e('item'),
              ns.is('active', minute.value === currentMinute),
              ns.is(
                'disabled',
                minute.disabled || isMinuteDisabled(minute.value),
              ),
            ]"
            @click="selectMinute(minute.value)"
          >
            {{ minute.label }}
          </li>
        </ul>
      </s-scrollbar>
      <s-scrollbar :always="false" :thickness="4">
        <ul :class="ns.e('list')">
          <li
            v-for="second in seconds"
            :key="second.value"
            :class="[
              ns.e('item'),
              ns.is('active', second.value === currentSecond),
              ns.is(
                'disabled',
                second.disabled || isSecondDisabled(second.value),
              ),
            ]"
            @click="selectSecond(second.value)"
          >
            {{ second.label }}
          </li>
        </ul>
      </s-scrollbar>
    </div>

    <div :class="ns.e('input')" role="group" aria-label="Time input">
      <input
        :class="ns.e('input-field')"
        :value="pad(currentHour)"
        inputmode="numeric"
        maxlength="2"
        aria-label="Hours"
        @change="updatePart('hour', $event)"
      />
      <span :class="ns.e('input-separator')">:</span>
      <input
        :class="ns.e('input-field')"
        :value="pad(currentMinute)"
        inputmode="numeric"
        maxlength="2"
        aria-label="Minutes"
        @change="updatePart('minute', $event)"
      />
      <span :class="ns.e('input-separator')">:</span>
      <input
        :class="ns.e('input-field')"
        :value="pad(currentSecond)"
        inputmode="numeric"
        maxlength="2"
        aria-label="Seconds"
        @change="updatePart('second', $event)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import dayjs from 'dayjs'
import SScrollbar from '@vuesax-alpha/components/scrollbar'
import { useNamespace } from '@vuesax-alpha/hooks'
import { range } from './utils'
import type { TimePickerConfig, TimePickerOption } from './utils'

defineOptions({ name: 'STimePanel' })

const props = defineProps<{
  modelValue: dayjs.Dayjs | null
  disabledDate?: (date: Date) => boolean
  timeConfig?: TimePickerConfig
}>()

const emit = defineEmits<{
  'update:modelValue': [value: dayjs.Dayjs]
}>()

const ns = useNamespace('time-panel')

type TimePanelItem = {
  value: number
  label: string
  disabled: boolean
}

const toItems = (options: TimePickerOption[] | undefined, maximum: number) => {
  const source = options ?? range(0, maximum)
  return source
    .map((option): TimePanelItem | null => {
      const raw = typeof option === 'object' ? option.value : option
      const value = Number(raw)
      if (!Number.isInteger(value) || value < 0 || value > maximum) return null
      return {
        value,
        label: String(
          typeof option === 'object' ? (option.label ?? raw) : raw,
        ).padStart(2, '0'),
        disabled: typeof option === 'object' && !!option.disabled,
      }
    })
    .filter((item): item is TimePanelItem => item !== null)
}

const hours = computed(() => toItems(props.timeConfig?.hours, 23))
const minutes = computed(() => toItems(props.timeConfig?.minutes, 59))
const seconds = computed(() => toItems(props.timeConfig?.seconds, 59))

const currentHour = computed(() => props.modelValue?.hour() ?? 0)
const currentMinute = computed(() => props.modelValue?.minute() ?? 0)
const currentSecond = computed(() => props.modelValue?.second() ?? 0)

const pad = (n: number) => String(n).padStart(2, '0')

const isDisabled = (date: dayjs.Dayjs) =>
  props.disabledDate?.(date.toDate()) ?? false

const isHourDisabled = (hour: number) => {
  const base = props.modelValue ?? dayjs()
  return (
    hours.value.find((item) => item.value === hour)?.disabled ||
    !!props.timeConfig?.hourDisabledMethod?.({ hour }) ||
    isDisabled(base.hour(hour).minute(0).second(0))
  )
}

const isMinuteDisabled = (minute: number) => {
  const base = props.modelValue ?? dayjs()
  return (
    minutes.value.find((item) => item.value === minute)?.disabled ||
    !!props.timeConfig?.minuteDisabledMethod?.({ minute }) ||
    isDisabled(base.minute(minute).second(0))
  )
}

const isSecondDisabled = (second: number) => {
  const base = props.modelValue ?? dayjs()
  return (
    seconds.value.find((item) => item.value === second)?.disabled ||
    !!props.timeConfig?.secondDisabledMethod?.({ second }) ||
    isDisabled(base.second(second))
  )
}

const update = (hour: number, minute: number, second: number) => {
  const base = props.modelValue ?? dayjs()
  const next = base.hour(hour).minute(minute).second(second)
  if (!isDisabled(next)) emit('update:modelValue', next)
}

const updatePart = (part: 'hour' | 'minute' | 'second', event: Event) => {
  const value = Number((event.target as HTMLInputElement).value)
  const maximum = part === 'hour' ? 23 : 59

  if (!Number.isInteger(value) || value < 0 || value > maximum) return

  if (part === 'hour') {
    update(value, currentMinute.value, currentSecond.value)
  } else if (part === 'minute') {
    update(currentHour.value, value, currentSecond.value)
  } else {
    update(currentHour.value, currentMinute.value, value)
  }
}

const selectHour = (hour: number) => {
  if (!isHourDisabled(hour)) {
    update(hour, currentMinute.value, currentSecond.value)
  }
}

const selectMinute = (minute: number) => {
  if (!isMinuteDisabled(minute)) {
    update(currentHour.value, minute, currentSecond.value)
  }
}

const selectSecond = (second: number) => {
  if (!isSecondDisabled(second)) {
    update(currentHour.value, currentMinute.value, second)
  }
}
</script>
