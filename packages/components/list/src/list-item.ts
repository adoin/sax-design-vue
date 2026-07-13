import { buildProps } from '@vuesax-alpha/utils'

import type { ExtractPropTypes } from 'vue'
import type ListItem from './list-item.vue'

export const listItemProps = buildProps({
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

export type ListItemProps = ExtractPropTypes<typeof listItemProps>
export type ListItemInstance = InstanceType<typeof ListItem>
