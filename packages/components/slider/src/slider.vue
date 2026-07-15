<template>
  <div
    :class="[
      ns.b(),
      themeColorClass,
      ns.is('disabled', disabled),
      ns.is('dragging', dragging),
    ]"
    :style="rootStyle"
    tabindex="0"
    @keydown.left.prevent="decrease"
    @keydown.right.prevent="increase"
  >
    <button
      ref="trackRef"
      :class="ns.e('track')"
      type="button"
      :disabled="disabled"
      @mousedown="startDrag"
      @touchstart.prevent="startTouchDrag"
      @click="handleTrackClick"
    >
      <span :class="ns.e('line')" />
      <span :class="ns.e('fill')" :style="fillStyle" />
      <span
        v-for="tick in tickValues"
        :key="tick"
        :class="ns.e('tick')"
        :style="{ left: `${tickPercent(tick)}%` }"
      />
    </button>
    <button
      ref="thumbRef"
      :class="ns.e('thumb')"
      type="button"
      :disabled="disabled"
      :style="thumbStyle"
      @mousedown.stop="startDrag"
      @touchstart.prevent.stop="startTouchDrag"
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
import { getVsColor, isVsColor, normalizeVsColor } from '@vuesax-alpha/utils'
import { sliderEmits, sliderProps } from './slider'
import type { CSSProperties } from 'vue'

defineOptions({
  name: 'SSlider',
})

const props = defineProps(sliderProps)
const emit = defineEmits(sliderEmits)

const ns = useNamespace('slider')
const trackRef = ref<HTMLButtonElement>()
const thumbRef = ref<HTMLButtonElement>()
const dragging = ref(false)

const themeColor = computed(() => normalizeVsColor(props.color))
const isThemeColor = computed(() => isVsColor(themeColor.value))
const themeColorClass = computed(() =>
  isThemeColor.value ? ns.m(themeColor.value) : ''
)

const clamp = (val: number) => Math.min(props.max, Math.max(props.min, val))

const percent = computed(() => {
  const range = props.max - props.min
  if (range <= 0) return 0
  return ((props.modelValue - props.min) / range) * 100
})

const displayValue = computed(() => props.modelValue)

const customColor = computed(() => {
  if (isThemeColor.value) return ''
  const c = getVsColor(props.color)
  if (!c) return ''
  return c.startsWith('var(') ? c : `rgb(${c})`
})

const rootStyle = computed((): CSSProperties => {
  if (!customColor.value) return {}
  return { '--s-slider-color': customColor.value } as CSSProperties
})

const fillStyle = computed(() => ({
  width: `${percent.value}%`,
  ...(customColor.value ? { background: customColor.value } : {}),
}))

const thumbStyle = computed(() => ({
  left: `${percent.value}%`,
  ...(customColor.value ? { background: customColor.value } : {}),
}))

const tickValues = computed(() => {
  if (!props.ticks) return []
  const values: number[] = []
  const step = props.step || 1
  for (let i = props.min; i <= props.max; i += step) {
    values.push(i)
  }
  return values
})

const tickPercent = (tick: number) => {
  const range = props.max - props.min
  if (range <= 0) return 0
  return ((tick - props.min) / range) * 100
}

const setValue = (next: number, emitChange = false) => {
  const stepped = props.step ? Math.round(next / props.step) * props.step : next
  const clamped = clamp(stepped)
  emit('update:modelValue', clamped)
  if (emitChange) {
    emit('change', clamped)
  }
}

const updateValue = (clientX: number, emitChange = false) => {
  const track = trackRef.value
  if (!track) return
  const rect = track.getBoundingClientRect()
  const ratio = (clientX - rect.left) / rect.width
  const next = props.min + ratio * (props.max - props.min)
  setValue(next, emitChange)
}

const startDrag = (event: MouseEvent) => {
  if (props.disabled) return
  dragging.value = true
  updateValue(event.clientX, true)
  window.addEventListener('mousemove', onDrag)
  window.addEventListener('mouseup', stopDrag)
}

const onDrag = (event: MouseEvent) => {
  if (!dragging.value) return
  updateValue(event.clientX, true)
}

const startTouchDrag = (event: TouchEvent) => {
  if (props.disabled) return
  dragging.value = true
  updateValue(event.touches[0].clientX, true)
  window.addEventListener('touchmove', onTouchDrag, { passive: false })
  window.addEventListener('touchend', stopTouchDrag)
}

const onTouchDrag = (event: TouchEvent) => {
  if (!dragging.value) return
  event.preventDefault()
  updateValue(event.touches[0].clientX, true)
}

const stopTouchDrag = () => {
  dragging.value = false
  window.removeEventListener('touchmove', onTouchDrag)
  window.removeEventListener('touchend', stopTouchDrag)
}

const stopDrag = () => {
  dragging.value = false
  window.removeEventListener('mousemove', onDrag)
  window.removeEventListener('mouseup', stopDrag)
}

const handleTrackClick = (event: MouseEvent) => {
  if (props.disabled) return
  updateValue(event.clientX, true)
}

const increase = () => {
  if (props.disabled) return
  setValue(props.modelValue + (props.step || 1), true)
}

const decrease = () => {
  if (props.disabled) return
  setValue(props.modelValue - (props.step || 1), true)
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

onBeforeUnmount(() => {
  stopDrag()
  stopTouchDrag()
})
</script>
