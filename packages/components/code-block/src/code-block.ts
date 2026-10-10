import { buildProps } from '@vuesax-alpha/utils'
import type { ExtractPropTypes } from 'vue'
import type CodeBlock from './code-block.vue'

export const codeBlockProps = buildProps({
  code: { type: String, default: '' },
  filename: String,
  language: { type: String, default: 'text' },
  lineNumbers: { type: Boolean, default: true },
  expanded: { type: Boolean, default: true },
  download: { type: Boolean, default: true },
} as const)
export const codeBlockEmits = {
  'update:expanded': (value: boolean) => typeof value === 'boolean',
  copy: () => true,
  'copy-error': (error: unknown) => error !== undefined,
  download: () => true,
}
export type CodeBlockProps = ExtractPropTypes<typeof codeBlockProps>
export type CodeBlockInstance = InstanceType<typeof CodeBlock>
