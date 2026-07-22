import { buildProps } from '@vuesax-alpha/utils'
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
  ellipsis: Boolean,
  lineClamp: Number,
  title: String,
} as const)

export type TextProps = ExtractPropTypes<typeof textProps>
export type TextInstance = InstanceType<typeof Text>
