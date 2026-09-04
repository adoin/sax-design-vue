import { h, renderSlot } from 'vue'
import TableDataRow from './table-data-row.vue'
import TableRendererOutlet from './renderer-outlet'
import type { Slots } from 'vue'
import type {
  TableCellRenderParams,
  TableCellRenderer,
  TableColumn,
  TableFlatRow,
  TableRenderedEntry,
} from './table'
import type { TableEditSlotParams } from './table-edit'
import type { TableRowDetailState } from './composables/use-table-details'
import type { TableMergeRegion } from './composables/table-merge-regions'

interface RowProps {
  flatRow: TableFlatRow
  displayIndex: number
  detail?: TableRowDetailState
  entries?: TableRenderedEntry[]
  mergeOwner?: TableMergeRegion
}
interface RowRendererOptions {
  bindings: (
    row: TableFlatRow,
    index: number,
  ) => InstanceType<typeof TableDataRow>['$props']
  slots: Slots
  cellSlotName: (column: TableColumn) => string
  editSlotName: (column: TableColumn) => string
  renderer: (column: TableColumn) => TableCellRenderer | undefined
}

/** Ordinary rows, virtual rows and merge owners share the same slot fallback chain. */
export function createTableBodyRow(options: RowRendererOptions) {
  function TableBodyRow(props: RowProps) {
    const bindings = options.bindings(props.flatRow, props.displayIndex)
    return h(
      TableDataRow,
      {
        ...bindings,
        ...props,
        entries: props.entries ?? bindings.entries,
        mergeAt: props.mergeOwner ? undefined : bindings.mergeAt,
        minimumHeight: props.mergeOwner ? undefined : bindings.minimumHeight,
      },
      {
        cell: (params: TableCellRenderParams) =>
          renderSlot(
            options.slots,
            options.cellSlotName(params.column),
            { ...params },
            () => [
              renderSlot(options.slots, 'cell', { ...params }, () => [
                h(TableRendererOutlet, {
                  renderer: options.renderer(params.column),
                  params,
                  fallback: params.value,
                }),
              ]),
            ],
          ),
        edit: (params: TableEditSlotParams) =>
          renderSlot(
            options.slots,
            options.editSlotName(params.column),
            { ...params },
            () => [renderSlot(options.slots, 'edit-cell', { ...params })],
          ),
      },
    )
  }
  TableBodyRow.props = [
    'flatRow',
    'displayIndex',
    'detail',
    'entries',
    'mergeOwner',
  ]
  return TableBodyRow
}
