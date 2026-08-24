import { buildProps, definePropType } from '@vuesax-alpha/utils'

import type { ExtractPropTypes } from 'vue'
import type Menu from './menu.vue'

export type MenuKey = string | number
export type MenuMode = 'vertical' | 'horizontal'
export type MenuSubmenuMode = 'inline' | 'popup'
export type MenuTrigger = 'hover' | 'click'
export type MenuVariant = 'soft' | 'floating' | 'plain'
export type MenuOptionType = 'item' | 'group' | 'divider'

export interface MenuOption {
  key: MenuKey
  label: string
  icon?: string
  description?: string
  badge?: string | number
  disabled?: boolean
  href?: string
  target?: string
  type?: MenuOptionType
  children?: MenuOption[]
}

export interface MenuTreeIndex {
  ancestors: Map<MenuKey, MenuKey[]>
  descendants: Map<MenuKey, MenuKey[]>
  siblings: Map<MenuKey, MenuKey[]>
}

export const createMenuTreeIndex = (options: MenuOption[]): MenuTreeIndex => {
  const ancestors = new Map<MenuKey, MenuKey[]>()
  const descendants = new Map<MenuKey, MenuKey[]>()
  const siblings = new Map<MenuKey, MenuKey[]>()

  const visit = (items: MenuOption[], path: MenuKey[]) => {
    const siblingKeys = items
      .filter((item) => item.type !== 'divider')
      .map((item) => item.key)

    items.forEach((item) => {
      ancestors.set(item.key, path)
      siblings.set(item.key, siblingKeys)
      if (item.children?.length) visit(item.children, [...path, item.key])
    })
  }

  visit(options, [])

  ancestors.forEach((path, key) => {
    path.forEach((ancestor) => {
      descendants.set(ancestor, [...(descendants.get(ancestor) ?? []), key])
    })
  })

  return { ancestors, descendants, siblings }
}

export const menuProps = buildProps({
  modelValue: { type: definePropType<MenuKey | undefined>([String, Number]) },
  options: { type: definePropType<MenuOption[]>(Array), default: () => [] },
  mode: {
    type: String,
    values: ['vertical', 'horizontal'] as const,
    default: 'vertical',
  },
  submenuMode: {
    type: String,
    values: ['inline', 'popup'] as const,
  },
  trigger: {
    type: String,
    values: ['hover', 'click'] as const,
  },
  variant: {
    type: String,
    values: ['soft', 'floating', 'plain'] as const,
    default: 'soft',
  },
  openKeys: { type: definePropType<MenuKey[] | undefined>(Array) },
  defaultOpeneds: { type: definePropType<MenuKey[]>(Array), default: () => [] },
  collapse: Boolean,
  uniqueOpen: Boolean,
  selectableParents: Boolean,
  closeOnSelect: { type: Boolean, default: true },
  teleported: { type: Boolean, default: true },
  showDelay: { type: Number, default: 120 },
  hideDelay: { type: Number, default: 180 },
  popupOffset: { type: Number, default: 8 },
  popupClass: String,
} as const)

export const menuEmits = {
  'update:modelValue': (value: MenuKey) => value !== null,
  'update:openKeys': (value: MenuKey[]) => Array.isArray(value),
  select: (value: MenuKey, option: MenuOption) => value !== null && !!option,
  open: (value: MenuKey) => value !== null,
  close: (value: MenuKey) => value !== null,
}

export type MenuProps = ExtractPropTypes<typeof menuProps>
export type MenuInstance = InstanceType<typeof Menu>
