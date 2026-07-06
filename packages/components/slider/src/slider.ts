import { UPDATE_MODEL_EVENT } from '@vuesax-alpha/constants'
import { useColorProp } from '@vuesax-alpha/hooks'
import { buildProps, isNumber } from '@vuesax-alpha/utils'

import type { ExtractPropTypes } from 'vue'
import type Slider from './slider.vue'

export const sliderProps = buildProps({
  modelValue: {
    type: Number,
    default: 0,
  },
  min: {
    type: Number,
    default: 0,
  },
  max: {
    type: Number,
    default: 100,
  },
  step: {
    type: Number,
    default: 1,
  },
  disabled: Boolean,
  color: { ...useColorProp, default: 'primary' },
  textFixed: {
    type: String,
    default: '',
  },
  ticks: Boolean,
} as const)

export const sliderEmits = {
  [UPDATE_MODEL_EVENT]: (val: number) => isNumber(val),
  change: (val: number) => isNumber(val),
}

export type SliderProps = ExtractPropTypes<typeof sliderProps>
export type SliderInstance = InstanceType<typeof Slider>
