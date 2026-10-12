import { buildProps, definePropType } from '@vuesax-alpha/utils'
import type { ExtractPropTypes } from 'vue'
import type Skeleton from './skeleton.vue'

export type SkeletonElementType = 'circle' | 'square' | 'rectangle' | 'line'
export type SkeletonLength = number | string
export interface SkeletonElement {
  type: SkeletonElementType
  width?: SkeletonLength
  height?: SkeletonLength
  /** Diameter or side length for circle and square. */
  size?: SkeletonLength
  /** Grow relative to other items in the same row. */
  flex?: number
}
export interface SkeletonGroup {
  type: 'group'
  rows: SkeletonRow[]
  width?: SkeletonLength
  flex?: number
  gap?: SkeletonLength
}
export type SkeletonItem = SkeletonElementType | SkeletonElement | SkeletonGroup
export interface SkeletonRowConfig {
  items: SkeletonItem[]
  gap?: SkeletonLength
  align?: 'start' | 'center' | 'end' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'space-between'
}
export type SkeletonRow = SkeletonItem[] | SkeletonRowConfig
export type SkeletonAnimation = 'shimmer' | 'pulse' | 'none'

export const skeletonProps = buildProps({
  loading: { type: Boolean, default: true },
  rows: { type: definePropType<SkeletonRow[]>(Array) },
  repeat: {
    type: Number,
    default: 1,
    validator: (value: number) => Number.isInteger(value) && value >= 1,
  },
  gap: { type: [Number, String], default: 16 },
  animation: {
    type: definePropType<SkeletonAnimation>(String),
    values: ['shimmer', 'pulse', 'none'],
    default: 'shimmer',
  },
  label: { type: String },
} as const)
export type SkeletonProps = ExtractPropTypes<typeof skeletonProps>
export type SkeletonInstance = InstanceType<typeof Skeleton>
