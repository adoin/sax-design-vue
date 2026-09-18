import type { InjectionKey, ShallowRef } from 'vue'
import type { TableFindController } from './composables/use-table-find'

export interface TableFindPanelApi {
  open: (replace?: boolean) => Promise<boolean>
  close: () => void
  keydown: (event: KeyboardEvent) => void
}

export interface TableFindRuntime {
  finder: TableFindController
  panel: ShallowRef<TableFindPanelApi | undefined>
}

export const tableFindRuntimeKey: InjectionKey<TableFindRuntime> =
  Symbol('tableFindRuntime')
