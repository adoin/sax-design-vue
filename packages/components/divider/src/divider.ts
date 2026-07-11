import { buildProps } from '@vuesax-alpha/utils'

import type { ExtractPropTypes } from 'vue'
import type Divider from './divider.vue'

export const dividerProps = buildProps({
  color: {
    type: String,
    default: 'rgba(0, 0, 0,.1)',
  },
  background: {
    type: String,
    default: 'transparent',
  },
  icon: {
    type: String,
    default: null,
  },
  iconPack: {
    type: String,
    default: 'material-icons',
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
