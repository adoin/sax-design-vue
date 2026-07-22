import { UPDATE_MODEL_EVENT } from '@vuesax-alpha/constants'
import { buildProps } from '@vuesax-alpha/utils'
import type { ExtractPropTypes, PropType } from 'vue'
import type Drawer from './drawer.vue'

export const drawerPlacements = ['left', 'right', 'top', 'bottom'] as const
export type DrawerPlacement = (typeof drawerPlacements)[number]
export const drawerProps = buildProps({
  modelValue: Boolean,
  placement: {
    type: String as PropType<DrawerPlacement>,
    values: drawerPlacements,
    default: 'right',
  },
  size: {
    type: [String, Number] as unknown as PropType<string | number>,
    default: '360px',
  },
  title: String,
  showClose: { type: Boolean, default: true },
  maskClosable: { type: Boolean, default: true },
  teleported: { type: Boolean, default: true },
} as const)
export const drawerEmits = {
  [UPDATE_MODEL_EVENT]: (value: boolean) => typeof value === 'boolean',
  close: () => true,
  open: () => true,
}
export type DrawerProps = ExtractPropTypes<typeof drawerProps>
export type DrawerInstance = InstanceType<typeof Drawer>
