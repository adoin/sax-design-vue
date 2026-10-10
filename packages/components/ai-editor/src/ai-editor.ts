import { buildProps, definePropType } from '@vuesax-alpha/utils'
import type { ExtractPropTypes } from 'vue'
import type AiEditor from './ai-editor.vue'

export type AiEditorFormat = 'bold' | 'italic' | 'underline' | 'strike' | 'code'
export type AiEditorStatus =
  'idle' | 'thinking' | 'researching' | 'streaming' | 'complete' | 'error'
export interface AiEditorMark {
  start: number
  end: number
  format: AiEditorFormat
}
export interface AiEditorSelection {
  start: number
  end: number
  text: string
}
export interface AiEditorSource {
  label: string
  href?: string
}
export interface AiEditorProgress {
  status?: 'thinking' | 'researching'
  label?: string
  sources?: AiEditorSource[]
}
export interface AiEditorResult {
  text: string
  sources?: AiEditorSource[]
}
export interface AiEditorRequest {
  prompt: string
  selection: AiEditorSelection
  document: string
  signal: AbortSignal
  report: (progress: AiEditorProgress) => void
}
export type AiEditorRequestHandler = (
  request: AiEditorRequest,
) =>
  | string
  | AiEditorResult
  | AsyncIterable<string>
  | Promise<string | AiEditorResult | AsyncIterable<string>>

export const aiEditorProps = buildProps({
  modelValue: { type: String, default: '' },
  marks: { type: definePropType<AiEditorMark[]>(Array), default: () => [] },
  title: String,
  label: String,
  placeholder: String,
  promptPlaceholder: String,
  aiIcon: String,
  request: { type: definePropType<AiEditorRequestHandler>(Function) },
  answer: String,
  disabled: Boolean,
  readonly: Boolean,
  formats: {
    type: definePropType<AiEditorFormat[]>(Array),
    default: () => ['bold', 'italic', 'underline', 'strike', 'code'],
  },
  animate: { type: Boolean, default: true },
  streamInterval: { type: Number, default: 18 },
} as const)

export const aiEditorEmits = {
  'update:modelValue': (text: string) => typeof text === 'string',
  'update:marks': (marks: AiEditorMark[]) => Array.isArray(marks),
  'selection-change': (selection: AiEditorSelection | null) =>
    selection === null || typeof selection.text === 'string',
  'format-change': (format: AiEditorFormat, marks: AiEditorMark[]) =>
    !!format && Array.isArray(marks),
  request: (request: AiEditorRequest) => typeof request.prompt === 'string',
  response: (result: AiEditorResult) => typeof result.text === 'string',
  error: (error: unknown) => error !== undefined,
  cancel: () => true,
  apply: (text: string, mode: 'replace' | 'insert') =>
    typeof text === 'string' && !!mode,
}
export type AiEditorProps = ExtractPropTypes<typeof aiEditorProps>
export type AiEditorInstance = InstanceType<typeof AiEditor>
