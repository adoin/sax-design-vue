<script lang="ts" setup>
import { computed, watch } from 'vue'
import { useNamespace, useShape } from '@vuesax-alpha/hooks'
import { getVsColor, isVsColor, normalizeVsColor } from '@vuesax-alpha/utils'
import { sliderEmits, sliderProps } from './slider'
import type { CSSProperties } from 'vue'

defineOptions({ name: 'SSlider', inheritAttrs: false })

const props = defineProps(sliderProps)
const emit = defineEmits(sliderEmits)
const ns = useNamespace('slider')
const shape = useShape()
const safeMin = computed(() => Math.min(props.min, props.max))
const safeMax = computed(() => Math.max(props.min, props.max))
const range = computed(() => safeMax.value - safeMin.value)
const clamp = (value: number) =>
  Math.min(safeMax.value, Math.max(safeMin.value, value))
const snap = (value: number) => {
  const step = props.step > 0 ? props.step : 1
  const next = safeMin.value + Math.round((value - safeMin.value) / step) * step
  return Number(clamp(next).toFixed(10))
}
const normalizedValue = computed(() => snap(props.modelValue))
const percent = computed(() =>
  range.value <= 0
    ? 0
    : ((normalizedValue.value - safeMin.value) / range.value) * 100,
)
const themeColor = computed(() => normalizeVsColor(props.color))
const isThemeColor = computed(() => isVsColor(themeColor.value))
const themeColorClass = computed(() =>
  isThemeColor.value ? ns.m(themeColor.value) : '',
)
const customColor = computed(() => {
  if (isThemeColor.value) return ''
  const color = getVsColor(props.color)
  if (!color) return ''
  return color.startsWith('var(') ? color : `rgb(${color})`
})
const rootStyle = computed(
  () =>
    ({
      '--sax-slider-percent': `${percent.value}%`,
      ...(customColor.value ? { '--sax-slider-color': customColor.value } : {}),
    }) as CSSProperties,
)
const tickValues = computed(() => {
  if (!props.ticks && props.variant !== 'steps') return []
  const step = props.step > 0 ? props.step : 1
  const count = Math.min(200, Math.floor(range.value / step))
  return Array.from({ length: count + 1 }, (_, index) =>
    Number((safeMin.value + index * step).toFixed(10)),
  )
})
const tickPercent = (value: number) =>
  range.value <= 0 ? 0 : ((value - safeMin.value) / range.value) * 100
const commit = (value: number, change = false) => {
  const next = snap(value)
  emit('update:modelValue', next)
  if (change) emit('change', next)
}
const handleInput = (event: Event) =>
  commit(Number((event.target as HTMLInputElement).value))
const handleChange = (event: Event) =>
  commit(Number((event.target as HTMLInputElement).value), true)

watch(
  () => [props.modelValue, props.min, props.max, props.step] as const,
  () => {
    if (normalizedValue.value !== props.modelValue)
      emit('update:modelValue', normalizedValue.value)
  },
  { immediate: true },
)
</script>

<template>
  <div
    :class="[
      ns.b(),
      themeColorClass,
      ns.is(variant),
      ns.is(shape),
      ns.is('disabled', disabled),
      ns.is('show-value', showValue),
    ]"
    :style="rootStyle"
  >
    <span :class="ns.e('track')" aria-hidden="true">
      <span :class="ns.e('line')" />
      <span :class="ns.e('fill')" />
      <span
        v-for="tick in tickValues"
        :key="tick"
        :class="[ns.e('tick'), ns.is('passed', tick <= normalizedValue)]"
        :style="{ left: `${tickPercent(tick)}%` }"
      />
      <span :class="ns.e('thumb')">
        <span :class="ns.e('text')">
          {{ normalizedValue }}<span v-if="textFixed">{{ textFixed }}</span>
        </span>
      </span>
    </span>
    <input
      v-bind="$attrs"
      :class="ns.e('input')"
      type="range"
      :min="safeMin"
      :max="safeMax"
      :step="step > 0 ? step : 1"
      :value="normalizedValue"
      :disabled="disabled"
      @input="handleInput"
      @change="handleChange"
    />
  </div>
</template>
