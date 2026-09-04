import { nextTick, toRaw } from 'vue'
import type { ComputedRef } from 'vue'
import type {
  TableColumn,
  TableFlatRow,
  TableProps,
  TableRow,
  TableRowKey,
} from '../table'
import type { TableValidateOptions } from '../table-validation'
import type { useTableTree } from './use-table-tree'
import type { useTablePagination } from './use-table-pagination'

export interface TableDataScopeRow {
  row: TableRow
  key: TableRowKey
  index: number
  ancestors: TableRow[]
  current: () => boolean
}
export interface TableDataScopeOptions {
  tree: ReturnType<typeof useTableTree<TableRow>>
  pagination: ReturnType<typeof useTablePagination>
  columns: ComputedRef<TableColumn[]>
  visibleColumns: ComputedRef<TableColumn[]>
  sourceRow: (index: number) => TableFlatRow
  sourceColumn: (index: number) => TableColumn
  sourceColumnHidden: (index: number) => boolean
  scrollRow: (row: TableRow | number) => void
  scrollColumn: (index: number) => void
  focusCell: (
    rowKey: TableRowKey,
    field: string,
    columnIndex: number,
    focus?: boolean,
  ) => boolean
  revealRow?: (
    target: TableDataScopeRow,
    current: () => boolean,
  ) => Promise<boolean>
}

/** Shared supplied-data traversal and navigation for validation and search. */
export function useTableDataScope(
  props: TableProps,
  options: TableDataScopeOptions,
) {
  const columnIndex = (column: TableColumn) =>
    options.visibleColumns.value.findIndex(
      (item) =>
        item === column ||
        (column.key
          ? item.key === column.key
          : Boolean(column.field && item.field === column.field)),
    )
  function* columns(
    selected?: TableValidateOptions['columns'],
  ): Generator<{ column: TableColumn; index: number }> {
    if (props.virtualSource) {
      const count = props.virtualSource.columnCount
      if (selected) {
        for (const index of new Set(selected))
          if (
            typeof index === 'number' &&
            Number.isInteger(index) &&
            index >= 0 &&
            index < count
          )
            yield { column: options.sourceColumn(index), index }
      } else {
        for (let index = 0; index < count; index++)
          yield { column: options.sourceColumn(index), index }
      }
    } else {
      const targets = selected
        ? selected
            .map((item) =>
              typeof item === 'number'
                ? options.visibleColumns.value[item]
                : typeof item === 'string'
                  ? options.columns.value.find(
                      (column) => column.key === item || column.field === item,
                    )
                  : item,
            )
            .filter((item): item is TableColumn => Boolean(item))
        : options.columns.value
      for (const column of new Set(targets))
        yield { column, index: columnIndex(column) }
    }
  }
  function* rows(
    selected: TableValidateOptions = {},
  ): Generator<TableDataScopeRow> {
    const selectedKeys = selected.rowKeys
      ? new Set(selected.rowKeys)
      : undefined
    if (props.virtualSource) {
      if (selectedKeys && !selected.rows)
        throw new TypeError(
          'Generated validation with rowKeys also requires numeric rows.',
        )
      const source = props.virtualSource
      const rowMethod = source.row
      const count = source.rowCount
      const start =
        selected.scope === 'view' ? options.pagination.sourceOffset.value : 0
      const end =
        selected.scope === 'view'
          ? start + options.pagination.sourceCount.value
          : count
      const indices = function* () {
        if (selected.rows) {
          for (const index of new Set(selected.rows))
            if (typeof index === 'number') yield index
        } else for (let index = start; index < end; index++) yield index
      }
      for (const index of indices()) {
        if (!Number.isInteger(index) || index < 0 || index >= count) continue
        const flat = options.sourceRow(index)
        if (selectedKeys && !selectedKeys.has(flat.key)) continue
        yield {
          row: flat.row,
          key: flat.key,
          index,
          ancestors: [],
          current: () =>
            props.virtualSource?.row === rowMethod &&
            index < props.virtualSource.rowCount,
        }
      }
      return
    }
    const selectedRows = selected.rows
      ? new Set(
          selected.rows.map((row) =>
            toRaw(
              typeof row === 'number'
                ? options.pagination.rows.value[row]?.row
                : row,
            ),
          ),
        )
      : undefined
    const viewRows =
      selected.scope === 'view'
        ? new Set(options.pagination.rows.value.map((flat) => flat.row))
        : undefined
    let index = 0
    function* walk(
      items: TableRow[],
      ancestors: TableRow[],
      parentCurrent: () => boolean,
    ): Generator<TableDataScopeRow> {
      for (const [offset, row] of items.entries()) {
        const rowIndex = index++
        const key = options.tree.getRowKey(row, rowIndex)
        const current = () =>
          parentCurrent() &&
          items[offset] === row &&
          options.tree.getRowKey(row, rowIndex) === key
        if (
          (!selectedRows || selectedRows.has(toRaw(row))) &&
          (!selectedKeys || selectedKeys.has(key)) &&
          (!viewRows || viewRows.has(row))
        )
          yield { row, key, index: rowIndex, ancestors, current }
        const children = options.tree.getChildren(row, key)
        if (children.length)
          yield* walk(
            children,
            [...ancestors, row],
            () => current() && options.tree.getChildren(row, key) === children,
          )
      }
    }
    const data = props.data
    yield* walk(data, [], () => props.data === data)
  }
  let locating = 0
  const locate = async (
    target: TableDataScopeRow,
    column: TableColumn,
    index: number,
    navigation: { current?: () => boolean; focus?: boolean } = {},
  ) => {
    const current = () => target.current() && navigation.current?.() !== false
    if (!current()) return false
    locating++
    try {
      for (const ancestor of target.ancestors) {
        if (!current()) return false
        await options.tree.toggleRowExpand(ancestor, true)
      }
      if (!current()) return false
      const pager = options.pagination
      if (pager.enabled.value && !pager.remote.value) {
        let rootIndex = target.index
        if (!props.virtualSource) {
          const root = target.ancestors[0] ?? target.row
          rootIndex = -1
          let offset = 0
          for (const flat of options.tree.flatRows.value) {
            if (flat.depth) continue
            if (flat.row === root) {
              rootIndex = offset
              break
            }
            offset++
          }
        }
        if (rootIndex < 0) return false
        const page = Math.floor(rootIndex / pager.pageSize.value) + 1
        if (page !== pager.currentPage.value) {
          pager.changePage(page)
          await nextTick()
        }
        if (!current() || page !== pager.currentPage.value) return false
      }
      if (
        !props.virtualSource &&
        !pager.rows.value.some((flat) => flat.row === target.row)
      )
        return false
      const currentIndex = props.virtualSource ? index : columnIndex(column)
      if (
        currentIndex < 0 ||
        (props.virtualSource && options.sourceColumnHidden(currentIndex))
      )
        return false
      if (options.revealRow && !(await options.revealRow(target, current)))
        return false
      if (!current()) return false
      options.scrollRow(props.virtualSource ? target.index : target.row)
      options.scrollColumn(currentIndex)
      await nextTick()
      await nextTick()
      return (
        current() &&
        options.focusCell(
          target.key,
          column.field!,
          currentIndex,
          navigation.focus !== false,
        )
      )
    } finally {
      locating--
    }
  }
  return {
    rows,
    columns,
    columnIndex,
    locate,
    sourceRow: options.sourceRow,
    locating: () => locating > 0,
    rowState: (target: TableDataScopeRow) =>
      props.virtualSource
        ? { expanded: false, loading: false }
        : options.tree.getRowState(target.row, target.key),
  }
}
export type TableDataScope = ReturnType<typeof useTableDataScope>
