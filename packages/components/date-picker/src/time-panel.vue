<template>
  <div :class="ns.b()">
    <div :class="ns.e('spinner')">
      <s-scrollbar max-height="200" :native="true">
        <ul :class="ns.e('list')">
          <li
            v-for="hour in hours"
            :key="hour"
            :class="[
              ns.e('item'),
              ns.is('active', hour === currentHour),
              ns.is('disabled', isHourDisabled(hour)),
            ]"
            @click="selectHour(hour)"
          >
            {{ pad(hour) }}
          </li>
        </ul>
      </s-scrollbar>
      <s-scrollbar max-height="200" :native="true">
        <ul :class="ns.e('list')">
          <li
            v-for="minute in minutes"
            :key="minute"
            :class="[
              ns.e('item'),
              ns.is('active', minute === currentMinute),
              ns.is('disabled', isMinuteDisabled(minute)),
            ]"
            @click="selectMinute(minute)"
          >
            {{ pad(minute) }}
          </li>
        </ul>
      </s-scrollbar>
      <s-scrollbar max-height="200" :native="true">
        <ul :class="ns.e('list')">
          <li
            v-for="second in seconds"
            :key="second"
            :class="[
              ns.e('item'),
              ns.is('active', second === currentSecond),
              ns.is('disabled', isSecondDisabled(second)),
            ]"
            @click="selectSecond(second)"
          >
            {{ pad(second) }}
          </li>
        </ul>
      </s-scrollbar>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import dayjs from 'dayjs'
import SScrollbar from '@vuesax-alpha/components/scrollbar'
import { useNamespace } from '@vuesax-alpha/hooks'
import { range } from './utils'

defineOptions({ name: 'STimePanel' })

const props = defineProps<{
  modelValue: dayjs.Dayjs | null
  disabledDate?: (date: Date) => boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: dayjs.Dayjs]
}>()

const ns = useNamespace('time-panel')

const hours = range(0, 23)
const minutes = range(0, 59)
const seconds = range(0, 59)

const currentHour = computed(() => props.modelValue?.hour() ?? 0)
const currentMinute = computed(() => props.modelValue?.minute() ?? 0)
const currentSecond = computed(() => props.modelValue?.second() ?? 0)

const pad = (n: number) => String(n).padStart(2, '0')

const isDisabled = (date: dayjs.Dayjs) =>
  props.disabledDate?.(date.toDate()) ?? false

const isHourDisabled = (hour: number) => {
  const base = props.modelValue ?? dayjs()
  return isDisabled(base.hour(hour).minute(0).second(0))
}

const isMinuteDisabled = (minute: number) => {
  const base = props.modelValue ?? dayjs()
  return isDisabled(base.minute(minute).second(0))
}

const isSecondDisabled = (second: number) => {
  const base = props.modelValue ?? dayjs()
  return isDisabled(base.second(second))
}

const update = (hour: number, minute: number, second: number) => {
  const base = props.modelValue ?? dayjs()
  const next = base.hour(hour).minute(minute).second(second)
  if (!isDisabled(next)) emit('update:modelValue', next)
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
