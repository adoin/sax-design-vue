import type { ComputedRef, InjectionKey } from 'vue'
import type { useTableColumnManager } from './composables/use-table-column-manager'

export interface TableColumnConfigRuntime {
  manager: ReturnType<typeof useTableColumnManager>
  disabled: ComputedRef<boolean>
}

export const tableColumnConfigRuntimeKey: InjectionKey<TableColumnConfigRuntime> =
  Symbol('tableColumnConfigRuntime')
