<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, shallowRef, watch } from 'vue'
import { useNamespace } from '@vuesax-alpha/hooks'
import CountdownDigit from './countdown-digit.vue'
import { countdownEmits, countdownProps } from './countdown'
import type { CountdownTime } from './countdown'

defineOptions({ name: 'SCountdown' })

const props = defineProps(countdownProps)
const emit = defineEmits(countdownEmits)
const ns = useNamespace('countdown')
const initialNow = Date.now()
const remain = shallowRef(Math.max(0, props.value - initialNow))
let timer: ReturnType<typeof setInterval> | undefined
let anchorTime = initialNow
let anchorRemaining = remain.value
let hasFinished = false

const pad = (value: number) => `${value}`.padStart(2, '0')

const time = computed<CountdownTime>(() => {
  const totalSeconds = Math.ceil(remain.value / 1000)
  return {
    remaining: remain.value,
    totalSeconds,
    totalMinutes: Math.ceil(remain.value / 60_000),
    totalHours: Math.ceil(remain.value / 3_600_000),
    totalDays: Math.ceil(remain.value / 86_400_000),
    days: Math.floor(totalSeconds / 86_400),
    hours: Math.floor((totalSeconds % 86_400) / 3_600),
    minutes: Math.floor((totalSeconds % 3_600) / 60),
    seconds: totalSeconds % 60,
  }
})

const defaultText = computed(() => {
  const hasDays = props.format.includes('DD')
  const hasHours = props.format.includes('HH')
  const hasMinutes = props.format.includes('mm')
  const hasSeconds = props.format.includes('ss')
  const displayTotalSeconds = hasSeconds
    ? time.value.totalSeconds
    : hasMinutes
      ? time.value.totalMinutes * 60
      : hasHours
        ? time.value.totalHours * 3_600
        : hasDays
          ? time.value.totalDays * 86_400
          : time.value.totalSeconds

  const values: Record<'DD' | 'HH' | 'mm' | 'ss', number> = {
    DD: Math.floor(displayTotalSeconds / 86_400),
    HH: hasDays
      ? Math.floor((displayTotalSeconds % 86_400) / 3_600)
      : Math.floor(displayTotalSeconds / 3_600),
    mm:
      hasDays || hasHours
        ? Math.floor((displayTotalSeconds % 3_600) / 60)
        : Math.floor(displayTotalSeconds / 60),
    ss:
      hasDays || hasHours || hasMinutes
        ? displayTotalSeconds % 60
        : displayTotalSeconds,
  }

  return props.format.replace(/DD|HH|mm|ss/g, (token) =>
    pad(values[token as keyof typeof values]),
  )
})

const text = computed(() =>
  props.formatter ? props.formatter(time.value) : defaultText.value,
)

const tokens = computed(() => {
  const characters = Array.from(text.value)
  const digitCount = characters.filter(
    (character) => character >= '0' && character <= '9',
  ).length
  let digitIndex = 0

  return characters.map((character, index) => {
    const isDigit = character >= '0' && character <= '9'
    const delay = isDigit
      ? Math.min((digitCount - digitIndex - 1) * 24, 120)
      : 0

    if (isDigit) digitIndex += 1

    return { character, delay, index, isDigit }
  })
})

const setAnchor = (now = Date.now()) => {
  anchorTime = now
  anchorRemaining = remain.value
}

const syncRemaining = (now = Date.now(), speed = props.speed) => {
  remain.value = Math.max(0, anchorRemaining - (now - anchorTime) * speed)
}

const clearTimer = () => {
  if (timer) clearInterval(timer)
  timer = undefined
}

const publish = () => {
  emit('change', remain.value)
  if (remain.value) {
    hasFinished = false
    return
  }

  clearTimer()
  if (!hasFinished) {
    hasFinished = true
    emit('finish')
  }
}

const tick = () => {
  syncRemaining()
  publish()
}

const start = () => {
  if (timer || !remain.value || props.speed <= 0) return
  setAnchor()
  timer = setInterval(tick, 250)
}

const stop = () => {
  if (!timer) return
  const now = Date.now()
  syncRemaining(now)
  clearTimer()
  setAnchor(now)
}

const resetFromDeadline = () => {
  const now = Date.now()
  remain.value = Math.max(0, props.value - now)
  hasFinished = false
  setAnchor(now)
  publish()
}

watch(
  () => props.value,
  () => {
    resetFromDeadline()
    if (props.autoStart) start()
  },
)

watch(
  () => props.autoStart,
  (autoStart) => (autoStart ? start() : stop()),
)

watch(
  () => props.speed,
  (speed, oldSpeed) => {
    const now = Date.now()
    if (timer) syncRemaining(now, oldSpeed)
    setAnchor(now)

    if (speed <= 0) clearTimer()
    else if (props.autoStart) start()
  },
)

onMounted(() => {
  resetFromDeadline()
  if (props.autoStart) start()
})
onBeforeUnmount(clearTimer)
defineExpose({ start, stop })
</script>

<template>
  <span :class="[ns.b(), ns.m(`effect-${props.effect}`)]" :aria-label="text">
    <template v-for="token in tokens" :key="token.index">
      <CountdownDigit
        v-if="token.isDigit"
        :value="token.character"
        :effect="props.effect"
        :delay="token.delay"
      />
      <span v-else :class="ns.e('separator')" aria-hidden="true">
        {{ token.character }}
      </span>
    </template>
  </span>
</template>
