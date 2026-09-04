import { defineComponent, h, nextTick, reactive, ref, shallowRef } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { STable, STableColumn } from '@vuesax-alpha/components/table'
import { SInput } from '@vuesax-alpha/components/input'
import TableGrid from '../src/table-grid.vue'
import type {
  TableColumn,
  TablePagerConfig,
  TableRow,
} from '@vuesax-alpha/components/table'
import type { TableGridExposes, TableGridQueryContext } from '../src/table-grid'
import type { Slot } from 'vue'

const rows = [
  { id: 1, name: 'A' },
  { id: 2, name: 'B' },
  { id: 3, name: 'C' },
]
const columns: TableColumn[] = [
  { field: 'id', width: 80, fixed: 'left' },
  { field: 'name', title: 'Name', sortable: true, editor: true },
]
const items = [
  {
    field: 'term',
    title: 'Term',
    itemRender: { name: 'SInput', component: SInput },
    rules: { required: true, message: 'Required' },
  },
]
const scrollDescriptor = Object.getOwnPropertyDescriptor(
  HTMLElement.prototype,
  'scrollIntoView',
)
beforeEach(() => {
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  )
  Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
    configurable: true,
    value: vi.fn(),
  })
})
afterEach(() => {
  vi.unstubAllGlobals()
  if (scrollDescriptor)
    Object.defineProperty(
      HTMLElement.prototype,
      'scrollIntoView',
      scrollDescriptor,
    )
  else Reflect.deleteProperty(HTMLElement.prototype, 'scrollIntoView')
})

describe('Table Grid integration', () => {
  it('updates dynamic query and table slots independently with their original payloads', async () => {
    const content = shallowRef<Record<string, Slot>>({})
    const model = reactive({ term: 'initial' })
    let field!: { setValue: (value: unknown) => void }
    let actions!: TableGridExposes & { busy: boolean }
    const root = mount(
      defineComponent({
        setup: () => () =>
          h(
            TableGrid,
            {
              data: rows,
              columns: [
                {
                  field: 'name',
                  title: 'Name',
                  slots: { default: 'person', header: 'heading' },
                },
              ],
              queryConfig: {
                model,
                items: [{ field: 'term', slots: { default: 'term' } }],
              },
            },
            content.value,
          ),
      }),
    )
    try {
      content.value = {
        'query-term': (params) => {
          field = params
          return [h('span', { class: 'late-query' }, String(params.value))]
        },
        'query-actions': (params) => {
          actions = params
          return [h('span', { class: 'late-actions' }, String(params.busy))]
        },
        person: ({ value }) => [h('b', { class: 'late-cell' }, value)],
        heading: ({ column, columnIndex }) => [
          h('b', { class: 'late-heading' }, `${column.title}:${columnIndex}`),
        ],
      }
      await flushPromises()
      expect(root.get('.late-query').text()).toBe('initial')
      expect(root.get('.late-actions').text()).toBe('false')
      expect(root.findAll('.late-cell')).toHaveLength(3)
      expect(root.get('.late-heading').text()).toBe('Name:0')
      field.setValue('changed')
      await nextTick()
      expect(model.term).toBe('changed')
      expect(root.get('.late-query').text()).toBe('changed')
      expect(await actions.query()).toBe(true)
      expect(
        root.getComponent(TableGrid).emitted('query')?.[0][0],
      ).toMatchObject({ form: { term: 'changed' } })
      content.value = {
        person: ({ value }) => [h('i', { class: 'replacement-cell' }, value)],
      }
      await flushPromises()
      expect(root.find('.late-query').exists()).toBe(false)
      expect(root.find('.late-actions').exists()).toBe(false)
      expect(root.find('.late-heading').exists()).toBe(false)
      expect(root.findAll('.replacement-cell')).toHaveLength(3)
      expect(
        root.get('.s-table-grid__query-actions').findAll('button'),
      ).toHaveLength(2)
      content.value = {}
      await flushPromises()
      expect(root.find('.replacement-cell').exists()).toBe(false)
      expect(root.get('.s-table__data-cell').text()).toBe('A')
    } finally {
      root.unmount()
    }
  })
  it('does not emit a stale validated query when page acceptance changes the form', async () => {
    const model = reactive({ term: 'A' })
    const config = { model, items }
    const pager = ref<TablePagerConfig>({ currentPage: 2, pageSize: 1 })
    const api = shallowRef<TableGridExposes>()
    const query = vi.fn()
    const root = mount(
      defineComponent({
        setup: () => () =>
          h(TableGrid, {
            ref: api,
            data: rows,
            columns,
            queryConfig: config,
            pagerConfig: pager.value,
            onQuery: query,
            'onUpdate:pagerConfig': (next: TablePagerConfig) => {
              pager.value = next
              model.term = 'unvalidated'
            },
          }),
      }),
    )
    expect(await api.value!.query()).toBe(false)
    expect(query).not.toHaveBeenCalled()
    root.unmount()
  })

  it('blocks query actions while loading or disabled and reports orchestration errors', async () => {
    const root = mount(TableGrid, {
      props: { loading: true, queryConfig: { model: { term: 'A' }, items } },
    })
    expect(await root.vm.query()).toBe(false)
    expect(await root.vm.resetQuery()).toBe(false)
    expect(await root.vm.refresh()).toBe(false)
    await root.setProps({
      loading: false,
      queryConfig: { model: { term: 'A' }, items, disabled: true },
    })
    expect(await root.vm.query()).toBe(false)
    await root.setProps({ queryConfig: { model: { term: 'A' }, items } })
    vi.spyOn(root.vm.getForm()!, 'validate').mockRejectedValueOnce(undefined)
    expect(await root.vm.query()).toBe(false)
    expect(root.emitted('queryError')).toEqual([[undefined]])
    expect(root.emitted('query')).toBeUndefined()
    expect(await root.vm.query()).toBe(true)
    root.unmount()
  })

  it('runs native form submission once through the query validation guard', async () => {
    const validator = vi.fn(async () => true)
    const root = mount(TableGrid, {
      props: {
        queryConfig: {
          model: { term: 'A' },
          items: [{ ...items[0], rules: { validator } }],
        },
      },
    })
    await root.get('form').trigger('submit')
    await flushPromises()
    expect(validator).toHaveBeenCalledOnce()
    expect(root.emitted('query')).toHaveLength(1)
    root.unmount()
  })

  it('reuses tree expansion and bounded generated rendering', async () => {
    const load = vi.fn(async () => [{ id: 2, name: 'Child' }])
    const parent = { id: 1, name: 'Parent', lazy: true }
    const tree = mount(TableGrid, {
      props: {
        data: [parent],
        columns: [{ field: 'name', treeNode: true }],
        treeConfig: { hasChildren: 'lazy', load },
      },
    })
    await tree.vm
      .getTable()!
      .toggleRowExpand(tree.findComponent(STable).props('data')![0], true)
    expect(tree.findAll('.s-table__data-row')).toHaveLength(2)
    expect(load).toHaveBeenCalledOnce()
    expect(tree.emitted('lazyLoad')).toHaveLength(1)
    tree.unmount()
    const row = vi.fn(
      (index: number) =>
        new Proxy(
          { id: index },
          {
            ownKeys() {
              throw new Error('Do not enumerate generated rows')
            },
          },
        ),
    )
    const column = vi.fn((index: number) => ({
      key: String(index),
      field: 'id',
      width: 120,
    }))
    const source = mount(TableGrid, {
      props: {
        virtualSource: {
          rowCount: 1_000_000,
          columnCount: 100_000,
          columnWidth: 120,
          row,
          column,
          rowKey: (index: number) => index,
          fixedLeftCount: 1,
          fixedRightCount: 1,
        },
        virtualConfig: { height: 180, horizontal: true, dynamic: true },
      },
    })
    expect(await source.vm.refresh()).toBe(true)
    expect(row.mock.calls.length).toBeLessThan(100)
    expect(column.mock.calls.length).toBeLessThan(100)
    expect(source.findAllComponents(STable)).toHaveLength(1)
    source.unmount()
  })
  it('renders one unchanged table by default and forwards attributes and cell slots', async () => {
    const root = mount(TableGrid, {
      props: { data: rows, columns },
      attrs: { class: 'business-grid', 'aria-label': 'Projects' },
      slots: {
        'cell-name': ({ value }: { value: unknown }) =>
          h('strong', String(value)),
      },
    })
    expect(root.findAllComponents(STable)).toHaveLength(1)
    expect(root.find('.s-form').exists()).toBe(false)
    expect(root.find('.s-table-grid__toolbar').exists()).toBe(false)
    expect(root.classes()).toContain('business-grid')
    expect(root.findComponent(STable).attributes('aria-label')).toBe('Projects')
    expect(
      root.findAll('.s-table__data-row strong').map((node) => node.text()),
    ).toEqual(['A', 'B', 'C'])
    expect(root.emitted('query')).toBeUndefined()
    root.unmount()
  })

  it('retains declarative columns, header and footer slots', async () => {
    const root = mount(TableGrid, {
      props: { data: rows },
      slots: {
        default: () => h(STableColumn, { field: 'name', title: 'Declarative' }),
        header: () => h('div', 'Existing header'),
        footer: () => h('div', 'Existing footer'),
      },
    })
    await nextTick()
    expect(root.text()).toContain('Declarative')
    expect(root.text()).toContain('Existing header')
    expect(root.text()).toContain('Existing footer')
    expect(root.findAll('.s-table__data-row')).toHaveLength(3)
    root.unmount()
  })

  it('validates query fields and emits an independent condition snapshot', async () => {
    const model = reactive({ term: '' })
    const root = mount(TableGrid, {
      props: { data: rows, columns, queryConfig: { model, items } },
    })
    expect(await root.vm.query()).toBe(false)
    expect(root.text()).toContain('Required')
    await root.get('.s-table-grid__query input').setValue('Alpha')
    expect(model.term).toBe('Alpha')
    expect(await root.vm.query()).toBe(true)
    const context = root.emitted('query')![0][0] as TableGridQueryContext
    model.term = 'Beta'
    expect(context.form).toEqual({ term: 'Alpha' })
    expect(context.pager).toBe(false)
    expect(context.sortBy).toEqual([])
    root.unmount()
  })

  it('resets query fields and the uncontrolled page but refresh preserves the page', async () => {
    const model = reactive({ term: 'initial' })
    const root = mount(TableGrid, {
      props: {
        data: rows,
        columns,
        queryConfig: { model, items },
        pagerConfig: { pageSize: 1 },
      },
    })
    const table = root.findComponent(STable)
    table.vm.$emit('update:pagerConfig', { currentPage: 2, pageSize: 1 })
    await nextTick()
    expect(await root.vm.refresh()).toBe(true)
    expect(
      (root.emitted('query')![0][0] as TableGridQueryContext).pager,
    ).toMatchObject({ currentPage: 2 })
    await root.get('.s-table-grid__query input').setValue('changed')
    expect(await root.vm.resetQuery()).toBe(true)
    expect(model.term).toBe('initial')
    expect(root.vm.getQueryContext().pager).toMatchObject({ currentPage: 1 })
    expect(root.emitted('query')![1][0]).toMatchObject({
      reason: 'reset',
      form: { term: 'initial' },
    })
    root.unmount()
  })

  it('waits for controlled page acceptance before emitting a search', async () => {
    const pager = ref<TablePagerConfig>({ currentPage: 2, pageSize: 1 })
    const api = shallowRef<TableGridExposes>()
    let accepts = false
    const query = vi.fn()
    const root = mount(
      defineComponent({
        setup: () => () =>
          h(TableGrid, {
            ref: api,
            data: rows,
            columns,
            pagerConfig: pager.value,
            onQuery: query,
            'onUpdate:pagerConfig': (value: TablePagerConfig) => {
              if (accepts) pager.value = value
            },
          }),
      }),
    )
    expect(await api.value!.query()).toBe(false)
    expect(query).not.toHaveBeenCalled()
    expect(pager.value.currentPage).toBe(2)
    accepts = true
    expect(await api.value!.query()).toBe(true)
    expect(query).toHaveBeenCalledOnce()
    expect(query.mock.calls[0][0].pager.currentPage).toBe(1)
    root.unmount()
  })

  it('preserves sort/filter events and uses the same table row pipeline', async () => {
    const root = mount(TableGrid, {
      props: {
        data: rows,
        columns: [
          ...columns.slice(0, 1),
          { ...columns[1], filters: [{ label: 'B', value: 'B' }] },
        ],
      },
    })
    root.vm.getTable()!.setSort([{ field: 'name', order: 'desc' }])
    await nextTick()
    expect(root.findAll('.s-table__data-row').map((row) => row.text())).toEqual(
      ['3C', '2B', '1A'],
    )
    root.vm.getTable()!.setFilters({ name: ['B'] })
    await nextTick()
    expect(root.findAll('.s-table__data-row').map((row) => row.text())).toEqual(
      ['2B'],
    )
    expect(root.vm.getQueryContext()).toMatchObject({
      sortBy: [{ field: 'name', order: 'desc' }],
      filters: { name: ['B'] },
    })
    expect(root.emitted('update:sortBy')).toHaveLength(1)
    expect(root.emitted('update:filters')).toHaveLength(1)
    root.unmount()
  })

  it('forwards controlled row mutations and history through the nested table', async () => {
    const data = ref<TableRow[]>(rows)
    const api = shallowRef<TableGridExposes>()
    const root = mount(
      defineComponent({
        setup: () => () =>
          h(TableGrid, {
            ref: api,
            data: data.value,
            columns,
            changeConfig: true,
            historyConfig: true,
            'onUpdate:data': (next: TableRow[]) => {
              data.value = next
            },
          }),
      }),
    )
    expect(
      await api.value!.getTable()!.updateRow(1, { name: 'updated' }),
    ).toEqual({ applied: true })
    expect(data.value[0].name).toBe('updated')
    expect(await api.value!.getTable()!.undo()).toEqual({ applied: true })
    expect(data.value[0].name).toBe('A')
    expect(root.findComponent(TableGrid).emitted('historyChange')).toHaveLength(
      2,
    )
    expect(rows[0].name).toBe('A')
    root.unmount()
  })

  it('discards pending query validation after input changes or unmount', async () => {
    for (const unmount of [false, true]) {
      let finish!: (value: boolean) => void
      const model = reactive({ term: 'initial' })
      const root = mount(TableGrid, {
        props: {
          queryConfig: {
            model,
            items: [
              {
                ...items[0],
                rules: {
                  validator: () =>
                    new Promise<boolean>((resolve) => {
                      finish = resolve
                    }),
                },
              },
            ],
          },
        },
      })
      const query = root.vm.query()
      expect(await root.vm.refresh()).toBe(false)
      if (unmount) root.unmount()
      else model.term = 'changed'
      if (!unmount) finish(true)
      expect(await query).toBe(false)
      expect(root.emitted('query')).toBeUndefined()
      if (!unmount) root.unmount()
    }
  })

  it('keeps configured toolbar visibility, disabled actions and refresh semantics', async () => {
    const root = mount(TableGrid, {
      props: {
        toolbarConfig: {
          title: 'Projects',
          buttons: [
            { code: 'add', text: 'Add' },
            { code: 'hidden', text: 'Hidden', visible: false },
            { code: 'blocked', text: 'Blocked', disabled: true },
          ],
        },
      },
    })
    const buttons = root.findAll('.s-table-grid__toolbar button')
    expect(buttons.map((button) => button.text())).toEqual([
      'Add',
      'Blocked',
      'Refresh',
    ])
    await buttons[0].trigger('click')
    await vi.waitFor(() =>
      expect(root.emitted('toolbarClick')?.[0][0]).toBe('add'),
    )
    expect(buttons[1].attributes('disabled')).toBeDefined()
    await buttons[2].trigger('click')
    await vi.waitFor(() =>
      expect(root.emitted('query')?.[0][0]).toMatchObject({
        reason: 'refresh',
      }),
    )
    root.unmount()
  })

  it('passes named form slots and custom query actions without swallowing table slots', async () => {
    const model = reactive({ term: 'custom' })
    const root = mount(TableGrid, {
      props: {
        data: rows,
        columns,
        queryConfig: {
          model,
          items: [{ field: 'term', slots: { default: 'term' } }],
        },
      },
      slots: {
        'query-term': ({ value }: { value: unknown }) =>
          h('span', { class: 'query-value' }, String(value)),
        'query-actions': ({ query }: { query: () => Promise<boolean> }) =>
          h(
            'button',
            {
              onClick: (event: Event) => {
                event.preventDefault()
                query()
              },
            },
            'Find',
          ),
        'cell-name': ({ value }: { value: unknown }) => h('b', String(value)),
      },
    })
    expect(root.get('.query-value').text()).toBe('custom')
    expect(root.get('.s-table-grid__query-actions').text()).toBe('Find')
    await root.get('.s-table-grid__query-actions button').trigger('click')
    await flushPromises()
    expect(root.emitted('query')).toHaveLength(1)
    expect(root.findAll('.s-table__data-row b')).toHaveLength(3)
    root.unmount()
  })
})
