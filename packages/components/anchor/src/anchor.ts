import { buildProps, definePropType } from '@vuesax-alpha/utils'
import type { ExtractPropTypes } from 'vue'
import type Anchor from './anchor.vue'

export interface AnchorItem {
  href: string
  title: string
  disabled?: boolean
  children?: AnchorItem[]
}

export const anchorProps = buildProps({
  modelValue: { type: String, default: '' },
  items: { type: definePropType<AnchorItem[]>(Array), default: () => [] },
  offset: { type: Number, default: 88 },
  targetOffset: { type: Number, default: undefined },
  bounds: { type: Number, default: 5 },
  affix: { type: Boolean, default: false },
  getContainer: {
    type: definePropType<() => HTMLElement | Window>(Function),
    default: undefined,
  },
  getCurrentAnchor: {
    type: definePropType<(activeHref: string) => string>(Function),
    default: undefined,
  },
  replace: { type: Boolean, default: false },
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
  click: (item: AnchorItem) => typeof item.href === 'string',
}

export type AnchorProps = ExtractPropTypes<typeof anchorProps>
export type AnchorInstance = InstanceType<typeof Anchor>
