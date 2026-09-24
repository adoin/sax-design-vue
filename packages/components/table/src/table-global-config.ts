import type { TableAlign } from './table-align'
import type { TableQueryFixedButton } from './table-business'
import type { ComponentSize } from '@vuesax-alpha/constants'

export type TableGlobalOverflow = boolean | 'ellipsis' | 'title' | 'tooltip'
export type TableGlobalFeature<Config> = boolean | Config

export interface TableGlobalConfig {
  size?: ComponentSize
  queryConfig?: TableGlobalFeature<{
    enabled?: boolean
    size?: ComponentSize
    fixedButtons?: TableQueryFixedButton[]
    /** @deprecated Use fixedButtons instead. */
    showActions?: boolean
    submitText?: string
    resetText?: string
  }>
  toolbarConfig?: TableGlobalFeature<{
    enabled?: boolean
    size?: ComponentSize
  }>
  historyConfig?: TableGlobalFeature<{ enabled?: boolean; limit?: number }>
  changeConfig?: TableGlobalFeature<{ enabled?: boolean }>
  validationConfig?: TableGlobalFeature<{
    onCommit?: boolean
    scrollToError?: boolean
    maxErrors?: number
  }>
  editConfig?: TableGlobalFeature<{
    enabled?: boolean
    mode?: 'cell' | 'row'
    trigger?: 'click' | 'dblclick' | 'manual'
    onSwitch?: 'commit' | 'cancel'
    onContextChange?: 'commit' | 'cancel'
    onScroll?: 'keep' | 'commit' | 'cancel'
  }>
  rowDragConfig?: TableGlobalFeature<{
    enabled?: boolean
    autoScroll?: boolean
    scrollThreshold?: number
    scrollSpeed?: number
  }>
  keyboardConfig?: TableGlobalFeature<{
    enabled?: boolean
    enterToEdit?: boolean
  }>
  rangeConfig?: TableGlobalFeature<{
    enabled?: boolean
    mouse?: boolean
    keyboard?: boolean
    autoScroll?: boolean
    scrollThreshold?: number
    scrollSpeed?: number
  }>
  clipboardConfig?: TableGlobalFeature<{
    enabled?: boolean
    keyboard?: boolean
    copy?: boolean
    cut?: boolean
    paste?: boolean
    maxCells?: number
    maxCharacters?: number
  }>
  findConfig?: TableGlobalFeature<{
    enabled?: boolean
    keyboard?: boolean
    scope?: 'view' | 'selection' | 'data'
    maxCells?: number
    maxMatches?: number
    maxCharacters?: number
  }>
  chartConfig?: TableGlobalFeature<{
    enabled?: boolean
    maxPoints?: number
    maxSeries?: number
    maxCells?: number
    maxCharacters?: number
  }>
  contextMenuConfig?: TableGlobalFeature<{
    enabled?: boolean
    minWidth?: number
  }>
  resizeConfig?: TableGlobalFeature<{
    enabled?: boolean
    minWidth?: number
    keyboardStep?: number
  }>
  rowKey?: string
  parentIndicator?: TableGlobalFeature<{
    enabled?: boolean
    hideDelay?: number
  }>
  virtualConfig?: TableGlobalFeature<{
    enabled?: boolean
    height?: number | string
    estimateSize?: number
    overscan?: number
    dynamic?: boolean
    horizontal?: boolean
    columnOverscan?: number
  }>
  sortConfig?: { multiple?: boolean }
  selectionConfig?: {
    trigger?: 'row' | 'cell'
    reserve?: boolean
    showSelectAll?: boolean
  }
  showOverflow?: TableGlobalOverflow
  showHeaderOverflow?: TableGlobalOverflow
  showFooterOverflow?: TableGlobalOverflow
  pagerConfig?: TableGlobalFeature<{
    enabled?: boolean
    pageSizes?: number[]
    layout?: string | string[]
    pagerCount?: number
    hideOnSinglePage?: boolean
    disabled?: boolean
    shape?: '' | 'circle' | 'square'
  }>
  showHeader?: boolean
  align?: TableAlign
  headerAlign?: TableAlign
  striped?: boolean
  multiple?: boolean
}
