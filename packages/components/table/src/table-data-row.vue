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
    :aria-rowindex="rowOffset == null ? undefined : displayIndex + rowOffset"
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
          ns.is(
            'editable-cell',
            editing?.isEditable(editContext(entry.column, entry.index)),
          ),
          ns.is(
            'editing-cell',
            editing?.isEditing(editContext(entry.column, entry.index)),
          ),
        ]"
        :style="[entry.style, { textAlign: entry.column.align ?? 'left' }]"
        role="cell"
        :aria-colindex="(entry.ariaIndex ?? entry.index) + 1"
        :data-column-index="entry.index"
        :tabindex="
          editing?.isEditable(editContext(entry.column, entry.index))
            ? 0
            : undefined
        "
        @dblclick="activateEdit(entry.column, entry.index, $event, 'dblclick')"
        @keydown="editKeydown(entry.column, entry.index, $event)"
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
          v-if="entry.column.type === 'expand'"
          :class="ns.e('detail-control')"
          @click.stop
        >
          <button
            type="button"
            :class="[
              ns.e('detail-toggle'),
              ns.is('expanded', detail?.expanded),
            ]"
            :disabled="!detail?.enabled || detail.disabled"
            :aria-expanded="detail?.expanded ?? false"
            :aria-controls="detail?.panelId"
            :aria-label="
              t(
                detail?.expanded
                  ? 'vs.table.collapseDetails'
                  : 'vs.table.expandDetails',
                { row: displayIndex + 1 },
              )
            "
            @click="detail?.toggle()"
          >
            <SIcon name="cb:chevron-right" />
          </button>
        </span>
        <span
          v-else-if="
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
        <TableCellEditor
          v-else-if="editing?.isEditing(editContext(entry.column, entry.index))"
          :context="editContext(entry.column, entry.index)"
          :editing="editing"
          :renderer="editRenderer?.(entry.column)"
          ><template #default="params"
            ><slot name="edit" v-bind="params" /></template
        ></TableCellEditor>
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
import TableCellEditor from './table-cell-editor.vue'
import type { TableEditing } from './composables/use-table-edit'
import type { TableEditContext, TableEditRenderer } from './table-edit'
import type { TableRowDetailState } from './composables/use-table-details'
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
  rowOffset?: number
  detail?: TableRowDetailState
  sequenceOffset?: number
  indent: number
  selected: boolean
  striped: boolean
  rowClass: TableRowClass
  selectionDisabled?: boolean
  selectionName?: string
  overflow?: TableOverflow
  editing?: TableEditing
  editRenderer?: (column: TableColumn) => TableEditRenderer | undefined
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
) => {
  emit('cellClick', createCellParams(column, columnIndex), event)
  activateEdit(column, columnIndex, event, 'click')
}
const editContext = (
  column: TableColumn,
  columnIndex: number,
): TableEditContext => ({
  ...createCellParams(column, columnIndex),
  rowKey: props.flatRow.key,
  columnKey: column.key ?? column.field ?? String(columnIndex),
})
const activateEdit = (
  column: TableColumn,
  index: number,
  event: MouseEvent,
  trigger: 'click' | 'dblclick',
) => {
  if ((props.editing?.config.value.trigger ?? 'dblclick') !== trigger) return
  if (
    (event.target as HTMLElement).closest(
      'button,input,select,textarea,a,[role="button"]',
    )
  )
    return
  props.editing?.start(editContext(column, index))
}
const editKeydown = (
  column: TableColumn,
  index: number,
  event: KeyboardEvent,
) => {
  if (
    event.target !== event.currentTarget ||
    event.isComposing ||
    event.defaultPrevented
  )
    return
  if (event.key !== 'Enter' && event.key !== 'F2') return
  if (props.editing?.start(editContext(column, index))) {
    event.preventDefault()
    event.stopPropagation()
  }
}
</script>
