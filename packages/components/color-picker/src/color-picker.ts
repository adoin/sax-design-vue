import { buildProps, definePropType } from '@vuesax-alpha/utils'
import type { ExtractPropTypes } from 'vue'
import type ColorPicker from './color-picker.vue'

export interface RgbColor {
  red: number
  green: number
  blue: number
  alpha: number
}

export const colorPickerProps = buildProps({
  modelValue: { type: String, default: '#5667f4' },
  showAlpha: Boolean,
  predefine: { type: definePropType<string[]>(Array), default: () => [] },
  disabled: Boolean,
  format: { type: String, values: ['hex', 'rgb'], default: 'hex' },
} as const)

export const colorPickerEmits = {
  'update:modelValue': (value: string) => typeof value === 'string',
  change: (value: string) => typeof value === 'string',
}

export type ColorPickerProps = ExtractPropTypes<typeof colorPickerProps>
export type ColorPickerInstance = InstanceType<typeof ColorPicker>
