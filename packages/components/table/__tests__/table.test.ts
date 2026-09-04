import { h, nextTick } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import Table from '../src/table.vue'
import TableColumnComponent from '../src/table-column.vue'
import {
  MAX_PHYSICAL_COLUMN_SCROLL_WIDTH,
  getColumnOffsets,
  getUniformVirtualColumnRange,
  getVirtualColumnRange,
  getVirtualColumnRangeFromOffsets,
  mapLogicalToPhysicalScroll,
  mapPhysicalToLogicalScroll,
  resolveColumnPixelWidth,
} from '../src/composables/use-table-column-virtualization'
import type { TableCellRenderParams, TableColumn } from '../src/table'

const virtualizerMocks = vi.hoisted(() => ({
  measure: vi.fn(),
  resizeItem: vi.fn(),
  scrollToIndex: vi.fn(),
  scrollToOffset: vi.fn(),
}))

vi.mock('@tanstack/vue-virtual', () => ({
  useVirtualizer: (options: { value: { count: number } }) => ({
    value: {
      ...virtualizerMocks,
      getTotalSize: () => options.value.count * 48,
      getVirtualItems: () =>
        Array.from(
          { length: Math.min(options.value.count, 4) },
          (_, index) => ({
            index,
            key: index,
            start: index * 48,
          }),
        ),
    },
  }),
}))

const columns: TableColumn[] = [
  { field: 'name', title: 'Name', treeNode: true },
  { field: 'description', title: 'Description' },
]

describe('Table data mode', () => {
  it('calculates a bounded horizontal column window with spacers', () => {
    expect(
      getVirtualColumnRange([80, 120, 160, 200, 240], 220, 180, 0),
    ).toEqual({
      start: 2,
      end: 4,
      before: 200,
      after: 240,
    })
    expect(resolveColumnPixelWidth(160)).toBe(160)
    expect(resolveColumnPixelWidth('220px')).toBe(220)
    expect(resolveColumnPixelWidth(undefined)).toBe(120)
    expect(resolveColumnPixelWidth('12rem')).toBeNull()

    const offsets = getColumnOffsets(Array.from({ length: 100_000 }, () => 120))
    expect(
      getVirtualColumnRangeFromOffsets(offsets, 6_000_000, 600, 2),
    ).toEqual({
      start: 49_998,
      end: 50_007,
      before: 5_999_760,
      after: 5_999_160,
    })
    expect(
      getUniformVirtualColumnRange(100_000, 120, 6_000_000, 600, 2),
    ).toEqual({
      start: 49_998,
      end: 50_007,
      before: 5_999_760,
      after: 5_999_160,
    })

    const logicalScrollableWidth = 12_000_000 - 600
    const physicalScrollableWidth = MAX_PHYSICAL_COLUMN_SCROLL_WIDTH - 600
    const physicalMiddle = mapLogicalToPhysicalScroll(
      logicalScrollableWidth / 2,
      logicalScrollableWidth,
      physicalScrollableWidth,
    )
    expect(physicalMiddle).toBe(physicalScrollableWidth / 2)
    expect(
      mapPhysicalToLogicalScroll(
        physicalMiddle,
        physicalScrollableWidth,
        logicalScrollableWidth,
      ),
    ).toBe(logicalScrollableWidth / 2)
  })

  it('pins configured columns on both sides without changing cell indices', () => {
    const wrapper = mount(Table, {
      props: {
        data: [{ id: 1, name: 'Alpha', status: 'Ready', owner: 'Leanne' }],
        columns: [
          { field: 'id', title: '#', width: 72, fixed: true },
          { field: 'name', title: 'Name', width: 180 },
          { field: 'status', title: 'Status', width: 140 },
          { field: 'owner', title: 'Owner', width: 160, fixed: 'right' },
        ],
      },
    })

    const fixedHeaders = wrapper.findAll(
      '.s-table__data-head-cell.is-fixed-column',
    )
    const fixedCells = wrapper.findAll('.s-table__data-cell.is-fixed-column')

    expect(fixedHeaders).toHaveLength(2)
    expect(fixedCells).toHaveLength(2)
    expect(fixedHeaders[0].classes()).toContain('is-fixed-left')
    expect(fixedHeaders[0].attributes('style')).toContain('left: 0px')
    expect(fixedHeaders[1].classes()).toContain('is-fixed-right')
    expect(fixedHeaders[1].attributes('style')).toContain('right: 0px')
    expect(
      fixedCells.map((cell) => cell.attributes('data-column-index')),
    ).toEqual(['0', '3'])
  })

  it('adds remaining width equally after each flexible column minimum', () => {
    const wrapper = mount(Table, {
      props: {
        data: [
          { id: 1, name: 'Alpha', role: 'Developer', email: 'a@test.dev' },
        ],
        columns: [
          { type: 'seq', title: '#', width: 72 },
          { field: 'name', title: 'Name', minWidth: 160 },
          { field: 'role', title: 'Role' },
          { field: 'email', title: 'Email', minWidth: 220 },
        ],
      },
    })

    const headerCells = wrapper.findAll('.s-table__data-head-cell')
    const rowCells = wrapper.findAll('.s-table__data-cell')

    expect(headerCells[0].attributes('style')).toContain('flex: 0 0 72px')
    expect(headerCells[1].attributes('style')).toContain('flex: 1 0 160px')
    expect(headerCells[2].attributes('style')).toContain('flex: 1 0 120px')
    expect(headerCells[3].attributes('style')).toContain('flex: 1 0 220px')
    expect(rowCells.map((cell) => cell.attributes('style'))).toEqual(
      headerCells.map((cell) => cell.attributes('style')),
    )
    expect(wrapper.find('.s-table__data-view').attributes('style')).toContain(
      'min-width: calc(572px)',
    )
  })

  it('supports VXE-style declarative column components without tr or td', async () => {
    const wrapper = mount(Table, {
      props: {
        data: [{ id: 1, name: 'Alpha', status: 'Ready' }],
      },
      slots: {
        default: () => [
          h(TableColumnComponent, { type: 'seq', title: '#', width: 64 }),
          h(TableColumnComponent, { field: 'name', title: 'Name' }),
          h(
            TableColumnComponent,
            { field: 'status', title: 'Status' },
            {
              default: ({ value }: { value: unknown }) => h('b', String(value)),
            },
          ),
        ],
      },
    })

    await nextTick()

    expect(wrapper.findAll('.s-table__data-head-cell')).toHaveLength(3)
    expect(wrapper.findAll('.s-table__data-cell')).toHaveLength(3)
    expect(wrapper.find('.s-table__data-row').text()).toContain('1AlphaReady')
    expect(wrapper.find('b').text()).toBe('Ready')
  })

  it('supports VXE-grid-style named slots from the column config', () => {
    const wrapper = mount(Table, {
      props: {
        data: [{ id: 1, name: 'Alpha' }],
        columns: [
          {
            field: 'name',
            title: 'Name',
            slots: { default: 'nameCell', header: 'nameHeader' },
          },
        ],
      },
      slots: {
        nameCell: ({ value }: { value: unknown }) => h('b', String(value)),
        nameHeader: () => h('strong', 'Configured name'),
      },
    })

    expect(wrapper.find('strong').text()).toBe('Configured name')
    expect(wrapper.find('b').text()).toBe('Alpha')
  })

  it('supports column slots before renderers', () => {
    const wrapper = mount(Table, {
      props: {
        data: [{ id: 1, name: 'Alpha', description: 'fallback' }],
        renderers: {
          description: ({ value }: TableCellRenderParams) =>
            h('strong', `renderer:${value}`),
        },
        columns: [columns[0], { ...columns[1], renderer: 'description' }],
      },
      slots: {
        'cell-name': ({ value }: { value: unknown }) =>
          h('em', `slot:${String(value)}`),
      },
    })

    expect(wrapper.find('em').text()).toBe('slot:Alpha')
    expect(wrapper.find('strong').text()).toBe('renderer:fallback')
  })

  it('flattens tree rows and emits expansion state', async () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        data: [
          {
            id: 'root',
            name: 'Root',
            description: 'Parent',
            children: [
              { id: 'child', name: 'Child', description: 'Nested row' },
            ],
          },
          { id: 'peer', name: 'Peer', description: 'Root row' },
        ],
        treeConfig: { children: 'children' },
      },
    })

    expect(wrapper.findAll('.s-table__data-row')).toHaveLength(2)
    await wrapper.find('.s-table__tree-toggle').trigger('click')
    await nextTick()

    expect(wrapper.findAll('.s-table__data-row')).toHaveLength(3)
    expect(wrapper.emitted('update:expandedKeys')?.[0]).toEqual([['root']])
    expect(wrapper.emitted('treeExpand')?.[0]?.[1]).toBe(true)
  })

  it('loads lazy children before expanding a row', async () => {
    const load = vi.fn(async () => [
      { id: 'lazy-child', name: 'Lazy child', description: 'Loaded' },
    ])
    const wrapper = mount(Table, {
      props: {
        columns,
        data: [
          {
            id: 'lazy-root',
            name: 'Lazy root',
            description: 'Parent',
            hasChildren: true,
          },
        ],
        treeConfig: {
          hasChildren: 'hasChildren',
          load,
        },
      },
    })

    await wrapper.find('.s-table__tree-toggle').trigger('click')
    await flushPromises()

    expect(load).toHaveBeenCalledWith({
      row: expect.objectContaining({ id: 'lazy-root' }),
      rowKey: 'lazy-root',
    })
    expect(wrapper.text()).toContain('Lazy child')
    expect(wrapper.emitted('lazyLoad')?.[0]?.[1]).toEqual([
      expect.objectContaining({ id: 'lazy-child' }),
    ])
  })

  it('virtualizes large data and keeps dynamic measurement enabled', async () => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      height: 64,
    } as DOMRect)
    virtualizerMocks.resizeItem.mockClear()
    virtualizerMocks.scrollToIndex.mockClear()
    const wrapper = mount(Table, {
      props: {
        columns,
        data: Array.from({ length: 100 }, (_, id) => ({
          id,
          name: `Row ${id}`,
          description: id % 2 ? 'Short' : 'A wrapped dynamic row '.repeat(4),
        })),
        virtualConfig: {
          height: 220,
          estimateSize: 48,
          overscan: 3,
          dynamic: true,
        },
      },
    })
    await nextTick()

    expect(wrapper.findAll('.s-table__data-row')).toHaveLength(4)
    expect(wrapper.find('.s-vl__window').attributes('style')).toContain(
      'height: 220px',
    )
    expect(virtualizerMocks.resizeItem).toHaveBeenCalledWith(
      expect.any(Number),
      64,
    )

    ;(
      wrapper.vm as unknown as { scrollToRow: (index: number) => void }
    ).scrollToRow(42)
    expect(virtualizerMocks.scrollToIndex).toHaveBeenCalledWith(42, {
      align: 'auto',
    })
  })

  it('keeps a 100k by 100k generated source bounded with fixed columns', async () => {
    const row = vi.fn((index: number) => ({ id: index + 1 }))
    const column = vi.fn((index: number) => ({
      key: `column-${index}`,
      title: `Column ${index + 1}`,
      width: 120,
      fixed: index < 2 ? ('left' as const) : undefined,
    }))
    const wrapper = mount(Table, {
      props: {
        virtualSource: {
          rowCount: 100_000,
          columnCount: 100_000,
          row,
          column,
          columnWidth: 120,
          fixedLeftCount: 2,
          fixedRightCount: 1,
        },
        virtualConfig: {
          height: 220,
          horizontal: true,
          dynamic: false,
          columnOverscan: 3,
        },
      },
    })
    await nextTick()

    expect(wrapper.find('[role="table"]').attributes('aria-rowcount')).toBe(
      '100001',
    )
    expect(wrapper.find('[role="table"]').attributes('aria-colcount')).toBe(
      '100000',
    )
    expect(wrapper.findAll('.s-table__data-row').length).toBeLessThan(40)
    expect(
      wrapper.findAll('.s-table__data-head-cell.is-fixed-column'),
    ).toHaveLength(3)
    expect(row.mock.calls.length).toBeLessThan(20)
    expect(column.mock.calls.length).toBeLessThan(50)
    expect(
      wrapper.find('.s-table__virtual-body').attributes('style'),
    ).toContain('--s-table-virtual-width: 100360px')

    const scrollWindow = wrapper.find('.s-vl__window')
    ;(scrollWindow.element as HTMLElement).scrollLeft =
      MAX_PHYSICAL_COLUMN_SCROLL_WIDTH / 2
    await scrollWindow.trigger('scroll')
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
    await nextTick()

    const headerIndices = wrapper
      .findAll('.s-table__data-head-cell')
      .map((cell) => cell.attributes('data-column-index'))
    const firstRowIndices = wrapper
      .find('.s-table__data-row')
      .findAll('.s-table__data-cell')
      .map((cell) => cell.attributes('data-column-index'))

    expect(firstRowIndices).toEqual(headerIndices)
    expect(headerIndices).toEqual(
      expect.arrayContaining(['0', '1', '99999', '49999', '50000']),
    )
  })

  it('keeps compressed horizontal wheel input at logical pixel speed', async () => {
    const wrapper = mount(Table, {
      props: {
        virtualSource: {
          rowCount: 100_000,
          columnCount: 100_000,
          row: (index: number) => ({ id: index + 1 }),
          column: (index: number) => ({
            key: `column-${index}`,
            title: `Column ${index + 1}`,
            width: 120,
          }),
          columnWidth: 120,
        },
        virtualConfig: {
          height: 220,
          horizontal: true,
          dynamic: false,
          columnOverscan: 3,
        },
      },
    })
    await nextTick()

    const scrollWindow = wrapper.find('.s-vl__window')
    const wheel = new WheelEvent('wheel', {
      bubbles: true,
      cancelable: true,
      deltaY: 120,
      shiftKey: true,
    })
    scrollWindow.element.dispatchEvent(wheel)
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
    await nextTick()

    expect(wheel.defaultPrevented).toBe(true)
    expect((scrollWindow.element as HTMLElement).scrollLeft).toBeGreaterThan(0)
    expect((scrollWindow.element as HTMLElement).scrollLeft).toBeLessThan(2)
    expect(
      wrapper
        .findAll('.s-table__data-head-cell')
        .map((cell) => cell.attributes('data-column-index')),
    ).toEqual(expect.arrayContaining(['0', '1']))

    const physicalLeft = (scrollWindow.element as HTMLElement).scrollLeft
    const verticalWheel = new WheelEvent('wheel', {
      bubbles: true,
      cancelable: true,
      deltaY: 120,
    })
    scrollWindow.element.dispatchEvent(verticalWheel)

    expect(verticalWheel.defaultPrevented).toBe(false)
    expect((scrollWindow.element as HTMLElement).scrollLeft).toBe(physicalLeft)
  })

  it('keeps stable internal row identities without mutating source rows', async () => {
    const first = { name: 'First' }
    const second = { name: 'Second' }
    const wrapper = mount(Table, {
      props: {
        data: [first, second],
        columns: [{ field: 'name', title: 'Name' }],
      },
    })

    const initialKeys = wrapper
      .findAll('.s-table__data-row')
      .map((row) => row.attributes('data-row-key'))
    expect(initialKeys).toEqual(['_S_ROW_1', '_S_ROW_2'])
    expect(first).not.toHaveProperty('_S_ROW_ID')
    expect(second).not.toHaveProperty('_S_ROW_ID')

    await wrapper.setProps({ data: [second, first] })

    expect(
      wrapper
        .findAll('.s-table__data-row')
        .map((row) => row.attributes('data-row-key')),
    ).toEqual(['_S_ROW_2', '_S_ROW_1'])
  })
})
