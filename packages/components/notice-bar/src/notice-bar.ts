import { buildProps } from '@vuesax-alpha/utils'
import type { ExtractPropTypes, PropType } from 'vue'
import type NoticeBar from './notice-bar.vue'

export const noticeBarTypes = ['info', 'success', 'warning', 'danger'] as const
export type NoticeBarType = (typeof noticeBarTypes)[number]

export const noticeBarProps = buildProps({
  content: String,
  type: {
    type: String as PropType<NoticeBarType>,
    values: noticeBarTypes,
    default: 'info',
  },
  scrollable: { type: Boolean, default: true },
  closable: Boolean,
  duration: { type: Number, default: 12 },
} as const)

export const noticeBarEmits = {
  close: () => true,
  click: (event: MouseEvent) => event instanceof MouseEvent,
}
export type NoticeBarProps = ExtractPropTypes<typeof noticeBarProps>
export type NoticeBarInstance = InstanceType<typeof NoticeBar>
