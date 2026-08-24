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
    default: 'hsl(0deg 0% 0% / 0.1)',
  },
  background: {
    type: String,
    default: 'transparent',
  },
  icon: {
    type: String,
    default: null,
  },
  borderStyle: {
    type: String,
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
export type DividerInstance = InstanceType<typeof Divider>
