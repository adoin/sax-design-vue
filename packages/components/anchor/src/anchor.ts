import { buildProps, definePropType } from '@vuesax-alpha/utils'
import type { ExtractPropTypes } from 'vue'
import type Anchor from './anchor.vue'

export interface AnchorItem {
  href: string
  title: string
  disabled?: boolean
}

export const anchorProps = buildProps({
  modelValue: { type: String, default: '' },
  items: { type: definePropType<AnchorItem[]>(Array), default: () => [] },
  offset: { type: Number, default: 88 },
  direction: {
    type: String,
    values: ['vertical', 'horizontal'],
    default: 'vertical',
  },
  scrollBehavior: {
    type: String,
    values: ['auto', 'smooth'],
    default: 'smooth',
  },
} as const)

export const anchorEmits = {
  'update:modelValue': (value: string) => typeof value === 'string',
  change: (value: string) => typeof value === 'string',
}

export type AnchorProps = ExtractPropTypes<typeof anchorProps>
export type AnchorInstance = InstanceType<typeof Anchor>
