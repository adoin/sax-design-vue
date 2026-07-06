import type { InjectionKey } from 'vue'

export interface CollapseContext {
  accordion: boolean
  openHover: boolean
  toggleItem: (id: symbol, open: boolean) => void
  isItemOpen: (id: symbol) => boolean
}

export const collapseContextKey: InjectionKey<CollapseContext> =
  Symbol('VsCollapse')
