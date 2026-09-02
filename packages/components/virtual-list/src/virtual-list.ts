import { buildProps, definePropType } from '@vuesax-alpha/utils'

import type { ExtractPropTypes } from 'vue'
import type VirtualList from './virtual-list.vue'

export type VirtualListKey = string | number
export type VirtualListItemKey<T = unknown> = (
  item: T,
  index: number,
) => VirtualListKey
export type VirtualListItemAt<T = unknown> = (index: number) => T
export type VirtualListItemKeyAt = (index: number) => VirtualListKey

export const virtualListProps = buildProps({
  /** @description Items rendered by the virtual list. */
  items: {
    type: definePropType<unknown[]>(Array),
    default: () => [],
  },
  /** @description Logical item count for generated data that is not stored in an array. */
  count: {
    type: Number,
    default: undefined,
  },
  /** @description Resolves one generated item by index when count is provided. */
  itemAt: {
    type: definePropType<VirtualListItemAt>(Function),
    default: undefined,
  },
  /** @description Resolves a stable key by index without creating the item. */
  itemKeyAt: {
    type: definePropType<VirtualListItemKeyAt>(Function),
    default: undefined,
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
  /** @description Keep the largest measured size for each stable item key. */
  retainMaxSize: {
    type: Boolean,
    default: false,
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
