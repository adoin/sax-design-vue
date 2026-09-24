import { buildProps, definePropType } from '@vuesax-alpha/utils'
import type { ExtractPropTypes, PropType } from 'vue'
import type Text from './text.vue'

export const textTypes = [
  'primary',
  'success',
  'warning',
  'danger',
  'info',
] as const
export type TextType = (typeof textTypes)[number]

export const textEffects = [
  'default',
  'shimmer',
  'typing',
  'rainbow',
  'neon',
  'shadow',
] as const
export type TextEffect = (typeof textEffects)[number]

export type TextLineClamp = false | number

export const textProps = buildProps({
  content: {
    type: [String, Number] as unknown as PropType<string | number>,
  },
  tag: {
    type: String,
    default: 'span',
  },
  type: {
    type: String as PropType<TextType>,
    values: textTypes,
  },
  status: { type: String as PropType<TextType> },
  effect: {
    type: String as PropType<TextEffect>,
    values: textEffects,
    default: 'default',
  },
  lineClamp: {
    type: definePropType<TextLineClamp>([Boolean, Number]),
    default: false,
    validator: (value: TextLineClamp) =>
      value === false ||
      (typeof value === 'number' && Number.isInteger(value) && value >= 1),
  },
  title: String,
} as const)

export type TextProps = ExtractPropTypes<typeof textProps>
export type TextInstance = InstanceType<typeof Text>
