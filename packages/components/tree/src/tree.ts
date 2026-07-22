import { buildProps, definePropType } from '@vuesax-alpha/utils'
import type { ExtractPropTypes } from 'vue'
import type Tree from './tree.vue'

export type TreeKey = string | number
export interface TreeNode {
  key: TreeKey
  label: string
  children?: TreeNode[]
  disabled?: boolean
  [key: string]: unknown
}

export interface TreeVisibleNode {
  key: TreeKey
  node: TreeNode
  depth: number
  hasChildren: boolean
}

export const treeProps = buildProps({
  modelValue: { type: definePropType<TreeKey | undefined>([String, Number]) },
  data: { type: definePropType<TreeNode[]>(Array), default: () => [] },
  nodeKey: { type: String, default: 'key' },
  label: { type: String, default: 'label' },
  children: { type: String, default: 'children' },
  defaultExpandedKeys: {
    type: definePropType<TreeKey[]>(Array),
    default: () => [],
  },
  defaultCheckedKeys: {
    type: definePropType<TreeKey[]>(Array),
    default: () => [],
  },
  defaultExpandAll: Boolean,
  showCheckbox: Boolean,
  checkStrictly: Boolean,
  expandOnClickNode: { type: Boolean, default: true },
  highlightCurrent: { type: Boolean, default: true },
  indent: { type: Number, default: 18 },
  emptyText: { type: String, default: 'No data' },
} as const)

export const treeEmits = {
  'update:modelValue': (key: TreeKey | undefined) => key !== null,
  'update:checkedKeys': (keys: TreeKey[]) => Array.isArray(keys),
  nodeClick: (node: TreeNode) => !!node,
  nodeExpand: (node: TreeNode) => !!node,
  nodeCollapse: (node: TreeNode) => !!node,
  checkChange: (node: TreeNode, checked: boolean, keys: TreeKey[]) =>
    !!node && typeof checked === 'boolean' && Array.isArray(keys),
}

export type TreeProps = ExtractPropTypes<typeof treeProps>
export type TreeInstance = InstanceType<typeof Tree>
