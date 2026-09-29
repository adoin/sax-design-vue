import { buildProps, definePropType } from '@vuesax-alpha/utils'
import type { ExtractPropTypes } from 'vue'
import type List from './list.vue'

export type ListDataItem = Record<string, unknown>
export type ListItemKey = (item: ListDataItem, index: number) => string | number
export interface ListVirtualConfig {
  height?: number | string
  estimateSize?: number
  overscan?: number
  dynamic?: boolean
}

export const listProps = buildProps({
  items: { type: definePropType<ListDataItem[]>(Array), default: () => [] },
  itemKey: { type: definePropType<ListItemKey>(Function) },
  virtual: Boolean,
  virtualConfig: {
    type: definePropType<ListVirtualConfig>(Object),
    default: () => ({}),
  },
} as const)

export type ListProps = ExtractPropTypes<typeof listProps>
export type ListInstance = InstanceType<typeof List>
