import type { ComputedRef, InjectionKey, Ref } from 'vue'
import type {
  MenuKey,
  MenuMode,
  MenuOption,
  MenuSubmenuMode,
  MenuTrigger,
} from './menu'

export interface MenuContext {
  current: ComputedRef<MenuKey | undefined>
  openKeys: ComputedRef<MenuKey[]>
  mode: ComputedRef<MenuMode>
  submenuMode: ComputedRef<MenuSubmenuMode>
  trigger: ComputedRef<MenuTrigger>
  collapse: Ref<boolean>
  selectableParents: Ref<boolean>
  teleported: Ref<boolean>
  showDelay: Ref<number>
  hideDelay: Ref<number>
  popupOffset: Ref<number>
  popupClass: Ref<string | undefined>
  select: (option: MenuOption) => void
  setOpen: (option: MenuOption, open: boolean) => void
}

export const menuContextKey: InjectionKey<MenuContext> = Symbol('menu-context')
