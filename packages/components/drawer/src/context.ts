import type { InjectionKey, Ref } from 'vue'
export interface DrawerContext {
  visible: Readonly<Ref<boolean>>
  setChild: (id: string, open: boolean) => void
}
export const drawerContextKey: InjectionKey<DrawerContext> = Symbol('drawer')
