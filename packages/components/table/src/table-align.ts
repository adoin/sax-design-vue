import { type ComputedRef, type InjectionKey, computed, inject } from 'vue'

export type TableAlign = 'left' | 'center' | 'right'
export const DEFAULT_TABLE_ALIGN: TableAlign = 'left'

export interface TableAlignContext {
  align?: TableAlign
  headerAlign?: TableAlign
}

export const tableAlignContextKey: InjectionKey<
  ComputedRef<TableAlignContext>
> = Symbol('tableAlign')

export const resolveTableCellAlign = (
  column: { align?: TableAlign },
  tableAlign?: TableAlign,
): TableAlign => column.align ?? tableAlign ?? DEFAULT_TABLE_ALIGN

export const resolveTableHeaderAlign = (
  column: { align?: TableAlign; headerAlign?: TableAlign },
  tableAlign?: TableAlign,
  tableHeaderAlign?: TableAlign,
): TableAlign =>
  column.headerAlign ??
  column.align ??
  tableHeaderAlign ??
  tableAlign ??
  DEFAULT_TABLE_ALIGN

export const resolveTableFooterAlign = (
  column: { align?: TableAlign; footerAlign?: TableAlign },
  tableAlign?: TableAlign,
): TableAlign =>
  column.footerAlign ?? column.align ?? tableAlign ?? DEFAULT_TABLE_ALIGN

export const useTableAlignContext = () =>
  inject(tableAlignContextKey) ??
  computed<TableAlignContext>(() => ({ align: DEFAULT_TABLE_ALIGN }))
