import { buildProps, definePropType } from '@vuesax-alpha/utils'
import type { ExtractPropTypes } from 'vue'
import type { TreeKey, TreeNode } from '@vuesax-alpha/components/tree'
import type TreeSelect from './tree-select.vue'

export const treeSelectProps = buildProps({
  modelValue: { type: definePropType<TreeKey | undefined>([String, Number]) },
  data: { type: definePropType<TreeNode[]>(Array), default: () => [] },
  nodeKey: { type: String, default: 'key' },
  label: { type: String, default: 'label' },
  children: { type: String, default: 'children' },
  placeholder: { type: String, default: 'Select' },
  clearable: Boolean,
  disabled: Boolean,
  checkStrictly: Boolean,
} as const)

export const treeSelectEmits = {
  'update:modelValue': (value: TreeKey | undefined) => value !== null,
  change: (value: TreeKey, node: TreeNode) => value !== null && !!node,
  clear: () => true,
}

export type TreeSelectProps = ExtractPropTypes<typeof treeSelectProps>
export type TreeSelectInstance = InstanceType<typeof TreeSelect>
