<template>
  <div
    :class="[
      ns.e('data-row'),
      ns.is('selected', selected),
      ns.is('striped-row', striped && displayIndex % 2 === 1),
      resolvedRowClass,
    ]"
    role="row"
    :aria-selected="selected"
    :aria-rowindex="displayIndex + rowOffset"
    @click="handleRowClick"
  >
    <template v-for="entry in entries" :key="entry.key">
      <div
        v-if="entry.kind === 'spacer'"
        :class="ns.e('data-column-spacer')"
        :style="{ flexBasis: `${entry.width}px` }"
        aria-hidden="true"
      />
      <div
        v-else
        :class="[
          ns.e('data-cell'),
          entry.column.className,
          ns.is('fixed-column', Boolean(entry.fixed)),
          ns.is('fixed-left', entry.fixed === 'left'),
          ns.is('fixed-right', entry.fixed === 'right'),
          ns.is('fixed-boundary', entry.fixedBoundary),
        ]"
        :style="[entry.style, { textAlign: entry.column.align ?? 'left' }]"
        role="cell"
        :aria-colindex="entry.index + 1"
        :data-column-index="entry.index"
        @click="handleCellClick(entry.column, entry.index, $event)"
      >
        <span
          v-if="entry.column.treeNode"
          :class="ns.e('tree-leading')"
          :style="{ width: `${flatRow.depth * indent}px` }"
          aria-hidden="true"
        />
        <button
          v-if="entry.column.treeNode && flatRow.hasChildren"
          :class="[
            ns.e('tree-toggle'),
            ns.is('expanded', flatRow.expanded),
            ns.is('loading', flatRow.loading),
          ]"
          type="button"
          :disabled="flatRow.loading"
          :aria-expanded="flatRow.expanded"
          :aria-label="
            t(flatRow.expanded ? 'vs.tree.collapse' : 'vs.tree.expand')
          "
          @click.stop="emit('toggleExpand')"
        >
          <span v-if="flatRow.loading" :class="ns.e('tree-spinner')" />
          <SIcon v-else name="cb:chevron-right" />
        </button>
        <span
          v-else-if="entry.column.treeNode"
          :class="ns.e('tree-toggle-placeholder')"
          aria-hidden="true"
        />
        <span
          v-if="
            entry.column.type === 'checkbox' || entry.column.type === 'radio'
          "
          :class="ns.e('selection-control')"
          @click.stop
        >
          <SCheckbox
            v-if="entry.column.type === 'checkbox'"
            :model-value="selected"
            :disabled="selectionDisabled"
            :aria-label="t('vs.table.selectRow', { row: displayIndex + 1 })"
            @update:model-value="
              emit('rowSelect', flatRow.row, Boolean($event))
            "
          />
          <SRadio
            v-else
            :model-value="selected"
            :value="true"
            :name="selectionName"
            :disabled="selectionDisabled"
            :aria-label="t('vs.table.selectRow', { row: displayIndex + 1 })"
            @update:model-value="emit('rowSelect', flatRow.row, true)"
          />
        </span>
        <span
          v-else
          :class="[
            ns.e('cell-content'),
            ns.is('ellipsis', Boolean(overflowMode(entry.column))),
          ]"
          :data-table-overflow="overflowMode(entry.column)"
          :tabindex="overflowMode(entry.column) === 'tooltip' ? 0 : undefined"
        >
          <slot
            name="cell"
            v-bind="createCellParams(entry.column, entry.index)"
          >
            {{ getValue(entry.column) }}
          </slot>
        </span>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { SIcon } from '@vuesax-alpha/components/icon'
import { SCheckbox } from '@vuesax-alpha/components/checkbox'
import { SRadio } from '@vuesax-alpha/components/radio'
import { useLocale, useNamespace } from '@vuesax-alpha/hooks'
import { tableFieldValue, tableOverflowMode } from './data-utils'
import type {
  TableCellRenderParams,
  TableColumn,
  TableFlatRow,
  TableOverflow,
  TableRenderedEntry,
  TableRow,
  TableRowClass,
} from './table'

defineOptions({ name: 'STableDataRow' })

const props = defineProps<{
  flatRow: TableFlatRow
  entries: TableRenderedEntry[]
  displayIndex: number
  rowOffset: number
  sequenceOffset?: number
  indent: number
  selected: boolean
  striped: boolean
  rowClass: TableRowClass
  selectionDisabled?: boolean
  selectionName?: string
  overflow?: TableOverflow
}>()

const emit = defineEmits<{
  rowClick: [row: TableRow, event: MouseEvent]
  cellClick: [params: TableCellRenderParams, event: MouseEvent]
  toggleExpand: []
  rowSelect: [row: TableRow, checked: boolean]
}>()

const ns = useNamespace('table')
const { t } = useLocale()
const overflowMode = (column: TableColumn) =>
  tableOverflowMode(column.showOverflow ?? props.overflow)

const resolvedRowClass = computed(() =>
  typeof props.rowClass === 'function'
    ? props.rowClass(props.flatRow)
    : props.rowClass,
)

const getValue = (column: TableColumn) => {
  if (column.type === 'seq')
    return props.flatRow.index + 1 + (props.sequenceOffset ?? 0)
  return tableFieldValue(props.flatRow.row, column.field)
}

const createCellParams = (
  column: TableColumn,
  columnIndex: number,
): TableCellRenderParams => ({
  row: props.flatRow.row,
  column,
  value: getValue(column),
  rowIndex: props.flatRow.index,
  columnIndex,
  depth: props.flatRow.depth,
  expanded: props.flatRow.expanded,
  loading: props.flatRow.loading,
  toggleExpand: async (expanded?: boolean) => {
    if (expanded === props.flatRow.expanded) return
    emit('toggleExpand')
  },
})

const handleRowClick = (event: MouseEvent) =>
  emit('rowClick', props.flatRow.row, event)

const handleCellClick = (
  column: TableColumn,
  columnIndex: number,
  event: MouseEvent,
) => emit('cellClick', createCellParams(column, columnIndex), event)
</script>
