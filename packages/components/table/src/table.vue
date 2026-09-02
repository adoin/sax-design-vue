<template>
  <div :class="ns.b('wrapper')">
    <slot />

    <div v-if="$slots.header" :class="ns.be('wrapper', 'header')">
      <slot name="header" />
    </div>

    <div
      ref="tableScrollRef"
      :class="[tableKls, ns.is('horizontal-virtual', horizontalVirtualMode)]"
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
        :style="{ minWidth: horizontalVirtualMode ? '0px' : dataMinWidth }"
        role="table"
        :aria-rowcount="effectiveRowCount + (showHeader ? 1 : 0)"
        :aria-colcount="resolvedColumnCount"
      >
        <div
          v-if="showHeader"
          :class="ns.e('data-header')"
          :style="virtualHeaderStyle"
          role="row"
        >
          <template v-for="entry in renderedColumnEntries" :key="entry.key">
            <div
              v-if="entry.kind === 'spacer'"
              :class="ns.e('data-column-spacer')"
              :style="{ flexBasis: `${entry.width}px` }"
              aria-hidden="true"
            />
            <div
              v-else
              :class="[
                ns.e('data-head-cell'),
                entry.column.className,
                ns.is('fixed-column', Boolean(entry.fixed)),
                ns.is('fixed-left', entry.fixed === 'left'),
                ns.is('fixed-right', entry.fixed === 'right'),
                ns.is('fixed-boundary', entry.fixedBoundary),
              ]"
              :style="[
                entry.style,
                fixedHeaderStyle(entry),
                { textAlign: entry.column.align ?? 'left' },
              ]"
              role="columnheader"
              :aria-colindex="entry.index + 1"
              :data-column-index="entry.index"
              :aria-sort="
                sortOrder(entry.column) === 'asc'
                  ? 'ascending'
                  : sortOrder(entry.column) === 'desc'
                    ? 'descending'
                    : entry.column.sortable
                      ? 'none'
                      : undefined
              "
            >
              <TableHeaderCell
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
            </div>
          </template>
        </div>

        <SVirtualList
          v-if="virtualEnabled && effectiveRowCount && resolvedColumnCount"
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
          :dynamic="virtualOptions.dynamic"
          :retain-max-size="horizontalVirtualMode && virtualOptions.dynamic"
          :item-key="flatRowKey"
          :class="ns.e('virtual-body')"
          :style="virtualBodyStyle"
          role="rowgroup"
          @scroll="handleVirtualScroll"
        >
          <template #default="{ item, index }">
            <TableDataRow
              :flat-row="item as TableFlatRow"
              :entries="renderedColumnEntries"
              :display-index="index"
              :row-offset="showHeader ? 2 : 1"
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
            </TableDataRow>
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
          <TableDataRow
            v-for="(flatRow, index) in flatRows"
            :key="`${typeof flatRow.key}:${String(flatRow.key)}`"
            :data-row-key="String(flatRow.key)"
            :flat-row="flatRow"
            :entries="renderedColumnEntries"
            :display-index="index"
            :row-offset="showHeader ? 2 : 1"
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
          </TableDataRow>
        </div>

        <div v-else :class="ns.e('data-empty')" role="row">
          <slot name="notFound">
            {{ emptyText || t('vs.table.emptyText') }}
          </slot>
        </div>

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
import { tableColumnKey } from './data-utils'
import { useTableQuery } from './composables/use-table-query'
import { useTableSelection } from './composables/use-table-selection'
import { useTableOverflow } from './composables/use-table-overflow'
import { useTablePagination } from './composables/use-table-pagination'
import type { VirtualListInstance } from '@vuesax-alpha/components/virtual-list'
import type { CSSProperties } from 'vue'
import type {
  TableCellRenderParams,
  TableCellRenderer,
  TableColumn,
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
const dataBodyRef = ref<HTMLElement>()
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

const resolvedColumns = computed(() =>
  props.columns.length
    ? props.columns
    : registeredColumns.value.map((entry) => entry.column),
)

const { tableKls } = useTable(props, emit)
const query = useTableQuery(props, emit, resolvedColumns)
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
      : resolvedColumns.value,
  ),
  flatRows,
  getAllRows: tree.getAllRows,
  getRowKey: tree.getRowKey,
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
    ? Math.max(0, Math.floor(props.virtualSource.columnCount))
    : resolvedColumns.value.length,
)

const resolveSourceRowKey = (row: TableRow, index: number): TableRowKey => {
  if (typeof props.rowKey === 'function') return props.rowKey(row, index)
  const key = row[props.rowKey]
  return typeof key === 'string' || typeof key === 'number' ? key : index
}

const virtualItemAt = (index: number): TableFlatRow => {
  if (!props.virtualSource) return flatRows.value[index]
  const sourceIndex = index + pagination.sourceOffset.value
  const row = props.virtualSource.row(sourceIndex)
  return {
    row,
    key: resolveSourceRowKey(row, sourceIndex),
    index: sourceIndex,
    depth: 0,
    hasChildren: false,
    expanded: false,
    loading: false,
  }
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

const cssSize = (value: number | string | undefined, fallback: string) =>
  typeof value === 'number' ? `${value}px` : value || fallback

const columnBaseSize = (column: TableColumn) =>
  cssSize(column.width ?? column.minWidth, '120px')

const sourceColumnWidth = (index: number) => {
  const source = props.virtualSource as TableVirtualSource | undefined
  if (!source) return undefined
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
    const count = resolvedColumnCount.value
    const leftCount = Math.min(
      count,
      Math.max(0, Math.floor(props.virtualSource.fixedLeftCount ?? 0)),
    )
    const rightCount = Math.min(
      count - leftCount,
      Math.max(0, Math.floor(props.virtualSource.fixedRightCount ?? 0)),
    )
    for (let index = 0; index < leftCount; index++)
      left.push({ column: props.virtualSource.column(index), index })
    for (let index = count - rightCount; index < count; index++)
      right.push({ column: props.virtualSource.column(index), index })
    return {
      left,
      center,
      right,
      centerCount: count - leftCount - rightCount,
      centerStart: leftCount,
    }
  }

  resolvedColumns.value.forEach((column, index) => {
    const entry = { column, index }
    if (column.fixed === true || column.fixed === 'left') left.push(entry)
    else if (column.fixed === 'right') right.push(entry)
    else center.push(entry)
  })
  return { left, center, right, centerCount: center.length, centerStart: 0 }
})

const centerColumns = computed(() =>
  columnPartitions.value.center.map((entry) => entry.column),
)
const centerColumnCount = computed(() => columnPartitions.value.centerCount)
const centerColumnAt = (virtualIndex: number): IndexedColumn | undefined => {
  if (props.virtualSource) {
    if (virtualIndex < 0 || virtualIndex >= centerColumnCount.value)
      return undefined
    const index = columnPartitions.value.centerStart + virtualIndex
    return { column: props.virtualSource.column(index), index }
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
  columnWidth: (virtualIndex) => {
    if (props.virtualSource)
      return sourceColumnWidth(
        columnPartitions.value.centerStart + virtualIndex,
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
const virtualHeaderStyle = computed<CSSProperties>(() =>
  horizontalVirtualActive.value
    ? {
        width: `${totalTablePixelWidth.value}px`,
        transform: `translateX(-${columnVirtualization.scrollLeft.value}px)`,
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
    if (!virtualEnabled.value || !virtualOptions.value.dynamic) return
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

const fixedHeaderStyle = (entry: TableRenderedColumnEntry): CSSProperties => {
  if (!horizontalVirtualActive.value || !entry.fixed) return {}
  const scrollLeft = columnVirtualization.scrollLeft.value
  const shift =
    entry.fixed === 'left'
      ? scrollLeft
      : columnVirtualization.viewportWidth.value -
        totalTablePixelWidth.value +
        scrollLeft
  return { transform: `translateX(${shift}px)` }
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
  [virtualEnabled, virtualListRef, tableScrollRef],
  () => {
    columnScrollRef.value = virtualEnabled.value
      ? (virtualListRef.value?.getScrollElement() ?? undefined)
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
  const index =
    typeof columnOrIndex === 'number'
      ? columnOrIndex
      : props.virtualSource
        ? -1
        : resolvedColumns.value.findIndex((column) =>
            typeof columnOrIndex === 'string'
              ? column.key === columnOrIndex || column.field === columnOrIndex
              : column === columnOrIndex,
          )
  const virtualIndex = props.virtualSource
    ? index - columnPartitions.value.centerStart
    : columnPartitions.value.center.findIndex((entry) => entry.index === index)
  if (virtualIndex >= 0)
    columnVirtualization.scrollToColumn(virtualIndex, align)
}

const measure = () =>
  nextTick(() => {
    virtualListRef.value?.measure()
    columnVirtualization.measureViewport()
  })

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
  ],
  () => overflow.close(),
)

defineExpose({
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
