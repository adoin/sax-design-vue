<template>
  <SPopper
    ref="popperRef"
    :visible="mergedOpen"
    trigger="click"
    :placement="popupConfig.placement ?? placement"
    :teleported="popupConfig.transfer ?? teleported"
    :append-to="popupConfig.appendTo"
    :offset="popupConfig.offset ?? 6"
    :fit="popupMatchesTrigger"
    :disabled="disabled"
    :popper-class="popperClass"
    :popper-style="[popupStyle, dropdownStyle, popupConfig.style]"
    :z-index="popupConfig.zIndex"
    :show-arrow="false"
    persistent
    @update:visible="setOpen"
  >
    <div
      ref="triggerRef"
      :class="[
        ns.b(),
        ns.is('disabled', disabled),
        ns.is('open', mergedOpen),
        ns.is('multiple', multiple),
        ns.is('block', block),
      ]"
      role="combobox"
      :tabindex="disabled || showSearchEnabled ? -1 : 0"
      :aria-disabled="disabled"
      :aria-expanded="mergedOpen"
      aria-haspopup="listbox"
      @keydown="handleTriggerKeydown"
      @focus="handleFocus"
      @blur="handleBlur"
    >
      <div :class="ns.e('selection')">
        <template v-if="multiple && !searchText">
          <span
            v-for="item in visibleTags"
            :key="pathKey(item.node.pathValues)"
            :class="ns.e('tag')"
          >
            <slot
              name="tag-render"
              :option="item.node.option"
              :path="item.node.pathOptions"
              :label="item.label"
            >
              <span :class="ns.e('tag-label')">{{ item.label }}</span>
              <button
                type="button"
                :class="ns.e('tag-remove')"
                :aria-label="t('vs.common.close')"
                :disabled="disabled"
                @click.stop="removeTag(item.node)"
              >
                <SIcon name="cb:close" size="12" />
              </button>
            </slot>
          </span>
          <span
            v-if="omittedTags.length"
            :class="[ns.e('tag'), ns.em('tag', 'more')]"
          >
            <slot
              name="max-tag-placeholder"
              :omitted-values="omittedTags.map((item) => item.node.pathValues)"
            >
              {{ overflowLabel }}
            </slot>
          </span>
        </template>

        <span
          v-if="!multiple && !searchText && singleDisplayLabel"
          :class="ns.e('value')"
        >
          <slot
            name="display-render"
            :labels="singleLabels"
            :selected-options="singleSelectedOptions"
          >
            {{ singleDisplayLabel }}
          </slot>
        </span>

        <input
          v-if="showSearchEnabled"
          ref="inputRef"
          :value="searchText"
          :class="ns.e('search-input')"
          type="text"
          autocomplete="off"
          :disabled="disabled"
          :placeholder="showPlaceholder ? resolvedPlaceholder : ''"
          :aria-label="resolvedPlaceholder"
          @input="handleSearchInput"
          @focus="handleFocus"
          @blur="handleBlur"
          @keydown="handleTriggerKeydown"
        />
        <span
          v-else-if="showPlaceholder"
          :class="[ns.e('value'), ns.is('placeholder')]"
        >
          {{ resolvedPlaceholder }}
        </span>
      </div>

      <button
        v-if="showClear"
        :class="ns.e('clear')"
        type="button"
        :aria-label="t('vs.cascader.clear')"
        @click.stop="clear"
      >
        <slot name="clear-icon"><SIcon name="cb:close" size="14" /></slot>
      </button>
      <span v-else :class="ns.e('suffix')" aria-hidden="true">
        <slot name="suffix-icon">
          <IconLoading v-if="loading" :class="ns.e('loading')" />
          <SIcon
            v-else
            :class="ns.is('rotated', mergedOpen)"
            name="cb:chevron-down"
            size="15"
          />
        </slot>
      </span>

      <div ref="measureRef" :class="ns.e('tag-measure')" aria-hidden="true">
        <span
          v-for="item in tagItems"
          :key="pathKey(item.node.pathValues)"
          data-cascader-measure-tag
          :class="ns.e('tag')"
        >
          <span :class="ns.e('tag-label')">{{ item.label }}</span>
          <SIcon name="cb:close" size="12" />
        </span>
        <span
          data-cascader-measure-overflow
          :class="[ns.e('tag'), ns.em('tag', 'more')]"
          >+{{ tagItems.length }}</span
        >
      </div>
    </div>

    <template #content>
      <div v-if="$slots.header" :class="ns.e('header')">
        <slot name="header" />
      </div>
      <CascaderPanel
        :menus="menus"
        :search-results="searchResults"
        :search-value="searchText"
        :searching="Boolean(showSearchEnabled && searchText)"
        :search-active-index="searchActiveIndex"
        :multiple="multiple"
        :expand-trigger="expandTrigger"
        :separator="separator"
        :empty-text="emptyText"
        :is-active="isActive"
        :is-selected="isNodeSelected"
        :is-indeterminate="isNodeIndeterminate"
        :is-loading="isNodeLoading"
        :has-children="hasChildren"
        @expand="expandNode"
        @select="selectNode"
      >
        <template v-if="$slots.option" #option="slotProps">
          <slot name="option" v-bind="slotProps" />
        </template>
        <template v-if="$slots.searchResult" #search-result="slotProps">
          <slot name="searchResult" v-bind="slotProps" />
        </template>
        <template v-if="$slots.expandIcon" #expand-icon="slotProps">
          <slot name="expandIcon" v-bind="slotProps" />
        </template>
        <template v-if="$slots.empty" #empty><slot name="empty" /></template>
      </CascaderPanel>
      <div v-if="$slots.footer" :class="ns.e('footer')">
        <slot name="footer" />
      </div>
    </template>
  </SPopper>
</template>

<script setup lang="ts">
import { computed, nextTick, shallowRef, useTemplateRef, watch } from 'vue'
import { useResizeObserver } from '@vueuse/core'
import { IconLoading, SIcon } from '@vuesax-alpha/components/icon'
import SPopper from '@vuesax-alpha/components/popper'
import { useLocale, useNamespace } from '@vuesax-alpha/hooks'
import CascaderPanel from './cascader-panel.vue'
import { SHOW_PARENT, cascaderEmits, cascaderProps } from './cascader'
import {
  calculateVisibleTagCount,
  findCascaderNode,
  flattenCascaderNodes,
  normalizeCascaderNodes,
  pathKey,
  resolveFieldNames,
  samePath,
  selectableLeafNodes,
} from './cascader-utils'
import type { PopperInstance } from '@vuesax-alpha/components/popper'
import type {
  CascaderModelValue,
  CascaderOption,
  CascaderPathValue,
} from './cascader'
import type { CascaderNode } from './cascader-utils'
import type { CSSProperties } from 'vue'

defineOptions({ name: 'SCascader', inheritAttrs: false })

const props = defineProps(cascaderProps)
const emit = defineEmits(cascaderEmits)
const ns = useNamespace('cascader')
const { t } = useLocale()
const triggerRef = useTemplateRef<HTMLElement>('triggerRef')
const inputRef = useTemplateRef<HTMLInputElement>('inputRef')
const measureRef = useTemplateRef<HTMLElement>('measureRef')
const popperRef = useTemplateRef<PopperInstance>('popperRef')

const internalOpen = shallowRef(props.defaultOpen)
const internalSearch = shallowRef('')
const activePath = shallowRef<CascaderPathValue>([])
const loadingKeys = shallowRef(new Set<string>())
const responsiveTagCount = shallowRef(0)
const popupWidth = shallowRef<number>()
const searchActiveIndex = shallowRef(0)

const fields = computed(() => resolveFieldNames(props.fieldNames))
const nodes = computed(() =>
  normalizeCascaderNodes(props.options, fields.value),
)
const flatNodes = computed(() => flattenCascaderNodes(nodes.value))
const showSearchEnabled = computed(
  () => Boolean(props.showSearch) && !props.loadData,
)
const searchConfig = computed(() =>
  typeof props.showSearch === 'object' ? props.showSearch : {},
)
const searchText = computed(() => props.searchValue ?? internalSearch.value)
const mergedOpen = computed(() => props.open ?? internalOpen.value)
const popupConfig = computed(() => props.popupConfig)
const popperClass = computed(() =>
  [ns.e('content'), props.popupClassName, popupConfig.value.className]
    .filter(Boolean)
    .join(' '),
)
const popupMatchesTrigger = computed(
  () =>
    popupConfig.value.full ||
    popupConfig.value.width === 'full' ||
    popupConfig.value.matchTriggerWidth ||
    searchConfig.value.matchInputWidth,
)
const toCssSize = (value: number | string | undefined) =>
  typeof value === 'number' ? `${value}px` : value
const popupStyle = computed<CSSProperties>(() => ({
  width: popupMatchesTrigger.value
    ? toCssSize(popupWidth.value)
    : toCssSize(
        popupConfig.value.width === 'full'
          ? undefined
          : popupConfig.value.width,
      ),
  minWidth: toCssSize(popupConfig.value.minWidth ?? popupWidth.value),
  maxWidth: toCssSize(popupConfig.value.maxWidth),
  maxHeight: toCssSize(popupConfig.value.maxHeight),
}))

const singleValue = computed<CascaderPathValue>(() =>
  props.multiple ? [] : (props.modelValue as CascaderPathValue),
)
const multipleValue = computed<CascaderPathValue[]>(() =>
  props.multiple ? (props.modelValue as CascaderPathValue[]) : [],
)
const selectedLeafNodes = computed(() => {
  const byKey = new Map<string, CascaderNode>()
  for (const path of multipleValue.value) {
    const node = findCascaderNode(nodes.value, path)
    if (!node) continue
    for (const leaf of selectableLeafNodes(node))
      byKey.set(pathKey(leaf.pathValues), leaf)
  }
  return [...byKey.values()]
})
const selectedLeafKeySet = computed(
  () =>
    new Set(selectedLeafNodes.value.map((node) => pathKey(node.pathValues))),
)

const isNodeSelected = (node: CascaderNode) => {
  if (!props.multiple) return samePath(singleValue.value, node.pathValues)
  const leaves = selectableLeafNodes(node)
  return (
    leaves.length > 0 &&
    leaves.every((leaf) =>
      selectedLeafKeySet.value.has(pathKey(leaf.pathValues)),
    )
  )
}
const isNodeIndeterminate = (node: CascaderNode) => {
  if (!props.multiple) return false
  const leaves = selectableLeafNodes(node)
  const selectedCount = leaves.filter((leaf) =>
    selectedLeafKeySet.value.has(pathKey(leaf.pathValues)),
  ).length
  return selectedCount > 0 && selectedCount < leaves.length
}
const isActive = (node: CascaderNode) =>
  activePath.value[node.level] === node.value
const isNodeLoading = (node: CascaderNode) =>
  loadingKeys.value.has(pathKey(node.pathValues)) ||
  Boolean(node.option.loading)
const hasChildren = (node: CascaderNode) =>
  node.children.length > 0 || (!node.isLeaf && Boolean(props.loadData))

const selectedSingleNode = computed(() =>
  findCascaderNode(nodes.value, singleValue.value),
)
const singleLabels = computed(() => {
  const labels: string[] = []
  let current = nodes.value
  for (const value of singleValue.value) {
    const found = current.find((node) => node.value === value)
    if (!found) break
    labels.push(found.label)
    current = found.children
  }
  return labels
})
const singleSelectedOptions = computed(
  () => selectedSingleNode.value?.pathOptions ?? [],
)
const singleDisplayLabel = computed(() =>
  props.displayRender
    ? props.displayRender(singleLabels.value, singleSelectedOptions.value)
    : singleLabels.value.join(props.separator),
)

const compressedNodes = computed(() => {
  if (props.showCheckedStrategy !== SHOW_PARENT) return selectedLeafNodes.value
  const result: CascaderNode[] = []
  const visit = (node: CascaderNode) => {
    const leaves = selectableLeafNodes(node)
    if (
      leaves.length &&
      leaves.every((leaf) =>
        selectedLeafKeySet.value.has(pathKey(leaf.pathValues)),
      )
    ) {
      result.push(node)
      return
    }
    node.children.forEach(visit)
  }
  nodes.value.forEach(visit)
  return result
})
const getNodeLabel = (node: CascaderNode) => {
  const labels: string[] = []
  let current = nodes.value
  for (const value of node.pathValues) {
    const found = current.find((item) => item.value === value)
    if (!found) break
    labels.push(found.label)
    current = found.children
  }
  return props.displayRender
    ? props.displayRender(labels, node.pathOptions)
    : labels.join(props.separator)
}
const tagItems = computed(() =>
  compressedNodes.value.map((node) => ({ node, label: getNodeLabel(node) })),
)
const visibleTagLimit = computed(() => {
  if (typeof props.maxTagCount === 'number')
    return Math.max(0, props.maxTagCount)
  return responsiveTagCount.value
})
const visibleTags = computed(() =>
  tagItems.value.slice(0, visibleTagLimit.value),
)
const omittedTags = computed(() => tagItems.value.slice(visibleTagLimit.value))
const overflowLabel = computed(() =>
  props.maxTagPlaceholder
    ? props.maxTagPlaceholder(
        omittedTags.value.map((item) => item.node.pathValues),
      )
    : `+${omittedTags.value.length}`,
)

const selectedCount = computed(() =>
  props.multiple
    ? multipleValue.value.length
    : singleValue.value.length
      ? 1
      : 0,
)
const resolvedPlaceholder = computed(
  () => props.placeholder || t('vs.cascader.placeholder'),
)
const showPlaceholder = computed(
  () => selectedCount.value === 0 && !searchText.value,
)
const showClear = computed(
  () =>
    !props.disabled &&
    (props.allowClear || props.clearable) &&
    (selectedCount.value > 0 || Boolean(searchText.value)),
)
const emptyText = computed(
  () =>
    props.notFoundContent ||
    (searchText.value ? t('vs.cascader.noMatch') : t('vs.cascader.noData')),
)

const menus = computed(() => {
  const result: CascaderNode[][] = [nodes.value]
  let current = nodes.value
  for (const value of activePath.value) {
    const node = current.find((item) => item.value === value)
    if (!node?.children.length) break
    current = node.children
    result.push(current)
  }
  return result
})
const searchResults = computed(() => {
  const query = searchText.value.trim()
  if (!query) return []
  const candidates = flatNodes.value.filter(
    (node) => node.isLeaf || props.changeOnSelect || props.checkStrictly,
  )
  const filter =
    searchConfig.value.filter ??
    ((input: string, path: CascaderOption[]) => {
      const labels = path.map((option) =>
        String(option[fields.value.label] ?? ''),
      )
      return labels.some((label) =>
        label.toLocaleLowerCase().includes(input.toLocaleLowerCase()),
      )
    })
  let result = candidates.filter((node) => filter(query, node.pathOptions))
  if (searchConfig.value.sort)
    result = [...result].sort((a, b) =>
      searchConfig.value.sort!(a.pathOptions, b.pathOptions, query),
    )
  const limit =
    searchConfig.value.limit === undefined ? 50 : searchConfig.value.limit
  return limit === false ? result : result.slice(0, Math.max(0, limit))
})

const setOpen = (value: boolean) => {
  if (props.disabled) return
  if (props.open === undefined) internalOpen.value = value
  emit('update:open', value)
  emit('dropdownVisibleChange', value)
  if (value) {
    activePath.value = props.multiple
      ? (selectedLeafNodes.value[0]?.pathValues ?? [])
      : [...singleValue.value]
    nextTick(() => {
      popupWidth.value = triggerRef.value?.getBoundingClientRect().width
      if (showSearchEnabled.value) inputRef.value?.focus()
      popperRef.value?.updatePopper()
    })
  }
}
const setSearch = (value: string) => {
  if (props.searchValue === undefined) internalSearch.value = value
  emit('update:searchValue', value)
  emit('search', value)
  if (value && !mergedOpen.value) setOpen(true)
}
const handleSearchInput = (event: Event) =>
  setSearch((event.target as HTMLInputElement).value)

const expandNode = async (node: CascaderNode) => {
  if (node.disabled) return
  activePath.value = [...node.pathValues]
  if (!node.children.length && !node.isLeaf && props.loadData) {
    const key = pathKey(node.pathValues)
    if (loadingKeys.value.has(key)) return
    loadingKeys.value = new Set(loadingKeys.value).add(key)
    try {
      await props.loadData(node.pathOptions)
      emit('load', node.pathOptions)
      await nextTick()
      popperRef.value?.updatePopper()
    } finally {
      const next = new Set(loadingKeys.value)
      next.delete(key)
      loadingKeys.value = next
    }
  }
  if (!props.multiple && (props.changeOnSelect || props.checkStrictly))
    commitSingle(node, false)
}
const commitSingle = (node: CascaderNode, close = true) => {
  emit('update:modelValue', node.pathValues)
  emit('change', node.pathValues, node.pathOptions)
  if (close) {
    setSearch('')
    setOpen(false)
  }
}
const outputMultipleNodes = (leafNodes: CascaderNode[]) => {
  if (props.showCheckedStrategy !== SHOW_PARENT) return leafNodes
  const selected = new Set(leafNodes.map((node) => pathKey(node.pathValues)))
  const output: CascaderNode[] = []
  const visit = (node: CascaderNode) => {
    const leaves = selectableLeafNodes(node)
    if (
      leaves.length &&
      leaves.every((leaf) => selected.has(pathKey(leaf.pathValues)))
    ) {
      output.push(node)
      return
    }
    node.children.forEach(visit)
  }
  nodes.value.forEach(visit)
  return output
}
const commitMultipleLeaves = (leaves: CascaderNode[]) => {
  const output = outputMultipleNodes(leaves)
  const value = output.map((node) => node.pathValues)
  const selectedOptions = output.map((node) => node.pathOptions)
  emit('update:modelValue', value)
  emit('change', value, selectedOptions)
}
const toggleMultipleNode = (node: CascaderNode) => {
  const affected = selectableLeafNodes(node)
  if (!affected.length) return
  const selected = new Map(
    selectedLeafNodes.value.map((item) => [pathKey(item.pathValues), item]),
  )
  const shouldRemove = affected.every((item) =>
    selected.has(pathKey(item.pathValues)),
  )
  for (const item of affected) {
    const key = pathKey(item.pathValues)
    if (shouldRemove) selected.delete(key)
    else selected.set(key, item)
  }
  commitMultipleLeaves([...selected.values()])
}
const selectNode = (node: CascaderNode) => {
  if (node.disabled) return
  if (props.multiple) {
    toggleMultipleNode(node)
    return
  }
  if (hasChildren(node) && !props.changeOnSelect && !props.checkStrictly) {
    expandNode(node)
    return
  }
  commitSingle(node)
}
const removeTag = (node: CascaderNode) => {
  const removeKeys = new Set(
    selectableLeafNodes(node).map((item) => pathKey(item.pathValues)),
  )
  commitMultipleLeaves(
    selectedLeafNodes.value.filter(
      (item) => !removeKeys.has(pathKey(item.pathValues)),
    ),
  )
  emit('removeTag', node.pathValues)
}
const clear = () => {
  activePath.value = []
  setSearch('')
  const value: CascaderModelValue = []
  emit('update:modelValue', value)
  emit('change', value, [])
  emit('clear')
}

const handleTriggerKeydown = (event: KeyboardEvent) => {
  if (props.disabled) return
  const searching =
    event.target instanceof HTMLInputElement &&
    Boolean(searchText.value) &&
    mergedOpen.value
  if (searching && event.key === 'ArrowDown') {
    event.preventDefault()
    searchActiveIndex.value = Math.max(
      0,
      Math.min(searchResults.value.length - 1, searchActiveIndex.value + 1),
    )
    return
  }
  if (searching && event.key === 'ArrowUp') {
    event.preventDefault()
    searchActiveIndex.value = Math.max(0, searchActiveIndex.value - 1)
    return
  }
  if (searching && event.key === 'Enter') {
    event.preventDefault()
    const node = searchResults.value[searchActiveIndex.value]
    if (node) selectNode(node)
    return
  }
  if (event.key === 'Escape') {
    event.preventDefault()
    setOpen(false)
  } else if (
    event.key === 'ArrowDown' ||
    event.key === 'Enter' ||
    event.key === ' '
  ) {
    if (
      event.target instanceof HTMLInputElement &&
      (event.key === ' ' || event.key === 'Enter')
    )
      return
    event.preventDefault()
    setOpen(true)
  } else if (
    event.key === 'Backspace' &&
    props.multiple &&
    !searchText.value &&
    tagItems.value.length
  ) {
    removeTag(tagItems.value[tagItems.value.length - 1].node)
  }
}
const handleFocus = (event: FocusEvent) => emit('focus', event)
const handleBlur = (event: FocusEvent) => emit('blur', event)

const measureTags = async () => {
  if (!props.multiple || props.maxTagCount !== 'responsive') return
  await nextTick()
  const trigger = triggerRef.value
  const measure = measureRef.value
  if (!trigger || !measure) return
  const tagWidths = [
    ...measure.querySelectorAll<HTMLElement>('[data-cascader-measure-tag]'),
  ].map((element) => element.getBoundingClientRect().width + 4)
  const overflowWidth =
    measure
      .querySelector<HTMLElement>('[data-cascader-measure-overflow]')
      ?.getBoundingClientRect().width ?? 34
  responsiveTagCount.value = calculateVisibleTagCount(
    trigger.clientWidth,
    tagWidths,
    overflowWidth,
    38,
  )
}
useResizeObserver(triggerRef, measureTags)
watch(tagItems, measureTags, { flush: 'post' })
watch(searchResults, () => {
  searchActiveIndex.value = 0
})
watch(
  () => props.modelValue,
  () => {
    if (!mergedOpen.value)
      activePath.value = props.multiple ? [] : [...singleValue.value]
  },
  { deep: true },
)

const focus = () => (inputRef.value ?? triggerRef.value)?.focus()
const blur = () => (inputRef.value ?? triggerRef.value)?.blur()
defineExpose({ focus, blur })
</script>
