import { addUnit, buildProps } from '@vuesax-alpha/utils'
import type { ExtractPropTypes, PropType } from 'vue'

const cssSizeProp = [String, Number] as unknown as PropType<string | number>

export const normalizeLayoutSize = (value?: string | number) =>
  value === 0 ? '0px' : addUnit(value)

export const layoutProps = buildProps({
  asidePosition: {
    type: String,
    values: ['start', 'end'] as const,
    default: 'start',
  },
  asideWidth: {
    type: cssSizeProp,
    default: 240,
  },
  headerHeight: {
    type: cssSizeProp,
  },
  footerHeight: {
    type: cssSizeProp,
  },
  gap: {
    type: cssSizeProp,
    default: 16,
  },
  padding: {
    type: cssSizeProp,
    default: 16,
  },
  minHeight: {
    type: cssSizeProp,
    default: '100%',
  },
  responsive: {
    type: Boolean,
    default: true,
  },
  stickyHeader: Boolean,
  stickyHeaderOffset: {
    type: cssSizeProp,
  },
  stickyHeaderZIndex: {
    type: Number,
    default: 10,
  },
  asideOutsideCollapsible: {
    type: Boolean,
    default: true,
  },
  asideOutsideCollapsed: Boolean,
} as const)

export const layoutContainerProps = buildProps({
  direction: {
    type: String,
    values: ['horizontal', 'vertical'] as const,
    default: 'horizontal',
  },
  gap: {
    type: cssSizeProp,
    default: 16,
  },
  wrap: Boolean,
  align: {
    type: String,
    values: ['start', 'center', 'end', 'stretch'] as const,
    default: 'stretch',
  },
  justify: {
    type: String,
    values: [
      'start',
      'center',
      'end',
      'space-around',
      'space-between',
      'space-evenly',
    ] as const,
    default: 'start',
  },
} as const)

export const layoutSectionProps = buildProps({
  size: { type: cssSizeProp },
  padding: { type: cssSizeProp },
} as const)

export const layoutAsideProps = buildProps({
  ...layoutSectionProps,
  outsidePosition: {
    type: String,
    values: ['start', 'end'] as const,
    default: 'end',
  },
  outsideCollapsible: {
    type: Boolean,
    default: true,
  },
  outsideCollapsed: Boolean,
} as const)

export const layoutHeaderProps = buildProps({
  ...layoutSectionProps,
  sticky: Boolean,
  stickyOffset: {
    type: cssSizeProp,
    default: 0,
  },
  zIndex: {
    type: Number,
    default: 10,
  },
} as const)

export const layoutBodyProps = buildProps({
  padding: { type: cssSizeProp },
} as const)

export type LayoutProps = ExtractPropTypes<typeof layoutProps>
export type LayoutContainerProps = ExtractPropTypes<typeof layoutContainerProps>
export type LayoutSectionProps = ExtractPropTypes<typeof layoutSectionProps>
export type LayoutAsideProps = ExtractPropTypes<typeof layoutAsideProps>
export type LayoutHeaderProps = ExtractPropTypes<typeof layoutHeaderProps>
export type LayoutBodyProps = ExtractPropTypes<typeof layoutBodyProps>
