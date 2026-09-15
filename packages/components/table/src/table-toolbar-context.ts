import type { ComputedRef, InjectionKey } from 'vue'
import type { TableExposes } from './table'
import type { TableQueryContext, TableToolbarConfig } from './table-business'

export interface TableToolbarRuntime {
  enabled: ComputedRef<boolean>
  config: ComputedRef<TableToolbarConfig>
  busy: ComputedRef<boolean>
  table: TableExposes
  context: () => TableQueryContext
  action: (code: string, event: MouseEvent) => void
}

export const tableToolbarRuntimeKey: InjectionKey<TableToolbarRuntime> = Symbol(
  'tableToolbarRuntime',
)
