<script setup lang="ts">
import { computed } from 'vue'
import { SButton } from '@vuesax-alpha/components/button'
import { useLocale, useNamespace } from '@vuesax-alpha/hooks'
import TableFooterRows from './table-footer-rows.vue'
import type { CSSProperties } from 'vue'
import type {
  TableCellRenderer,
  TableFooterCellRenderParams,
  TableRenderedColumnEntry,
  TableRenderedEntry,
  TableRenderer,
} from './table'
import type { TableGroupNode } from './table-group'

const props = defineProps<{
  kind: 'group' | 'subtotal' | 'summary'
  group?: TableGroupNode
  summary?: Readonly<Record<string, unknown>>
  expanded?: boolean
  disabled: boolean
  columnCount: number
  viewportWidth: number
  rowIndex?: number
  entries: TableRenderedEntry[]
  fixedStyle: (entry: TableRenderedColumnEntry) => CSSProperties
  renderers: Record<string, TableRenderer | TableCellRenderer>
  retainHeights: boolean
}>()
const emit = defineEmits<{ toggle: [key: string, expanded: boolean] }>()
defineSlots<{
  header(params: { group: TableGroupNode; expanded: boolean }): unknown
  summary(
    params: TableFooterCellRenderParams & {
      group?: TableGroupNode
      kind: 'subtotal' | 'summary'
    },
  ): unknown
}>()
const ns = useNamespace('table')
const { t } = useLocale()
const data = computed(() => [{ ...(props.group?.aggregates ?? props.summary) }])
</script>

<template>
  <div
    v-if="kind === 'group' && group"
    :class="ns.e('group-row')"
    data-table-group-band
    role="row"
    :aria-rowindex="rowIndex"
    :data-group-key="group.key"
  >
    <div
      :class="ns.e('group-cell')"
      role="cell"
      :aria-colspan="columnCount"
      :style="{
        width: viewportWidth ? `${viewportWidth}px` : '100%',
        paddingInlineStart: `${12 + group.depth * 20}px`,
      }"
    >
      <SButton
        :class="ns.e('group-toggle')"
        flat
        :debounce="false"
        :disabled="disabled"
        :aria-expanded="Boolean(expanded)"
        :aria-label="`${t(expanded ? 'vs.tree.collapse' : 'vs.tree.expand')}: ${group.label}`"
        @click="emit('toggle', group.key, !expanded)"
      >
        <span aria-hidden="true">{{ expanded ? '−' : '+' }}</span>
      </SButton>
      <slot name="header" :group="group" :expanded="Boolean(expanded)">
        <strong>{{ group.label }}</strong
        ><span :class="ns.e('group-count')">{{ group.rowCount }}</span>
      </slot>
    </div>
  </div>
  <TableFooterRows
    v-else
    data-table-group-band
    :class="ns.e(kind === 'subtotal' ? 'group-subtotal' : 'group-summary')"
    :data="data"
    :entries="entries"
    :row-offset="rowIndex"
    :fixed-style="fixedStyle"
    :renderers="renderers"
    :retain-heights="retainHeights"
  >
    <template v-if="$slots.summary" #cell="params"
      ><slot
        name="summary"
        v-bind="params"
        :group="group"
        :kind="kind === 'subtotal' ? 'subtotal' : 'summary'"
    /></template>
  </TableFooterRows>
</template>
