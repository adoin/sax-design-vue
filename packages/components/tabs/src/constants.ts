import type { InjectionKey, Ref, VNode } from 'vue'

export type TabValue = string | number
export type TabsPosition = 'top' | 'bottom' | 'left' | 'right'
export type TabsType =
  'line' | 'pill' | 'card' | 'connected-card' | 'editable-card'
export type TabsOverflow = 'collapse' | 'scroll' | 'wrap'
export type TabsSize = 'small' | 'medium' | 'default' | 'large'
export const tabsRenderModes = ['all', 'lazy', 'active-only'] as const
export type TabsRenderMode = (typeof tabsRenderModes)[number]

export interface TabLabelExtraSlotParams {
  pane: TabPaneContext
  active: boolean
  value: TabValue
}

export interface TabPaneContext {
  uid: number
  name?: TabValue
  label: string
  icon?: string
  badge?: string | number
  disabled?: boolean
  closable?: boolean
  renderLabel?: () => VNode[]
  renderLabelExtra?: (scope: TabLabelExtraSlotParams) => VNode[]
}

export interface TabsContext {
  activeUid: Ref<number | undefined>
  animated: Ref<boolean>
  renderMode: Ref<TabsRenderMode>
  registerPane: (pane: TabPaneContext) => void
  updatePane: (uid: number, pane: Partial<TabPaneContext>) => void
  unregisterPane: (uid: number) => void
  tabId: (uid: number) => string
  panelId: (uid: number) => string
}

export const tabsContextKey: InjectionKey<TabsContext> = Symbol('STabs')
