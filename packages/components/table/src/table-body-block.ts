import { h, renderSlot } from 'vue'
import TableRowBlock from './table-row-block.vue'
import TableGroupBand from './table-group-band.vue'
import type { Component, Slots } from 'vue'
import type { TableFlatRow } from './table'
import type { TableGroupDisplayItem } from './composables/table-group-layout'
import type { TableRowDetailState } from './composables/use-table-details'

export type TableBodyItem =
  | { kind: 'data'; flatRow: TableFlatRow; index: number; renderIndex: number }
  | (Exclude<TableGroupDisplayItem, { kind: 'data' }> & { renderIndex: number })

interface Options {
  row: Component
  slots: Slots
  detail: (
    row: TableFlatRow,
    index: number,
  ) => InstanceType<typeof TableRowBlock>['$props']
  group: (item: TableBodyItem) => InstanceType<typeof TableGroupBand>['$props']
}

/** One composition path for ordinary and virtual data rows, details, and group bands. */
export function createTableBodyBlock(options: Options) {
  function TableBodyBlock({
    item,
    renderSlots,
  }: {
    item: TableBodyItem
    renderSlots?: Slots
  }) {
    const slots = renderSlots ?? options.slots
    if (item.kind !== 'data')
      return h(TableGroupBand, options.group(item), {
        ...(slots['group-header']
          ? {
              header: (params: Record<string, unknown>) =>
                renderSlot(slots, 'group-header', params),
            }
          : {}),
        ...(slots['group-summary']
          ? {
              summary: (params: Record<string, unknown>) =>
                renderSlot(slots, 'group-summary', params),
            }
          : {}),
      })
    return h(TableRowBlock, options.detail(item.flatRow, item.index), {
      default: ({ detail }: { detail: TableRowDetailState }) =>
        h(options.row, {
          flatRow: item.flatRow,
          displayIndex: item.index,
          detail,
          renderSlots: slots,
        }),
      detail: (params: Record<string, unknown>) =>
        renderSlot(slots, 'detail', params),
      loading: (params: Record<string, unknown>) =>
        renderSlot(slots, 'detail-loading', params),
      error: (params: Record<string, unknown>) =>
        renderSlot(slots, 'detail-error', params),
    })
  }
  TableBodyBlock.props = ['item', 'renderSlots']
  return TableBodyBlock
}
