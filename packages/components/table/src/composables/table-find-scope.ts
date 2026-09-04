import { tableFieldValue } from '../data-utils'
import type { TableColumn, TableProps } from '../table'
import type { TableEditContext } from '../table-edit'
import type { TableFindCell } from '../find-data'
import type { TableFindOptions } from '../table-find'
import type { TableCellRangeBounds } from '../table-cell-range'
import type { TableClipboardCell } from '../clipboard-data'
import type { TableDataScope, TableDataScopeRow } from './use-table-data-scope'

interface Options {
  scope: TableDataScope
  count: () => { rows: number; columns: number }
  columnAt: (
    position: number,
  ) => { column: TableColumn; index: number } | undefined
  selection: () => TableCellRangeBounds | undefined | null
  cells: (
    bounds: TableCellRangeBounds,
  ) => (row: number, column: number) => TableClipboardCell | undefined
  locateView: (
    row: number,
    column: number,
    current: () => boolean,
    focus: boolean,
  ) => Promise<boolean>
  locateData: (
    target: TableDataScopeRow,
    column: TableColumn,
    index: number,
    current: () => boolean,
    focus: boolean,
  ) => Promise<boolean>
  toggle: (context: TableEditContext, expanded?: boolean) => Promise<void>
}

/** Search scope selection does not mount cells or fetch unprovided pages/tree nodes. */
export function createTableFindScope(props: TableProps, options: Options) {
  return function* cells(
    selected: TableFindOptions,
    current: () => boolean,
  ): Generator<() => TableFindCell | undefined> {
    const scope = selected.scope ?? 'view'
    const count = options.count()
    if (!['view', 'selection', 'data'].includes(scope))
      throw new TypeError('Invalid find scope')
    if (!count.columns || selected.columns?.length === 0) return
    const selectedColumns =
      selected.columns && new Set(selected.columns.map(String))
    const acceptsColumn = (column: TableColumn, index: number) =>
      !selectedColumns ||
      selectedColumns.has(column.key ?? column.field ?? String(index)) ||
      selectedColumns.has(String(index))
    if (scope !== 'data') {
      const bounds =
        selected.bounds ??
        (scope === 'selection'
          ? options.selection()
          : {
              rowStart: 0,
              rowEnd: count.rows,
              colStart: 0,
              colEnd: count.columns,
            })
      if (!bounds) return
      if (
        ![bounds.rowStart, bounds.rowEnd, bounds.colStart, bounds.colEnd].every(
          (n) => Number.isSafeInteger(n) && n >= 0,
        ) ||
        bounds.rowStart > bounds.rowEnd ||
        bounds.colStart > bounds.colEnd ||
        bounds.rowEnd > count.rows ||
        bounds.colEnd > count.columns
      )
        throw new RangeError('Find bounds are outside the current view')
      if (
        bounds.rowStart === bounds.rowEnd ||
        bounds.colStart === bounds.colEnd
      )
        return
      const cellAt = options.cells(bounds)
      for (let row = bounds.rowStart; row < bounds.rowEnd; row++)
        for (let col = bounds.colStart; col < bounds.colEnd; col++)
          yield () => {
            const cell = cellAt(row, col)
            if (
              !cell ||
              !acceptsColumn(cell.context.column, cell.context.columnIndex)
            )
              return
            return {
              context: cell.context,
              isCurrent: current,
              locate: (valid, focus) =>
                options.locateView(row, col, valid, focus),
            }
          }
      return
    }
    if (selected.bounds)
      throw new TypeError(
        'Data scope uses supplied rows; bounds require view or selection scope',
      )
    function* rows(): Generator<() => TableDataScopeRow> {
      const source = props.virtualSource
      if (source) {
        const rowMethod = source.row
        for (let index = 0; index < source.rowCount; index++)
          yield () => {
            const flat = options.scope.sourceRow(index)
            return {
              row: flat.row,
              key: flat.key,
              index,
              ancestors: [],
              current: () =>
                current() && props.virtualSource?.row === rowMethod,
            }
          }
      } else {
        for (const target of options.scope.rows()) yield () => target
      }
    }
    for (const rowAt of rows()) {
      let target: TableDataScopeRow | undefined
      for (let position = 0; position < count.columns; position++)
        yield () => {
          const entry = options.columnAt(position)
          if (!entry || !acceptsColumn(entry.column, entry.index)) return
          target ??= rowAt()
          const row = target
          const context: TableEditContext = {
            row: row.row,
            rowKey: row.key,
            rowIndex: row.index,
            column: entry.column,
            columnIndex: entry.index,
            columnKey:
              entry.column.key ?? entry.column.field ?? String(entry.index),
            value: tableFieldValue(row.row, entry.column.field),
            depth: row.ancestors.length,
            get expanded() {
              return options.scope.rowState(row).expanded
            },
            get loading() {
              return options.scope.rowState(row).loading
            },
            toggleExpand: (expanded) => options.toggle(context, expanded),
          }
          return {
            context,
            isCurrent: () => current() && row.current(),
            locate: (valid, focus) =>
              options.locateData(row, entry.column, entry.index, valid, focus),
          }
        }
    }
  }
}
