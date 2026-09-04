import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import Table from '../src/table.vue'
import TableGrid from '../../table-grid/src/table-grid.vue'
import type { TableProps } from '../src/table'

const featureKeys = [
  'historyConfig',
  'changeConfig',
  'editConfig',
  'rowDragConfig',
  'keyboardConfig',
  'rangeConfig',
  'clipboardConfig',
  'findConfig',
  'chartConfig',
  'contextMenuConfig',
  'mergeConfig',
  'groupConfig',
  'columnManagerConfig',
  'resizeConfig',
  'virtualConfig',
  'pagerConfig',
] as const
const inactiveProps = (
  mode: 'omitted' | 'false' | 'disabled',
): Partial<TableProps> =>
  mode === 'omitted'
    ? {}
    : {
        ...Object.fromEntries(
          featureKeys.map((key) => [
            key,
            mode === 'false' ? false : { enabled: false },
          ]),
        ),
        detailConfig: mode === 'false' ? false : { enabled: false },
        // ValidationConfig controls automatic commit validation through onCommit.
        validationConfig: mode === 'false' ? false : { onCommit: false },
      }

describe('Table opt-in contract', () => {
  it.each(['omitted', 'false', 'disabled'] as const)(
    'keeps the ordinary table inert with %s optional features',
    async (mode) => {
      const validator = vi.fn(() => true)
      const row = Object.freeze({ id: 1, name: 'Alpha' })
      const wrapper = mount(Table, {
        props: {
          data: [row],
          columns: [
            {
              field: 'name',
              title: 'Name',
              editor: true,
              dragSort: true,
              rules: { validator },
            },
          ],
          ...inactiveProps(mode),
        },
      })
      await flushPromises()
      expect(wrapper.findAll('.s-table__data-row')).toHaveLength(1)
      expect(wrapper.find('[role="cell"]').text()).toBe('Alpha')
      expect(wrapper.find('[role="columnheader"]').text()).toBe('Name')
      expect(wrapper.get('.s-table').classes()).not.toContain('is-virtual')
      expect(wrapper.find('.s-vl__window').exists()).toBe(false)
      expect(
        wrapper.find('button,input,[role="menu"],[role="dialog"]').exists(),
      ).toBe(false)
      await wrapper.get('[role="cell"]').trigger('dblclick')
      expect(wrapper.find('.s-table__cell-editor').exists()).toBe(false)
      for (const event of [
        new KeyboardEvent('keydown', {
          key: 'ArrowDown',
          bubbles: true,
          cancelable: true,
        }),
        new KeyboardEvent('keydown', {
          key: 'f',
          ctrlKey: true,
          bubbles: true,
          cancelable: true,
        }),
        new KeyboardEvent('keydown', {
          key: 'c',
          ctrlKey: true,
          bubbles: true,
          cancelable: true,
        }),
        new MouseEvent('contextmenu', { bubbles: true, cancelable: true }),
      ]) {
        wrapper.get('[role="cell"]').element.dispatchEvent(event)
        expect(event.defaultPrevented).toBe(false)
      }
      expect(await wrapper.vm.startEdit(row, 'name')).toBe(false)
      expect(validator).not.toHaveBeenCalled()
      expect(wrapper.emitted('editStart')).toBeUndefined()
      expect(wrapper.emitted('update:activeCell')).toBeUndefined()
      expect(row).toEqual({ id: 1, name: 'Alpha' })
      wrapper.unmount()
    },
  )

  it('reflects source-implied virtualization even when virtualConfig is omitted', async () => {
    const wrapper = mount(Table, {
      props: {
        virtualSource: {
          rowCount: 3,
          columnCount: 1,
          row: (index: number) => ({ id: index, name: `Row ${index}` }),
          column: () => ({ field: 'name', title: 'Name' }),
          columnWidth: 120,
        },
      },
    })
    await flushPromises()
    expect(wrapper.find('.s-vl__window').exists()).toBe(true)
    expect(wrapper.get('.s-table').classes()).toContain('is-virtual')
    wrapper.unmount()
  })

  it('disables virtual layout reactively without keeping the virtual state class', async () => {
    const wrapper = mount(Table, {
      props: {
        data: [{ id: 1, name: 'Alpha' }],
        columns: [{ field: 'name' }],
        virtualConfig: true,
      },
    })
    await flushPromises()
    expect(wrapper.get('.s-table').classes()).toContain('is-virtual')
    await wrapper.setProps({ virtualConfig: { enabled: false } })
    expect(wrapper.find('.s-vl__window').exists()).toBe(false)
    expect(wrapper.get('.s-table').classes()).not.toContain('is-virtual')
    expect(wrapper.get('[role="cell"]').text()).toBe('Alpha')
    wrapper.unmount()
  })

  it.each([false, { enabled: false }] as const)(
    'does not mount Grid tools or request data with disabled configuration %j',
    async (disabled) => {
      const query = vi.fn(async () => ({ data: [], total: 0 }))
      const wrapper = mount(TableGrid, {
        props: {
          data: [{ id: 1, name: 'Local' }],
          columns: [{ field: 'name' }],
          queryConfig: disabled,
          toolbarConfig: disabled,
          proxyConfig: disabled === false ? false : { enabled: false, query },
        },
      })
      await flushPromises()
      expect(query).not.toHaveBeenCalled()
      expect(wrapper.find('form,button,input').exists()).toBe(false)
      expect(wrapper.get('[role="cell"]').text()).toBe('Local')
      wrapper.unmount()
    },
  )
})
