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

export type TextLineClamp = false | number
export type TextTyping = boolean | number

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
  lineClamp: {
    type: definePropType<TextLineClamp>([Boolean, Number]),
    default: false,
    validator: (value: TextLineClamp) =>
      value === false ||
      (typeof value === 'number' && Number.isInteger(value) && value >= 1),
  },
  typing: {
    type: definePropType<TextTyping>([Boolean, Number]),
    default: false,
    validator: (value: TextTyping) =>
      typeof value === 'boolean' ||
      (typeof value === 'number' && Number.isFinite(value) && value > 0),
  },
  title: String,
} as const)

export type TextProps = ExtractPropTypes<typeof textProps>
export type TextInstance = InstanceType<typeof Text>
