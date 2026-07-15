import type { InjectionKey, Ref, VNode } from 'vue'

export interface TabPaneContext {
  uid: number
  label: string
  icon?: string
  disabled?: boolean
  vnode: VNode
}

export interface TabsContext {
  activeIndex: Ref<number>
  setActiveIndex: (index: number) => void
  registerPane: (pane: TabPaneContext) => number
  unregisterPane: (uid: number) => void
}

export const tabsContextKey: InjectionKey<TabsContext> = Symbol('STabs')
