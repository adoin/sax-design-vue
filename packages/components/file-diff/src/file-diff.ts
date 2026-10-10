import { buildProps, definePropType } from '@vuesax-alpha/utils'
import type { ExtractPropTypes } from 'vue'
import type FileDiff from './file-diff.vue'
import type { FileDiffLine } from '../../ai-editor/src/agent-shared/types'

export const fileDiffProps = buildProps({
  filename: { type: String, default: '' },
  lines: { type: definePropType<FileDiffLine[]>(Array), default: () => [] },
  expanded: { type: Boolean, default: true },
  disabled: Boolean,
} as const)
export const fileDiffEmits = {
  'update:expanded': (value: boolean) => typeof value === 'boolean',
  apply: () => true,
  reject: () => true,
}
export type FileDiffProps = ExtractPropTypes<typeof fileDiffProps>
export type FileDiffInstance = InstanceType<typeof FileDiff>
