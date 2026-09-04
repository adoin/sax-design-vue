import { h } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import MergeLayer from '../src/table-merge-layer.vue'
import DataRow from '../src/table-data-row.vue'
import FooterRows from '../src/table-footer-rows.vue'
import { createTableMergeIndex } from '../src/composables/table-merge-regions'
import type { TableMergeSurface } from '../src/table-merge-layer.vue'
import type { TableMergeGeometry } from '../src/composables/use-table-merge-geometry'
import type {
  TableCellRenderParams,
  TableFlatRow,
  TableFooterCellRenderParams,
  TableRenderedColumnEntry,
} from '../src/table'

const flatRow: TableFlatRow = {
  key: 'owner',
  index: 0,
  row: { name: 'Merged owner' },
  depth: 0,
  expanded: false,
  loading: false,
  hasChildren: false,
}
const entry: TableRenderedColumnEntry = {
  kind: 'column',
  key: 'name',
  index: 0,
  ariaIndex: 0,
  column: { field: 'name', title: 'Name' },
  style: { width: '100%', minWidth: 0, flex: '1 1 0' },
}
const body = createTableMergeIndex(
  [{ row: 0, col: 0, rowspan: 1000000, colspan: 100000 }],
  1000000,
  100000,
)
const empty = createTableMergeIndex([], 0, 100000)
const geometry = (): TableMergeGeometry => ({
  body: {
    rows: [
      { index: 999998, top: 20, height: 44 },
      { index: 999999, top: 64, height: 64 },
    ],
    columns: [
      { position: 0, left: 0, width: 80, fixed: 'left' },
      { position: 99998, left: 40, width: 320 },
      { position: 99999, left: 320, width: 80, fixed: 'right' },
    ],
    clip: { left: 0, right: 400, top: 20, bottom: 128 },
    windows: [],
  },
  footer: {
    rows: [],
    columns: [],
    clip: { left: 0, right: 400, top: 128, bottom: 128 },
    windows: [],
  },
})

describe('merge layer and shared data-cell rendering', () => {
  it('keeps virtual body owners inside their native scroll host while the footer remains outside', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    host.scrollTop = 8000
    host.scrollLeft = 2000
    const wheel = vi.fn()
    host.addEventListener('wheel', wheel)
    const layout = geometry()
    layout.footer = {
      rows: [{ index: 0, top: 128, height: 44 }],
      columns: layout.body.columns,
      clip: { left: 0, right: 400, top: 128, bottom: 172 },
      windows: [],
    }
    const wrapper = mount(MergeLayer, {
      attachTo: document.body,
      props: {
        body,
        footer: createTableMergeIndex(
          [{ row: 0, col: 0, rowspan: 1, colspan: 2 }],
          1,
          100000,
        ),
        geometry: layout,
        bodyHost: host,
      },
      slots: {
        cell: ({ surface }: { surface: TableMergeSurface }) =>
          h('input', { 'data-area': surface.area }),
      },
    })
    try {
      const owner = host.querySelector<HTMLElement>('[data-merge-primary]')!
      const input = owner.querySelector('input')!
      expect(owner.style.top).toBe('8000px')
      expect(owner.style.left).toBe('2000px')
      expect(host.querySelectorAll('input')).toHaveLength(1)
      expect(wrapper.find('input[data-area="footer"]').exists()).toBe(true)
      input.dispatchEvent(
        new WheelEvent('wheel', { deltaY: 100, bubbles: true }),
      )
      expect(wheel).toHaveBeenCalledTimes(1)
      input.focus()
      host.scrollTop = 8100
      await wrapper.setProps({ geometry: { ...layout } })
      expect(host.querySelector('input')).toBe(input)
      expect(document.activeElement).toBe(input)
      expect(owner.style.top).toBe('8100px')
    } finally {
      wrapper.unmount()
      expect(host.querySelectorAll('[data-merge-region]')).toHaveLength(0)
      host.remove()
    }
  })
  it('uses original footer indices, formatting and context for an offscreen owner', async () => {
    const footer = createTableMergeIndex(
      [{ row: 3, col: 0, rowspan: 2, colspan: 1 }],
      5,
      1,
    )
    const format = vi.fn(
      ({ value, rowIndex }: TableFooterCellRenderParams) =>
        `${rowIndex}: ${value}`,
    )
    const props = {
      data: [{ name: 'Total' }],
      dataOffset: 3,
      rowOffset: 14,
      entries: [
        { ...entry, column: { ...entry.column, footerFormatter: format } },
      ],
      renderers: {},
      fixedStyle: () => ({}),
      retainHeights: false,
      contextMenuEnabled: true,
      mergeOwner: footer.regions[0],
    }
    const wrapper = mount(FooterRows, { props })
    expect(wrapper.get('[role="cell"]').text()).toBe('3: Total')
    expect(wrapper.get('[role="row"]').attributes()).toMatchObject({
      'data-footer-row-index': '3',
      'aria-rowindex': '14',
    })
    expect(wrapper.get('[role="cell"]').attributes('aria-rowspan')).toBe('2')
    await wrapper.get('[role="cell"]').trigger('contextmenu')
    expect(wrapper.emitted('cellContextMenu')?.[0][0]).toMatchObject({
      rowIndex: 3,
      columnIndex: 0,
      value: 'Total',
    })
    wrapper.unmount()
    const covered = mount(FooterRows, {
      props: { ...props, mergeOwner: undefined, mergeAt: footer.at },
    })
    expect(covered.findAll('[role="cell"]')).toHaveLength(0)
    expect(covered.findAll('.s-table__merge-placeholder')).toHaveLength(1)
    // Covered footer values do not invoke user formatters.
    expect(format).toHaveBeenCalledTimes(1)
    covered.unmount()
  })
  it('renders the offscreen owner through the existing cell pipeline once across fixed panes', async () => {
    const clicked = vi.fn()
    const renderer = vi.fn((params: TableCellRenderParams) =>
      h('button', params.value as string),
    )
    const wrapper = mount(MergeLayer, {
      props: { body, footer: empty, geometry: geometry() },
      slots: {
        cell: ({ surface }: { surface: TableMergeSurface }) =>
          h(
            DataRow,
            {
              flatRow,
              entries: [entry],
              displayIndex: 0,
              rowOffset: 2,
              selected: false,
              striped: false,
              indent: 20,
              rowClass: '',
              mergeOwner: surface.region,
              onCellClick: clicked,
            },
            { cell: renderer },
          ),
      },
    })
    const fragments = wrapper.findAll('.s-table__merge-fragment')
    expect(fragments).toHaveLength(3)
    expect(fragments.map((fragment) => fragment.attributes('style'))).toEqual([
      'left: 0px; top: 20px; width: 80px; height: 108px;',
      'left: 80px; top: 20px; width: 240px; height: 108px;',
      'left: 320px; top: 20px; width: 80px; height: 108px;',
    ])
    expect(wrapper.findAll('button')).toHaveLength(1)
    expect(renderer).toHaveBeenCalledTimes(1)
    expect(wrapper.get('[role="cell"]').attributes()).toMatchObject({
      'aria-rowspan': '1000000',
      'aria-colspan': '100000',
      'aria-colindex': '1',
    })
    expect(fragments[1].attributes('aria-hidden')).toBe('true')
    await wrapper.get('button').trigger('click')
    expect(clicked.mock.calls[0][0]).toMatchObject({
      row: flatRow.row,
      rowIndex: 0,
      columnIndex: 0,
    })
    await fragments[1].trigger('click')
    await fragments[2].trigger('contextmenu')
    expect(wrapper.emitted('continuationClick')?.[0][0]).toMatchObject({
      region: body.regions[0],
      area: 'body',
    })
    expect(wrapper.emitted('continuationContextmenu')?.[0][0]).toMatchObject({
      region: body.regions[0],
      area: 'body',
    })
    wrapper.unmount()
  })

  it('keeps the editor DOM and focus when the visible window and owning pane change', async () => {
    const wrapper = mount(MergeLayer, {
      attachTo: document.body,
      props: { body, footer: empty, geometry: geometry() },
      slots: {
        cell: () =>
          h('input', { value: 'draft', 'aria-label': 'Merged value' }),
      },
    })
    const input = wrapper.get('input').element
    input.focus()
    const next = geometry()
    next.body.rows = [{ index: 999999, top: 20, height: 64 }]
    // The owner moves from the fixed-left fragment to the sole remaining center fragment.
    next.body.columns = [{ position: 99997, left: 0, width: 400 }]
    await wrapper.setProps({ geometry: next })
    expect(wrapper.get('input').element).toBe(input)
    expect(document.activeElement).toBe(input)
    expect(wrapper.findAll('.s-table__merge-fragment')).toHaveLength(1)
    wrapper.unmount()
  })

  it('keeps body and footer owners separate even when the region keys match', () => {
    const index = createTableMergeIndex(
      [{ row: 0, col: 0, rowspan: 2, colspan: 1 }],
      2,
      1,
    )
    const next = geometry()
    next.body.rows = [
      { index: 0, top: 0, height: 44 },
      { index: 1, top: 44, height: 44 },
    ]
    next.body.columns = [{ position: 0, left: 0, width: 200 }]
    next.body.clip = { left: 0, right: 200, top: 0, bottom: 88 }
    next.footer = {
      ...next.body,
      rows: next.body.rows.map((row) => ({ ...row, top: row.top + 88 })),
      clip: { left: 0, right: 200, top: 88, bottom: 176 },
    }
    const wrapper = mount(MergeLayer, {
      props: { body: index, footer: index, geometry: next },
      slots: {
        cell: ({ surface }: { surface: TableMergeSurface }) =>
          h('button', surface.area),
      },
    })
    expect(wrapper.findAll('button').map((button) => button.text())).toEqual([
      'body',
      'footer',
    ])
    expect(wrapper.findAll('.is-footer-merge')).toHaveLength(1)
    wrapper.unmount()
  })

  it('replaces covered source cells with inert tracks without invoking slots or cell actions', async () => {
    const renderer = vi.fn(() => h('button', 'Should not mount'))
    const wrapper = mount(DataRow, {
      props: {
        flatRow: { ...flatRow, index: 999999 },
        entries: [entry],
        displayIndex: 999,
        mergeRowOffset: 999000,
        mergeAt: body.at,
        selected: false,
        striped: false,
        indent: 20,
        rowClass: '',
      },
      slots: { cell: renderer },
    })
    expect(wrapper.findAll('[role="cell"]')).toHaveLength(0)
    expect(wrapper.findAll('button')).toHaveLength(0)
    expect(renderer).not.toHaveBeenCalled()
    const track = wrapper.get('.s-table__merge-placeholder')
    expect(track.attributes()).toMatchObject({
      'data-column-index': '0',
      'data-column-position': '0',
      'aria-hidden': 'true',
    })
    await track.trigger('dblclick')
    expect(wrapper.emitted('cellClick')).toBeUndefined()
    await wrapper.setProps({ mergeAt: undefined })
    expect(wrapper.findAll('[role="cell"]')).toHaveLength(1)
    expect(renderer).toHaveBeenCalledTimes(1)
    wrapper.unmount()
  })
})
