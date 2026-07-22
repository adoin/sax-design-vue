<template>
  <div ref="rootRef" :class="[ns.b(), ns.is('disabled', disabled)]">
    <div
      :class="[ns.e('trigger'), ns.is('open', open)]"
      role="combobox"
      :tabindex="disabled ? -1 : 0"
      :aria-disabled="disabled"
      :aria-expanded="open"
      aria-haspopup="tree"
      @click="toggle"
      @keydown.enter.prevent="toggle"
      @keydown.space.prevent="toggle"
    >
      <span :class="[ns.e('value'), ns.is('placeholder', !selectedLabel)]">{{
        selectedLabel || placeholder
      }}</span>
      <button
        v-if="clearable && modelValue !== undefined"
        :class="ns.e('clear')"
        type="button"
        aria-label="Clear selection"
        @click.stop="clear"
      >
        <SIcon icon="close" icon-pack="material-icons" />
      </button>
      <SIcon v-else icon="arrow_drop_down" icon-pack="material-icons" />
    </div>
    <div v-if="open" :class="ns.e('panel')">
      <s-tree
        v-model="activeKey"
        :data="data"
        :node-key="nodeKey"
        :label="label"
        :children="children"
        :highlight-current="true"
        @node-click="selectNode"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { SIcon } from '@vuesax-alpha/components/icon'
import { useNamespace } from '@vuesax-alpha/hooks'
import { treeSelectEmits, treeSelectProps } from './tree-select'
import type { TreeKey, TreeNode } from '@vuesax-alpha/components/tree'

defineOptions({ name: 'STreeSelect' })

const props = defineProps(treeSelectProps)
const emit = defineEmits(treeSelectEmits)
const ns = useNamespace('tree-select')
const rootRef = ref<HTMLElement>()
const open = ref(false)
const activeKey = ref<TreeKey | undefined>()

const getKey = (node: TreeNode) =>
  (node[props.nodeKey] as TreeKey | undefined) ?? node.key
const getLabel = (node: TreeNode) =>
  String(node[props.label] ?? node.label ?? '')
const getChildren = (node: TreeNode) =>
  (node[props.children] as TreeNode[] | undefined) ?? node.children ?? []
const findNode = (
  nodes: TreeNode[],
  key: TreeKey | undefined,
): TreeNode | undefined => {
  if (key === undefined) return undefined
  for (const node of nodes) {
    if (getKey(node) === key) return node
    const found = findNode(getChildren(node), key)
    if (found) return found
  }
  return undefined
}
const selectedLabel = computed(() => {
  const node = findNode(props.data, props.modelValue)
  return node ? getLabel(node) : ''
})
const toggle = () => {
  if (props.disabled) return
  open.value = !open.value
}
const selectNode = (node: TreeNode) => {
  if (node.disabled) return
  if (getChildren(node).length && !props.checkStrictly) return
  const key = getKey(node)
  activeKey.value = key
  emit('update:modelValue', key)
  emit('change', key, node)
  open.value = false
}
const clear = () => {
  activeKey.value = undefined
  emit('update:modelValue', undefined)
  emit('clear')
}
const handlePointerDown = (event: PointerEvent) => {
  if (rootRef.value && !rootRef.value.contains(event.target as Node))
    open.value = false
}

watch(
  () => props.modelValue,
  (value) => {
    activeKey.value = value
  },
  { immediate: true },
)
onMounted(() => document.addEventListener('pointerdown', handlePointerDown))
onBeforeUnmount(() =>
  document.removeEventListener('pointerdown', handlePointerDown),
)
</script>
