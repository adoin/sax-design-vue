import { buildProps, isBoolean } from '@vuesax-alpha/utils'

import type { ExtractPropTypes } from 'vue'
import type Chip from './chip.vue'

export const chipProps = buildProps({
  modelValue: {
    type: Boolean,
    default: true,
  },
  text: {
    type: String,
    default: null,
  },
  closable: {
    type: [Boolean, String],
    default: false,
  },
  color: {
    type: String,
    default: null,
  },
  icon: {
    type: String,
    default: null,
  },
  iconPack: {
    type: String,
    default: 'material-icons',
  },
  closeIcon: {
    type: String,
    default: 'clear',
  },
  transparent: Boolean,
  item: Boolean,
} as const)

export const chipEmits = {
  'update:modelValue': (val: boolean) => isBoolean(val),
  click: () => true,
  close: () => true,
  'vs-remove': (val: boolean) => isBoolean(val),
}

export type ChipProps = ExtractPropTypes<typeof chipProps>
export type ChipInstance = InstanceType<typeof Chip>
