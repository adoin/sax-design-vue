import { buildProps, definePropType } from '@vuesax-alpha/utils'
import { useColorProp, useShapeProp, useSizeProp } from '@vuesax-alpha/hooks'
import type { EmitFn } from '@vuesax-alpha/utils'
import type { ExtractPropTypes } from 'vue'
import type NoticeBar from './notice-bar.vue'

export const noticeBarTypes = [
  'info',
  'primary',
  'success',
  'warning',
  'warn',
  'danger',
] as const
export type NoticeBarType = (typeof noticeBarTypes)[number]
export type NoticeBarBeforeCloseFn = () => Promise<void>
export interface NoticeBarItem {
  id?: string | number
  content: string
  type?: NoticeBarType
  icon?: string | false
  href?: string
  target?: '_self' | '_blank'
  disabled?: boolean
}
export interface NoticeBarSlotScope {
  item: NoticeBarItem
  index: number
  count: number
  paused: boolean
  scrolling: boolean
  closePending: boolean
  close: () => Promise<boolean>
  next: () => void
  prev: () => void
}

export const noticeBarProps = buildProps({
  content: String,
  items: {
    type: definePropType<Array<string | NoticeBarItem>>(Array),
    default: () => [],
  },
  modelValue: { type: Boolean, default: undefined },
  activeIndex: { type: Number, default: undefined },
  type: {
    type: definePropType<NoticeBarType>(String),
    values: noticeBarTypes,
    default: 'info',
  },
  scrollable: { type: Boolean, default: true },
  closable: Boolean,
  beforeClose: {
    type: definePropType<NoticeBarBeforeCloseFn>(Function),
  },
  duration: { type: Number, default: 12 },
  speed: Number,
  delay: { type: Number, default: 1000 },
  gap: { type: Number, default: 32 },
  wrapable: Boolean,
  autoplay: { type: Boolean, default: true },
  interval: { type: Number, default: 3000 },
  loop: { type: Boolean, default: true },
  paused: Boolean,
  pauseOnHover: { type: Boolean, default: true },
  pauseOnFocus: { type: Boolean, default: true },
  reducedMotion: { type: Boolean, default: undefined },
  showNavigation: Boolean,
  showIndicator: Boolean,
  icon: {
    type: definePropType<string | false>([String, Boolean]),
    default: undefined,
  },
  href: String,
  target: {
    type: String,
    values: ['_self', '_blank'] as const,
    default: '_self',
  },
  clickable: Boolean,
  live: {
    type: String,
    values: ['off', 'polite', 'assertive'] as const,
    default: undefined,
  },
  color: useColorProp,
  textColor: useColorProp,
  shape: useShapeProp,
  size: useSizeProp,
  variant: {
    type: String,
    values: ['soft', 'solid', 'plain'] as const,
    default: 'soft',
  },
} as const)

export const noticeBarEmits = {
  close: () => true,
  closeError: (...args: [unknown]) => args.length === 1,
  click: (event: MouseEvent) => event instanceof MouseEvent,
  'update:modelValue': (value: boolean) => typeof value === 'boolean',
  'update:activeIndex': (value: number) => Number.isInteger(value),
  change: (...args: [number, NoticeBarItem]) => Number.isInteger(args[0]),
  closed: () => true,
  scrollEnd: () => true,
}
export type NoticeBarProps = ExtractPropTypes<typeof noticeBarProps>
export type NoticeBarEmitFn = EmitFn<typeof noticeBarEmits>
export type NoticeBarInstance = InstanceType<typeof NoticeBar>
