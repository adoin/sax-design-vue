import { buildProps } from '@vuesax-alpha/utils'
import { useShapeProp } from '@vuesax-alpha/hooks'

import type { EmitFn } from '@vuesax-alpha/utils'
import type { ExtractPropTypes } from 'vue'
import type Tag from './tag.vue'

export const tagProps = buildProps({
  disabled: { type: Boolean },
  hit: {
    type: Boolean,
    default: false,
  },
  shape: useShapeProp,
  showClose: {
    type: Boolean,
    default: true,
  },
})

export type TagProps = ExtractPropTypes<typeof tagProps>

export const tagEmits = {
  click: (e: Event | MouseEvent) => e instanceof Event,
  close: (e: Event | MouseEvent) => e instanceof Event,
}

export type TagEmits = typeof tagEmits
export type TagEmitFn = EmitFn<TagEmits>

export type TagInstance = InstanceType<typeof Tag>
