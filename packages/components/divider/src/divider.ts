import { buildProps } from '@vuesax-alpha/utils'

import type { ExtractPropTypes } from 'vue'
import type Divider from './divider.vue'

export const dividerProps = buildProps({
  direction: {
    type: String,
    values: ['horizontal', 'vertical'] as const,
    default: 'horizontal',
  },
  color: {
    type: String,
    default: 'default',
  },
  variant: {
    type: String,
    values: ['plain', 'soft', 'solid'] as const,
    default: 'plain',
  },
  background: {
    type: String,
    default: 'transparent',
  },
  labelColor: {
    type: String,
    default: '',
  },
  gap: {
    type: String,
    default: '12px',
  },
  icon: {
    type: String,
    default: null,
  },
  borderStyle: {
    type: String,
    values: ['solid', 'dashed', 'dotted'] as const,
    default: 'solid',
  },
  borderHeight: {
    type: String,
    default: '1px',
  },
  position: {
    type: String,
    values: ['center', 'left', 'left-center', 'right-center', 'right'],
    default: 'center',
  },
} as const)

export type DividerProps = ExtractPropTypes<typeof dividerProps>
export type DividerVariant = DividerProps['variant']
export type DividerInstance = InstanceType<typeof Divider>
