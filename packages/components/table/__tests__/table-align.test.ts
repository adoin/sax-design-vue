import { h } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ConfigProvider from '../../config-provider/src/config-provider'
import Table from '../src/table.vue'
import {
  DEFAULT_TABLE_ALIGN,
  resolveTableCellAlign,
  resolveTableFooterAlign,
  resolveTableHeaderAlign,
} from '../src/table-align'
import type { TableColumn } from '../src/table'

const data = [{ id: 1, name: 'Alpha', email: 'alpha@example.com' }]
const headerStyle = (
  wrapper: ReturnType<typeof mount>,
  index: number,
  group = false,
) =>
  wrapper
    .get(
      `[role="columnheader"][data-column-index="${index}"]${
        group ? '.is-group-header' : ':not(.is-group-header)'
      }`,
    )
    .attributes('style')
const cellStyle = (wrapper: ReturnType<typeof mount>, index: number) =>
  wrapper
    .get(`.s-table__data-row [role="cell"][data-column-index="${index}"]`)
    .attributes('style')
const footerStyle = (wrapper: ReturnType<typeof mount>, index: number) =>
  wrapper
    .get(`.s-table__footer-cell[data-column-index="${index}"]`)
    .attributes('style')

describe('table alignment resolution', () => {
  it('resolves header, cell and footer alignment with the documented fallbacks', () => {
    expect(resolveTableCellAlign({}, undefined)).toBe(DEFAULT_TABLE_ALIGN)
    expect(resolveTableCellAlign({}, 'center')).toBe('center')
    expect(resolveTableCellAlign({ align: 'right' }, 'center')).toBe('right')

    expect(resolveTableHeaderAlign({}, undefined, undefined)).toBe('left')
    expect(resolveTableHeaderAlign({}, 'center', undefined)).toBe('center')
    expect(resolveTableHeaderAlign({}, 'center', 'right')).toBe('right')
    expect(resolveTableHeaderAlign({ align: 'right' }, 'center', 'left')).toBe(
      'right',
    )
    expect(
      resolveTableHeaderAlign(
        { align: 'right', headerAlign: 'center' },
        'left',
        'left',
      ),
    ).toBe('center')

    expect(resolveTableFooterAlign({}, 'center')).toBe('center')
    expect(resolveTableFooterAlign({ align: 'right' }, 'center')).toBe('right')
    expect(
      resolveTableFooterAlign(
        { align: 'right', footerAlign: 'left' },
        'center',
      ),
    ).toBe('left')
  })

  it('defaults omitted column alignment to left for headers, cells and grouped titles', () => {
    const wrapper = mount(Table, {
      props: {
        data,
        columns: [
          {
            title: 'Profile',
            children: [{ field: 'name', title: 'Name' }],
          },
        ],
      },
    })

    expect(headerStyle(wrapper, 0, true)).toContain('text-align: left')
    expect(headerStyle(wrapper, 0)).toContain('text-align: left')
    expect(cellStyle(wrapper, 0)).toContain('text-align: left')
    wrapper.unmount()
  })

  it('lets column align control both surfaces and headerAlign override the header only', () => {
    const wrapper = mount(Table, {
      props: {
        data,
        columns: [
          { field: 'name', title: 'Name', align: 'right' },
          { field: 'email', title: 'Email', headerAlign: 'right' },
        ],
      },
    })

    expect(headerStyle(wrapper, 0)).toContain('text-align: right')
    expect(cellStyle(wrapper, 0)).toContain('text-align: right')
    expect(headerStyle(wrapper, 1)).toContain('text-align: right')
    expect(cellStyle(wrapper, 1)).toContain('text-align: left')
    wrapper.unmount()
  })

  it('inherits table align and headerAlign when a column omits them', () => {
    const columns: TableColumn[] = [
      { field: 'name', title: 'Name' },
      { field: 'email', title: 'Email', align: 'left' },
    ]
    const wrapper = mount(Table, {
      props: {
        data,
        columns,
        align: 'center',
        headerAlign: 'right',
        footerData: [{ name: 'Total', email: 'n/a' }],
      },
    })

    expect(headerStyle(wrapper, 0)).toContain('text-align: right')
    expect(cellStyle(wrapper, 0)).toContain('text-align: center')
    expect(footerStyle(wrapper, 0)).toContain('text-align: center')
    expect(headerStyle(wrapper, 1)).toContain('text-align: left')
    expect(cellStyle(wrapper, 1)).toContain('text-align: left')
    wrapper.unmount()
  })

  it('inherits ConfigProvider table alignment when the instance omits both props', () => {
    const wrapper = mount(ConfigProvider, {
      props: {
        table: { align: 'center', headerAlign: 'right' },
      },
      slots: {
        default: () =>
          h(Table, {
            data,
            columns: [{ field: 'name', title: 'Name' }],
          }),
      },
    })

    expect(headerStyle(wrapper, 0)).toContain('text-align: right')
    expect(cellStyle(wrapper, 0)).toContain('text-align: center')
    wrapper.unmount()
  })
})
