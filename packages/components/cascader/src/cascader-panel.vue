<template>
  <div :class="ns.e('panel')">
    <div v-if="searching" :class="ns.e('search-results')" role="listbox">
      <button
        v-for="(node, resultIndex) in searchResults"
        :key="pathKey(node.pathValues)"
        type="button"
        :class="[
          ns.e('search-option'),
          ns.is('active', resultIndex === searchActiveIndex),
          ns.is('selected', isSelected(node)),
          ns.is('disabled', node.disabled),
        ]"
        role="option"
        :disabled="node.disabled"
        :aria-selected="isSelected(node)"
        @click="emit('select', node)"
      >
        <slot name="search-result" :node="node" :path="node.pathOptions">
          <span
            v-for="(pathNode, index) in pathNodes(node)"
            :key="pathKey(pathNode.pathValues)"
            :class="ns.e('search-segment')"
          >
            <span v-if="index" :class="ns.e('separator')">{{ separator }}</span>
            <template
              v-for="(part, partIndex) in highlight(pathNode.label)"
              :key="partIndex"
            >
              <mark v-if="part.match" :class="ns.e('highlight')">{{
                part.text
              }}</mark>
              <template v-else>{{ part.text }}</template>
            </template>
          </span>
        </slot>
        <SIcon v-if="isSelected(node)" name="cb:checkmark" size="14" />
      </button>
      <div v-if="!searchResults.length" :class="ns.e('empty')" role="status">
        <slot name="empty">{{ emptyText }}</slot>
      </div>
    </div>

    <div v-else-if="menus.length" :class="ns.e('columns')">
      <ul
        v-for="(menu, level) in menus"
        :key="level"
        :class="ns.e('menu')"
        role="listbox"
        :aria-label="`Level ${level + 1}`"
      >
        <li v-for="node in menu" :key="pathKey(node.pathValues)">
          <button
            type="button"
            :class="[
              ns.e('option'),
              ns.is('active', isActive(node)),
              ns.is('selected', isSelected(node)),
              ns.is('disabled', node.disabled),
            ]"
            role="option"
            :disabled="node.disabled"
            :aria-selected="isSelected(node)"
            @mouseenter="handleMouseenter(node)"
            @click="handleClick(node)"
            @keydown.right.prevent="emit('expand', node)"
            @keydown.enter.prevent="emit('select', node)"
          >
            <span
              v-if="multiple"
              :class="[
                ns.e('checkbox'),
                ns.is('checked', isSelected(node)),
                ns.is('indeterminate', isIndeterminate(node)),
              ]"
              aria-hidden="true"
            >
              <SIcon
                v-if="isSelected(node) || isIndeterminate(node)"
                :name="isIndeterminate(node) ? 'cb:subtract' : 'cb:checkmark'"
                size="12"
              />
            </span>
            <span :class="ns.e('option-label')">
              <slot
                name="option"
                :option="node.option"
                :path="node.pathOptions"
                :selected="isSelected(node)"
                :active="isActive(node)"
                >{{ node.label }}</slot
              >
            </span>
            <IconLoading v-if="isLoading(node)" :class="ns.e('loading')" />
            <slot
              v-else-if="hasChildren(node)"
              name="expand-icon"
              :option="node.option"
            >
              <SIcon name="cb:chevron-right" size="15" />
            </slot>
          </button>
        </li>
      </ul>
    </div>
    <div v-else :class="ns.e('empty')" role="status">
      <slot name="empty">{{ emptyText }}</slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconLoading, SIcon } from '@vuesax-alpha/components/icon'
import { useNamespace } from '@vuesax-alpha/hooks'
import { pathKey, splitHighlightedText } from './cascader-utils'
import type { CascaderExpandTrigger } from './cascader'
import type { CascaderNode } from './cascader-utils'

defineOptions({ name: 'SCascaderPanel' })

const props = defineProps<{
  menus: CascaderNode[][]
  searchResults: CascaderNode[]
  searchValue: string
  searching: boolean
  searchActiveIndex: number
  multiple: boolean
  expandTrigger: CascaderExpandTrigger
  separator: string
  emptyText: string
  isActive: (node: CascaderNode) => boolean
  isSelected: (node: CascaderNode) => boolean
  isIndeterminate: (node: CascaderNode) => boolean
  isLoading: (node: CascaderNode) => boolean
  hasChildren: (node: CascaderNode) => boolean
}>()

const emit = defineEmits<{
  expand: [node: CascaderNode]
  select: [node: CascaderNode]
}>()

defineSlots<{
  option(props: {
    option: CascaderNode['option']
    path: CascaderNode['pathOptions']
    selected: boolean
    active: boolean
  }): unknown
  'search-result'(props: {
    node: CascaderNode
    path: CascaderNode['pathOptions']
  }): unknown
  'expand-icon'(props: { option: CascaderNode['option'] }): unknown
  empty(): unknown
}>()

const ns = useNamespace('cascader')
const highlight = (label: string) =>
  splitHighlightedText(label, props.searchValue)
const pathNodes = (node: CascaderNode) => {
  const result: CascaderNode[] = []
  let current = props.menus[0] || []
  for (const value of node.pathValues) {
    const found = current.find((item) => item.value === value)
    if (!found) break
    result.push(found)
    current = found.children
  }
  return result.length ? result : [node]
}
const handleMouseenter = (node: CascaderNode) => {
  if (props.expandTrigger === 'hover' && props.hasChildren(node))
    emit('expand', node)
}
const handleClick = (node: CascaderNode) => {
  if (props.hasChildren(node)) emit('expand', node)
  if (props.multiple || !props.hasChildren(node)) emit('select', node)
}
</script>
