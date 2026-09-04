import { useTableCellRange } from './use-table-cell-range'
import { createTableRangeMergeQuery } from './table-range-merge-query'
import type { WatchSource } from 'vue'
import type { TableEmitFn, TableProps } from '../table'
import type { TableCellCoordinate } from './use-table-keyboard'
import type { TableCellRangeBounds } from '../table-cell-range'
import type { TableMergeRegion } from './table-merge-regions'

interface Options {
  count: () => number
  columns: () => number
  resolve: (
    address: TableCellCoordinate['address'],
    hint?: TableCellCoordinate,
  ) => TableCellCoordinate | undefined
  sourceIndexAt: (index: number) => number
  viewIndexNear: (index: number, backwards: boolean) => number | undefined
  query: (window: TableCellRangeBounds) => readonly TableMergeRegion[]
  context: WatchSource[]
}

export function useTableRangeController(
  props: TableProps,
  emit: TableEmitFn,
  options: Options,
) {
  return useTableCellRange({
    config: () => props.rangeConfig,
    value: () => props.cellRange,
    disabled: () => props.loading,
    limits: () => ({ rows: options.count(), columns: options.columns() }),
    resolve: options.resolve,
    merges: createTableRangeMergeQuery(options),
    context: options.context,
    onUpdate: (range) => emit('update:cellRange', range),
    onChange: (change) => emit('cellRangeChange', change),
    onError: (error) => emit('cellRangeError', error),
  })
}
