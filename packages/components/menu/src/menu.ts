import { buildProps, definePropType } from '@vuesax-alpha/utils'
import type { ExtractPropTypes } from 'vue'
import type Menu from './menu.vue'

export type MenuKey = string | number
export interface MenuOption {
  key: MenuKey
  label: string
  icon?: string
  disabled?: boolean
  children?: MenuOption[]
}

export const menuProps = buildProps({
  modelValue: { type: definePropType<MenuKey | undefined>([String, Number]) },
  options: { type: definePropType<MenuOption[]>(Array), default: () => [] },
  mode: {
    type: String,
    values: ['vertical', 'horizontal'] as const,
    default: 'vertical',
  },
  defaultOpeneds: { type: definePropType<MenuKey[]>(Array), default: () => [] },
  collapse: Boolean,
  uniqueOpen: Boolean,
  selectableParents: Boolean,
} as const)

export const menuEmits = {
  'update:modelValue': (value: MenuKey) => value !== null,
  select: (value: MenuKey, option: MenuOption) => value !== null && !!option,
  open: (value: MenuKey) => value !== null,
  close: (value: MenuKey) => value !== null,
}

export type MenuProps = ExtractPropTypes<typeof menuProps>
export type MenuInstance = InstanceType<typeof Menu>
