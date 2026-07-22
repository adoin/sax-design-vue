<template>
  <div ref="rootRef" :class="[ns.b(), ns.is('disabled', disabled)]">
    <button
      :class="ns.e('trigger')"
      type="button"
      :disabled="disabled"
      aria-haspopup="dialog"
      :aria-expanded="open"
      @click="open = !open"
    >
      <span :class="ns.e('swatch')" :style="{ background: colorValue }" />
      <span :class="ns.e('value')">{{ valueText }}</span>
      <SIcon icon="arrow_drop_down" icon-pack="material-icons" />
    </button>
    <div
      v-if="open"
      :class="ns.e('panel')"
      role="dialog"
      aria-label="Color picker"
    >
      <input
        :class="ns.e('native')"
        type="color"
        :value="hexValue"
        :disabled="disabled"
        aria-label="Color"
        @input="updateHex(($event.target as HTMLInputElement).value)"
      />
      <div :class="ns.e('row')">
        <span :class="ns.e('preview')" :style="{ background: colorValue }" />
        <input
          :class="ns.e('text')"
          :value="valueText"
          :disabled="disabled"
          aria-label="Color value"
          @change="updateText(($event.target as HTMLInputElement).value)"
        />
      </div>
      <label v-if="showAlpha" :class="ns.e('alpha')">
        <span>Opacity</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          :value="alpha"
          @input="
            updateAlpha(Number(($event.target as HTMLInputElement).value))
          "
        />
        <b>{{ Math.round(alpha * 100) }}%</b>
      </label>
      <div v-if="predefine.length" :class="ns.e('presets')">
        <button
          v-for="color in predefine"
          :key="color"
          :class="[ns.e('preset'), ns.is('active', color === modelValue)]"
          type="button"
          :style="{ background: color }"
          :aria-label="`Choose ${color}`"
          @click="selectPreset(color)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { SIcon } from '@vuesax-alpha/components/icon'
import { useNamespace } from '@vuesax-alpha/hooks'
import { colorPickerEmits, colorPickerProps } from './color-picker'
import type { RgbColor } from './color-picker'

defineOptions({ name: 'SColorPicker' })

const props = defineProps(colorPickerProps)
const emit = defineEmits(colorPickerEmits)
const ns = useNamespace('color-picker')
const rootRef = ref<HTMLElement>()
const open = ref(false)

const clamp = (value: number) => Math.min(Math.max(value, 0), 255)
const parseColor = (value: string): RgbColor | undefined => {
  const hex = value.trim().replace('#', '')
  if (/^[\da-f]{3}$/i.test(hex)) {
    return {
      red: Number.parseInt(hex[0] + hex[0], 16),
      green: Number.parseInt(hex[1] + hex[1], 16),
      blue: Number.parseInt(hex[2] + hex[2], 16),
      alpha: 1,
    }
  }
  if (/^[\da-f]{6}$/i.test(hex)) {
    return {
      red: Number.parseInt(hex.slice(0, 2), 16),
      green: Number.parseInt(hex.slice(2, 4), 16),
      blue: Number.parseInt(hex.slice(4, 6), 16),
      alpha: 1,
    }
  }
  const match = value.match(/rgba?\(([^)]+)\)/i)
  if (!match) return undefined
  const values = match[1].split(',').map(Number)
  if (values.length < 3 || values.slice(0, 3).some(Number.isNaN))
    return undefined
  return {
    red: clamp(values[0]),
    green: clamp(values[1]),
    blue: clamp(values[2]),
    alpha: Number.isNaN(values[3]) ? 1 : Math.min(Math.max(values[3], 0), 1),
  }
}
const rgb = computed(
  () =>
    parseColor(props.modelValue) || {
      red: 86,
      green: 103,
      blue: 244,
      alpha: 1,
    },
)
const hexValue = computed(
  () =>
    `#${[rgb.value.red, rgb.value.green, rgb.value.blue].map((part) => Math.round(part).toString(16).padStart(2, '0')).join('')}`,
)
const alpha = computed(() => rgb.value.alpha)
const colorValue = computed(
  () =>
    `rgba(${rgb.value.red}, ${rgb.value.green}, ${rgb.value.blue}, ${rgb.value.alpha})`,
)
const formatValue = (color: RgbColor) => {
  const hex = `#${[color.red, color.green, color.blue].map((part) => Math.round(part).toString(16).padStart(2, '0')).join('')}`
  return props.format === 'rgb' || (props.showAlpha && color.alpha < 1)
    ? `rgba(${color.red}, ${color.green}, ${color.blue}, ${Number(color.alpha.toFixed(2))})`
    : hex
}
const valueText = computed(() => formatValue(rgb.value))
const emitValue = (color: RgbColor) => {
  const value = formatValue(color)
  emit('update:modelValue', value)
  emit('change', value)
}
const updateHex = (value: string) => {
  const color = parseColor(value)
  if (color) emitValue({ ...color, alpha: rgb.value.alpha })
}
const updateAlpha = (value: number) => emitValue({ ...rgb.value, alpha: value })
const updateText = (value: string) => {
  const color = parseColor(value)
  if (color) emitValue(color)
}
const selectPreset = (value: string) => {
  const color = parseColor(value)
  if (color) emitValue(color)
}
const handlePointerDown = (event: PointerEvent) => {
  if (rootRef.value && !rootRef.value.contains(event.target as Node))
    open.value = false
}

onMounted(() => document.addEventListener('pointerdown', handlePointerDown))
onBeforeUnmount(() =>
  document.removeEventListener('pointerdown', handlePointerDown),
)
</script>
