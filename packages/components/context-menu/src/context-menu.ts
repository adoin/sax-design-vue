import { buildProps, definePropType } from '@vuesax-alpha/utils'
import type { ExtractPropTypes } from 'vue'
import type ContextMenu from './context-menu.vue'

export interface ContextMenuItem {
  label?: string
  value?: string | number
  icon?: string
  disabled?: boolean
  divided?: boolean
  keepOpen?: boolean
}

export const contextMenuProps = buildProps({
  modelValue: Boolean,
  items: { type: definePropType<ContextMenuItem[]>(Array), default: () => [] },
  disabled: Boolean,
  minWidth: { type: Number, default: 184 },
} as const)

export const contextMenuEmits = {
  'update:modelValue': (value: boolean) => typeof value === 'boolean',
  select: (item: ContextMenuItem) => !!item,
  open: (event: MouseEvent) => !!event,
  close: () => true,
}

export type ContextMenuProps = ExtractPropTypes<typeof contextMenuProps>
export type ContextMenuInstance = InstanceType<typeof ContextMenu>
