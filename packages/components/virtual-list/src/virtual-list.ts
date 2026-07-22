import { buildProps, definePropType } from '@vuesax-alpha/utils'

import type { ExtractPropTypes } from 'vue'
import type VirtualList from './virtual-list.vue'

export type VirtualListKey = string | number
export type VirtualListItemKey<T = unknown> = (
  item: T,
  index: number,
) => VirtualListKey

export const virtualListProps = buildProps({
  /** @description Items rendered by the virtual list. */
  items: {
    type: definePropType<unknown[]>(Array),
    default: () => [],
  },
  /** @description Height of the scroll viewport. */
  height: {
    type: [Number, String],
    default: 320,
  },
  /** @description Initial row-height estimate used before rows are measured. */
  estimateSize: {
    type: Number,
    default: 48,
  },
  /** @description Extra rows rendered above and below the visible window. */
  overscan: {
    type: Number,
    default: 5,
  },
  /** @description Measure rendered rows to support dynamic heights. */
  dynamic: {
    type: Boolean,
    default: true,
  },
  /** @description Returns a stable unique key for every item. */
  itemKey: {
    type: definePropType<VirtualListItemKey>(Function),
    default: undefined,
  },
} as const)

export const virtualListEmits = {
  scroll: (event: Event) => event instanceof Event,
  'range-change': (range: { start: number; end: number }) =>
    Number.isInteger(range.start) && Number.isInteger(range.end),
}

export type VirtualListProps = ExtractPropTypes<typeof virtualListProps>
export type VirtualListInstance = InstanceType<typeof VirtualList>
