<template>
  <div :class="ns.b()" role="tree">
    <template v-if="visibleNodes.length">
      <div
        v-for="entry in visibleNodes"
        :key="String(getKey(entry.node))"
        :class="[
          ns.e('node'),
          ns.is('current', entry.key === currentKey),
          ns.is('disabled', entry.node.disabled),
        ]"
        :style="{ paddingLeft: `${entry.depth * indent + 8}px` }"
        role="treeitem"
        :aria-expanded="
          entry.hasChildren ? expandedKeys.has(entry.key) : undefined
        "
        :aria-selected="entry.key === currentKey"
        @click="handleNodeClick(entry)"
      >
        <button
          v-if="entry.hasChildren"
          :class="[
            ns.e('expand'),
            ns.is('expanded', expandedKeys.has(entry.key)),
          ]"
          type="button"
          :disabled="entry.node.disabled"
          :aria-label="
            expandedKeys.has(entry.key) ? 'Collapse node' : 'Expand node'
          "
          @click.stop="toggleExpand(entry)"
        >
          <SIcon icon="chevron_right" icon-pack="material-icons" />
        </button>
        <span v-else :class="ns.e('expand-placeholder')" />
        <button
          v-if="showCheckbox"
          :class="[
            ns.e('checkbox'),
            ns.is('checked', checkedKeys.has(entry.key)),
            ns.is('indeterminate', isIndeterminate(entry.node)),
          ]"
          type="button"
          role="checkbox"
          :aria-checked="checkedKeys.has(entry.key)"
          :disabled="entry.node.disabled"
          @click.stop="toggleCheck(entry.node)"
        >
          <SIcon
            v-if="checkedKeys.has(entry.key)"
            icon="check"
            icon-pack="material-icons"
          />
          <span v-else-if="isIndeterminate(entry.node)" />
        </button>
        <span :class="ns.e('label')">
          <slot name="node" :node="entry.node" :depth="entry.depth">
            {{ getLabel(entry.node) }}
          </slot>
        </span>
      </div>
    </template>
    <div v-else :class="ns.e('empty')">{{ emptyText }}</div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { SIcon } from '@vuesax-alpha/components/icon'
import { useNamespace } from '@vuesax-alpha/hooks'
import { treeEmits, treeProps } from './tree'
import type { TreeKey, TreeNode, TreeVisibleNode } from './tree'

defineOptions({ name: 'STree' })

const props = defineProps(treeProps)
const emit = defineEmits(treeEmits)
const ns = useNamespace('tree')
const currentKey = ref<TreeKey | undefined>()
const expandedKeys = ref(new Set<TreeKey>())
const checkedKeys = ref(new Set<TreeKey>())
let initialized = false

const getKey = (node: TreeNode): TreeKey =>
  (node[props.nodeKey] as TreeKey | undefined) ?? node.key
const getLabel = (node: TreeNode) =>
  String(node[props.label] ?? node.label ?? '')
const getChildren = (node: TreeNode): TreeNode[] =>
  (node[props.children] as TreeNode[] | undefined) ?? node.children ?? []
const getDescendants = (node: TreeNode): TreeNode[] => {
  const children = getChildren(node)
  return children.reduce<TreeNode[]>(
    (result, child) => result.concat(child, getDescendants(child)),
    [],
  )
}
const allKeys = (nodes: TreeNode[]) =>
  nodes.reduce<TreeKey[]>(
    (result, node) => result.concat(getKey(node), allKeys(getChildren(node))),
    [],
  )

const visibleNodes = computed<TreeVisibleNode[]>(() => {
  const result: TreeVisibleNode[] = []
  const walk = (nodes: TreeNode[], depth: number) => {
    nodes.forEach((node) => {
      const key = getKey(node)
      const hasChildren = getChildren(node).length > 0
      result.push({ key, node, depth, hasChildren })
      if (hasChildren && expandedKeys.value.has(key))
        walk(getChildren(node), depth + 1)
    })
  }
  walk(props.data, 0)
  return result
})

const setExpanded = (key: TreeKey, expanded: boolean) => {
  const next = new Set(expandedKeys.value)
  if (expanded) next.add(key)
  else next.delete(key)
  expandedKeys.value = next
}

const toggleExpand = (entry: TreeVisibleNode) => {
  const expanded = !expandedKeys.value.has(entry.key)
  setExpanded(entry.key, expanded)
  if (expanded) emit('nodeExpand', entry.node)
  else emit('nodeCollapse', entry.node)
}

const isIndeterminate = (node: TreeNode) => {
  if (props.checkStrictly) return false
  const keys = getDescendants(node).map(getKey)
  const checked = keys.filter((key) => checkedKeys.value.has(key)).length
  return checked > 0 && checked < keys.length
}

const syncParentChecks = (node: TreeNode, roots = props.data): boolean => {
  for (const parent of roots) {
    const children = getChildren(parent)
    if (children.includes(node)) {
      const childKeys = children.reduce<TreeKey[]>(
        (result, child) =>
          result.concat(getKey(child), getDescendants(child).map(getKey)),
        [],
      )
      const next = new Set(checkedKeys.value)
      if (childKeys.length && childKeys.every((key) => next.has(key)))
        next.add(getKey(parent))
      else next.delete(getKey(parent))
      checkedKeys.value = next
      return syncParentChecks(parent)
    }
    if (syncParentChecks(node, children)) return true
  }
  return false
}

const toggleCheck = (node: TreeNode) => {
  if (node.disabled) return
  const key = getKey(node)
  const next = new Set(checkedKeys.value)
  const checked = !next.has(key)
  const targetKeys = props.checkStrictly
    ? [key]
    : [key, ...getDescendants(node).map(getKey)]
  targetKeys.forEach((targetKey) =>
    checked ? next.add(targetKey) : next.delete(targetKey),
  )
  checkedKeys.value = next
  if (!props.checkStrictly) syncParentChecks(node)
  const keys = [...checkedKeys.value]
  emit('update:checkedKeys', keys)
  emit('checkChange', node, checked, keys)
}

const handleNodeClick = (entry: TreeVisibleNode) => {
  if (entry.node.disabled) return
  currentKey.value = entry.key
  emit('update:modelValue', entry.key)
  emit('nodeClick', entry.node)
  if (entry.hasChildren && props.expandOnClickNode) toggleExpand(entry)
}

watch(
  () => [
    props.data,
    props.defaultExpandedKeys,
    props.defaultCheckedKeys,
    props.defaultExpandAll,
  ],
  () => {
    if (!initialized) {
      expandedKeys.value = new Set(
        props.defaultExpandAll
          ? allKeys(props.data)
          : props.defaultExpandedKeys,
      )
      checkedKeys.value = new Set(props.defaultCheckedKeys)
      initialized = true
    }
  },
  { immediate: true, deep: true },
)

watch(
  () => props.modelValue,
  (key) => {
    currentKey.value = key
  },
  { immediate: true },
)
</script>
