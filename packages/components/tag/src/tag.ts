import { buildProps } from '@vuesax-alpha/utils'
import type { ComponentSize } from '@vuesax-alpha/constants'
import type { ExtractPropTypes, PropType } from 'vue'
import type Tag from './tag.vue'

export const tagTypes = [
  'primary',
  'success',
  'warning',
  'danger',
  'info',
] as const
export type TagType = (typeof tagTypes)[number]

export const tagProps = buildProps({
  type: {
    type: String as PropType<TagType>,
    values: tagTypes,
    default: 'primary',
  },
  /** VXE-compatible semantic alias. Takes priority over type. */
  status: { type: String as PropType<TagType> },
  size: { type: String as PropType<ComponentSize> },
  color: String,
  content: String,
  closable: Boolean,
  disabled: Boolean,
  round: Boolean,
  border: {
    type: Boolean,
    default: true,
  },
} as const)

export const tagEmits = {
  click: (event: MouseEvent) => event instanceof MouseEvent,
  close: (event: MouseEvent) => event instanceof MouseEvent,
}

export type TagProps = ExtractPropTypes<typeof tagProps>
export type TagInstance = InstanceType<typeof Tag>
