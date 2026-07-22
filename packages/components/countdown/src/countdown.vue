<template>
  <span :class="ns.b()" :aria-label="text">{{ text }}</span>
</template>
<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useNamespace } from '@vuesax-alpha/hooks'
import { countdownEmits, countdownProps } from './countdown'
defineOptions({ name: 'SCountdown' })
const props = defineProps(countdownProps)
const emit = defineEmits(countdownEmits)
const ns = useNamespace('countdown')
const remain = ref(Math.max(0, props.value - Date.now()))
let timer: ReturnType<typeof setInterval> | undefined
const pad = (value: number) => `${value}`.padStart(2, '0')
const text = computed(() => {
  const total = Math.ceil(remain.value / 1000)
  const days = Math.floor(total / 86400)
  const hours = Math.floor((total % 86400) / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const seconds = total % 60
  return props.format
    .replace(/DD/g, pad(days))
    .replace(/HH/g, pad(hours))
    .replace(/mm/g, pad(minutes))
    .replace(/ss/g, pad(seconds))
})
const tick = () => {
  remain.value = Math.max(0, props.value - Date.now())
  emit('change', remain.value)
  if (!remain.value) {
    clearInterval(timer)
    timer = undefined
    emit('finish')
  }
}
const start = () => {
  if (!timer && remain.value) timer = setInterval(tick, 250)
}
const stop = () => {
  if (timer) clearInterval(timer)
  timer = undefined
}
watch(
  () => props.value,
  () => {
    tick()
    if (props.autoStart) start()
  },
)
onMounted(() => {
  tick()
  if (props.autoStart) start()
})
onBeforeUnmount(stop)
defineExpose({ start, stop })
</script>
