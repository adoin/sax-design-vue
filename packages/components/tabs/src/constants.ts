import type { InjectionKey, Ref, VNode } from 'vue'

export interface TabPaneContext {
  uid: number
  label: string
  icon?: string
  disabled?: boolean
  vnode: VNode
}

export interface TabsContext {
  currentName: Ref<string | number>
  setCurrentName: (name: string | number) => void
  registerPane: (pane: TabPaneContext) => void
  unregisterPane: (uid: number) => void
}

export const tabsContextKey: InjectionKey<TabsContext> = Symbol('VsTabs')
