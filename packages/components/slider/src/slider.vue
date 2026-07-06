<template>
  <div
    :class="[ns.b(), ns.m(color), ns.is('disabled', disabled)]"
    @keydown.left.prevent="decrease"
    @keydown.right.prevent="increase"
  >
    <button
      ref="trackRef"
      :class="ns.e('track')"
      type="button"
      :disabled="disabled"
      @mousedown="startDrag"
      @click="handleTrackClick"
    >
      <span :class="ns.e('line')" />
      <span :class="ns.e('fill')" :style="fillStyle" />
    </button>
    <button
      ref="thumbRef"
      :class="ns.e('thumb')"
      type="button"
      :disabled="disabled"
      :style="thumbStyle"
      @mousedown.stop="startDrag"
    >
      <span :class="ns.e('text')">
        {{ displayValue }}
        <span v-if="textFixed">{{ textFixed }}</span>
      </span>
    </button>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useNamespace } from '@vuesax-alpha/hooks'
import { sliderEmits, sliderProps } from './slider'

defineOptions({
  name: 'VsSlider',
})

const props = defineProps(sliderProps)
const emit = defineEmits(sliderEmits)

const ns = useNamespace('slider')
const trackRef = ref<HTMLButtonElement>()
const thumbRef = ref<HTMLButtonElement>()
const dragging = ref(false)

const clamp = (val: number) => Math.min(props.max, Math.max(props.min, val))

const percent = computed(() => {
  const range = props.max - props.min
  if (range <= 0) return 0
  return ((props.modelValue - props.min) / range) * 100
})

const displayValue = computed(() => props.modelValue)

const fillStyle = computed(() => ({ width: `${percent.value}%` }))
const thumbStyle = computed(() => ({ left: `${percent.value}%` }))

const updateValue = (clientX: number) => {
  const track = trackRef.value
  if (!track) return
  const rect = track.getBoundingClientRect()
  const ratio = (clientX - rect.left) / rect.width
  const next = clamp(props.min + ratio * (props.max - props.min))
  emit(
    'update:modelValue',
    props.step ? Math.round(next / props.step) * props.step : next
  )
  emit('change', next)
}

const startDrag = (event: MouseEvent) => {
  if (props.disabled) return
  dragging.value = true
  updateValue(event.clientX)
  window.addEventListener('mousemove', onDrag)
  window.addEventListener('mouseup', stopDrag)
}

const onDrag = (event: MouseEvent) => {
  if (!dragging.value) return
  updateValue(event.clientX)
}

const stopDrag = () => {
  dragging.value = false
  window.removeEventListener('mousemove', onDrag)
  window.removeEventListener('mouseup', stopDrag)
}

const handleTrackClick = (event: MouseEvent) => {
  if (props.disabled) return
  updateValue(event.clientX)
}

const increase = () => {
  if (props.disabled) return
  const next = clamp(props.modelValue + (props.step || 1))
  emit('update:modelValue', next)
  emit('change', next)
}

const decrease = () => {
  if (props.disabled) return
  const next = clamp(props.modelValue - (props.step || 1))
  emit('update:modelValue', next)
  emit('change', next)
}

watch(
  () => props.modelValue,
  (val) => {
    const clamped = clamp(val)
    if (clamped !== val) {
      emit('update:modelValue', clamped)
    }
  }
)

onBeforeUnmount(stopDrag)
</script>
