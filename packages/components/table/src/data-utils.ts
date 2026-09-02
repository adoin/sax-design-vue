import type { TableColumn, TableOverflow, TableRow } from './table'

export const tableColumnKey = (column: TableColumn) =>
  column.field ?? column.key ?? column.type ?? 'column'

export const tableFieldValue = (row: TableRow, field?: string): unknown =>
  field
    ?.split('.')
    .reduce<unknown>(
      (value, key) =>
        value && typeof value === 'object'
          ? (value as Record<string, unknown>)[key]
          : undefined,
      row,
    )

export const tableOverflowMode = (value?: TableOverflow) =>
  value === true ? 'tooltip' : value || undefined
