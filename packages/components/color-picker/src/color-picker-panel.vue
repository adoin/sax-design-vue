<template>
  <div :class="ns.e('editor')">
    <div
      ref="saturationRef"
      :class="ns.e('saturation')"
      :style="{ backgroundColor: `hsl(${hsv.hue}, 100%, 50%)` }"
      role="slider"
      tabindex="0"
      :aria-label="t('vs.colorpicker.saturationValue')"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-valuenow="Math.round(hsv.saturation)"
      :aria-valuetext="`${Math.round(hsv.saturation)}%, ${Math.round(hsv.value)}%`"
      @keydown="handleSaturationKeydown"
      @pointerdown="startSaturationDrag"
    >
      <span
        :class="ns.e('saturation-thumb')"
        :style="{
          left: `${hsv.saturation}%`,
          top: `${100 - hsv.value}%`,
          background: cssColor,
        }"
      />
    </div>

    <div :class="ns.e('control-row')">
      <button
        :class="ns.e('eyedropper')"
        type="button"
        :aria-label="t('vs.colorpicker.eyedropper')"
        :title="t('vs.colorpicker.eyedropper')"
        @click="pickScreenColor"
      >
        <SIcon name="cb:color-picker" />
      </button>
      <span :class="ns.e('preview')">
        <span :style="{ background: cssColor }" />
      </span>
      <div :class="ns.e('sliders')">
        <label :class="ns.e('slider')">
          <span class="s-sr-only">{{ t('vs.colorpicker.hue') }}</span>
          <input
            class="is-hue"
            type="range"
            min="0"
            max="359"
            :value="hsv.hue"
            @input="
              updateHue(Number(($event.target as HTMLInputElement).value))
            "
          />
        </label>
        <label v-if="showAlpha" :class="ns.e('slider')">
          <span class="s-sr-only">{{ t('vs.colorpicker.opacity') }}</span>
          <input
            class="is-alpha"
            type="range"
            min="0"
            max="1"
            step="0.01"
            :style="alphaStyle"
            :value="color.alpha"
            @input="
              updateAlpha(Number(($event.target as HTMLInputElement).value))
            "
          />
        </label>
      </div>
    </div>

    <p v-if="eyedropperMessage" :class="ns.e('message')" role="status">
      {{ eyedropperMessage }}
    </p>

    <div
      :class="ns.e('formats')"
      role="tablist"
      :aria-label="t('vs.colorpicker.format')"
    >
      <button
        v-for="item in formats"
        :key="item"
        :class="[ns.e('format'), ns.is('active', item === format)]"
        type="button"
        role="tab"
        :aria-selected="item === format"
        @click="emit('update:format', item)"
      >
        {{ item.toUpperCase() }}
      </button>
    </div>

    <div :class="[ns.e('fields'), ns.m(format)]">
      <label v-if="format === 'hex'" :class="ns.e('field')">
        <span>HEX</span>
        <input :value="hexText" spellcheck="false" @change="updateTextValue" />
      </label>

      <template v-else-if="format === 'rgb'">
        <label
          v-for="channel in rgbChannels"
          :key="channel.key"
          :class="ns.e('field')"
        >
          <span>{{ channel.label }}</span>
          <input
            inputmode="decimal"
            :value="channel.value"
            @change="
              updateRgbChannel(
                channel.key,
                ($event.target as HTMLInputElement).value,
              )
            "
          />
        </label>
      </template>

      <template v-else>
        <label
          v-for="channel in hslChannels"
          :key="channel.key"
          :class="ns.e('field')"
        >
          <span>{{ channel.label }}</span>
          <input
            inputmode="decimal"
            :value="channel.value"
            @change="
              updateHslChannel(
                channel.key,
                ($event.target as HTMLInputElement).value,
              )
            "
          />
        </label>
      </template>
    </div>

    <div v-if="normalizedPresets.length" :class="ns.e('presets')">
      <button
        v-for="preset in normalizedPresets"
        :key="preset.key"
        :class="[ns.e('preset'), ns.is('active', isPresetActive(preset.color))]"
        type="button"
        :title="`${preset.name}: ${preset.value}`"
        :aria-label="
          t('vs.colorpicker.choose', {
            color: `${preset.name}: ${preset.value}`,
          })
        "
        @click="selectPreset(preset.color)"
      >
        <span
          :class="ns.e('preset-swatch')"
          :style="{ background: preset.value }"
        />
        <span :class="ns.e('preset-name')">{{ preset.name }}</span>
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import { SIcon } from '@vuesax-alpha/components/icon'
import { useLocale, useNamespace } from '@vuesax-alpha/hooks'
import {
  clamp,
  formatColor,
  hslToRgb,
  hsvToRgb,
  parseColor,
  rgbToHsl,
  rgbToHsv,
  toCssColor,
} from './color-utils'
import { pickColorFromScreen } from './screen-color-picker'
import type { ColorPickerPresetInput } from './color-picker'
import type { ColorFormat, HslColor, RgbColor } from './color-utils'

const props = defineProps<{
  color: RgbColor
  format: ColorFormat
  showAlpha: boolean
  predefine: ColorPickerPresetInput[]
}>()

const emit = defineEmits<{
  'update:color': [color: RgbColor]
  'update:format': [format: ColorFormat]
}>()

const ns = useNamespace('color-picker')
const { t } = useLocale()
const saturationRef = ref<HTMLElement>()
const eyedropperMessage = ref('')
const formats: ColorFormat[] = ['hex', 'rgb', 'hsl']
const hsv = computed(() => rgbToHsv(props.color))
const hsl = computed(() => rgbToHsl(props.color))
const cssColor = computed(() => toCssColor(props.color))
const hexText = computed(() => formatColor(props.color, 'hex', props.showAlpha))
const alphaStyle = computed(() => ({
  background: `linear-gradient(90deg, transparent, rgb(${Math.round(props.color.red)}, ${Math.round(props.color.green)}, ${Math.round(props.color.blue)}))`,
}))
const rgbChannels = computed(() => [
  { key: 'red' as const, label: 'R', value: Math.round(props.color.red) },
  { key: 'green' as const, label: 'G', value: Math.round(props.color.green) },
  { key: 'blue' as const, label: 'B', value: Math.round(props.color.blue) },
  ...(props.showAlpha
    ? [
        {
          key: 'alpha' as const,
          label: 'A',
          value: Number(props.color.alpha.toFixed(2)),
        },
      ]
    : []),
])
const hslChannels = computed(() => [
  { key: 'hue' as const, label: 'H', value: Math.round(hsl.value.hue) },
  {
    key: 'saturation' as const,
    label: 'S',
    value: Math.round(hsl.value.saturation),
  },
  {
    key: 'lightness' as const,
    label: 'L',
    value: Math.round(hsl.value.lightness),
  },
  ...(props.showAlpha
    ? [
        {
          key: 'alpha' as const,
          label: 'A',
          value: Number(props.color.alpha.toFixed(2)),
        },
      ]
    : []),
])
const normalizedPresets = computed(() => {
  const presets: Array<{
    name: string
    value: string
    color: RgbColor
    key: string
  }> = []

  props.predefine.forEach((preset, index) => {
    const item =
      typeof preset === 'string'
        ? { name: preset, value: preset }
        : { name: preset.name, value: preset.value }
    const color = parseColor(item.value)
    if (color) {
      presets.push({
        ...item,
        color,
        key: `${item.name}-${item.value}-${index}`,
      })
    }
  })

  return presets
})

const updateColor = (color: RgbColor) => {
  eyedropperMessage.value = ''
  emit('update:color', color)
}

const updateHue = (hue: number) => updateColor(hsvToRgb({ ...hsv.value, hue }))

const updateAlpha = (alpha: number) =>
  updateColor({ ...props.color, alpha: clamp(alpha, 0, 1) })

const updateSaturationFromPointer = (event: PointerEvent) => {
  const rect = saturationRef.value?.getBoundingClientRect()
  if (!rect?.width || !rect.height) return
  const saturation = clamp(
    ((event.clientX - rect.left) / rect.width) * 100,
    0,
    100,
  )
  const value =
    100 - clamp(((event.clientY - rect.top) / rect.height) * 100, 0, 100)
  updateColor(hsvToRgb({ ...hsv.value, saturation, value }))
}

const stopSaturationDrag = () => {
  window.removeEventListener('pointermove', updateSaturationFromPointer)
  window.removeEventListener('pointerup', stopSaturationDrag)
}

const startSaturationDrag = (event: PointerEvent) => {
  event.preventDefault()
  saturationRef.value?.setPointerCapture?.(event.pointerId)
  updateSaturationFromPointer(event)
  window.addEventListener('pointermove', updateSaturationFromPointer)
  window.addEventListener('pointerup', stopSaturationDrag, { once: true })
}

const handleSaturationKeydown = (event: KeyboardEvent) => {
  const step = event.shiftKey ? 10 : 1
  let saturation = hsv.value.saturation
  let value = hsv.value.value
  if (event.key === 'ArrowLeft') saturation -= step
  else if (event.key === 'ArrowRight') saturation += step
  else if (event.key === 'ArrowDown') value -= step
  else if (event.key === 'ArrowUp') value += step
  else return
  event.preventDefault()
  updateColor(hsvToRgb({ ...hsv.value, saturation, value }))
}

const updateTextValue = (event: Event) => {
  const input = event.target as HTMLInputElement
  const parsed = parseColor(input.value)
  if (parsed) updateColor(parsed)
  else input.value = hexText.value
}

const updateRgbChannel = (key: keyof RgbColor, value: string) => {
  const parsed = Number.parseFloat(value)
  if (!Number.isFinite(parsed)) return
  updateColor({
    ...props.color,
    [key]: key === 'alpha' ? clamp(parsed, 0, 1) : clamp(parsed, 0, 255),
  })
}

const updateHslChannel = (key: keyof HslColor, value: string) => {
  const parsed = Number.parseFloat(value)
  if (!Number.isFinite(parsed)) return
  updateColor(
    hslToRgb({
      ...hsl.value,
      [key]: key === 'alpha' ? clamp(parsed, 0, 1) : parsed,
    }),
  )
}

const selectPreset = (color: RgbColor) => updateColor({ ...color })

const isPresetActive = (color: RgbColor) =>
  formatColor(color, 'hex', true) === formatColor(props.color, 'hex', true)

const pickScreenColor = async () => {
  eyedropperMessage.value = ''
  const result = await pickColorFromScreen(formatColor(props.color, 'hex'))
  if (result.status === 'failed') {
    eyedropperMessage.value = t('vs.colorpicker.eyedropperFailed')
    return
  }
  if (result.status !== 'selected') return

  const parsed = parseColor(result.color)
  if (parsed) updateColor({ ...parsed, alpha: props.color.alpha })
}

onBeforeUnmount(stopSaturationDrag)
</script>
