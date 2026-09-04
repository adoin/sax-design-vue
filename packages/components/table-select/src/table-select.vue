<script lang="ts" setup>
import { computed, nextTick, shallowRef, useTemplateRef, watch } from 'vue'
import { useResizeObserver } from '@vueuse/core'
import { IconLoading, SIcon } from '@vuesax-alpha/components/icon'
import { SPopper } from '@vuesax-alpha/components/popper'
import { STable } from '@vuesax-alpha/components/table'
import { useId, useLocale, useNamespace, useShape } from '@vuesax-alpha/hooks'
import { getVsColor } from '@vuesax-alpha/utils'
import { tableSelectEmits, tableSelectProps } from './table-select'
import type {
  TableCellRenderParams,
  TableFlatRow,
  TableHeaderRenderParams,
  TableInstance,
  TableRow,
  TableRowKey,
} from '@vuesax-alpha/components/table'
import type { CSSProperties } from 'vue'

defineOptions({ name: 'STableSelect' })

const props = defineProps(tableSelectProps)
const emit = defineEmits(tableSelectEmits)
const slots = defineSlots<{
  prefix?(): unknown
  suffix?(props: { open: boolean; selectedRow: TableRow | null }): unknown
  'clear-icon'?(): unknown
  selected?(props: { row: TableRow; label: string }): unknown
  empty?(): unknown
  'popup-header'?(): unknown
  'popup-footer'?(props: {
    selectedRow: TableRow | null
    close: () => void
  }): unknown
  cell?(props: TableCellRenderParams): unknown
  'header-cell'?(props: TableHeaderRenderParams): unknown
  [name: `cell-${string}`]:
    ((props: TableCellRenderParams) => unknown) | undefined
  [name: `header-${string}`]:
    ((props: TableHeaderRenderParams) => unknown) | undefined
  // Dynamic Table column slots keep their original scoped payload.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [name: string]: ((props: any) => unknown) | undefined
}>()

const ns = useNamespace('table-select')
const resolvedShape = useShape()
const { t } = useLocale()
const triggerRef = useTemplateRef<HTMLElement>('triggerRef')
const tableRef = useTemplateRef<TableInstance>('tableRef')
const panelId = useId()
const internalOpen = shallowRef(props.defaultOpen)
const popupWidth = shallowRef<number>()

const mergedOpen = computed(() => props.open ?? internalOpen.value)
const popupConfig = computed(() => props.popupConfig)
const accentColor = computed(() => props.state || props.color)
const colorCssVar = computed(() =>
  ns.cssVar({ color: getVsColor(accentColor.value) }),
)
const hasPrefix = computed(() =>
  Boolean(slots.prefix || props.prefixIcon || props.prefixConfig?.content),
)
const hasSuffix = computed(() =>
  Boolean(slots.suffix || props.suffixIcon || props.suffixConfig?.content),
)
const prefixIconName = computed(
  () => props.prefixIcon || props.prefixConfig?.icon,
)
const suffixIconName = computed(
  () => props.suffixIcon || props.suffixConfig?.icon,
)
const popperClass = computed(() =>
  [
    ns.e('panel'),
    ns.is('square', resolvedShape.value === 'square'),
    popupConfig.value.className,
  ].filter((className): className is string => Boolean(className)),
)
const popupMatchesTrigger = computed(
  () =>
    popupConfig.value.full ||
    popupConfig.value.width === 'full' ||
    popupConfig.value.matchTriggerWidth,
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
  height: toCssSize(popupConfig.value.height),
  maxHeight: toCssSize(popupConfig.value.maxHeight),
}))

const getFieldValue = (row: TableRow, field: string) =>
  field
    .split('.')
    .reduce<unknown>(
      (value, key) =>
        value && typeof value === 'object'
          ? (value as Record<string, unknown>)[key]
          : undefined,
      row,
    )

const getChildren = (row: TableRow) => {
  const children = row[props.treeConfig?.children ?? 'children']
  return Array.isArray(children) ? (children as TableRow[]) : []
}

const resolveRowKey = (row: TableRow, index: number): TableRowKey => {
  if (typeof props.rowKey === 'function') return props.rowKey(row, index)
  const value = getFieldValue(row, props.rowKey)
  return typeof value === 'string' || typeof value === 'number' ? value : index
}

const findRowEntry = (
  predicate: (row: TableRow, key: TableRowKey) => boolean,
) => {
  let sourceIndex = 0
  const walk = (
    rows: TableRow[],
  ): { row: TableRow; key: TableRowKey } | undefined => {
    for (const row of rows) {
      const key = resolveRowKey(row, sourceIndex++)
      if (predicate(row, key)) return { row, key }
      const found = walk(getChildren(row))
      if (found) return found
    }
    return undefined
  }
  return walk(props.data)
}

const selectedEntry = computed(() => {
  if (props.modelValue === undefined) return undefined
  return findRowEntry((_, key) => key === props.modelValue)
})
const selectedRow = computed(() => selectedEntry.value?.row ?? null)
const selectedLabel = computed(() => {
  const row = selectedRow.value
  if (!row) return ''
  if (props.labelFormatter) return props.labelFormatter(row)
  return String(getFieldValue(row, props.labelKey) ?? selectedEntry.value?.key)
})

const isRowSelectable = (row: TableRow) =>
  !row.disabled && (props.selectable?.(row) ?? true)

const resolveRowClass = (flatRow: TableFlatRow) => {
  const custom =
    typeof props.rowClass === 'function'
      ? props.rowClass(flatRow)
      : props.rowClass
  const classes = Array.isArray(custom) ? [...custom] : custom ? [custom] : []
  if (!isRowSelectable(flatRow.row)) classes.push(ns.is('disabled-option'))
  return classes
}

const reservedSlotNames = new Set([
  'prefix',
  'suffix',
  'clear-icon',
  'selected',
  'empty',
  'popup-header',
  'popup-footer',
])
const forwardedSlotNames = computed(() =>
  Object.keys(slots).filter((name) => !reservedSlotNames.has(name)),
)

const measurePopup = () => {
  popupWidth.value = triggerRef.value?.getBoundingClientRect().width
}
const setOpen = (value: boolean) => {
  if (value && (props.disabled || props.loading)) return
  if (props.open === undefined) internalOpen.value = value
  emit('update:open', value)
  emit('visible-change', value)
  if (value) nextTick(measurePopup)
}
const openPopup = () => setOpen(true)
const close = () => setOpen(false)
const toggle = () => setOpen(!mergedOpen.value)
const handleTriggerKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    toggle()
    return
  }
  if (event.key === 'Escape') {
    event.preventDefault()
    close()
  }
}
const handleRowClick = (row: TableRow, event: MouseEvent) => {
  emit('rowClick', row, event)
  if (!isRowSelectable(row)) return
  const entry = findRowEntry((candidate) => candidate === row)
  if (!entry) return
  emit('update:modelValue', entry.key)
  emit('change', entry.key, row)
  if (props.closeOnSelect) close()
}
const clear = () => {
  emit('update:modelValue', undefined)
  emit('clear')
}
const handleCellClick = (params: TableCellRenderParams, event: MouseEvent) =>
  emit('cellClick', params, event)
const handleTreeExpand = (row: TableRow, expanded: boolean) =>
  emit('treeExpand', row, expanded)
const handleLazyLoad = (row: TableRow, children: TableRow[]) =>
  emit('lazyLoad', row, children)

watch(
  () => props.disabled || props.loading,
  (inactive) => {
    if (inactive && mergedOpen.value) close()
  },
)
useResizeObserver(triggerRef, measurePopup)

defineExpose({
  open: openPopup,
  close,
  toggleRowExpand: (...args: Parameters<TableInstance['toggleRowExpand']>) =>
    tableRef.value?.toggleRowExpand(...args),
  setExpandedKeys: (...args: Parameters<TableInstance['setExpandedKeys']>) =>
    tableRef.value?.setExpandedKeys(...args),
  scrollToRow: (...args: Parameters<TableInstance['scrollToRow']>) =>
    tableRef.value?.scrollToRow(...args),
  measure: () => tableRef.value?.measure(),
})
</script>

<template>
  <SPopper
    :visible="mergedOpen"
    trigger="click"
    :placement="popupConfig.placement ?? placement"
    :teleported="popupConfig.transfer ?? teleported"
    :append-to="popupConfig.appendTo"
    :disabled="disabled || loading"
    :strategy="strategy"
    :flip="flip"
    :offset="popupConfig.offset ?? 8"
    :show-arrow="false"
    :popper-class="popperClass"
    :popper-style="[colorCssVar, popupStyle, popupConfig.style]"
    :z-index="popupConfig.zIndex"
    @update:visible="setOpen"
  >
    <div
      ref="triggerRef"
      :class="[
        ns.b(),
        ns.is('open', mergedOpen),
        ns.is('disabled', disabled),
        ns.is('loading', loading),
        ns.is('block', block),
        ns.is('square', resolvedShape === 'square'),
        ns.is('has-prefix', hasPrefix),
        ns.is('has-suffix', hasSuffix),
      ]"
      :style="colorCssVar"
    >
      <div
        :class="ns.e('trigger')"
        role="combobox"
        :tabindex="disabled || loading ? -1 : 0"
        :aria-controls="mergedOpen ? panelId : undefined"
        :aria-disabled="disabled"
        :aria-expanded="mergedOpen"
        :aria-busy="loading"
        aria-haspopup="grid"
        @focus="emit('focus', $event)"
        @blur="emit('blur', $event)"
        @keydown="handleTriggerKeydown"
      >
        <span
          v-if="hasPrefix"
          :class="ns.e('prefix')"
          @click="emit('prefix-click', $event)"
        >
          <slot name="prefix">
            <SIcon v-if="prefixIconName" :name="prefixIconName" />
            <template v-else>{{ prefixConfig?.content }}</template>
          </slot>
        </span>

        <span :class="[ns.e('value'), ns.is('placeholder', !selectedRow)]">
          <slot
            v-if="selectedRow"
            name="selected"
            :row="selectedRow"
            :label="selectedLabel"
          >
            {{ selectedLabel }}
          </slot>
          <template v-else>{{
            placeholder || t('vs.select.placeholder')
          }}</template>
        </span>

        <span
          v-if="hasSuffix"
          :class="ns.e('suffix')"
          @click="emit('suffix-click', $event)"
        >
          <slot name="suffix" :open="mergedOpen" :selected-row="selectedRow">
            <SIcon v-if="suffixIconName" :name="suffixIconName" />
            <template v-else>{{ suffixConfig?.content }}</template>
          </slot>
        </span>

        <button
          v-if="clearable && modelValue !== undefined && !loading"
          :class="ns.e('clear')"
          type="button"
          :aria-label="t('vs.cascader.clear')"
          @click.stop="clear"
        >
          <slot name="clear-icon"><SIcon name="cb:close" /></slot>
        </button>

        <span :class="ns.e('action')" aria-hidden="true">
          <IconLoading v-if="loading" :class="ns.e('loading')" />
          <SIcon
            v-else
            :class="ns.is('rotated', mergedOpen)"
            name="cb:chevron-down"
          />
        </span>
      </div>
    </div>

    <template #content>
      <div
        :id="panelId"
        :class="ns.e('content')"
        @keydown.esc.stop.prevent="close"
      >
        <div v-if="$slots['popup-header']" :class="ns.e('header')">
          <slot name="popup-header" />
        </div>
        <STable
          ref="tableRef"
          :data="data"
          :columns="columns"
          :row-key="rowKey"
          :tree-config="treeConfig"
          :virtual-config="virtualConfig"
          :expanded-keys="expandedKeys"
          :renderers="renderers"
          :row-class="resolveRowClass"
          :empty-text="emptyText"
          :show-header="showHeader"
          :striped="striped"
          :loading="tableLoading"
          :highlight="selectedRow"
          @row-click="handleRowClick"
          @cell-click="handleCellClick"
          @update:expanded-keys="emit('update:expandedKeys', $event)"
          @tree-expand="handleTreeExpand"
          @lazy-load="handleLazyLoad"
          @scroll="emit('scroll', $event)"
        >
          <template
            v-for="slotName in forwardedSlotNames"
            #[slotName]="slotProps"
            :key="slotName"
          >
            <slot :name="slotName" v-bind="slotProps" />
          </template>
          <template v-if="$slots.empty" #notFound>
            <slot name="empty" />
          </template>
        </STable>
        <div v-if="$slots['popup-footer']" :class="ns.e('footer')">
          <slot
            name="popup-footer"
            :selected-row="selectedRow"
            :close="close"
          />
        </div>
      </div>
    </template>
  </SPopper>
</template>
