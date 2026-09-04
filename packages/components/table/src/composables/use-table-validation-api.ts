import { computed, watch } from 'vue'
import { cloneDeep, isEqual } from 'lodash-unified'
import { tableFieldValue } from '../data-utils'
import { editableField } from '../edit-utils'
import { useTableDataScope } from './use-table-data-scope'
import type {
  TableColumn,
  TableEditRecord,
  TableProps,
  TableRow,
} from '../table'
import type {
  TableValidateOptions,
  TableValidationCell,
  TableValidationRule,
} from '../table-validation'
import type { TableEditing } from './use-table-edit'
import type { TableValidation } from './use-table-validation'
import type {
  TableDataScopeOptions,
  TableDataScopeRow,
} from './use-table-data-scope'

export function useTableValidationApi(
  props: TableProps,
  validation: TableValidation,
  editing: TableEditing,
  options: TableDataScopeOptions,
) {
  const config = computed(() =>
    typeof props.validationConfig === 'object' ? props.validationConfig : {},
  )
  const rulesFor = (column: TableColumn): TableValidationRule[] => {
    const rules = column.rules ?? props.validationRules[column.field ?? '']
    return rules ? (Array.isArray(rules) ? rules : [rules]) : []
  }
  const scope = useTableDataScope(props, options)
  const { rows, columns, locate } = scope
  const draftFor = (target: TableDataScopeRow) => {
    const draft = editing.record()
    return draft?.rowKey === target.key
      ? draft.updatedRow
      : props.virtualSource
        ? options.sourceRow(target.index).row
        : target.row
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
    scope,
    rulesFor,
    validate,
    validateRow,
    validateCell,
    validateEdit,
    isDataCurrent,
    locating: scope.locating,
  }
}
