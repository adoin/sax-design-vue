import { buildProps, definePropType, isBoolean } from '@vuesax-alpha/utils'

import type { ExtractPropTypes } from 'vue'
import type Chip from './chip.vue'

export const chipStyleList = [
  'default',
  'outline',
  'dashed',
  'mark',
  'arrow',
  'flag',
] as const

export type ChipStyle = (typeof chipStyleList)[number]
export type ChipSize = 'small' | 'default' | 'large'

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
  closeIcon: {
    type: String,
    default: 'cb:close',
  },
  transparent: Boolean,
  /** Tag-inspired visual treatment. */
  tagStyle: {
    type: definePropType<ChipStyle>(String),
    default: 'default',
  },
  /** Pill geometry. Mark and arrow use dedicated round-safe variants. */
  round: Boolean,
  size: {
    type: definePropType<ChipSize>(String),
    default: 'default',
  },
  item: Boolean,
} as const)

export const chipEmits = {
  'update:modelValue': (val: boolean) => isBoolean(val),
  click: () => true,
  close: () => true,
  's-remove': (val: boolean) => isBoolean(val),
}

export type ChipProps = ExtractPropTypes<typeof chipProps>
export type ChipInstance = InstanceType<typeof Chip>
