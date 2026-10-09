import { UPDATE_MODEL_EVENT } from '@vuesax-alpha/constants'
import { buildProps, definePropType } from '@vuesax-alpha/utils'
import { useShapeProp } from '@vuesax-alpha/hooks'
import type { EmitFn } from '@vuesax-alpha/utils'
import type { CSSProperties, ExtractPropTypes, VNodeChild } from 'vue'
import type Drawer from './drawer.vue'

export const drawerPlacements = ['left', 'right', 'top', 'bottom'] as const
export type DrawerPlacement = (typeof drawerPlacements)[number]
export type DrawerDirection = 'ltr' | 'rtl' | 'ttb' | 'btt'
export type DrawerCloseReason = 'button' | 'mask' | 'escape' | 'api'
export type DrawerContent = string | VNodeChild | (() => VNodeChild)
export type DrawerBeforeCloseFn =
  | (() => Promise<void | boolean>)
  | ((done: (cancel?: boolean) => void, reason: DrawerCloseReason) => void)
export type DrawerContainer =
  string | HTMLElement | false | (() => HTMLElement | false)
export interface DrawerPushOptions {
  distance?: number | string
}
export interface DrawerResizeEvent {
  size: number
  placement: DrawerPlacement
  event: Event
}
export interface DrawerSlotScope {
  close: (reason?: DrawerCloseReason) => Promise<boolean>
  open: boolean
  closePending: boolean
  loading: boolean
  titleId: string
  titleClass: string
  placement: DrawerPlacement
  size: string | number
  resizing: boolean
}
export interface DrawerRegionClasses {
  mask?: string
  wrapper?: string
  header?: string
  body?: string
  footer?: string
}
export interface DrawerRegionStyles {
  mask?: CSSProperties
  wrapper?: CSSProperties
  header?: CSSProperties
  body?: CSSProperties
  footer?: CSSProperties
}
const boolAlias = { type: Boolean, default: undefined } as const
const lengthProp = { type: definePropType<string | number>([String, Number]) }
const styleProp = { type: definePropType<CSSProperties>(Object) }
const contentProp = {
  type: definePropType<DrawerContent>([
    String,
    Number,
    Object,
    Array,
    Function,
  ]),
}
export const drawerProps = buildProps({
  modelValue: Boolean,
  open: boolAlias,
  placement: { type: String, values: drawerPlacements, default: 'right' },
  direction: {
    type: definePropType<DrawerDirection>(String),
    values: ['ltr', 'rtl', 'ttb', 'btt'] as const,
  },
  size: { ...lengthProp, default: '360px' },
  width: lengthProp,
  height: lengthProp,
  title: contentProp,
  extra: contentProp,
  footer: contentProp,
  showClose: { type: Boolean, default: true },
  closable: boolAlias,
  closeIcon: contentProp,
  withHeader: { type: Boolean, default: true },
  mask: { type: Boolean, default: true },
  modal: boolAlias,
  modalPenetrable: Boolean,
  maskClosable: { type: Boolean, default: true },
  closeOnClickModal: boolAlias,
  keyboard: { type: Boolean, default: true },
  closeOnPressEscape: boolAlias,
  beforeClose: { type: definePropType<DrawerBeforeCloseFn>(Function) },
  teleported: { type: Boolean, default: true },
  appendToBody: boolAlias,
  appendTo: { type: definePropType<string | HTMLElement>([String, Object]) },
  getContainer: {
    type: definePropType<DrawerContainer>([String, Object, Boolean, Function]),
    default: undefined,
  },
  lockScroll: { type: Boolean, default: true },
  autoFocus: { type: Boolean, default: true },
  autofocus: boolAlias,
  trapFocus: boolAlias,
  restoreFocus: { type: Boolean, default: true },
  ariaLabel: String,
  resizeLabel: String,
  headerAriaLevel: { type: [String, Number], default: 2 },
  openDelay: { type: Number, default: 0 },
  closeDelay: { type: Number, default: 0 },
  destroyOnClose: Boolean,
  forceRender: Boolean,
  zIndex: Number,
  shape: useShapeProp,
  loading: Boolean,
  resizable: Boolean,
  minSize: { ...lengthProp, default: 120 },
  maxSize: lengthProp,
  resizeStep: { type: Number, default: 10 },
  push: {
    type: definePropType<boolean | DrawerPushOptions>([Boolean, Object]),
    default: true,
  },
  rootClassName: String,
  rootStyle: styleProp,
  contentWrapperStyle: styleProp,
  maskStyle: styleProp,
  headerStyle: styleProp,
  bodyStyle: styleProp,
  footerStyle: styleProp,
  modalClass: String,
  headerClass: String,
  bodyClass: String,
  footerClass: String,
  classNames: { type: definePropType<DrawerRegionClasses>(Object) },
  styles: { type: definePropType<DrawerRegionStyles>(Object) },
} as const)
export const drawerEmits = {
  [UPDATE_MODEL_EVENT]: (value: boolean) => typeof value === 'boolean',
  'update:open': (value: boolean) => typeof value === 'boolean',
  'update:size': (value: number) => Number.isFinite(value),
  'update:width': (value: number) => Number.isFinite(value),
  'update:height': (value: number) => Number.isFinite(value),
  // Preserve the original completion timing of open/close.
  open: () => true,
  close: () => true,
  opened: () => true,
  closed: () => true,
  beforeOpen: () => true,
  beforeClose: () => true,
  afterOpenChange: (value: boolean) => typeof value === 'boolean',
  closeRequest: (reason: DrawerCloseReason, event?: Event) =>
    ['button', 'mask', 'escape', 'api'].includes(reason) &&
    (!event || event instanceof Event),
  closeError: (...args: [unknown, DrawerCloseReason]) =>
    ['button', 'mask', 'escape', 'api'].includes(args[1]),
  openAutoFocus: (event: Event) => event instanceof Event,
  closeAutoFocus: (event: Event) => event instanceof Event,
  resizeStart: (info: DrawerResizeEvent) => Number.isFinite(info.size),
  resize: (info: DrawerResizeEvent) => Number.isFinite(info.size),
  resizeEnd: (info: DrawerResizeEvent) => Number.isFinite(info.size),
}
export type DrawerProps = ExtractPropTypes<typeof drawerProps>
export type DrawerEmitsFn = EmitFn<typeof drawerEmits>
export type DrawerInstance = InstanceType<typeof Drawer>
