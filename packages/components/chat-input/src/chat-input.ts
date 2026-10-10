import { buildProps, definePropType } from '@vuesax-alpha/utils'
import { useShapeProp } from '@vuesax-alpha/hooks'
import type { ExtractPropTypes } from 'vue'
import type ChatInput from './chat-input.vue'
import type { AgentAttachment } from '../../ai-editor/src/agent-shared/types'

export const chatInputProps = buildProps({
  shape: useShapeProp,
  modelValue: { type: String, default: '' },
  attachments: {
    type: definePropType<AgentAttachment[]>(Array),
    default: () => [],
  },
  placeholder: String,
  label: String,
  disabled: Boolean,
  loading: Boolean,
  submitOnEnter: { type: Boolean, default: true },
  maxLength: Number,
} as const)
export const chatInputEmits = {
  'update:modelValue': (value: string) => typeof value === 'string',
  submit: (text: string, attachments: AgentAttachment[]) =>
    typeof text === 'string' && Array.isArray(attachments),
  stop: () => true,
  attach: () => true,
  'remove-attachment': (attachment: AgentAttachment) => !!attachment,
}
export type ChatInputProps = ExtractPropTypes<typeof chatInputProps>
export type ChatInputInstance = InstanceType<typeof ChatInput>
