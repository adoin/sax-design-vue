import type { ComputedRef, InjectionKey } from 'vue'
import type { TableExposes } from './table'
import type {
  TableQueryContext,
  TableSize,
  TableToolbarConfig,
} from './table-business'

export interface TableToolbarRuntime {
  enabled: ComputedRef<boolean>
  size: ComputedRef<TableSize>
  config: ComputedRef<TableToolbarConfig>
  busy: ComputedRef<boolean>
  table: TableExposes
  context: () => TableQueryContext
  action: (code: string, event: MouseEvent) => void
}

export const tableToolbarRuntimeKey: InjectionKey<TableToolbarRuntime> = Symbol(
  'tableToolbarRuntime',
)
