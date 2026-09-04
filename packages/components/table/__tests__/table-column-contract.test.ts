import { defineComponent, h, ref } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Table from '../src/table.vue'
import Column from '../src/table-column.vue'
import type { TableColumn } from '../src/table'

const data = [{ id: 1, a: 'A', b: 'B', c: 'C' }]
const values = (wrapper: ReturnType<typeof mount>) =>
  wrapper.findAll('.s-table__data-row [role="cell"]').map((cell) => cell.text())

describe('Table column declaration contract', () => {
  it.each(['configured', 'declarative'] as const)(
    'keeps keyed %s columns in the current source order',
    async (mode) => {
      const fields = ref(['a', 'b'])
      const columns = () =>
        fields.value.map((field) => ({ key: field, field, title: field }))
      const wrapper = mount(
        defineComponent(
          () => () =>
            h(
              Table,
              {
                data,
                columns: mode === 'configured' ? columns() : undefined,
              },
              mode === 'declarative'
                ? {
                    default: () => columns().map((column) => h(Column, column)),
                  }
                : {},
            ),
        ),
      )
      await flushPromises()
      expect(values(wrapper)).toEqual(['A', 'B'])
      fields.value = ['b', 'c', 'a']
      await flushPromises()
      expect(values(wrapper)).toEqual(['B', 'C', 'A'])
      fields.value = ['a', 'c']
      await flushPromises()
      expect(values(wrapper)).toEqual(['A', 'C'])
      wrapper.unmount()
    },
  )

  it.each(['configured', 'declarative'] as const)(
    'orders nested %s declarations before flattening grouped headers',
    async (mode) => {
      const fields = ref(['a', 'b'])
      const columns = (): TableColumn[] => [
        {
          key: 'group',
          title: 'Group',
          children: fields.value.map((field) => ({
            key: field,
            field,
            title: field,
          })),
        },
      ]
      const wrapper = mount(
        defineComponent(
          () => () =>
            h(
              Table,
              {
                data,
                columns: mode === 'configured' ? columns() : undefined,
              },
              mode === 'declarative'
                ? {
                    default: () =>
                      h(
                        Column,
                        { key: 'group', title: 'Group' },
                        {
                          columns: () =>
                            fields.value.map((field) =>
                              h(Column, { key: field, field, title: field }),
                            ),
                        },
                      ),
                  }
                : {},
            ),
        ),
      )
      await flushPromises()
      expect(values(wrapper)).toEqual(['A', 'B'])
      fields.value = ['b', 'a']
      await flushPromises()
      expect(values(wrapper)).toEqual(['B', 'A'])
      expect(
        wrapper.findAll('.s-table__data-head-cell').map((cell) => cell.text()),
      ).toEqual(['Group', 'b', 'a'])
      wrapper.unmount()
    },
  )

  it('updates renderers when declarative slots are added or removed', async () => {
    const custom = ref(false)
    const wrapper = mount(
      defineComponent(
        () => () =>
          h(
            Table,
            {
              data,
              footerData: [{ a: 'total' }],
            },
            {
              default: () =>
                h(
                  Column,
                  { key: 'a', field: 'a', title: 'Title' },
                  custom.value
                    ? {
                        default: ({ value }: { value: unknown }) =>
                          h('b', `cell:${value}`),
                        header: () => h('b', 'Custom title'),
                        footer: ({ value }: { value: unknown }) =>
                          h('b', `footer:${value}`),
                      }
                    : {},
                ),
            },
          ),
      ),
    )
    await flushPromises()
    expect(values(wrapper)).toEqual(['A'])
    custom.value = true
    await flushPromises()
    expect(values(wrapper)).toEqual(['cell:A'])
    expect(wrapper.find('.s-table__data-head-cell').text()).toBe('Custom title')
    expect(wrapper.find('.s-table__footer-cell').text()).toBe('footer:total')
    custom.value = false
    await flushPromises()
    expect(values(wrapper)).toEqual(['A'])
    expect(wrapper.find('.s-table__data-head-cell').text()).toBe('Title')
    expect(wrapper.find('.s-table__footer-cell').text()).toBe('total')
    wrapper.unmount()
  })

  it.each(['configured', 'declarative'] as const)(
    'preserves every cell fallback when %s renderers change',
    async (mode) => {
      const stage = ref('specific')
      const renderer = () => h('span', 'function')
      const columns = (): TableColumn[] => [
        {
          key: 'a',
          field: 'a',
          title: 'A',
          cell: ['specific', 'generic', 'function'].includes(stage.value)
            ? renderer
            : undefined,
          renderer: stage.value === 'raw' ? undefined : 'named',
        },
      ]
      const wrapper = mount(
        defineComponent(
          () => () =>
            h(
              Table,
              {
                data,
                columns: mode === 'configured' ? columns() : undefined,
                renderers: { named: () => h('span', 'named') },
              },
              {
                ...(mode === 'declarative'
                  ? {
                      default: () =>
                        columns().map((column) => h(Column, column)),
                    }
                  : {}),
                ...(stage.value === 'specific'
                  ? { 'cell-a': () => h('span', 'specific') }
                  : {}),
                ...(['specific', 'generic'].includes(stage.value)
                  ? { cell: () => h('span', 'generic') }
                  : {}),
              },
            ),
        ),
      )
      for (const current of [
        'specific',
        'generic',
        'function',
        'named',
        'raw',
      ]) {
        stage.value = current
        await flushPromises()
        expect(values(wrapper)).toEqual([current === 'raw' ? 'A' : current])
      }
      wrapper.unmount()
    },
  )

  it('restores current declarations after a configured override is removed', async () => {
    const override = ref<TableColumn[]>([])
    const fields = ref(['a', 'b'])
    const wrapper = mount(
      defineComponent(
        () => () =>
          h(
            Table,
            {
              data,
              columns: override.value,
              columnWidths: { a: 180, b: 140 },
            },
            {
              default: () =>
                fields.value.map((field) =>
                  h(Column, { key: field, field, title: field }),
                ),
            },
          ),
      ),
    )
    await flushPromises()
    expect(values(wrapper)).toEqual(['A', 'B'])
    override.value = [{ field: 'c', title: 'C' }]
    fields.value = ['b', 'a']
    await flushPromises()
    expect(values(wrapper)).toEqual(['C'])
    override.value = []
    await flushPromises()
    expect(values(wrapper)).toEqual(['B', 'A'])
    expect(
      wrapper
        .findAll('.s-table__data-row [role="cell"]')
        .map((cell) => cell.attributes('style')),
    ).toEqual([
      expect.stringContaining('140px'),
      expect.stringContaining('180px'),
    ])
    wrapper.unmount()
  })
})
