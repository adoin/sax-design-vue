import { buildProps } from '@vuesax-alpha/utils'
import type { ExtractPropTypes } from 'vue'
import type TextEllipsis from './text-ellipsis.vue'

export const textEllipsisProps = buildProps({
  content: { type: String, default: '' },
  lineClamp: { type: Number, default: 1 },
  expanded: Boolean,
  expandable: Boolean,
  expandText: { type: String, default: 'More' },
  collapseText: { type: String, default: 'Less' },
} as const)

export const textEllipsisEmits = {
  'update:expanded': (value: boolean) => typeof value === 'boolean',
  change: (value: boolean) => typeof value === 'boolean',
}

export type TextEllipsisProps = ExtractPropTypes<typeof textEllipsisProps>
export type TextEllipsisInstance = InstanceType<typeof TextEllipsis>
