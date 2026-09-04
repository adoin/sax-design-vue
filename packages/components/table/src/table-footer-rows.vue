<script setup lang="ts">
import { computed, watch } from 'vue'
import { useNamespace } from '@vuesax-alpha/hooks'
import { tableFieldValue, tableOverflowMode } from './data-utils'
import TableRendererOutlet from './renderer-outlet'
import { useTableFooterHeights } from './composables/use-table-footer-heights'
import type { CSSProperties } from 'vue'
import type {
  TableCellRenderer,
  TableColumn,
  TableFooterCellRenderParams,
  TableFooterRenderer,
  TableOverflow,
  TableRenderedColumnEntry,
  TableRenderedEntry,
  TableRenderer,
  TableRow,
  TableRowKeyGetter,
} from './table'

const props = defineProps<{
  data: TableRow[]
  rowKey?: TableRowKeyGetter
  entries: TableRenderedEntry[]
  rowOffset: number
  fixedStyle: (entry: TableRenderedColumnEntry) => CSSProperties
  renderers: Record<string, TableRenderer | TableCellRenderer>
  overflow?: TableOverflow
  retainHeights: boolean
}>()
const emit = defineEmits<{
  cellClick: [params: TableFooterCellRenderParams, event: MouseEvent]
}>()
defineSlots<{ cell(params: TableFooterCellRenderParams): unknown }>()
const ns = useNamespace('table')
const { heights, setElement, measure } = useTableFooterHeights(
  () => props.retainHeights,
)
const rows = computed(() =>
  props.data.map((row, rowIndex) => {
    const rawKey =
      typeof props.rowKey === 'function'
        ? props.rowKey(row, rowIndex)
        : tableFieldValue(row, props.rowKey)
    const key =
      rawKey == null
        ? `index:${rowIndex}`
        : `${typeof rawKey}:${String(rawKey)}`
    return {
      key,
      cells: props.entries.map((entry) =>
        entry.kind === 'spacer'
          ? entry
          : {
              ...entry,
              params: {
                row,
                column: entry.column,
                value: tableFieldValue(row, entry.column.field),
                rowIndex,
                columnIndex: entry.index,
              },
              overflow: tableOverflowMode(
                entry.column.showFooterOverflow ?? props.overflow,
              ),
            },
      ),
    }
  }),
)
const rendererFor = (column: TableColumn): TableFooterRenderer | undefined => {
  if (column.footer) return column.footer
  const renderer =
    typeof column.renderer === 'string'
      ? props.renderers[column.renderer]
      : column.renderer
  if (renderer && typeof renderer === 'object' && renderer.footer)
    return renderer.footer
  if (column.footerFormatter)
    return (params) => String(column.footerFormatter?.(params) ?? '')
  return undefined
}
watch(
  () => [props.data, props.rowKey, props.overflow, props.renderers],
  measure,
  { deep: true },
)
defineExpose({ measure })
</script>

<template>
  <div :class="ns.e('data-footer')" role="rowgroup">
    <div
      v-for="(row, rowIndex) in rows"
      :key="row.key"
      :ref="(element) => setElement(row.key, element)"
      :class="ns.e('footer-row')"
      :style="{
        minHeight:
          retainHeights && heights.get(row.key)
            ? `${heights.get(row.key)}px`
            : undefined,
      }"
      role="row"
      :aria-rowindex="rowOffset + rowIndex"
      :data-footer-row-key="row.key"
    >
      <template v-for="entry in row.cells" :key="entry.key">
        <div
          v-if="entry.kind === 'spacer'"
          :class="ns.e('data-column-spacer')"
          :style="{ flexBasis: `${entry.width}px` }"
          aria-hidden="true"
        />
        <div
          v-else
          :class="[
            ns.e('footer-cell'),
            entry.column.className,
            ns.is('fixed-column', Boolean(entry.fixed)),
            ns.is('fixed-left', entry.fixed === 'left'),
            ns.is('fixed-right', entry.fixed === 'right'),
            ns.is('fixed-boundary', entry.fixedBoundary),
          ]"
          :style="[
            entry.style,
            fixedStyle(entry),
            {
              textAlign:
                entry.column.footerAlign ?? entry.column.align ?? 'left',
            },
          ]"
          role="cell"
          :aria-colindex="(entry.ariaIndex ?? entry.index) + 1"
          :data-column-index="entry.index"
          @click="emit('cellClick', entry.params, $event)"
        >
          <span
            :class="[
              ns.e('cell-content'),
              ns.is('ellipsis', Boolean(entry.overflow)),
            ]"
            :data-table-overflow="entry.overflow"
            :tabindex="entry.overflow === 'tooltip' ? 0 : undefined"
          >
            <slot name="cell" v-bind="entry.params">
              <TableRendererOutlet
                :renderer="rendererFor(entry.column)"
                :params="entry.params"
                :fallback="entry.params.value"
              />
            </slot>
          </span>
        </div>
      </template>
    </div>
  </div>
</template>
