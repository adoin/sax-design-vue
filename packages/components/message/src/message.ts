import { buildProps, definePropType } from '@vuesax-alpha/utils'
import type { ExtractPropTypes } from 'vue'
import type Message from './message.vue'

export const messageProps = buildProps({
  role: {
    type: definePropType<'user' | 'assistant' | 'system' | 'tool'>(String),
    default: 'assistant',
  },
  content: { type: String, default: '' },
  author: String,
  sentAt: String,
  datetime: String,
  showTime: Boolean,
  loading: Boolean,
  actions: { type: Boolean, default: undefined },
  feedback: {
    type: definePropType<'like' | 'dislike' | null>(String),
    default: null,
  },
  disabled: Boolean,
} as const)
export const messageEmits = {
  'update:showTime': (value: boolean) => typeof value === 'boolean',
  copy: () => true,
  'copy-error': (error: unknown) => error !== undefined,
  'update:feedback': (value: 'like' | 'dislike' | null) =>
    value === null || typeof value === 'string',
  regenerate: () => true,
}
export type MessageProps = ExtractPropTypes<typeof messageProps>
export type MessageInstance = InstanceType<typeof Message>
