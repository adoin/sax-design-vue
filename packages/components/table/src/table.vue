<template>
  <div :class="ns.b('wrapper')">
    <slot />
    <TableColumnManager
      v-if="columnManager.enabled.value"
      :manager="columnManager"
      :disabled="loading"
    />

    <div v-if="$slots.header" :class="ns.be('wrapper', 'header')">
      <slot name="header" />
    </div>

    <div
      ref="tableScrollRef"
      :class="[
        tableKls,
        ns.is('horizontal-virtual', horizontalVirtualMode && usesBodyScroll),
      ]"
      @scroll="handleTableScroll"
      @wheel="handleTableWheel"
      @mouseover="overflow.enter"
      @mouseout="overflow.leave"
      @focusin="overflow.enter"
      @focusout="overflow.leave"
      @scroll.capture="overflow.close"
      @keydown.esc="overflow.close"
    >
      <div
        :class="ns.e('data-view')"
        :style="{ minWidth: dataViewMinWidth }"
        role="table"
        :aria-rowcount="tableAriaRowCount"
        :aria-colcount="resolvedColumnCount"
      >
        <TableHeaderRows
          v-if="showHeader"
          :style="virtualBandStyle"
          :entries="renderedColumnEntries"
          :depth="headerDepth"
          :path-for="headerPathFor"
        >
          <template #default="{ entry }">
            <div
              :class="[
                ns.e('data-head-cell'),
                ns.is('group-header', entry.group),
                entry.column.className,
                ns.is('fixed-column', Boolean(entry.fixed)),
                ns.is('fixed-left', entry.fixed === 'left'),
                ns.is('fixed-right', entry.fixed === 'right'),
                ns.is('fixed-boundary', entry.fixedBoundary),
              ]"
              :style="[
                entry.style,
                fixedBandStyle(entry),
                {
                  textAlign:
                    entry.column.align ?? (entry.group ? 'center' : 'left'),
                },
              ]"
              role="columnheader"
              :aria-colindex="(entry.ariaIndex ?? entry.index) + 1"
              :aria-colspan="entry.colSpan"
              :aria-rowspan="entry.rowSpan"
              :data-column-index="entry.index"
              :aria-sort="
                entry.group
                  ? undefined
                  : sortOrder(entry.column) === 'asc'
                    ? 'ascending'
                    : sortOrder(entry.column) === 'desc'
                      ? 'descending'
                      : entry.column.sortable
                        ? 'none'
                        : undefined
              "
            >
              <TableHeaderCell
                :group="entry.group"
                :column="entry.column"
                :order="sortOrder(entry.column)"
                :sort-priority="sortPriority(entry.column)"
                :filter-values="
                  filtersState[tableColumnKey(entry.column)] ?? []
                "
                :overflow="showHeaderOverflow"
                :all-selected="entry.column.type === 'checkbox' && allSelected"
                :indeterminate="
                  entry.column.type === 'checkbox' && indeterminate
                "
                :select-all-disabled="
                  loading ||
                  Boolean(virtualSource) ||
                  (entry.column.type === 'checkbox' && !selectableRows.length)
                "
                :show-select-all="
                  selectionConfig.showSelectAll !== false && !virtualSource
                "
                @sort="query.toggleSort(entry.column, $event)"
                @filter="setColumnFilter(entry.column, $event)"
                @select-all="selectAll"
              >
                <slot
                  :name="headerSlotName(entry.column)"
                  v-bind="headerParams(entry.column, entry.index)"
                >
                  <slot
                    name="header-cell"
                    v-bind="headerParams(entry.column, entry.index)"
                  >
                    <TableRendererOutlet
                      :renderer="resolveHeaderRenderer(entry.column)"
                      :params="headerParams(entry.column, entry.index)"
                      :fallback="entry.column.title ?? entry.column.field"
                    />
                  </slot>
                </slot>
                <template
                  v-if="
                    entry.column.slots?.filter &&
                    $slots[entry.column.slots.filter]
                  "
                  #filter="params"
                >
                  <slot :name="entry.column.slots.filter" v-bind="params" />
                </template>
              </TableHeaderCell>
              <span
                v-if="!entry.group && columnResize.canResize(entry.column)"
                :class="[
                  ns.e('resize-handle'),
                  ns.is(
                    'resizing',
                    columnResize.session.value?.key ===
                      columnResize.keyFor(entry.column, entry.index),
                  ),
                ]"
                role="separator"
                tabindex="0"
                aria-orientation="vertical"
                :aria-label="
                  t('vs.table.resizeColumn', {
                    column:
                      entry.column.title ??
                      entry.column.field ??
                      entry.index + 1,
                  })
                "
                :aria-valuemin="columnResize.minimumFor(entry.column)"
                :aria-valuenow="
                  columnResize.widthFor(entry.column, entry.index) ??
                  resolveColumnPixelWidth(
                    entry.column.width ?? entry.column.minWidth,
                  ) ??
                  undefined
                "
                @pointerdown="
                  columnResize.start(
                    $event,
                    entry.column,
                    entry.index,
                    entry.fixed,
                  )
                "
                @keydown="
                  columnResize.keydown($event, entry.column, entry.index)
                "
                @focus="columnResize.focus"
                @click.stop
              />
            </div>
          </template>
        </TableHeaderRows>

        <SVirtualList
          v-if="usesBodyScroll"
          :key="
            pagination.enabled.value
              ? `${pagination.currentPage.value}:${pagination.pageSize.value}`
              : 'unpaged'
          "
          ref="virtualListRef"
          :items="virtualSourceActive ? [] : flatRows"
          :count="effectiveRowCount"
          :item-at="virtualItemAt"
          :item-key-at="virtualRowKeyAt"
          :height="virtualOptions.height"
          :estimate-size="virtualOptions.estimateSize"
          :overscan="virtualOptions.overscan"
          :dynamic="dynamicRows"
          :retain-max-size="horizontalVirtualMode && dynamicRows"
          :item-key="flatRowKey"
          :class="ns.e('virtual-body')"
          :style="virtualBodyStyle"
          role="rowgroup"
          @scroll="handleVirtualScroll"
        >
          <template #default="{ item, index }">
            <TableRowBlock
              :flat-row="item as TableFlatRow"
              :controller="details"
              :column-count="resolvedColumnCount"
              :viewport-width="columnVirtualization.viewportWidth.value"
              :panel-id="detailPanelId((item as TableFlatRow).key)"
              :aria-row-index="detailAriaIndex(index)"
              :disabled="loading"
              @shrink="resetDetailMeasurements"
            >
              <template #default="{ detail }">
                <TableDataRow
                  :detail="detail"
                  :editing="editing"
                  :validation="validation"
                  :edit-renderer="resolveEditRenderer"
                  :flat-row="item as TableFlatRow"
                  :entries="renderedColumnEntries"
                  :display-index="index"
                  :row-offset="detailRowOffset(index)"
                  :sequence-offset="
                    pagination.remote.value ? pagination.offset.value : 0
                  "
                  :indent="treeIndent"
                  :selected="isRowSelected((item as TableFlatRow).key)"
                  :selection-disabled="
                    loading ||
                    !isSelectable(
                      (item as TableFlatRow).row,
                      (item as TableFlatRow).index,
                    )
                  "
                  :selection-name="selectionName"
                  :overflow="showOverflow"
                  :striped="striped"
                  :row-class="rowClass"
                  @row-click="handleRowClick"
                  @cell-click="handleCellClick"
                  @row-select="toggleRowSelection"
                  @toggle-expand="toggleRowExpand((item as TableFlatRow).row)"
                >
                  <template #cell="params">
                    <slot :name="cellSlotName(params.column)" v-bind="params">
                      <slot name="cell" v-bind="params">
                        <TableRendererOutlet
                          :renderer="resolveCellRenderer(params.column)"
                          :params="params"
                          :fallback="params.value"
                        />
                      </slot>
                    </slot>
                  </template>
                  <template #edit="params">
                    <slot
                      :name="
                        params.column.slots?.edit ??
                        `edit-${columnSlotKey(params.column)}`
                      "
                      v-bind="params"
                      ><slot name="edit-cell" v-bind="params"
                    /></slot>
                  </template>
                </TableDataRow>
              </template>
              <template #detail="params"
                ><slot name="detail" v-bind="params"
              /></template>
              <template #loading="params"
                ><slot name="detail-loading" v-bind="params"
              /></template>
              <template #error="params"
                ><slot name="detail-error" v-bind="params"
              /></template>
            </TableRowBlock>
          </template>
        </SVirtualList>

        <div
          v-else-if="
            !virtualSourceActive && flatRows.length && resolvedColumnCount
          "
          ref="dataBodyRef"
          :class="ns.e('data-body')"
          role="rowgroup"
        >
          <TableRowBlock
            v-for="(flatRow, index) in flatRows"
            :key="`${typeof flatRow.key}:${String(flatRow.key)}`"
            :flat-row="flatRow"
            :controller="details"
            :column-count="resolvedColumnCount"
            :viewport-width="columnVirtualization.viewportWidth.value"
            :panel-id="detailPanelId(flatRow.key)"
            :aria-row-index="detailAriaIndex(index)"
            :disabled="loading"
            @shrink="resetDetailMeasurements"
          >
            <template #default="{ detail }">
              <TableDataRow
                :data-row-key="String(flatRow.key)"
                :detail="detail"
                :editing="editing"
                :validation="validation"
                :edit-renderer="resolveEditRenderer"
                :flat-row="flatRow"
                :entries="renderedColumnEntries"
                :display-index="index"
                :row-offset="detailRowOffset(index)"
                :sequence-offset="
                  pagination.remote.value ? pagination.offset.value : 0
                "
                :indent="treeIndent"
                :selected="isRowSelected(flatRow.key)"
                :selection-disabled="
                  loading || !isSelectable(flatRow.row, flatRow.index)
                "
                :selection-name="selectionName"
                :overflow="showOverflow"
                :striped="striped"
                :row-class="rowClass"
                @row-click="handleRowClick"
                @cell-click="handleCellClick"
                @row-select="toggleRowSelection"
                @toggle-expand="toggleRowExpand(flatRow.row)"
              >
                <template #cell="params">
                  <slot :name="cellSlotName(params.column)" v-bind="params">
                    <slot name="cell" v-bind="params">
                      <TableRendererOutlet
                        :renderer="resolveCellRenderer(params.column)"
                        :params="params"
                        :fallback="params.value"
                      />
                    </slot>
                  </slot>
                </template>
                <template #edit="params">
                  <slot
                    :name="
                      params.column.slots?.edit ??
                      `edit-${columnSlotKey(params.column)}`
                    "
                    v-bind="params"
                    ><slot name="edit-cell" v-bind="params"
                  /></slot>
                </template>
              </TableDataRow>
            </template>
            <template #detail="params"
              ><slot name="detail" v-bind="params"
            /></template>
            <template #loading="params"
              ><slot name="detail-loading" v-bind="params"
            /></template>
            <template #error="params"
              ><slot name="detail-error" v-bind="params"
            /></template>
          </TableRowBlock>
        </div>

        <div v-else :class="ns.e('data-empty')" role="row">
          <slot name="notFound">
            {{ emptyText || t('vs.table.emptyText') }}
          </slot>
        </div>

        <TableFooterRows
          v-if="footerData.length && resolvedColumnCount"
          ref="footerRowsRef"
          :data="footerData"
          :row-key="footerRowKey"
          :entries="renderedColumnEntries"
          :row-offset="footerAriaOffset"
          :style="virtualBandStyle"
          :fixed-style="fixedBandStyle"
          :renderers="renderers"
          :overflow="showFooterOverflow"
          :retain-heights="horizontalVirtualMode"
          @cell-click="
            (params, event) => emit('footerCellClick', params, event)
          "
        >
          <template #cell="params">
            <slot
              :name="
                params.column.slots?.footer ??
                `footer-${columnSlotKey(params.column)}`
              "
              v-bind="params"
            >
              <slot name="footer-cell" v-bind="params" />
            </slot>
          </template>
        </TableFooterRows>

        <div v-if="loading" :class="ns.e('loading-mask')" aria-live="polite">
          <span :class="ns.e('loading-spinner')" />
        </div>
      </div>
    </div>

    <div v-if="$slots.footer" :class="ns.e('footer')">
      <slot name="footer" />
    </div>
    <div v-if="pagination.enabled.value" :class="ns.e('pagination')">
      <SPagination
        :current-page="pagination.currentPage.value"
        :page-size="pagination.pageSize.value"
        :total="pagination.total.value"
        :page-sizes="pagination.config.value.pageSizes"
        :layout="
          pagination.config.value.layout ?? [
            'total',
            'prev',
            'pager',
            'next',
            'sizes',
          ]
        "
        :pager-count="pagination.config.value.pagerCount"
        :hide-on-single-page="pagination.config.value.hideOnSinglePage"
        :shape="pagination.config.value.shape"
        :disabled="loading || pagination.config.value.disabled"
        @update:current-page="pagination.changePage"
        @update:page-size="pagination.changeSize"
      />
    </div>
    <SPopper
      v-if="overflow.reference.value"
      v-model:visible="overflow.visible.value"
      virtual-triggering
      :virtual-ref="overflow.reference.value"
      :trigger="[]"
      placement="top"
      :offset="8"
      :show-arrow="false"
      :popper-class="ns.e('overflow-tooltip')"
      :content="overflow.content.value"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, provide, ref, shallowRef, watch } from 'vue'
import { SPopper } from '@vuesax-alpha/components/popper'
import { SPagination } from '@vuesax-alpha/components/pagination'
import { SVirtualList } from '@vuesax-alpha/components/virtual-list'
import { useId, useLocale, useNamespace } from '@vuesax-alpha/hooks'
import { tableColumnRegistrationKey, tableEmits, tableProps } from './table'
import {
  useTable,
  useTableColumnVirtualization,
  useTableTree,
} from './composables'
import { resolveColumnPixelWidth } from './composables/use-table-column-virtualization'
import TableDataRow from './table-data-row.vue'
import TableRendererOutlet from './renderer-outlet'
import TableHeaderCell from './table-header-cell.vue'
import TableHeaderRows from './table-header-rows.vue'
import TableFooterRows from './table-footer-rows.vue'
import TableRowBlock from './table-row-block.vue'
import { useTableEdit } from './composables/use-table-edit'
import { useTableChanges } from './composables/use-table-changes'
import { useTableEditLifecycle } from './composables/use-table-edit-lifecycle'
import { useTableValidation } from './composables/use-table-validation'
import { useTableValidationApi } from './composables/use-table-validation-api'
import { tableValidationId } from './validation-utils'
import { useTableDetails } from './composables/use-table-details'
import { flattenTableColumns } from './composables/table-column-tree'
import { tableColumnKey, tableFieldValue } from './data-utils'
import { useTableQuery } from './composables/use-table-query'
import { useTableSelection } from './composables/use-table-selection'
import { useTableOverflow } from './composables/use-table-overflow'
import { useTablePagination } from './composables/use-table-pagination'
import { useTableColumnResize } from './composables/use-table-column-resize'
import { useTableColumnManager } from './composables/use-table-column-manager'
import TableColumnManager from './table-column-manager.vue'
import type { VirtualListInstance } from '@vuesax-alpha/components/virtual-list'
import type { CSSProperties } from 'vue'
import type {
  TableCellRenderParams,
  TableCellRenderer,
  TableColumn,
  TableEditContext,
  TableEditRenderer,
  TableFilterValue,
  TableFlatRow,
  TableHeaderRenderParams,
  TableHeaderRenderer,
  TableRenderedColumnEntry,
  TableRenderedEntry,
  TableRenderer,
  TableRow,
  TableRowKey,
  TableVirtualConfig,
  TableVirtualSource,
} from './table'

defineOptions({ name: 'STable' })

const ns = useNamespace('table')
const { t } = useLocale()
const props = defineProps(tableProps)
const emit = defineEmits(tableEmits)
const virtualListRef = ref<VirtualListInstance>()
const footerRowsRef = ref<InstanceType<typeof TableFooterRows>>()
const dataBodyRef = ref<HTMLElement>()
const sourceDetailRows = new WeakMap<TableRow, TableFlatRow>()
const tableScrollRef = ref<HTMLElement>()
const columnScrollRef = ref<HTMLElement>()
const selectionName = useId()
const overflow = useTableOverflow()

interface RegisteredColumn {
  id: symbol
  column: TableColumn
}

const registeredColumns = shallowRef<RegisteredColumn[]>([])
const registerColumn = (id: symbol, column: TableColumn) => {
  registeredColumns.value = [...registeredColumns.value, { id, column }]
}
const updateColumn = (id: symbol, column: TableColumn) => {
  registeredColumns.value = registeredColumns.value.map((entry) =>
    entry.id === id ? { id, column } : entry,
  )
}
const unregisterColumn = (id: symbol) => {
  registeredColumns.value = registeredColumns.value.filter(
    (entry) => entry.id !== id,
  )
}

provide(tableColumnRegistrationKey, {
  register: registerColumn,
  update: updateColumn,
  unregister: unregisterColumn,
})

const columnTree = computed(() =>
  flattenTableColumns(
    props.columns.length
      ? props.columns
      : registeredColumns.value.map((entry) => entry.column),
  ),
)
const rawColumns = computed(() => columnTree.value.leaves)
const headerDepth = computed(() => {
  if (!props.virtualSource) return columnTree.value.depth
  const depth = props.virtualSource.headerDepth ?? 1
  return Number.isFinite(depth) ? Math.max(1, Math.floor(depth)) : 1
})
const headerPathFor = (entry: TableRenderedColumnEntry) =>
  props.virtualSource
    ? (props.virtualSource.headerPath?.(entry.index) ?? []).map((column) => ({
        key: column.key,
        column,
      }))
    : (columnTree.value.paths.get(
        entry.column.key ?? entry.column.field ?? `@${entry.index}`,
      ) ?? [])
const columnResize = useTableColumnResize(props, emit, rawColumns)
const sizedColumns = computed(() =>
  rawColumns.value.map((column, index) => {
    const width = columnResize.widthFor(column, index)
    return width == null ? column : { ...column, width }
  }),
)
const columnManager = useTableColumnManager(props, emit, sizedColumns)
const resolvedColumns = columnManager.visibleColumns
watch(columnManager.state, columnResize.cancel, { deep: true })

const { tableKls } = useTable(props)
const query = useTableQuery(props, emit, sizedColumns)
const {
  sorts,
  filters: filtersState,
  setSort,
  clearSort,
  setFilters,
  clearFilters,
} = query
const sortOrder = (column: TableColumn) =>
  sorts.value.find((sort) => sort.field === tableColumnKey(column))?.order
const sortPriority = (column: TableColumn) =>
  sorts.value.length > 1
    ? sorts.value.findIndex((sort) => sort.field === tableColumnKey(column)) + 1
    : undefined
const setColumnFilter = (column: TableColumn, values: TableFilterValue[]) =>
  setFilters({ ...filtersState.value, [tableColumnKey(column)]: values })

const tree = useTableTree({
  data: computed(() => props.data),
  rowKey: computed(() => props.rowKey),
  config: computed(() => props.treeConfig),
  expandedKeys: computed(() => props.expandedKeys),
  sortRows: query.sortRows,
  filterRow: query.filterRow,
  onExpandedKeysChange: (keys) => emit('update:expandedKeys', keys),
  onTreeExpand: (row, expanded) => emit('treeExpand', row, expanded),
  onLazyLoad: (row, children) => emit('lazyLoad', row, children),
})

const { setExpandedKeys, toggleRowExpand } = tree
const pagination = useTablePagination(props, emit, tree.flatRows)
const flatRows = pagination.rows
const getRowIndex = (rowOrKey: TableRow | TableRowKey) => {
  const index = tree.getRowIndex(rowOrKey)
  if (index < 0) return -1
  if (!pagination.enabled.value || pagination.remote.value) return index
  return flatRows.value.indexOf(tree.flatRows.value[index])
}
watch([sorts, filtersState], pagination.reset)
const {
  selected: isRowSelected,
  isSelectable,
  allSelected,
  indeterminate,
  selectableRows,
  onRowClick: selectRowOnClick,
  getSelectedRows,
  setSelectedRows,
  toggleRowSelection,
  clearSelection,
  selectAll,
} = useTableSelection(props, emit, {
  columns: computed(() =>
    props.virtualSource
      ? renderedColumnEntries.value
          .filter(
            (entry): entry is TableRenderedColumnEntry =>
              entry.kind === 'column',
          )
          .map((entry) => entry.column)
          .concat(columnManager.customizedSelectionColumns.value)
      : sizedColumns.value,
  ),
  flatRows,
  getAllRows: tree.getAllRows,
  getRowKey: (row, index) =>
    sourceDetailRows.get(row)?.key ?? tree.getRowKey(row, index),
  pageKey: computed(() =>
    pagination.enabled.value
      ? `${pagination.currentPage.value}:${pagination.pageSize.value}`
      : '',
  ),
})
const treeIndent = computed(() => Math.max(0, props.treeConfig?.indent ?? 20))
const virtualSourceActive = computed(() => Boolean(props.virtualSource))
const effectiveRowCount = computed(() =>
  props.virtualSource ? pagination.sourceCount.value : flatRows.value.length,
)
const resolvedColumnCount = computed(() =>
  props.virtualSource
    ? columnManager.layout.value.visibleCount
    : resolvedColumns.value.length,
)

const resolveSourceRowKey = (row: TableRow, index: number): TableRowKey => {
  if (typeof props.rowKey === 'function') return props.rowKey(row, index)
  const key = row[props.rowKey]
  return typeof key === 'string' || typeof key === 'number' ? key : index
}

const details = useTableDetails(props, emit, sizedColumns)
const resolveEditContext = (
  context: TableEditContext,
): TableEditContext | undefined => {
  const flat = props.virtualSource
    ? createSourceFlatRow(context.rowIndex)
    : flatRows.value[getRowIndex(context.rowKey)]
  if (!flat || flat.key !== context.rowKey) return undefined
  const index = props.virtualSource
    ? context.columnIndex
    : resolvedColumns.value.findIndex(
        (column, index) =>
          (column.key ?? column.field ?? String(index)) === context.columnKey,
      )
  const column = props.virtualSource
    ? columnManager.columnAt(index)
    : resolvedColumns.value[index]
  return column
    ? {
        ...context,
        row: flat.row,
        rowIndex: flat.index,
        depth: flat.depth,
        expanded: flat.expanded,
        loading: flat.loading,
        column,
        columnIndex: index,
        value: tableFieldValue(flat.row, column.field),
      }
    : undefined
}
const validation = useTableValidation(
  (result) => {
    emit('validation', result)
  },
  {
    required: (field) => t('vs.table.validationRequired', { field }),
    invalid: (field) => t('vs.table.validationInvalid', { field }),
  },
)
const changes = useTableChanges(props, emit, {
  editing: () => Boolean(editing.active.value),
  children: tree.getChildren,
  changed: () => {
    validation.clear()
    measure()
  },
})
const editing = useTableEdit(props, emit, resolveEditContext, {
  validate: (record) => validationApi.validateEdit(record),
  apply: (record, current) =>
    changes.enabled.value ? changes.applyEdit(record, current) : true,
  invalidate: (context, field) => {
    changes.cancelDataChange()
    validation.clear(context.rowKey, field)
    measure()
  },
})
const detailPanelId = (key: TableRowKey) =>
  `${selectionName.value}-detail-${encodeURIComponent(`${typeof key}:${String(key)}`)}`
const detailIndices = computed(() => {
  const indices: number[] = []
  if (!details.enabled.value || props.virtualSource) return indices
  flatRows.value.forEach((row, index) => {
    if (details.expanded(row)) indices.push(index)
  })
  return indices
})
const detailRowOffset = (index: number) => {
  if (props.virtualSource && details.enabled.value) return undefined
  const indices = detailIndices.value
  let low = 0,
    high = indices.length
  while (low < high) {
    const middle = (low + high) >>> 1
    if (indices[middle] < index) low = middle + 1
    else high = middle
  }
  return (props.showHeader ? headerDepth.value : 0) + 1 + low
}
const detailAriaIndex = (index: number) => {
  const offset = detailRowOffset(index)
  return offset == null ? undefined : offset + index + 1
}
const footerAriaOffset = computed(() =>
  props.virtualSource && details.enabled.value
    ? undefined
    : effectiveRowCount.value +
      detailIndices.value.length +
      (props.showHeader ? headerDepth.value : 0) +
      1,
)
const tableAriaRowCount = computed(() =>
  footerAriaOffset.value == null
    ? -1
    : footerAriaOffset.value -
      1 +
      (resolvedColumnCount.value ? props.footerData.length : 0),
)
const resetDetailMeasurements = () =>
  nextTick(() => virtualListRef.value?.resetMeasurements())
watch([details.keys, details.enabled], ([keys, enabled], [previous]) => {
  if (!enabled || [...previous].some((key) => !keys.has(key)))
    resetDetailMeasurements()
})
const createSourceFlatRow = (sourceIndex: number): TableFlatRow => {
  const source = props.virtualSource!
  const row = source.row(sourceIndex)
  const flat: TableFlatRow = {
    row,
    key: source.rowKey?.(sourceIndex) ?? resolveSourceRowKey(row, sourceIndex),
    index: sourceIndex,
    depth: 0,
    hasChildren: false,
    expanded: false,
    loading: false,
  }
  sourceDetailRows.set(row, flat)
  return flat
}
const resolveDetailRow = (
  rowOrIndex: TableRow | number,
): TableFlatRow | undefined => {
  if (props.virtualSource) {
    if (typeof rowOrIndex !== 'number') return sourceDetailRows.get(rowOrIndex)
    return Number.isInteger(rowOrIndex) &&
      rowOrIndex >= 0 &&
      rowOrIndex < props.virtualSource.rowCount
      ? createSourceFlatRow(rowOrIndex)
      : undefined
  }
  const index =
    typeof rowOrIndex === 'number' ? rowOrIndex : getRowIndex(rowOrIndex)
  return flatRows.value[index]
}
const toggleRowDetail = async (
  rowOrIndex: TableRow | number,
  expanded?: boolean,
) => {
  const row = resolveDetailRow(rowOrIndex)
  if (row) await details.toggle(row, expanded)
}
const reloadRowDetail = async (rowOrIndex: TableRow | number) => {
  const row = resolveDetailRow(rowOrIndex)
  if (row) await details.ensure(row, true)
}
const setDetailExpandedKeys = details.setKeys
const virtualItemAt = (index: number): TableFlatRow => {
  if (!props.virtualSource) return flatRows.value[index]
  const sourceIndex = index + pagination.sourceOffset.value
  return createSourceFlatRow(sourceIndex)
}

const virtualRowKeyAt = (index: number): TableRowKey =>
  props.virtualSource?.rowKey?.(index + pagination.sourceOffset.value) ??
  (props.virtualSource
    ? index + pagination.sourceOffset.value
    : (flatRows.value[index]?.key ?? index))

const virtualOptions = computed<Required<TableVirtualConfig>>(() => {
  const config =
    typeof props.virtualConfig === 'object' ? props.virtualConfig : {}
  return {
    enabled: config.enabled ?? props.virtualConfig !== false,
    height: config.height ?? 360,
    estimateSize: Math.max(1, config.estimateSize ?? 44),
    overscan: Math.max(0, config.overscan ?? 6),
    dynamic: config.dynamic ?? true,
    horizontal: config.horizontal ?? false,
    columnOverscan: Math.max(0, config.columnOverscan ?? 2),
  }
})

const virtualEnabled = computed(
  () =>
    virtualSourceActive.value ||
    (props.virtualConfig !== false && virtualOptions.value.enabled),
)

const dynamicRows = computed(
  () =>
    virtualOptions.value.dynamic ||
    details.enabled.value ||
    editing.enabled.value ||
    validation.hasErrors.value,
)

const usesBodyScroll = computed(
  () =>
    virtualEnabled.value &&
    effectiveRowCount.value > 0 &&
    resolvedColumnCount.value > 0,
)

const cssSize = (value: number | string | undefined, fallback: string) =>
  typeof value === 'number' ? `${value}px` : value || fallback

const columnBaseSize = (column: TableColumn) =>
  cssSize(column.width ?? column.minWidth, '120px')

const sourceColumnWidth = (index: number) => {
  const source = props.virtualSource as TableVirtualSource | undefined
  if (!source) return undefined
  const width = columnResize.widthFor({ key: String(index) }, index)
  if (width != null) return width
  return typeof source.columnWidth === 'function'
    ? source.columnWidth(index)
    : source.columnWidth
}

const columnStyles = computed<CSSProperties[]>(() =>
  virtualSourceActive.value
    ? []
    : resolvedColumns.value.map((column) => {
        const baseSize = columnBaseSize(column)
        if (column.width != null) {
          return {
            width: baseSize,
            minWidth: baseSize,
            flex: `0 0 ${baseSize}`,
          }
        }

        return {
          minWidth: baseSize,
          flex: `1 0 ${baseSize}`,
        }
      }),
)

const dataMinWidth = computed(() => {
  if (virtualSourceActive.value) return '0px'
  const baseSizes = resolvedColumns.value.map(columnBaseSize)
  return baseSizes.length ? `calc(${baseSizes.join(' + ')})` : '0px'
})

interface IndexedColumn {
  column: TableColumn
  index: number
}

const columnPartitions = computed(() => {
  const left: IndexedColumn[] = []
  const center: IndexedColumn[] = []
  const right: IndexedColumn[] = []
  if (props.virtualSource) {
    for (const index of columnManager.layout.value.left)
      left.push({ column: columnManager.columnAt(index), index })
    for (const index of columnManager.layout.value.right)
      right.push({ column: columnManager.columnAt(index), index })
    return {
      left,
      center,
      right,
      centerCount: columnManager.layout.value.centerCount,
    }
  }

  resolvedColumns.value.forEach((column, index) => {
    const entry = { column, index }
    if (column.fixed === true || column.fixed === 'left') left.push(entry)
    else if (column.fixed === 'right') right.push(entry)
    else center.push(entry)
  })
  return { left, center, right, centerCount: center.length }
})

const centerColumns = computed(() =>
  columnPartitions.value.center.map((entry) => entry.column),
)
const centerColumnCount = computed(() => columnPartitions.value.centerCount)
const centerColumnAt = (virtualIndex: number): IndexedColumn | undefined => {
  if (props.virtualSource) {
    if (virtualIndex < 0 || virtualIndex >= centerColumnCount.value)
      return undefined
    const index = columnManager.layout.value.centerAt(virtualIndex)
    return { column: columnManager.columnAt(index), index }
  }
  return columnPartitions.value.center[virtualIndex]
}
const indexedColumnBaseSize = ({ column, index }: IndexedColumn) =>
  props.virtualSource
    ? cssSize(sourceColumnWidth(index), '120px')
    : columnBaseSize(column)

const fixedPixelMetrics = computed(() => {
  const widths = [
    ...columnPartitions.value.left,
    ...columnPartitions.value.right,
  ].map((entry) =>
    resolveColumnPixelWidth(
      props.virtualSource
        ? sourceColumnWidth(entry.index)
        : (entry.column.width ?? entry.column.minWidth),
    ),
  )
  return {
    supported: widths.every((width): width is number => width != null),
    total: widths.reduce<number>(
      (sum, width) => sum + (typeof width === 'number' ? width : 0),
      0,
    ),
  }
})

const columnVirtualization = useTableColumnVirtualization({
  columns: centerColumns,
  columnCount: centerColumnCount,
  uniformColumnWidth: computed(() =>
    props.virtualSource && typeof props.virtualSource.columnWidth !== 'function'
      ? props.virtualSource.columnWidth
      : undefined,
  ),
  columnWidthOverrides: computed(() => {
    const overrides = new Map<number, number>()
    if (!props.virtualSource) return overrides
    const widths = { ...columnResize.widths.value }
    if (columnResize.session.value)
      widths[columnResize.session.value.key] = columnResize.session.value.width
    for (const [key, width] of Object.entries(widths)) {
      const index = Number(key)
      const virtualIndex = columnManager.layout.value.centerIndexOf(index)
      if (
        Number.isInteger(index) &&
        virtualIndex >= 0 &&
        Number.isFinite(width) &&
        width > 0
      )
        overrides.set(virtualIndex, width)
    }
    return overrides
  }),
  columnWidth: (virtualIndex) => {
    if (props.virtualSource)
      return sourceColumnWidth(
        columnManager.layout.value.centerAt(virtualIndex),
      )
    const entry = centerColumnAt(virtualIndex)
    if (!entry) return undefined
    return entry.column.width ?? entry.column.minWidth
  },
  horizontal: computed(
    () =>
      (virtualSourceActive.value || virtualOptions.value.horizontal) &&
      fixedPixelMetrics.value.supported,
  ),
  overscan: computed(() => virtualOptions.value.columnOverscan),
  scrollElement: columnScrollRef,
  reservedWidth: computed(() => fixedPixelMetrics.value.total),
})
const horizontalVirtualActive = computed(
  () => columnVirtualization.active.value && fixedPixelMetrics.value.supported,
)
const horizontalVirtualMode = computed(
  () =>
    virtualEnabled.value &&
    (virtualSourceActive.value || virtualOptions.value.horizontal) &&
    columnVirtualization.supported.value &&
    fixedPixelMetrics.value.supported,
)
const totalTablePixelWidth = computed(
  () =>
    fixedPixelMetrics.value.total +
    columnVirtualization.physicalTotalWidth.value,
)
const dataViewMinWidth = computed(() =>
  horizontalVirtualActive.value && !usesBodyScroll.value
    ? `${totalTablePixelWidth.value}px`
    : horizontalVirtualMode.value
      ? '0px'
      : dataMinWidth.value,
)
const virtualBandStyle = computed<CSSProperties>(() =>
  horizontalVirtualActive.value
    ? {
        width: `${totalTablePixelWidth.value}px`,
        transform: !usesBodyScroll.value
          ? undefined
          : `translateX(-${columnVirtualization.scrollLeft.value}px)`,
      }
    : {},
)
const virtualBodyStyle = computed<CSSProperties>(() => ({
  '--s-table-virtual-width': horizontalVirtualActive.value
    ? `${totalTablePixelWidth.value}px`
    : '100%',
}))
const columnRange = computed(() => columnVirtualization.range.value)

watch(
  () => [columnRange.value.start, columnRange.value.end] as const,
  () => {
    if (!virtualEnabled.value || !dynamicRows.value) return
    nextTick(() => virtualListRef.value?.measureVisible())
  },
  { flush: 'post' },
)

const visibleCenterEntries = computed<TableRenderedColumnEntry[]>(() => {
  const { start, end } = columnRange.value
  const entries: TableRenderedColumnEntry[] = []
  for (let virtualIndex = start; virtualIndex < end; virtualIndex++) {
    const indexedColumn = centerColumnAt(virtualIndex)
    if (!indexedColumn) continue
    const { column, index } = indexedColumn
    const pixelWidth = columnVirtualization.pixelWidthAt(virtualIndex)
    const style = horizontalVirtualActive.value
      ? {
          width: `${pixelWidth}px`,
          minWidth: `${pixelWidth}px`,
          flex: `0 0 ${pixelWidth}px`,
        }
      : columnStyles.value[index]
    entries.push({
      kind: 'column',
      key: `column:${index}`,
      column,
      index,
      style,
      ariaIndex: columnPartitions.value.left.length + virtualIndex,
    })
  }
  return entries
})

const cssOffset = (sizes: string[]) =>
  sizes.length ? `calc(${sizes.join(' + ')})` : '0px'

const createFixedEntries = (
  entries: IndexedColumn[],
  side: 'left' | 'right',
): TableRenderedColumnEntry[] => {
  const sizes = entries.map(indexedColumnBaseSize)
  return entries.map(({ column, index }, fixedIndex) => {
    const offsetSizes =
      side === 'left' ? sizes.slice(0, fixedIndex) : sizes.slice(fixedIndex + 1)
    const size = sizes[fixedIndex]
    return {
      kind: 'column',
      key: `column:${index}`,
      column,
      index,
      fixed: side,
      ariaIndex:
        side === 'left'
          ? fixedIndex
          : columnPartitions.value.left.length +
            centerColumnCount.value +
            fixedIndex,
      fixedBoundary:
        side === 'left' ? fixedIndex === entries.length - 1 : fixedIndex === 0,
      style: {
        width: size,
        minWidth: size,
        flex: `0 0 ${size}`,
        [side]: cssOffset(offsetSizes),
      },
    }
  })
}

const fixedLeftEntries = computed(() =>
  createFixedEntries(columnPartitions.value.left, 'left'),
)
const fixedRightEntries = computed(() =>
  createFixedEntries(columnPartitions.value.right, 'right'),
)
const renderedColumnEntries = computed<TableRenderedEntry[]>(() => {
  const entries: TableRenderedEntry[] = [...fixedLeftEntries.value]
  if (horizontalVirtualActive.value && columnVirtualization.renderBefore.value)
    entries.push({
      kind: 'spacer',
      key: 'center-spacer-before',
      width: columnVirtualization.renderBefore.value,
    })
  entries.push(...visibleCenterEntries.value)
  if (horizontalVirtualActive.value && columnVirtualization.renderAfter.value)
    entries.push({
      kind: 'spacer',
      key: 'center-spacer-after',
      width: columnVirtualization.renderAfter.value,
    })
  entries.push(...fixedRightEntries.value)
  return entries
})

const fixedBandStyle = (entry: TableRenderedColumnEntry): CSSProperties => {
  if (!horizontalVirtualActive.value || !entry.fixed || !usesBodyScroll.value)
    return {}
  const scrollLeft = columnVirtualization.scrollLeft.value
  const shift =
    entry.fixed === 'left'
      ? scrollLeft
      : columnVirtualization.viewportWidth.value -
        totalTablePixelWidth.value +
        scrollLeft
  // Translated header/footer bands already own fixed-column compensation.
  // Native sticky offsets would apply a second viewport adjustment.
  return {
    position: 'relative',
    left: 'auto',
    right: 'auto',
    transform: `translateX(${shift}px)`,
  }
}

const columnSlotKey = (column: TableColumn) =>
  column.key ?? column.field ?? column.type ?? 'column'
const cellSlotName = (column: TableColumn) =>
  column.slots?.default ?? `cell-${columnSlotKey(column)}`
const headerSlotName = (column: TableColumn) =>
  column.slots?.header ?? `header-${columnSlotKey(column)}`
const headerParams = (
  column: TableColumn,
  columnIndex: number,
): TableHeaderRenderParams => ({ column, columnIndex })

const rendererEntry = (column: TableColumn) => {
  if (typeof column.renderer !== 'string') return column.renderer
  return props.renderers[column.renderer]
}

const resolveCellRenderer = (
  column: TableColumn,
): TableCellRenderer | undefined => {
  if (column.cell) return column.cell
  const renderer = rendererEntry(column)
  if (typeof renderer === 'function') return renderer as TableCellRenderer
  return (renderer as TableRenderer | undefined)?.cell
}

const resolveEditRenderer = (
  column: TableColumn,
): TableEditRenderer | undefined => {
  if (column.edit) return column.edit
  const renderer = rendererEntry(column)
  return typeof renderer === 'object' ? renderer?.edit : undefined
}

const resolveHeaderRenderer = (
  column: TableColumn,
): TableHeaderRenderer | undefined => {
  if (column.header) return column.header
  const renderer = rendererEntry(column)
  return typeof renderer === 'object' ? renderer?.header : undefined
}

const handleRowClick = async (row: TableRow, event: MouseEvent) => {
  if (!props.loading) selectRowOnClick(row)
  emit('rowClick', row, event)
  if (props.treeConfig?.expandOnClickRow) await toggleRowExpand(row)
}

const handleCellClick = (params: TableCellRenderParams, event: MouseEvent) =>
  emit('cellClick', params, event)

const handleTableScroll = (event: Event) => {
  if (event.currentTarget === columnScrollRef.value)
    columnVirtualization.handleScroll(event)
  emit('scroll', event)
}

const handleVirtualScroll = (event: Event) => {
  columnVirtualization.handleScroll(event)
  emit('scroll', event)
}

const handleTableWheel = (event: WheelEvent) =>
  columnVirtualization.handleWheel(event)

watch(
  [
    virtualEnabled,
    virtualListRef,
    tableScrollRef,
    effectiveRowCount,
    resolvedColumnCount,
  ],
  () => {
    columnScrollRef.value = virtualEnabled.value
      ? (virtualListRef.value?.getScrollElement() ??
        (!effectiveRowCount.value || !resolvedColumnCount.value
          ? tableScrollRef.value
          : undefined))
      : tableScrollRef.value
  },
  { immediate: true, flush: 'post' },
)

const flatRowKey = (item: unknown) => (item as TableFlatRow).key

const scrollToRow = (
  rowOrIndex: TableRow | TableRowKey | number,
  align: 'auto' | 'start' | 'center' | 'end' = 'auto',
) => {
  let index = -1
  if (props.virtualSource && typeof rowOrIndex === 'number')
    index = rowOrIndex - pagination.sourceOffset.value
  else if (!props.virtualSource) index = getRowIndex(rowOrIndex)
  if (index < 0 && typeof rowOrIndex === 'number' && !props.virtualSource)
    index = rowOrIndex
  if (index < 0 || index >= effectiveRowCount.value) return

  if (virtualEnabled.value) virtualListRef.value?.scrollToIndex(index, align)
  else {
    const row = dataBodyRef.value?.children.item(index) as HTMLElement | null
    row?.scrollIntoView({ block: align === 'auto' ? 'nearest' : align })
  }
}

const scrollToColumn = (
  columnOrIndex: TableColumn | string | number,
  align: 'auto' | 'start' | 'center' | 'end' = 'auto',
) => {
  const originalIndex =
    typeof columnOrIndex === 'object'
      ? columnTree.value.originals.indexOf(columnOrIndex)
      : -1
  const index =
    typeof columnOrIndex === 'number'
      ? columnOrIndex
      : props.virtualSource
        ? -1
        : resolvedColumns.value.findIndex((column, columnIndex) =>
            typeof columnOrIndex === 'string'
              ? column.key === columnOrIndex || column.field === columnOrIndex
              : column === columnOrIndex ||
                (originalIndex >= 0 &&
                  columnResize.keyFor(column, columnIndex) ===
                    columnManager.keyAt(originalIndex)),
          )
  const virtualIndex = props.virtualSource
    ? columnManager.layout.value.centerIndexOf(index)
    : columnPartitions.value.center.findIndex((entry) => entry.index === index)
  if (virtualIndex >= 0)
    columnVirtualization.scrollToColumn(virtualIndex, align)
}

const measure = () =>
  nextTick(() => {
    virtualListRef.value?.resetMeasurements()
    footerRowsRef.value?.measure()
    columnVirtualization.measureViewport()
  })

// Horizontal window changes keep max heights; actual column layout changes reset them.
watch(
  () => [
    columnResize.revision.value,
    columnManager.state.value,
    props.columnWidths,
    columnVirtualization.viewportWidth.value,
    props.virtualSource?.columnWidth,
    rawColumns.value.map((column) => [column.width, column.minWidth]),
  ],
  () => {
    overflow.close()
    nextTick(() => {
      footerRowsRef.value?.measure()
      if (virtualEnabled.value && dynamicRows.value)
        virtualListRef.value?.resetMeasurements()
      columnVirtualization.measureViewport()
    })
  },
  { deep: true, flush: 'post' },
)

watch(
  () => [props.data, props.virtualSource?.row],
  () => measure(),
)

watch([pagination.currentPage, pagination.pageSize], () => {
  overflow.close()
  nextTick(() => {
    if (virtualEnabled.value) virtualListRef.value?.scrollToIndex(0, 'start')
    else if (tableScrollRef.value) tableScrollRef.value.scrollTop = 0
  })
})

watch(
  [
    sorts,
    filtersState,
    () => props.data,
    () => props.columns,
    () => props.showOverflow,
    () => props.showHeaderOverflow,
    () => props.footerData,
    () => props.showFooterOverflow,
  ],
  () => overflow.close(),
)

const startEdit = async (
  rowOrIndex: TableRow | number,
  columnOrIndex: TableColumn | string | number,
): Promise<boolean> => {
  const flat = resolveDetailRow(rowOrIndex)
  if (!flat) return false
  let index = typeof columnOrIndex === 'number' ? columnOrIndex : -1
  let column: TableColumn | undefined
  if (props.virtualSource) {
    if (
      index < 0 ||
      index >= props.virtualSource.columnCount ||
      columnManager.layout.value.hidden.has(index)
    )
      return false
    column = props.virtualSource.column(index)
  } else {
    if (index < 0)
      index = resolvedColumns.value.findIndex((item) =>
        typeof columnOrIndex === 'string'
          ? item.key === columnOrIndex || item.field === columnOrIndex
          : item === columnOrIndex ||
            (typeof columnOrIndex === 'object' &&
              Boolean(
                columnOrIndex.field && item.field === columnOrIndex.field,
              )),
      )
    column = resolvedColumns.value[index]
  }
  if (!column) return false
  const started = await editing.start({
    row: flat.row,
    rowKey: flat.key,
    column,
    columnIndex: index,
    columnKey: column.key ?? column.field ?? String(index),
    rowIndex: flat.index,
    value: tableFieldValue(flat.row, column.field),
    depth: flat.depth,
    expanded: flat.expanded,
    loading: flat.loading,
    toggleExpand: async (value) => toggleRowExpand(flat.row, value),
  })
  if (started) {
    scrollToRow(props.virtualSource ? flat.index : flat.row)
    scrollToColumn(index)
    await nextTick()
  }
  return started
}
const commitEdit = async () => editing.commit()
const cancelEdit = () => editing.cancel()
const getEditRecord = editing.record
// Error text changes the row's natural height, including when it is cleared.
watch(validation.getErrors, () => measure(), { flush: 'post' })
const validationApi = useTableValidationApi(props, validation, editing, {
  tree,
  pagination,
  columns: rawColumns,
  visibleColumns: resolvedColumns,
  sourceRow: createSourceFlatRow,
  sourceColumn: (index) => props.virtualSource!.column(index),
  sourceColumnHidden: (index) => columnManager.layout.value.hidden.has(index),
  scrollRow: (row) => scrollToRow(row),
  scrollColumn: (index) => scrollToColumn(index),
  focusCell: (rowKey, field, columnIndex) => {
    if (typeof document === 'undefined') return false
    const id = `${tableValidationId(selectionName.value, rowKey, field, columnIndex)}-cell`
    const cell = tableScrollRef.value?.querySelector<HTMLElement>(
      `[id="${id}"]`,
    )
    if (!cell || !tableScrollRef.value?.contains(cell)) return false
    const target =
      cell.querySelector<HTMLElement>(
        'input:not(:disabled),textarea:not(:disabled)',
      ) ?? cell
    target.focus({ preventScroll: true })
    return document.activeElement === target
  },
})
watch(
  () => editing.active.value?.id,
  () =>
    nextTick(() => {
      const active = editing.active.value
      if (active) {
        scrollToRow(props.virtualSource ? active.rowIndex : active.row)
        scrollToColumn(active.columnIndex)
      }
      virtualListRef.value?.resetMeasurements()
    }),
)
useTableEditLifecycle(props, editing, {
  query: [sorts, filtersState],
  page: [pagination.currentPage, pagination.pageSize, pagination.enabled],
  columns: [rawColumns, columnManager.state],
  resolveContext: resolveEditContext,
  isDataCurrent: validationApi.isDataCurrent,
  isLocating: validationApi.locating,
})

defineExpose({
  undo: changes.undo,
  redo: changes.redo,
  clearHistory: changes.clearHistory,
  getHistoryState: changes.getHistoryState,
  insertRows: changes.insertRows,
  removeRows: changes.removeRows,
  updateRow: changes.updateRow,
  revertChanges: changes.revertChanges,
  getChangeRecords: changes.getChangeRecords,
  acceptChanges: changes.acceptChanges,
  resetChanges: changes.resetChanges,
  cancelDataChange: changes.cancelDataChange,
  validate: validationApi.validate,
  validateRow: validationApi.validateRow,
  validateCell: validationApi.validateCell,
  clearValidation: validation.clear,
  cancelValidation: validation.cancel,
  getValidationErrors: validation.getErrors,
  scrollToValidationError: validation.scrollToError,
  startEdit,
  commitEdit,
  cancelEdit,
  getEditRecord,
  toggleRowDetail,
  reloadRowDetail,
  setDetailExpandedKeys,
  toggleRowExpand,
  setExpandedKeys,
  scrollToRow,
  scrollToColumn,
  measure,
  setSort,
  clearSort,
  setFilters,
  clearFilters,
  getSelectedRows,
  setSelectedRows,
  clearSelection,
  toggleRowSelection,
  selectAll,
})
</script>
