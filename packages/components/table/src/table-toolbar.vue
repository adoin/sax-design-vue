<script setup lang="ts">
import { useLocale } from '@vuesax-alpha/hooks'
import TableToolbarItem from './table-toolbar-item'
import type { TableExposes } from './table'
import type {
  TableQueryContext,
  TableSize,
  TableToolbarConfig,
  TableToolbarRendererParams,
} from './table-business'

const props = defineProps<{
  config: TableToolbarConfig
  busy: boolean
  table: TableExposes
  context: TableQueryContext
  size: TableSize
}>()
const emit = defineEmits<{
  action: [code: string, event: MouseEvent]
}>()
const { t } = useLocale()
defineSlots<{
  title?(): unknown
  left?(params: TableExposes & { busy: boolean }): unknown
  right?(params: TableExposes & { busy: boolean }): unknown
}>()

const rendererParams = (
  placement: 'left' | 'right',
): TableToolbarRendererParams => ({
  table: props.table,
  context: props.context,
  placement,
  busy: props.busy,
  size: props.size,
})
</script>

<template>
  <div
    class="s-table-shell__toolbar"
    role="toolbar"
    :aria-label="t('vs.table.toolbar')"
  >
    <div class="s-table-shell__left">
      <div v-if="config.title || $slots.title" class="s-table-shell__title">
        <slot name="title">{{ config.title }}</slot>
      </div>
      <slot name="left" v-bind="table" :busy="busy">
        <TableToolbarItem
          v-for="(item, index) in config.left ?? []"
          :key="item.key ?? `${item.itemRender}-${index}`"
          :options="item"
          :params="rendererParams('left')"
          :action="(code, event) => emit('action', code, event)"
        />
      </slot>
    </div>
    <div class="s-table-shell__right">
      <slot name="right" v-bind="table" :busy="busy">
        <TableToolbarItem
          v-for="(item, index) in config.right ?? []"
          :key="item.key ?? `${item.itemRender}-${index}`"
          :options="item"
          :params="rendererParams('right')"
          :action="(code, event) => emit('action', code, event)"
        />
      </slot>
    </div>
  </div>
</template>
