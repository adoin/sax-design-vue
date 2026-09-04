<template>
  <div :class="ns.b('wrapper')" @keydown="findPanelRef?.keydown($event)">
    <slot />
    <span
      v-if="clipboard.enabled.value"
      :class="ns.e('range-status')"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {{ clipboardStatus }}
    </span>
    <span
      v-if="cellRange.enabled.value"
      :class="ns.e('range-status')"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {{
        cellRange.bounds.value
          ? t('vs.table.rangeSelected', {
              rows:
                cellRange.bounds.value.rowEnd - cellRange.bounds.value.rowStart,
              columns:
                cellRange.bounds.value.colEnd - cellRange.bounds.value.colStart,
            })
          : t('vs.table.rangeEmpty')
      }}
    </span>
    <TableColumnManager
      v-if="columnManager.enabled.value"
      :manager="columnManager"
      :disabled="loading"
    />

    <div v-if="$slots.header" :class="ns.be('wrapper', 'header')">
      <slot name="header" />
    </div>
    <TableFindPanel
      v-if="finder.enabled.value && finder.config.value.panel !== false"
      ref="findPanelRef"
      :finder="finder"
    />
    <TableChartPanel
      v-if="chart.enabled.value"
      :chart="chart"
      @error="emit('chartError', $event)"
    />

    <div
      ref="tableScrollRef"
      :tabindex="keyboard.rootTabindex.value"
      :class="[
        tableKls,
        ns.is('horizontal-virtual', horizontalVirtualMode && usesBodyScroll),
      ]"
      :aria-busy="clipboard.pending.value ? true : undefined"
      @keydown="handleTableKeydown"
      @keydown.capture="handleTableKeydownCapture"
      @copy="clipboard.onClipboard"
      @cut="clipboard.onClipboard"
      @paste="clipboard.onClipboard"
      @pointerdown="rangeInteraction.onPointerdown"
      @click.capture="rangeInteraction.onClickCapture"
      @click="keyboard.onClick"
      @scroll="handleTableScroll"
      @wheel="handleTableWheel"
      @mouseover="overflow.enter"
      @mouseout="overflow.leave"
      @focusin="handleTableFocusin"
      @focusout="overflow.leave"
      @scroll.capture="handleTableScrollCapture"
      @keydown.esc="overflow.close"
    >
      <div
        ref="dataViewRef"
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
              :tabindex="contextMenu.enabled.value ? 0 : undefined"
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
              @contextmenu="
                contextMenu.open(
                  {
                    area: 'header',
                    column: entry.column,
                    columnIndex: entry.index,
                    group: Boolean(entry.group),
                  },
                  $event,
                )
              "
              @keydown="
                contextMenu.open(
                  {
                    area: 'header',
                    column: entry.column,
                    columnIndex: entry.index,
                    group: Boolean(entry.group),
                  },
                  $event,
                )
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
          :items="groups.enabled.value || virtualSourceActive ? [] : flatRows"
          :count="bodyDisplayCount"
          :item-at="virtualItemAt"
          :item-key-at="virtualRowKeyAt"
          :height="virtualOptions.height"
          :estimate-size="virtualOptions.estimateSize"
          :overscan="virtualOptions.overscan"
          :dynamic="dynamicRows"
          :retain-max-size="horizontalVirtualMode && dynamicRows"
          :item-key="groups.enabled.value ? undefined : flatRowKey"
          :class="ns.e('virtual-body')"
          :style="virtualBodyStyle"
          role="rowgroup"
          @scroll="handleVirtualScroll"
        >
          <template #default="{ item, index }">
            <TableBodyBlock
              :item="normalizeBodyItem(item, index)"
              :render-slots="{ ...$slots }"
            />
          </template>
        </SVirtualList>

        <div
          v-else-if="
            !virtualSourceActive && bodyDisplayCount && resolvedColumnCount
          "
          ref="dataBodyRef"
          :class="ns.e('data-body')"
          role="rowgroup"
        >
          <TableBodyBlock
            v-for="index in bodyDisplayCount"
            :key="virtualRowKeyAt(index - 1)"
            :render-slots="{ ...$slots }"
            :item="bodyItemAt(index - 1)"
          />
        </div>

        <div v-else :class="ns.e('data-empty')" role="row">
          <slot name="notFound">
            {{ emptyText || t('vs.table.emptyText') }}
          </slot>
        </div>

        <TableGroupBand
          v-if="showGroupSummary && resolvedColumnCount"
          kind="summary"
          :summary="groups.state.value.summary"
          :disabled="loading"
          :column-count="resolvedColumnCount"
          :viewport-width="columnVirtualization.viewportWidth.value"
          :entries="renderedColumnEntries"
          :row-index="
            footerAriaOffset == null ? undefined : footerAriaOffset - 1
          "
          :fixed-style="fixedBandStyle"
          :style="virtualBandStyle"
          :renderers="renderers"
          :retain-heights="horizontalVirtualMode"
        >
          <template v-if="$slots['group-summary']" #summary="params"
            ><slot name="group-summary" v-bind="params"
          /></template>
        </TableGroupBand>

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
          :context-menu-enabled="contextMenu.enabled.value"
          :merge-at="merges.enabled.value ? footerMergeAt : undefined"
          :minimum-height="footerMergeHeight"
          @cell-context-menu="
            (params, event) =>
              contextMenu.open({ ...params, area: 'footer' }, event)
          "
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

        <TableMergeLayer
          v-if="merges.enabled.value"
          :body-host="
            usesBodyScroll ? virtualListRef?.getScrollElement() : undefined
          "
          :geometry="mergeGeometry.geometry.value"
          :body="merges.body.value"
          :footer="merges.footer.value"
          :range-selected="isRangeMergeSelected"
          @continuation-click="mergeContinuationClick"
          @continuation-dblclick="mergeContinuationDblclick"
          @continuation-contextmenu="mergeContinuationContextmenu"
        >
          <template #cell="{ surface }"
            ><TableMergedCell :surface="surface" :render-slots="{ ...$slots }"
          /></template>
        </TableMergeLayer>

        <div v-if="loading" :class="ns.e('loading-mask')" aria-live="polite">
          <span :class="ns.e('loading-spinner')" />
        </div>
      </div>
    </div>

    <SContextMenu
      v-if="contextMenu.enabled.value"
      :ref="
        (instance) => (contextMenu.menu.value = instance as ContextMenuInstance)
      "
      :items="contextMenu.items.value"
      :min-width="contextMenu.config.value.minWidth"
      @select="contextMenu.select"
      @close="contextMenu.onClose"
    />
    <span
      v-if="rowDragConfig"
      :class="ns.e('drag-status')"
      role="status"
      aria-live="polite"
      aria-atomic="true"
      >{{
        rowDrag.session.value?.target !== undefined
          ? t('vs.table.dragRowTarget', {
              row: rowDrag.session.value.target + 1,
              position: t(
                rowDrag.session.value.position === 'before'
                  ? 'vs.table.dragBefore'
                  : 'vs.table.dragAfter',
              ),
            })
          : rowDrag.announcement.value
            ? t(`vs.table.dragStatus.${rowDrag.announcement.value}`)
            : ''
      }}</span
    >
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
import {
  computed,
  h,
  nextTick,
  ref,
  renderSlot,
  shallowRef,
  useSlots,
  watch,
} from 'vue'
import { SPopper } from '@vuesax-alpha/components/popper'
import { SPagination } from '@vuesax-alpha/components/pagination'
import { SVirtualList } from '@vuesax-alpha/components/virtual-list'
import { useId, useLocale, useNamespace } from '@vuesax-alpha/hooks'
import { SContextMenu } from '@vuesax-alpha/components/context-menu'
import { tableEmits, tableProps } from './table'
import { useTableColumnRegistry } from './composables/use-table-column-registry'
import {
  useTable,
  useTableColumnVirtualization,
  useTableTree,
} from './composables'
import { resolveColumnPixelWidth } from './composables/use-table-column-virtualization'
import { createTableBodyRow } from './table-body-row'
import TableMergeLayer from './table-merge-layer.vue'
import { useTableMergeGeometry } from './composables/use-table-merge-geometry'
import { useTableMergeRegions } from './composables/use-table-merge-regions'
import { useTableMergeCoordinates } from './composables/use-table-merge-coordinates'
import { useTableMergeHeights } from './composables/use-table-merge-heights'
import TableRendererOutlet from './renderer-outlet'
import TableHeaderCell from './table-header-cell.vue'
import TableHeaderRows from './table-header-rows.vue'
import TableFooterRows from './table-footer-rows.vue'
import TableGroupBand from './table-group-band.vue'
import { createTableBodyBlock } from './table-body-block'
import { useTableGroups } from './composables/use-table-groups'
import { useTableEdit } from './composables/use-table-edit'
import { useTableChanges } from './composables/use-table-changes'
import { useTableEditLifecycle } from './composables/use-table-edit-lifecycle'
import { useTableRowReorder } from './composables/use-table-row-reorder'
import { useTableRowDrag } from './composables/use-table-row-drag'
import { useTableKeyboard } from './composables/use-table-keyboard'
import { useTableKeyboardCoordinates } from './composables/use-table-keyboard-coordinates'
import { useTableRangeController } from './composables/use-table-range-controller'
import { useTableClipboard } from './composables/use-table-clipboard'
import { createTableClipboardCells } from './composables/table-clipboard-cells'
import { useTableFind } from './composables/use-table-find'
import { useTableChart } from './composables/use-table-chart'
import { createTableChartScope } from './composables/table-chart-scope'
import TableChartPanel from './table-chart-panel.vue'
import { createTableFindScope } from './composables/table-find-scope'
import TableFindPanel from './table-find-panel.vue'
import { useTableRangeInteraction } from './composables/use-table-range-interaction'
import {
  tableRangeScrollParent,
  tableRangeViewport,
} from './composables/table-range-scroll'
import { useTableContextMenu } from './composables/use-table-context-menu'
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
import type { TableBodyItem } from './table-body-block'
import type { TableMergeSurface } from './table-merge-layer.vue'
import type { ContextMenuInstance } from '@vuesax-alpha/components/context-menu'
import type { VirtualListInstance } from '@vuesax-alpha/components/virtual-list'
import type { CSSProperties, Slots } from 'vue'
import type {
  TableCellRenderParams,
  TableCellRenderer,
  TableColumn,
  TableEditContext,
  TableEditRenderer,
  TableExposes,
  TableFilterValue,
  TableFlatRow,
  TableFooterCellRenderParams,
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
const dataViewRef = ref<HTMLElement>()
const tableSlots = useSlots()
const sourceDetailRows = new WeakMap<TableRow, TableFlatRow>()
const tableScrollRef = ref<HTMLElement>()
const columnScrollRef = ref<HTMLElement>()
const selectionName = useId()
const overflow = useTableOverflow()

const registeredColumns = useTableColumnRegistry()

const columnTree = computed(() =>
  flattenTableColumns(
    props.columns.length ? props.columns : registeredColumns.value,
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

const loadedTreeRevision = shallowRef(0)
const tree = useTableTree({
  data: computed(() => props.data),
  rowKey: computed(() => props.rowKey),
  config: computed(() => props.treeConfig),
  expandedKeys: computed(() => props.expandedKeys),
  sortRows: query.sortRows,
  filterRow: query.filterRow,
  onExpandedKeysChange: (keys) => emit('update:expandedKeys', keys),
  onTreeExpand: (row, expanded) => emit('treeExpand', row, expanded),
  onLazyLoad: (row, children) => {
    loadedTreeRevision.value++
    emit('lazyLoad', row, children)
  },
})

const { setExpandedKeys, toggleRowExpand } = tree
const pagination = useTablePagination(props, emit, tree.flatRows)
const groups = useTableGroups({
  config: () => props.groupConfig,
  rows: () => pagination.rows.value,
  filteredRows: () => tree.flatRows.value,
  sourceBounds: () =>
    props.virtualSource
      ? {
          count: pagination.sourceCount.value,
          offset: pagination.sourceOffset.value,
        }
      : undefined,
  expandedKeys: () => props.groupExpandedKeys,
  disabled: () => props.loading,
  onExpandedKeysChange: (keys) => emit('update:groupExpandedKeys', keys),
  onExpand: (params) => emit('groupExpand', params),
  onError: (error) => emit('groupError', error),
})
const flatRows = computed(() => {
  if (
    !groups.enabled.value ||
    !groups.state.value.groups.length ||
    props.virtualSource
  )
    return pagination.rows.value
  const layout = groups.layout.value
  return Array.from(
    { length: layout.dataCount },
    (_, index) => groups.state.value.rows[layout.rowIndexAt(index)!],
  )
})
const bodyDisplayCount = computed(() => groups.layout.value.count)
const showGroupSummary = computed(
  () =>
    groups.enabled.value &&
    groups.config.value.summary &&
    groups.state.value.error === undefined,
)
const sourceIndexAt = (index: number) =>
  groups.layout.value.rowIndexAt(index) ?? -1
const sourceViewIndex = (index: number) =>
  groups.layout.value.dataIndexOf(index) ?? -1
const getRowIndex = (rowOrKey: TableRow | TableRowKey) => {
  const index = tree.getRowIndex(rowOrKey)
  if (index < 0) return -1
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
  props.virtualSource ? groups.layout.value.dataCount : flatRows.value.length,
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
  return (
    (props.showHeader ? headerDepth.value : 0) +
    1 +
    low +
    (groups.layout.value.renderIndexAt(index) ?? index) -
    index
  )
}
const detailAriaIndex = (index: number) => {
  const offset = detailRowOffset(index)
  return offset == null ? undefined : offset + index + 1
}
const footerAriaOffset = computed(() =>
  props.virtualSource && details.enabled.value
    ? undefined
    : bodyDisplayCount.value +
      detailIndices.value.length +
      (showGroupSummary.value ? 1 : 0) +
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
const bodyItemAt = (index: number): TableBodyItem => {
  const item = groups.layout.value.itemAt(index)!
  if (item.kind !== 'data') return { ...item, renderIndex: index }
  return {
    kind: 'data',
    flatRow: props.virtualSource
      ? createSourceFlatRow(item.rowIndex)
      : flatRows.value[item.dataIndex],
    index: item.dataIndex,
    renderIndex: index,
  }
}
const virtualItemAt = (index: number) =>
  groups.enabled.value
    ? bodyItemAt(index)
    : props.virtualSource
      ? createSourceFlatRow(index + pagination.sourceOffset.value)
      : flatRows.value[index]
const normalizeBodyItem = (item: unknown, index: number): TableBodyItem =>
  groups.enabled.value
    ? (item as TableBodyItem)
    : { kind: 'data', flatRow: item as TableFlatRow, index, renderIndex: index }
const flatRowKey = (item: unknown) => (item as TableFlatRow).key

const virtualRowKeyAt = (index: number): TableRowKey => {
  const item = groups.layout.value.itemAt(index)
  if (!item) return `removed:${index}`
  if (item.kind !== 'data') return `${item.kind}:${item.group.key}`
  const key =
    props.virtualSource?.rowKey?.(item.rowIndex) ??
    (props.virtualSource
      ? item.rowIndex
      : (flatRows.value[item.dataIndex]?.key ?? index))
  return groups.enabled.value ? `data:${typeof key}:${String(key)}` : key
}

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
const { tableKls } = useTable(props, virtualEnabled)

const dynamicRows = computed(
  () =>
    virtualOptions.value.dynamic ||
    details.enabled.value ||
    groups.enabled.value ||
    editing.enabled.value ||
    validation.hasErrors.value,
)

const usesBodyScroll = computed(
  () =>
    virtualEnabled.value &&
    bodyDisplayCount.value > 0 &&
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
        (!bodyDisplayCount.value || !resolvedColumnCount.value
          ? tableScrollRef.value
          : undefined))
      : tableScrollRef.value
  },
  { immediate: true, flush: 'post' },
)

const scrollToRow = (
  rowOrIndex: TableRow | TableRowKey | number,
  align: 'auto' | 'start' | 'center' | 'end' = 'auto',
) => {
  let index = -1
  if (props.virtualSource && typeof rowOrIndex === 'number')
    index = sourceViewIndex(rowOrIndex)
  else if (!props.virtualSource) index = getRowIndex(rowOrIndex)
  if (index < 0 && typeof rowOrIndex === 'number' && !props.virtualSource)
    index = rowOrIndex
  if (index < 0 || index >= effectiveRowCount.value) return

  const renderIndex = groups.layout.value.renderIndexAt(index) ?? index
  if (virtualEnabled.value)
    virtualListRef.value?.scrollToIndex(renderIndex, align)
  else {
    const row = dataBodyRef.value?.children.item(
      renderIndex,
    ) as HTMLElement | null
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
    mergeHeights.clear()
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
  if (
    props.virtualSource &&
    groups.enabled.value &&
    sourceViewIndex(flat.index) < 0
  )
    return false
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
  const requestedColumn = index
  const region = bodyMergeAt(
    props.virtualSource ? flat.index : getRowIndex(flat.row),
    keyboardCoordinates.positionOf(index),
  )
  const editFlat = region ? mergeFlatRow(region.row) : flat
  if (!editFlat) return false
  if (region) {
    const ownerColumn = mergeColumn(region.col)
    if (!ownerColumn) return false
    index = ownerColumn.index
    column = ownerColumn.column
  }
  const started = await editing.start({
    row: editFlat.row,
    rowKey: editFlat.key,
    column,
    columnIndex: index,
    columnKey: column.key ?? column.field ?? String(index),
    rowIndex: editFlat.index,
    value: tableFieldValue(editFlat.row, column.field),
    depth: editFlat.depth,
    expanded: editFlat.expanded,
    loading: editFlat.loading,
    toggleExpand: async (value) => toggleRowExpand(editFlat.row, value),
  })
  if (started) {
    scrollToRow(props.virtualSource ? flat.index : flat.row)
    scrollToColumn(requestedColumn)
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
  revealRow: (target, current) => {
    const index = props.virtualSource
      ? target.index
      : groups.state.value.rows.findIndex((row) => row.key === target.key)
    return groups.revealRow(index, current)
  },
  focusCell: (rowKey, field, columnIndex, focus = true) => {
    if (!focus) return true
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
      const visibleMerge =
        active &&
        [
          ...(dataViewRef.value?.querySelectorAll<HTMLElement>(
            '[data-merge-primary] [data-row-key]',
          ) ?? []),
        ].some(
          (row) =>
            row.closest('[role="table"]') === dataViewRef.value &&
            row.dataset.rowKey === String(active.rowKey) &&
            row.querySelector(`[data-column-index="${active.columnIndex}"]`),
        )
      if (active && !visibleMerge) {
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

const dragRowAt = (index: number) =>
  index < 0 || index >= effectiveRowCount.value
    ? undefined
    : props.virtualSource
      ? createSourceFlatRow(sourceIndexAt(index))
      : flatRows.value[index]
const rowReorder = useTableRowReorder(props, emit, {
  rowAt: dragRowAt,
  count: () => effectiveRowCount.value,
  blocked: () => {
    const records = changes.getChangeRecords()
    return Boolean(
      sorts.value.length ||
      editing.active.value ||
      records.inserted.length ||
      records.updated.length ||
      records.removed.length,
    )
  },
  children: tree.getChildren,
  changed: () => {
    validation.clear()
    measure()
  },
})
const rowDrag = useTableRowDrag(rowReorder, emit, {
  root: () => tableScrollRef.value,
  scroll: () => {
    const body = virtualListRef.value?.getScrollElement()
    if (body) return body
    let node = tableScrollRef.value
    while (node) {
      if (
        node.scrollHeight > node.clientHeight &&
        /(auto|scroll)/.test(getComputedStyle(node).overflowY)
      )
        return node
      node = node.parentElement ?? undefined
    }
    return tableScrollRef.value?.ownerDocument.scrollingElement as
      HTMLElement | undefined
  },
  rowAt: dragRowAt,
  count: () => effectiveRowCount.value,
  changes: [
    () => props.data,
    () => props.virtualSource,
    sorts,
    filtersState,
    pagination.currentPage,
    pagination.pageSize,
    () => props.expandedKeys,
    () => (props.virtualSource ? undefined : flatRows.value),
    columnManager.state,
  ],
  scrollTo: (index) => {
    const row = dragRowAt(index)
    if (row) scrollToRow(props.virtualSource ? row.index : row.row)
  },
  focus: async (key, generatedIndex) => {
    const index = props.virtualSource
      ? sourceViewIndex(generatedIndex ?? -1)
      : flatRows.value.findIndex((row) => row.key === key)
    const row = dragRowAt(index)
    if (!row) return
    scrollToRow(props.virtualSource ? row.index : row.row)
    await nextTick()
    tableScrollRef.value
      ?.querySelector<HTMLElement>(
        `[data-table-row-index="${index}"] .${ns.e('row-drag-handle')}`,
      )
      ?.focus({ preventScroll: true })
  },
})

const keyboardCoordinates = useTableKeyboardCoordinates(props, {
  rows: flatRows,
  count: () => effectiveRowCount.value,
  offset: () => pagination.sourceOffset.value,
  sourceViewIndex,
  rowAt: dragRowAt,
  columns: resolvedColumns,
  manager: columnManager,
})
const mergeRowOffset = computed(() =>
  props.virtualSource ? pagination.sourceOffset.value : 0,
)
const mergeFlatRow = (index: number) =>
  props.virtualSource
    ? index >= 0 && index < props.virtualSource.rowCount
      ? createSourceFlatRow(index)
      : undefined
    : flatRows.value[index]
const mergeColumn = (position: number) => {
  const index = keyboardCoordinates.columnAt(position)
  return index < 0
    ? undefined
    : {
        index,
        column: props.virtualSource
          ? columnManager.columnAt(index)
          : resolvedColumns.value[index],
      }
}
const mergeGeometry = useTableMergeGeometry({
  enabled: () =>
    Boolean(props.mergeConfig) &&
    (typeof props.mergeConfig !== 'object' ||
      props.mergeConfig.enabled !== false),
  root: () => dataViewRef.value,
  viewport: () =>
    usesBodyScroll.value
      ? (virtualListRef.value?.getScrollElement() ?? undefined)
      : tableScrollRef.value,
  rowOffset: () => mergeRowOffset.value,
  rowIndex: (index) => (props.virtualSource ? sourceIndexAt(index) : index),
})
const merges = useTableMergeRegions({
  config: () => props.mergeConfig,
  columnCount: keyboardCoordinates.countColumns,
  columnAt: (position) => mergeColumn(position)?.column,
  body: {
    count: () => props.virtualSource?.rowCount ?? flatRows.value.length,
    rowAt: (index) => mergeFlatRow(index)?.row,
    windows: () => mergeGeometry.geometry.value.body.windows,
  },
  footer: {
    count: () => props.footerData.length,
    rowAt: (index) => props.footerData[index],
    windows: () => mergeGeometry.geometry.value.footer.windows,
  },
})
const bodyMergeAt = (row: number, col: number) => merges.at('body', row, col)
const footerMergeAt = (row: number, col: number) =>
  merges.at('footer', row, col)
const mergeCoordinates = useTableMergeCoordinates({
  base: keyboardCoordinates,
  at: bodyMergeAt,
  rowAt: mergeFlatRow,
  offset: () => mergeRowOffset.value,
  count: () => effectiveRowCount.value,
  rowSourceIndex: (index) =>
    props.virtualSource ? sourceIndexAt(index) : index,
  rowViewIndex: (index, backwards) =>
    props.virtualSource
      ? groups.layout.value.dataIndexNear(
          index,
          backwards ? 'backward' : 'forward',
        )
      : index,
})
const mergeHeights = useTableMergeHeights({
  root: () => dataViewRef.value,
  enabled: () => merges.enabled.value,
  index: (area) => (area === 'body' ? merges.body.value : merges.footer.value),
  columnCount: keyboardCoordinates.countColumns,
  shrink: () =>
    nextTick(() => {
      virtualListRef.value?.resetMeasurements()
      footerRowsRef.value?.measure()
    }),
})
const footerMergeHeight = (row: number) => mergeHeights.minimum('footer', row)
watch(
  () => {
    const active = editing.active.value
    if (!active) return undefined
    const coordinate = props.virtualSource
      ? {
          row: sourceViewIndex(active.rowIndex),
          position: keyboardCoordinates.positionOf(active.columnIndex),
        }
      : keyboardCoordinates.resolve({
          rowKey: active.rowKey,
          columnKey: active.columnKey,
        })
    return {
      session: active.id,
      region: coordinate
        ? bodyMergeAt(
            props.virtualSource ? active.rowIndex : coordinate.row,
            coordinate.position,
          )?.key
        : undefined,
    }
  },
  (current, previous) => {
    if (
      current &&
      previous &&
      current.session === previous.session &&
      current.region !== previous.region
    )
      editing.contextChanged('columns')
  },
)
watch(
  [
    () => props.data,
    () => props.footerData,
    merges.config,
    () => props.virtualSource?.row,
    resolvedColumns,
    () => totalTablePixelWidth.value,
    pagination.currentPage,
  ],
  () => {
    const hadMergeHeights = mergeHeights.clear()
    if (!merges.enabled.value && !hadMergeHeights) return
    virtualListRef.value?.resetMeasurements()
    footerRowsRef.value?.measure()
  },
)
const contextMenu = useTableContextMenu(props, emit, {
  root: () => tableScrollRef.value,
  context: [
    () => props.data,
    () => props.virtualSource,
    () => props.footerData,
    () => props.contextMenuConfig,
    sorts,
    filtersState,
    pagination.currentPage,
    pagination.pageSize,
    () => (props.virtualSource ? undefined : flatRows.value),
    columnManager.state,
    rawColumns,
  ],
})
const coordinateFromElement = (cell: HTMLElement) => {
  const fragment = cell.closest<HTMLElement>('[data-merge-region]')
  return mergeCoordinates.at(
    fragment
      ? props.virtualSource
        ? (groups.layout.value.dataIndexNear(
            Number(fragment.dataset.mergeRowStart),
            'forward',
          ) ?? -1)
        : Number(fragment.dataset.mergeRowStart)
      : Number(
          cell
            .closest('[data-table-row-index]')
            ?.getAttribute('data-table-row-index'),
        ),
    fragment
      ? Number(fragment.dataset.mergeColStart)
      : keyboardCoordinates.positionOf(Number(cell.dataset.columnIndex)),
  )
}
const keyboard = useTableKeyboard(props, emit, {
  ...keyboardCoordinates,
  ...mergeCoordinates,
  root: () => tableScrollRef.value,
  fromElement: coordinateFromElement,
  locate: (coordinate) => {
    const row = dragRowAt(coordinate.viewRow ?? coordinate.row)
    if (row) scrollToRow(props.virtualSource ? row.index : row.row)
    scrollToColumn(coordinate.viewColumn ?? coordinate.column)
  },
  element: (coordinate) =>
    [
      ...(tableScrollRef.value?.querySelectorAll<HTMLElement>(
        `[data-table-row-index="${coordinate.row}"] > [role="cell"][data-column-index="${coordinate.column}"]`,
      ) ?? []),
    ].find(
      (cell) =>
        cell.closest('[role="table"]') ===
        tableScrollRef.value?.querySelector('[role="table"]'),
    ),
  edit: (coordinate) => {
    const row = dragRowAt(coordinate.viewRow ?? coordinate.row)
    return row
      ? startEdit(
          props.virtualSource ? row.index : row.row,
          coordinate.viewColumn ?? coordinate.column,
        )
      : Promise.resolve(false)
  },
  editing: () => Boolean(editing.active.value),
  dragActive: () => Boolean(rowDrag.session.value),
  context: [
    () => (props.virtualSource ? undefined : flatRows.value),
    groups.layout,
    merges.body,
    () => props.virtualSource?.row,
    () => props.virtualSource?.rowCount,
    () => props.virtualSource?.columnCount,
    pagination.currentPage,
    pagination.pageSize,
    resolvedColumns,
    columnManager.state,
  ],
})
const rangeContext = [
  () => (props.virtualSource ? undefined : flatRows.value),
  groups.layout,
  () => props.virtualSource?.row,
  () => props.virtualSource?.rowCount,
  () => props.virtualSource?.columnCount,
  merges.config,
  pagination.currentPage,
  pagination.pageSize,
  resolvedColumns,
  columnManager.state,
]
const cellRange = useTableRangeController(props, emit, {
  count: () => effectiveRowCount.value,
  columns: keyboardCoordinates.countColumns,
  resolve: mergeCoordinates.resolve,
  sourceIndexAt: (index) =>
    props.virtualSource ? sourceIndexAt(index) : index,
  viewIndexNear: (index, backwards) =>
    props.virtualSource
      ? groups.layout.value.dataIndexNear(
          index,
          backwards ? 'backward' : 'forward',
        )
      : Math.max(0, Math.min(effectiveRowCount.value - 1, index)),
  query: (window) => merges.query('body', window),
  context: rangeContext,
})
const rangeInteraction = useTableRangeInteraction(cellRange, {
  root: () => tableScrollRef.value,
  viewport: () => {
    const root = tableScrollRef.value
    const body = virtualListRef.value?.getScrollElement() ?? dataBodyRef.value
    return root && body ? tableRangeViewport(root, body) : undefined
  },
  fromElement: coordinateFromElement,
  at: mergeCoordinates.at,
  move: mergeCoordinates.move,
  current: keyboard.coordinate,
  count: () => ({
    rows: effectiveRowCount.value,
    columns: keyboardCoordinates.countColumns(),
  }),
  focus: keyboard.select,
  scrollBy: (x, y) => {
    if (x) columnVirtualization.scrollBy(x)
    if (!y) return
    if (virtualListRef.value) virtualListRef.value.scrollBy(y)
    else if (tableScrollRef.value) {
      const scroll = tableRangeScrollParent(tableScrollRef.value)
      if (scroll) scroll.scrollTop += y
    }
  },
  blocked: () => Boolean(editing.active.value || rowDrag.session.value),
  context: rangeContext,
})
const clipboardCells = createTableClipboardCells({
  count: () => ({
    rows: effectiveRowCount.value,
    columns: keyboardCoordinates.countColumns(),
    sourceRows: props.virtualSource?.rowCount ?? flatRows.value.length,
  }),
  sourceIndexAt: (index) =>
    props.virtualSource ? sourceIndexAt(index) : index,
  viewIndexNear: (index, backwards) =>
    props.virtualSource
      ? groups.layout.value.dataIndexNear(
          index,
          backwards ? 'backward' : 'forward',
        )
      : Math.max(0, Math.min(effectiveRowCount.value - 1, index)),
  rowAt: mergeFlatRow,
  columnAt: mergeColumn,
  query: (bounds) => merges.query('body', bounds),
  toggle: (flat, expanded) => toggleRowExpand(flat.row, expanded),
})
const clipboard = useTableClipboard(props, emit, {
  root: () => tableScrollRef.value,
  bounds: () => {
    const selected = cellRange.getBounds()
    if (selected) return selected
    const active = keyboard.coordinate()
    if (!active) return
    const row = active.viewRow ?? active.row
    const col = keyboardCoordinates.positionOf(
      active.viewColumn ?? active.column,
    )
    const bounds = {
      rowStart: row,
      rowEnd: row + 1,
      colStart: col,
      colEnd: col + 1,
    }
    return clipboardCells(bounds)(row, col)?.span ?? bounds
  },
  count: () => ({
    rows: effectiveRowCount.value,
    columns: keyboardCoordinates.countColumns(),
  }),
  cells: clipboardCells,
  writable: (context) => {
    const resolved = resolveEditContext(context)
    const editor =
      typeof resolved?.column.editor === 'object'
        ? resolved.column.editor
        : undefined
    if (editor?.props?.disabled || editor?.props?.readonly) return false
    return Boolean(resolved && editing.isEditable(resolved))
  },
  editing: () => Boolean(editing.active.value || rowDrag.session.value),
  changes,
  validation,
  rulesFor: (context) => validationApi.rulesFor(context.column),
  locate: async (context) => {
    scrollToRow(props.virtualSource ? context.rowIndex : context.row)
    scrollToColumn(context.columnIndex)
    await nextTick()
    const root = tableScrollRef.value
    const id = `${tableValidationId(selectionName.value, context.rowKey, context.column.field!, context.columnIndex)}-cell`
    const cell = root?.querySelector<HTMLElement>(`[id="${id}"]`)
    if (!cell || !root?.contains(cell)) return false
    cell.focus({ preventScroll: true })
    return root.ownerDocument.activeElement === cell
  },
  context: [
    sorts,
    filtersState,
    pagination.currentPage,
    pagination.pageSize,
    columnManager.state,
    merges.config,
    groups.expansionState,
    groups.config,
    rawColumns,
    () => props.rowKey,
    () => props.virtualSource?.column,
    () => props.virtualSource?.rowKey,
  ],
  dataContext: [
    () => props.data,
    () => props.virtualSource?.row,
    () => props.virtualSource?.rowCount,
    () => props.virtualSource?.columnCount,
    () =>
      props.changeConfig && typeof props.changeConfig === 'object'
        ? props.changeConfig.dataKey
        : undefined,
    () => flatRows.value,
    groups.layout,
  ],
})
const clipboardStatus = computed(() => {
  if (clipboard.pending.value) return t('vs.table.clipboardWorking')
  const result = clipboard.last.value
  if (!result) return ''
  if (!result.success)
    return t(
      result.reason === 'cancelled'
        ? 'vs.table.clipboardCancelled'
        : 'vs.table.clipboardFailed',
    )
  const message = { copy: 'Copied', cut: 'Cut', paste: 'Pasted' }[result.action]
  return t(`vs.table.clipboard${message}`)
})
const findCellsInScope = createTableFindScope(props, {
  scope: validationApi.scope,
  count: () => ({
    rows: effectiveRowCount.value,
    columns: keyboardCoordinates.countColumns(),
  }),
  columnAt: mergeColumn,
  selection: cellRange.getBounds,
  cells: clipboardCells,
  toggle: (context, expanded) => toggleRowExpand(context.row, expanded),
  locateView: async (row, col, current, focus) => {
    if (!current()) return false
    const target = mergeCoordinates.at(row, col)
    if (!target) return false
    if (!focus) {
      scrollToRow(
        props.virtualSource ? sourceIndexAt(row) : flatRows.value[row].row,
      )
      scrollToColumn(target.column)
    }
    return current() ? keyboard.select(target, focus) : false
  },
  locateData: async (target, column, index, current, focus) => {
    if (
      !(await validationApi.scope.locate(target, column, index, {
        current,
        focus: false,
      })) ||
      !current()
    )
      return false
    const row = props.virtualSource
      ? sourceViewIndex(target.index)
      : flatRows.value.findIndex((flat) => flat.key === target.key)
    return current()
      ? keyboard.select(
          mergeCoordinates.at(row, keyboardCoordinates.positionOf(index)),
          focus,
        )
      : false
  },
})
const finder = useTableFind(props, emit, {
  cells: findCellsInScope,
  selection: cellRange.getBounds,
  editing: () => Boolean(editing.active.value || rowDrag.session.value),
  writable: (context) => {
    const editor =
      typeof context.column.editor === 'object'
        ? context.column.editor
        : undefined
    return (
      !editor?.props?.disabled &&
      !editor?.props?.readonly &&
      editing.isEditable(context)
    )
  },
  changes,
  validation,
  rulesFor: (context) => validationApi.rulesFor(context.column),
  locateError: async (context) => {
    const match = finder.scan.value?.matches.find(
      (match) =>
        match.context.rowKey === context.rowKey &&
        match.context.columnKey === context.columnKey,
    )
    return (await match?.locate?.(() => match.isCurrent(), true)) ?? false
  },
  dataContext: [
    () => props.data,
    () => props.virtualSource?.row,
    () => props.virtualSource?.rowCount,
    () => props.virtualSource?.columnCount,
    loadedTreeRevision,
    () =>
      typeof props.changeConfig === 'object'
        ? props.changeConfig.dataKey
        : undefined,
  ],
  viewContext: [
    sorts,
    filtersState,
    pagination.currentPage,
    pagination.pageSize,
    groups.expansionState,
    flatRows,
    groups.layout,
  ],
  context: [
    columnManager.state,
    rawColumns,
    merges.config,
    groups.config,
    () => props.rowKey,
    () => props.virtualSource?.rowKey,
    () => props.virtualSource?.column,
  ],
})
const findPanelRef = shallowRef<InstanceType<typeof TableFindPanel>>()
const chart = useTableChart(props, emit, {
  editing: () => Boolean(editing.active.value || rowDrag.session.value),
  selection: cellRange.getBounds,
  context: [
    () => props.data,
    () => props.virtualSource,
    () => props.virtualSource?.row,
    () => props.virtualSource?.rowKey,
    () => props.virtualSource?.rowCount,
    () => props.virtualSource?.column,
    () => props.virtualSource?.columnCount,
    tree.flatRows,
    columnManager.state,
    rawColumns,
    merges.config,
    groups.state,
    pagination.currentPage,
    pagination.pageSize,
    groups.expansionState,
    () => props.rowKey,
  ],
  scope: createTableChartScope({
    selection: cellRange.getBounds,
    count: () => ({
      rows: effectiveRowCount.value,
      columns: keyboardCoordinates.countColumns(),
    }),
    rowAt: dragRowAt,
    cells: clipboardCells,
    columnAt: (position) => {
      const entry = mergeColumn(position)
      return entry && { ...entry, position }
    },
    column: (key) => {
      const index =
        typeof key === 'number'
          ? key
          : props.virtualSource
            ? /^(0|[1-9]\d*)$/.test(key)
              ? Number(key)
              : -1
            : resolvedColumns.value.findIndex(
                (column, index) =>
                  (column.key ?? column.field ?? `@${index}`) === key,
              )
      const position = keyboardCoordinates.positionOf(index)
      const entry = position >= 0 ? mergeColumn(position) : undefined
      return entry && { ...entry, position }
    },
    filtered: () => {
      if (props.virtualSource) {
        const source = props.virtualSource
        return {
          count: source.rowCount,
          rowAt: createSourceFlatRow,
          isCurrent: () => source === props.virtualSource,
        }
      }
      const rows = tree.flatRows.value
      return {
        count: rows.length,
        rowAt: (index) => rows[index],
        isCurrent: () => rows === tree.flatRows.value,
      }
    },
    aggregates: () => {
      if (!groups.enabled.value || groups.state.value.error)
        throw new Error('Chart aggregates require a valid group configuration')
      const model = groups.state.value
      const nodes = groups.nodes.value
      return {
        groups: model.groups,
        group: (key) => nodes.get(key),
        summary: model.summary,
        isCurrent: () => model === groups.state.value,
      }
    },
  }),
})
const isRangeMergeSelected = (surface: TableMergeSurface) => {
  if (surface.area !== 'body') return false
  const row = props.virtualSource
    ? groups.layout.value.dataIndexNear(surface.rowStart, 'forward')
    : surface.rowStart
  return row != null && cellRange.contains(row, surface.colStart)
}
const TableBodyRow = createTableBodyRow({
  slots: tableSlots,
  cellSlotName,
  editSlotName: (column) =>
    column.slots?.edit ?? `edit-${columnSlotKey(column)}`,
  renderer: resolveCellRenderer,
  bindings: (flatRow, index) => ({
    flatRow,
    displayIndex: index,
    entries: renderedColumnEntries.value,
    'data-row-key': String(flatRow.key),
    editing,
    keyboard,
    cellRange,
    validation,
    contextMenuEnabled: contextMenu.enabled.value,
    drag:
      rowReorder.config.value.enabled !== false && props.rowDragConfig
        ? rowDrag
        : undefined,
    editRenderer: resolveEditRenderer,
    rowOffset: detailRowOffset(index),
    sequenceOffset: pagination.remote.value ? pagination.offset.value : 0,
    indent: treeIndent.value,
    selected: isRowSelected(flatRow.key),
    selectionDisabled:
      props.loading || !isSelectable(flatRow.row, flatRow.index),
    selectionName: selectionName.value,
    overflow: props.showOverflow,
    striped: props.striped,
    rowClass: props.rowClass,
    mergeAt: merges.enabled.value ? bodyMergeAt : undefined,
    mergeRowOffset: props.virtualSource ? sourceIndexAt(index) - index : 0,
    minimumHeight: mergeHeights.minimum(
      'body',
      props.virtualSource ? sourceIndexAt(index) : index,
    ),
    onCellContextMenu: (
      params: TableEditContext,
      event: MouseEvent | KeyboardEvent,
    ) => contextMenu.open({ ...params, area: 'body' }, event),
    onRowClick: handleRowClick,
    onCellClick: handleCellClick,
    onRowSelect: toggleRowSelection,
    onToggleExpand: () => toggleRowExpand(flatRow.row),
  }),
})
const groupBandAriaIndex = (renderIndex: number) => {
  if (props.virtualSource && details.enabled.value) return undefined
  let previousDetails = 0
  for (const index of detailIndices.value) {
    if ((groups.layout.value.renderIndexAt(index) ?? index) >= renderIndex)
      break
    previousDetails++
  }
  return (
    (props.showHeader ? headerDepth.value : 0) +
    1 +
    renderIndex +
    previousDetails
  )
}
const TableBodyBlock = createTableBodyBlock({
  row: TableBodyRow,
  slots: tableSlots,
  detail: (flatRow, index) => ({
    flatRow,
    controller: details,
    columnCount: resolvedColumnCount.value,
    viewportWidth: columnVirtualization.viewportWidth.value,
    panelId: detailPanelId(flatRow.key),
    ariaRowIndex: detailAriaIndex(index),
    disabled: props.loading,
    onShrink: resetDetailMeasurements,
  }),
  group: (item) => ({
    kind: item.kind === 'subtotal' ? 'subtotal' : 'group',
    group: item.kind === 'data' ? undefined : item.group,
    expanded: item.kind === 'data' ? undefined : item.expanded,
    disabled: props.loading,
    columnCount: resolvedColumnCount.value,
    viewportWidth: columnVirtualization.viewportWidth.value,
    rowIndex: groupBandAriaIndex(item.renderIndex),
    entries: renderedColumnEntries.value,
    fixedStyle: fixedBandStyle,
    style: virtualBandStyle.value,
    renderers: props.renderers,
    retainHeights: horizontalVirtualMode.value,
    onToggle: (key, value) => groups.toggle(key, value),
  }),
})
watch(groups.layout, () => {
  if (groups.enabled.value) measure()
})
watch(
  () => JSON.stringify([...groups.keys.value]),
  () => {
    if (groups.enabled.value) editing.contextChanged('view')
  },
)
const TableMergedCell = ({
  surface,
  renderSlots,
}: {
  surface: TableMergeSurface
  renderSlots: Slots
}) => {
  const column = mergeColumn(surface.region.col)
  if (!column) return null
  const entries: TableRenderedColumnEntry[] = [
    {
      kind: 'column',
      key: String(column.index),
      column: column.column,
      index: column.index,
      ariaIndex: surface.region.col,
      style: { width: '100%', minWidth: 0, flex: '1 1 0' },
    },
  ]
  if (surface.area === 'body') {
    const flatRow = mergeFlatRow(surface.region.row)
    if (!flatRow) return null
    return h(TableBodyRow, {
      renderSlots,
      flatRow,
      displayIndex: props.virtualSource
        ? (groups.layout.value.dataIndexNear(surface.region.row, 'forward') ??
          0)
        : surface.region.row,
      entries,
      mergeOwner: surface.region,
      detail: {
        enabled: details.enabled.value,
        expanded: details.expanded(flatRow),
        disabled: props.loading || !details.allowed(flatRow),
        panelId: detailPanelId(flatRow.key),
        toggle: () => details.toggle(flatRow),
      },
    })
  }
  const row = props.footerData[surface.region.row]
  if (!row) return null
  return h(
    TableFooterRows,
    {
      data: [row],
      dataOffset: surface.region.row,
      rowKey: props.footerRowKey,
      entries,
      rowOffset:
        footerAriaOffset.value == null
          ? undefined
          : footerAriaOffset.value + surface.region.row,
      fixedStyle: () => ({}),
      renderers: props.renderers,
      overflow: props.showFooterOverflow,
      retainHeights: false,
      contextMenuEnabled: contextMenu.enabled.value,
      mergeOwner: surface.region,
      onCellClick: (params, event) => emit('footerCellClick', params, event),
      onCellContextMenu: (params, event) =>
        contextMenu.open({ ...params, area: 'footer' }, event),
    },
    {
      cell: (params: TableFooterCellRenderParams) =>
        renderSlot(
          tableSlots,
          params.column.slots?.footer ??
            `footer-${columnSlotKey(params.column)}`,
          { ...params },
          () => [renderSlot(tableSlots, 'footer-cell', { ...params })],
        ),
    },
  )
}
const mergeOwnerElement = (surface: TableMergeSurface) =>
  [
    ...(dataViewRef.value?.querySelectorAll<HTMLElement>(
      '[data-merge-primary]',
    ) ?? []),
  ]
    .find(
      (element) =>
        element.dataset.mergeRegion === surface.region.key &&
        element.classList.contains('is-footer-merge') ===
          (surface.area === 'footer'),
    )
    ?.querySelector<HTMLElement>('[role="cell"]')
const mergeContinuationClick = (
  surface: TableMergeSurface,
  event: MouseEvent,
) =>
  mergeOwnerElement(surface)?.dispatchEvent(
    new MouseEvent('click', {
      bubbles: true,
      ctrlKey: event.ctrlKey,
      shiftKey: event.shiftKey,
      metaKey: event.metaKey,
    }),
  )
const mergeContinuationDblclick = (surface: TableMergeSurface) =>
  mergeOwnerElement(surface)?.dispatchEvent(
    new MouseEvent('dblclick', { bubbles: true }),
  )
const mergeContinuationContextmenu = (
  surface: TableMergeSurface,
  event: MouseEvent,
) => {
  const target = mergeOwnerElement(surface)
  if (
    target &&
    !target.dispatchEvent(
      new MouseEvent('contextmenu', {
        bubbles: true,
        cancelable: true,
        clientX: event.clientX,
        clientY: event.clientY,
      }),
    )
  )
    event.preventDefault()
}
const handleTableKeydown = (event: KeyboardEvent) => {
  if (rowDrag.session.value?.keyboard)
    rowDrag.keydown(event, rowDrag.session.value.from)
  keyboard.onKeydown(event)
}
const handleTableKeydownCapture = (event: KeyboardEvent) => {
  findPanelRef.value?.keydown(event)
  if (event.defaultPrevented) return
  clipboard.onKeydown(event)
  if (!event.defaultPrevented) rangeInteraction.onKeydown(event)
}
const handleTableFocusin = (event: FocusEvent) => {
  overflow.enter(event)
  keyboard.onFocusin(event)
}
const handleTableScrollCapture = () => {
  overflow.close()
  contextMenu.close()
}
const setActiveCell = (rowIndex: number, columnIndex: number) => {
  const target = mergeCoordinates.at(
    props.virtualSource ? sourceViewIndex(rowIndex) : rowIndex,
    keyboardCoordinates.positionOf(columnIndex),
  )
  return target ? keyboard.select(target) : Promise.resolve(false)
}

defineExpose({
  getChartData: chart.getChartData,
  openChart: chart.openChart,
  closeChart: chart.closeChart,
  cancelChart: chart.cancelChart,
  getChartState: chart.getChartState,
  openFind: () => findPanelRef.value?.open() ?? Promise.resolve(false),
  closeFind: () => findPanelRef.value?.close(),
  findCells: finder.findCells,
  findNext: finder.findNext,
  findPrevious: finder.findPrevious,
  replaceMatch: finder.replaceMatch,
  replaceAll: finder.replaceAll,
  getFindState: finder.getFindState,
  clearFind: finder.clearFind,
  cancelFind: finder.cancelFind,
  copyCells: clipboard.copyCells,
  cutCells: clipboard.cutCells,
  pasteCells: clipboard.pasteCells,
  cancelClipboard: clipboard.cancelClipboard,
  setCellRange: cellRange.select,
  clearCellRange: cellRange.clear,
  getCellRange: cellRange.getRange,
  getCellRangeBounds: cellRange.getBounds,
  setGroupExpandedKeys: groups.setExpandedKeys,
  toggleGroup: groups.toggle,
  getGroups: () => groups.state.value.groups,
  getGroupSummary: () => groups.state.value.summary,
  closeContextMenu: contextMenu.close,
  setActiveCell,
  clearActiveCell: keyboard.clear,
  getActiveCell: keyboard.get,
  moveRow: rowReorder.move,
  cancelRowDrag: rowDrag.cancel,
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
} satisfies TableExposes)
</script>
