import { buildProps, definePropType } from '@vuesax-alpha/utils'
import type { ExtractPropTypes } from 'vue'
import type AgentEditor from './ai-editor.vue'

export type AgentEditorFormat =
  'bold' | 'italic' | 'underline' | 'strike' | 'code'
export type AgentEditorStatus =
  'idle' | 'thinking' | 'researching' | 'streaming' | 'complete' | 'error'
export interface AgentEditorMark {
  start: number
  end: number
  format: AgentEditorFormat
}
export interface AgentEditorSelection {
  start: number
  end: number
  text: string
}
export interface AgentEditorSource {
  label: string
  href?: string
}
export interface AgentEditorProgress {
  status?: 'thinking' | 'researching'
  label?: string
  sources?: AgentEditorSource[]
}
export interface AgentEditorResult {
  text: string
  sources?: AgentEditorSource[]
}
export interface AgentEditorRequest {
  prompt: string
  selection: AgentEditorSelection
  document: string
  signal: AbortSignal
  report: (progress: AgentEditorProgress) => void
}
export type AgentEditorRequestHandler = (
  request: AgentEditorRequest,
) =>
  | string
  | AgentEditorResult
  | AsyncIterable<string>
  | Promise<string | AgentEditorResult | AsyncIterable<string>>

export const agentEditorProps = buildProps({
  modelValue: { type: String, default: '' },
  marks: { type: definePropType<AgentEditorMark[]>(Array), default: () => [] },
  title: String,
  label: String,
  placeholder: String,
  promptPlaceholder: String,
  agentIcon: String,
  request: { type: definePropType<AgentEditorRequestHandler>(Function) },
  answer: String,
  disabled: Boolean,
  readonly: Boolean,
  formats: {
    type: definePropType<AgentEditorFormat[]>(Array),
    default: () => ['bold', 'italic', 'underline', 'strike', 'code'],
  },
  animate: { type: Boolean, default: true },
  streamInterval: { type: Number, default: 18 },
} as const)

export const agentEditorEmits = {
  'update:modelValue': (text: string) => typeof text === 'string',
  'update:marks': (marks: AgentEditorMark[]) => Array.isArray(marks),
  'selection-change': (selection: AgentEditorSelection | null) =>
    selection === null || typeof selection.text === 'string',
  'format-change': (format: AgentEditorFormat, marks: AgentEditorMark[]) =>
    !!format && Array.isArray(marks),
  request: (request: AgentEditorRequest) => typeof request.prompt === 'string',
  response: (result: AgentEditorResult) => typeof result.text === 'string',
  error: (error: unknown) => error !== undefined,
  cancel: () => true,
  apply: (text: string, mode: 'replace' | 'insert') =>
    typeof text === 'string' && !!mode,
}
export type AgentEditorProps = ExtractPropTypes<typeof agentEditorProps>
export type AgentEditorInstance = InstanceType<typeof AgentEditor>
