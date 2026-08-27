import { buildProps, definePropType } from '@vuesax-alpha/utils'
import type { ExtractPropTypes } from 'vue'
import type ColorPicker from './color-picker.vue'
import type { ColorFormat } from './color-utils'

export interface ColorPickerPreset {
  name: string
  value: string
}

export type ColorPickerPresetInput = string | ColorPickerPreset

export const colorPickerProps = buildProps({
  modelValue: { type: String, default: '#5667f4' },
  showAlpha: Boolean,
  predefine: {
    type: definePropType<ColorPickerPresetInput[]>(Array),
    default: () => [],
  },
  disabled: Boolean,
  format: {
    type: definePropType<ColorFormat>(String),
    values: ['hex', 'rgb', 'hsl'],
    default: 'hex',
  },
} as const)

export const colorPickerEmits = {
  'update:modelValue': (value: string) => typeof value === 'string',
  change: (value: string) => typeof value === 'string',
}

export type ColorPickerProps = ExtractPropTypes<typeof colorPickerProps>
export type ColorPickerInstance = InstanceType<typeof ColorPicker>
export type { ColorFormat, HslColor, RgbColor } from './color-utils'
export { formatColor, parseColor, toCssColor } from './color-utils'
