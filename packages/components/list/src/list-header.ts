import { useColorProp } from '@vuesax-alpha/hooks'
import { buildProps } from '@vuesax-alpha/utils'

import type { ExtractPropTypes } from 'vue'
import type ListHeader from './list-header.vue'

export const listHeaderProps = buildProps({
  color: { ...useColorProp, default: 'primary' },
  title: {
    type: String,
    default: null,
  },
  subtitle: {
    type: String,
    default: null,
  },
  icon: {
    type: String,
    default: null,
  },
  iconPack: {
    type: String,
    default: 'material-icons',
  },
} as const)

export type ListHeaderProps = ExtractPropTypes<typeof listHeaderProps>
export type ListHeaderInstance = InstanceType<typeof ListHeader>
