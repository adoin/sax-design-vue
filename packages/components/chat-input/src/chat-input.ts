import { buildProps, definePropType } from '@vuesax-alpha/utils'
import type { ExtractPropTypes } from 'vue'
import type ChatInput from './chat-input.vue'
import type { AgentAttachment } from '../../ai-editor/src/agent-shared/types'

export interface ChatInputReasoningOption {
  value: string
  label: string
}
export interface ChatInputReasoningCapability {
  options: ChatInputReasoningOption[]
  default?: string
}
export interface ChatInputModelCapabilities {
  fast?: boolean
  reasoning?: ChatInputReasoningCapability
}
export interface ChatInputModelGroup {
  value: string
  label: string
  description?: string
}
export interface ChatInputModel {
  value: string
  label: string
  group?: ChatInputModelGroup
  capabilities?: ChatInputModelCapabilities
  /** @deprecated Use capabilities.fast. */
  supportsFast?: boolean
  /** @deprecated Use capabilities.reasoning.options. */
  reasoningEfforts?: ChatInputReasoningOption[]
  /** @deprecated Use capabilities.reasoning.default. */
  defaultReasoning?: string
  icon?: string
  disabled?: boolean
}
export type ChatInputTranscribe = (signal: AbortSignal) => Promise<string>

export const chatInputProps = buildProps({
  modelValue: { type: String, default: '' },
  model: String,
  fast: Boolean,
  reasoning: String,
  models: { type: definePropType<ChatInputModel[]>(Array), default: () => [] },
  accept: String,
  fileLimitSize: Number,
  filePicker: { type: Boolean, default: true },
  voiceInput: { type: Boolean, default: true },
  speechLanguage: String,
  transcribe: { type: definePropType<ChatInputTranscribe>(Function) },
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
  'update:attachments': (value: AgentAttachment[]) => Array.isArray(value),
  'update:fast': (value: boolean) => typeof value === 'boolean',
  'update:reasoning': (value: string) => typeof value === 'string',
  'update:model': (value: string) => typeof value === 'string',
  'files-selected': (files: File[]) => Array.isArray(files),
  'file-error': (error: unknown) => !!error,
  'voice-start': () => true,
  'voice-end': () => true,
  'voice-error': (error: unknown) => !!error,
  'update:modelValue': (value: string) => typeof value === 'string',
  submit: (text: string, attachments: AgentAttachment[]) =>
    typeof text === 'string' && Array.isArray(attachments),
  stop: () => true,
  attach: () => true,
  'remove-attachment': (attachment: AgentAttachment) => !!attachment,
}
export type ChatInputProps = ExtractPropTypes<typeof chatInputProps>
export type ChatInputInstance = InstanceType<typeof ChatInput>
