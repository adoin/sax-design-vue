import { computed, nextTick, watch } from 'vue'
import { cloneDeep, isEqual } from 'lodash-unified'
import { tableFieldValue } from '../data-utils'
import { editableField } from '../edit-utils'
import type { ComputedRef } from 'vue'
import type {
  TableColumn,
  TableEditRecord,
  TableFlatRow,
  TableProps,
  TableRow,
  TableRowKey,
} from '../table'
import type {
  TableValidateOptions,
  TableValidationCell,
  TableValidationRule,
} from '../table-validation'
import type { TableEditing } from './use-table-edit'
import type { TableValidation } from './use-table-validation'
import type { useTableTree } from './use-table-tree'
import type { useTablePagination } from './use-table-pagination'

interface ValidationRow {
  row: TableRow
  key: TableRowKey
  index: number
  ancestors: TableRow[]
  current: () => boolean
}
interface ValidationApiOptions {
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
  ) => boolean
}

export function useTableValidationApi(
  props: TableProps,
  validation: TableValidation,
  editing: TableEditing,
  options: ValidationApiOptions,
) {
  const config = computed(() =>
    typeof props.validationConfig === 'object' ? props.validationConfig : {},
  )
  const rulesFor = (column: TableColumn): TableValidationRule[] => {
    const rules = column.rules ?? props.validationRules[column.field ?? '']
    return rules ? (Array.isArray(rules) ? rules : [rules]) : []
  }
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
  ): Generator<ValidationRow> {
    if (props.virtualSource) {
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
            typeof row === 'number'
              ? options.pagination.rows.value[row]?.row
              : row,
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
    ): Generator<ValidationRow> {
      for (const [offset, row] of items.entries()) {
        const rowIndex = index++
        const key = options.tree.getRowKey(row, rowIndex)
        const current = () =>
          parentCurrent() &&
          items[offset] === row &&
          options.tree.getRowKey(row, rowIndex) === key
        if (
          (!selectedRows || selectedRows.has(row)) &&
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
  const draftFor = (target: ValidationRow) => {
    const draft = editing.record()
    return draft?.rowKey === target.key
      ? draft.updatedRow
      : props.virtualSource
        ? options.sourceRow(target.index).row
        : target.row
  }
  let locating = false
  const locate = async (
    target: ValidationRow,
    column: TableColumn,
    index: number,
  ) => {
    if (!target.current()) return false
    locating = true
    try {
      for (const ancestor of target.ancestors)
        await options.tree.toggleRowExpand(ancestor, true)
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
        if (page !== pager.currentPage.value) return false
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
      options.scrollRow(props.virtualSource ? target.index : target.row)
      options.scrollColumn(currentIndex)
      await nextTick()
      await nextTick()
      return (
        target.current() &&
        options.focusCell(target.key, column.field!, currentIndex)
      )
    } finally {
      locating = false
    }
  }
  function* cells(
    selected: TableValidateOptions = {},
  ): Generator<TableValidationCell | undefined> {
    for (const target of rows(selected)) {
      const draftRow = draftFor(target)
      for (const { column, index } of columns(selected.columns)) {
        if (column.type || !editableField(column.field)) {
          yield undefined
          continue
        }
        const rules = rulesFor(column)
        const field = column.field!
        yield {
          row: target.row,
          rowKey: target.key,
          rowIndex: target.index,
          draftRow,
          column,
          columnIndex: index,
          field,
          rules,
          value: rules.length ? tableFieldValue(draftRow, field) : undefined,
          isCurrent: target.current,
          readValue: () => tableFieldValue(draftFor(target), field),
          locate: () => locate(target, column, index),
        }
      }
    }
  }
  const validate = (selected: TableValidateOptions = {}) =>
    validation.run(cells(selected), {
      ...selected,
      clear: !selected.rows && !selected.columns,
      maxErrors: selected.maxErrors ?? config.value.maxErrors,
      scrollToError:
        selected.scrollToError ?? config.value.scrollToError ?? true,
    })
  const validateRow = (
    row: TableRow | number,
    selected: TableValidateOptions = {},
  ) => validate({ ...selected, rows: [row] })
  const validateCell = (
    row: TableRow | number,
    column: TableColumn | string | number,
    selected: TableValidateOptions = {},
  ) => validate({ ...selected, rows: [row], columns: [column] })
  const validateEdit = (
    record: TableEditRecord,
  ): boolean | Promise<boolean> => {
    if (!props.validationConfig || config.value.onCommit === false) return true
    return validate({
      rows: [props.virtualSource ? record.rowIndex : record.row],
      columns:
        record.mode === 'cell'
          ? [props.virtualSource ? record.columnIndex : record.column]
          : undefined,
    }).then((result) => result.valid)
  }
  watch(
    [
      () => props.data,
      () => props.virtualSource?.row,
      () => props.rowKey,
      () => props.virtualSource?.rowKey,
    ],
    () => validation.clear(),
  )
  watch(
    () =>
      cloneDeep([
        props.validationRules,
        props.validationConfig,
        options.columns.value.map(({ key, field, rules }) => [
          key,
          field,
          rules,
        ]),
        props.virtualSource?.column,
      ]),
    (current, previous) => {
      if (!isEqual(current, previous)) validation.clear()
    },
  )
  const isDataCurrent = (record: { row: TableRow; rowIndex: number }) => {
    for (const target of rows({
      rows: [props.virtualSource ? record.rowIndex : record.row],
    }))
      if (target.current()) return true
    return false
  }
  return {
    validate,
    validateRow,
    validateCell,
    validateEdit,
    isDataCurrent,
    locating: () => locating,
  }
}
