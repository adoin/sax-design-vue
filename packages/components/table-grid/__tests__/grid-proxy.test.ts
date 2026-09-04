import { defineComponent, h, nextTick, reactive, ref, shallowRef } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { STable } from '@vuesax-alpha/components/table'
import TableGrid from '../src/table-grid.vue'
import type { TableColumn, TableRow } from '@vuesax-alpha/components/table'
import type {
  TableGridExposes,
  TableGridProxyQueryResult,
  TableGridProxyRequest,
} from '../src/table-grid'

const columns: TableColumn[] = [
  { field: 'id', width: 80, fixed: 'left' },
  { field: 'name', sortable: true, editor: true },
]
const deferred = <T>() => {
  let resolve!: (value: T) => void
  let reject!: (reason?: unknown) => void
  const promise = new Promise<T>((done, fail) => {
    resolve = done
    reject = fail
  })
  return { resolve, reject, promise }
}
const scrollDescriptor = Object.getOwnPropertyDescriptor(
  HTMLElement.prototype,
  'scrollIntoView',
)
beforeEach(() => {
  Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
    configurable: true,
    value: vi.fn(),
  })
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  )
})
afterEach(() => {
  if (scrollDescriptor)
    Object.defineProperty(
      HTMLElement.prototype,
      'scrollIntoView',
      scrollDescriptor,
    )
  else Reflect.deleteProperty(HTMLElement.prototype, 'scrollIntoView')
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('Grid request proxy', () => {
  it('persists a committed editor draft through the same internal data journal', async () => {
    const save = vi.fn(async () => true)
    const root = mount(TableGrid, {
      props: {
        columns,
        editConfig: { mode: 'row' },
        changeConfig: true,
        proxyConfig: {
          query: () => ({ data: [{ id: 1, name: 'A' }] }),
          save,
          reloadAfterMutation: false,
        },
      },
    })
    await flushPromises()
    expect(await root.vm.getTable()!.startEdit(0, 'name')).toBe(true)
    await root.get('.s-table__cell-editor input').setValue('B')
    expect(await root.vm.getTable()!.commitEdit()).toBe(true)
    expect(root.emitted('editCancel')).toBeUndefined()
    expect(root.vm.getTable()!.getChangeRecords().updated).toHaveLength(1)
    expect((await root.vm.commitProxy('save')).status).toBe('success')
    expect(save).toHaveBeenCalledOnce()
    root.unmount()
  })
  it('keeps validation failures and rejected or cancelled writes in the change journal', async () => {
    const pending = deferred<boolean>()
    const save = vi
      .fn()
      .mockResolvedValueOnce(false)
      .mockReturnValueOnce(pending.promise)
    const root = mount(TableGrid, {
      props: {
        columns: [{ field: 'name', rules: { required: true } }],
        changeConfig: true,
        validationConfig: { scrollToError: false },
        proxyConfig: { query: () => ({ data: [{ id: 1, name: 'A' }] }), save },
      },
    })
    await flushPromises()
    await root.vm.getTable()!.updateRow(1, { name: '' })
    expect((await root.vm.commitProxy('save')).status).toBe('invalid')
    expect(save).not.toHaveBeenCalled()
    await root.vm.getTable()!.updateRow(1, { name: 'B' })
    expect((await root.vm.commitProxy('save')).status).toBe('rejected')
    const operation = root.vm.commitProxy('save')
    await flushPromises()
    root.vm.cancelProxy()
    expect((await operation).status).toBe('cancelled')
    expect(root.vm.getTable()!.getChangeRecords().updated).toHaveLength(1)
    pending.resolve(true)
    await flushPromises()
    expect(root.vm.getTable()!.getChangeRecords().updated).toHaveLength(1)
    root.unmount()
  })

  it('renders only the virtual window of a loaded tree page', async () => {
    for (const key of ['clientWidth', 'offsetWidth'] as const)
      vi.spyOn(HTMLElement.prototype, key, 'get').mockReturnValue(600)
    for (const key of ['clientHeight', 'offsetHeight'] as const)
      vi.spyOn(HTMLElement.prototype, key, 'get').mockReturnValue(180)
    const root = mount(TableGrid, {
      props: {
        columns: [
          { field: 'name', treeNode: true, fixed: 'left', width: 180 },
          { field: 'id', width: 120 },
        ],
        expandedKeys: [1],
        pagerConfig: { pageSize: 1 },
        virtualConfig: { height: 180, horizontal: true, dynamic: true },
        proxyConfig: {
          query: () => ({
            data: [
              {
                id: 1,
                name: 'Group',
                children: Array.from({ length: 1000 }, (_, i) => ({
                  id: i + 2,
                  name: `Child ${i}`,
                })),
              },
            ],
            total: 1_000_000,
          }),
        },
      },
    })
    await flushPromises()
    expect(root.vm.getProxyState().result).toMatchObject({ status: 'success' })
    expect(root.findComponent(STable).props('data')).toHaveLength(1)
    await vi.waitFor(() =>
      expect(root.findAll('.s-table__data-row').length).toBeGreaterThan(1),
    )
    expect(root.findAll('.s-table__data-row').length).toBeLessThan(50)
    expect(root.findComponent(STable).props('pagerConfig')).toMatchObject({
      total: 1_000_000,
      remote: true,
    })
    root.unmount()
  })

  it('saves sparse generated changes without enumerating rows or columns', async () => {
    const values = new Map<number, string>()
    const row = vi.fn(
      (index: number) =>
        new Proxy(
          { id: index, name: values.get(index) ?? 'A' },
          {
            ownKeys() {
              throw new Error('Do not enumerate rows')
            },
          },
        ),
    )
    const save = vi.fn(async () => true)
    const root = mount(TableGrid, {
      props: {
        virtualSource: {
          rowCount: 1_000_000,
          columnCount: 100_000,
          row,
          rowKey: (index) => index,
          column: (index) => ({
            key: String(index),
            field: index === 1 ? 'name' : 'id',
            width: 120,
          }),
          columnWidth: 120,
        },
        virtualConfig: { height: 180, horizontal: true, dynamic: true },
        changeConfig: {
          indexOf: (key) => Number(key),
          apply: ({ operations }) => {
            for (const operation of operations)
              for (const patch of operation.patches)
                if (patch.field === 'name')
                  values.set(Number(operation.rowKey), String(patch.value))
            return true
          },
        },
        proxyConfig: {
          autoLoad: false,
          save,
          reloadAfterMutation: false,
          validationColumns: [1],
        },
      },
    })
    expect(
      (await root.vm.getTable()!.updateRow(999_999, { name: 'updated' }))
        .applied,
    ).toBe(true)
    for (const validationColumns of [['name'], [-1], [100_000], [Number.NaN]]) {
      await root.setProps({
        proxyConfig: {
          autoLoad: false,
          save,
          reloadAfterMutation: false,
          validationColumns,
        },
      })
      row.mockClear()
      expect((await root.vm.commitProxy('save')).status).toBe('unsupported')
      expect(row.mock.calls.length).toBeLessThan(100)
      expect(save).not.toHaveBeenCalled()
      expect(root.vm.getTable()!.getChangeRecords().updated).toHaveLength(1)
    }
    await root.setProps({
      proxyConfig: {
        autoLoad: false,
        save,
        reloadAfterMutation: false,
        validationColumns: [1],
      },
    })
    row.mockClear()
    expect((await root.vm.commitProxy('save')).status).toBe('success')
    expect(save).toHaveBeenCalledOnce()
    expect(row.mock.calls.length).toBeLessThan(100)
    expect(root.vm.getTable()!.getChangeRecords().updated).toHaveLength(0)
    root.unmount()
  })

  it('loads a remote page without local sorting, filtering or slicing it again', async () => {
    const query = vi.fn<
      (request: TableGridProxyRequest) => Promise<TableGridProxyQueryResult>
    >(async () => ({
      data: [
        { id: 7, name: 'B' },
        { id: 8, name: 'A' },
      ],
      total: 20,
    }))
    const root = mount(TableGrid, {
      props: {
        columns,
        pagerConfig: { currentPage: 2, pageSize: 2 },
        sortConfig: { defaultSort: [{ field: 'name', order: 'asc' }] },
        proxyConfig: { query },
      },
    })
    await flushPromises()
    expect(query).toHaveBeenCalledOnce()
    expect(query.mock.calls[0][0]).toMatchObject({
      pager: { currentPage: 2, pageSize: 2, remote: true },
      sortBy: [{ field: 'name', order: 'asc' }],
    })
    expect(root.findAll('.s-table__data-row').map((e) => e.text())).toEqual([
      '7B',
      '8A',
    ])
    expect(root.findComponent(STable).props('pagerConfig')).toMatchObject({
      total: 20,
      remote: true,
    })
    expect(root.vm.getProxyState().loading).toBe(false)
    root.unmount()
  })

  it('applies only the latest query and settles superseded adapters that ignore abort', async () => {
    const first = deferred<TableGridProxyQueryResult>()
    const second = deferred<TableGridProxyQueryResult>()
    const query = vi
      .fn<
        (request: TableGridProxyRequest) => Promise<TableGridProxyQueryResult>
      >()
      .mockReturnValueOnce(first.promise)
      .mockReturnValueOnce(second.promise)
    const root = mount(TableGrid, {
      props: { columns, proxyConfig: { autoLoad: false, query } },
    })
    const a = root.vm.commitProxy('query')
    await flushPromises()
    const b = root.vm.commitProxy('refresh')
    await flushPromises()
    expect((await a).status).toBe('cancelled')
    expect(query.mock.calls[0][0].signal.aborted).toBe(true)
    second.resolve({ data: [{ id: 2, name: 'new' }] })
    expect((await b).status).toBe('success')
    first.resolve({ data: [{ id: 1, name: 'old' }] })
    await flushPromises()
    expect(root.find('.s-table__data-row').text()).toBe('2new')
    root.unmount()
  })

  it('cancels on unmount, explicit cancellation and adapter replacement', async () => {
    for (const mode of ['unmount', 'cancel', 'replace']) {
      const query = vi.fn(
        () => new Promise<TableGridProxyQueryResult>(() => {}),
      )
      const root = mount(TableGrid, {
        props: { columns, proxyConfig: { autoLoad: false, query } },
      })
      const pending = root.vm.commitProxy('query')
      await flushPromises()
      if (mode === 'unmount') root.unmount()
      if (mode === 'cancel') root.vm.cancelProxy()
      if (mode === 'replace') await root.setProps({ proxyConfig: false })
      expect((await pending).status).toBe('cancelled')
      expect(root.emitted('proxyError')).toBeUndefined()
      if (mode !== 'unmount') root.unmount()
    }
  })

  it('requires controlled data acceptance and preserves old rows on rejection', async () => {
    const initial = [{ id: 1, name: 'old' }]
    const next = [{ id: 2, name: 'new' }]
    const data = ref<TableRow[]>(initial)
    const grid = shallowRef<TableGridExposes>()
    let accepts = false
    const query = async () => ({ data: next })
    const root = mount(
      defineComponent({
        setup: () => () =>
          h(TableGrid, {
            ref: grid,
            data: data.value,
            columns,
            proxyConfig: { autoLoad: false, query },
            'onUpdate:data': (value: TableRow[]) => {
              if (accepts) data.value = value
            },
          }),
      }),
    )
    expect((await grid.value!.commitProxy('query')).status).toBe('rejected')
    expect(data.value[0].id).toBe(1)
    accepts = true
    expect((await grid.value!.commitProxy('query')).status).toBe('success')
    expect(data.value[0].id).toBe(2)
    root.unmount()
  })

  it('does not query draft form changes and batches accepted sort/filter changes on page one', async () => {
    const model = reactive({ term: 'initial' })
    const query = vi.fn<
      (request: TableGridProxyRequest) => Promise<TableGridProxyQueryResult>
    >(async () => ({
      data: [{ id: 1, name: 'A' }],
      total: 30,
    }))
    const root = mount(TableGrid, {
      props: {
        columns,
        queryConfig: { model },
        pagerConfig: { pageSize: 2 },
        proxyConfig: { query },
      },
    })
    await flushPromises()
    model.term = 'draft'
    await flushPromises()
    expect(query).toHaveBeenCalledOnce()
    root
      .findComponent(STable)
      .vm.$emit('update:pagerConfig', { currentPage: 3, pageSize: 2 })
    await flushPromises()
    expect(query).toHaveBeenCalledTimes(2)
    root.vm.getTable()!.setSort([{ field: 'name', order: 'desc' }])
    root.vm.getTable()!.setFilters({ name: ['A'] })
    await flushPromises()
    expect(query).toHaveBeenCalledTimes(3)
    expect(query.mock.calls[2][0]).toMatchObject({
      pager: { currentPage: 1 },
      sortBy: [{ field: 'name', order: 'desc' }],
      filters: { name: ['A'] },
    })
    root.unmount()
  })

  it('reports query errors and malformed responses, then allows retry', async () => {
    const query = vi
      .fn()
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce({ data: [], total: -1 })
      .mockResolvedValueOnce({ data: [], total: 0 })
    const root = mount(TableGrid, {
      props: {
        columns,
        pagerConfig: true,
        proxyConfig: { autoLoad: false, query },
      },
    })
    expect((await root.vm.commitProxy('query')).status).toBe('error')
    await nextTick()
    expect(root.find('.s-table-grid__error').exists()).toBe(true)
    expect((await root.vm.commitProxy('query')).status).toBe('error')
    expect((await root.vm.commitProxy('query')).status).toBe('success')
    await nextTick()
    expect(root.find('.s-table-grid__error').exists()).toBe(false)
    expect(root.emitted('proxyError')).toHaveLength(2)
    root.unmount()
  })

  it('saves accepted changes, keeps writes exclusive and only confirms the saved version', async () => {
    const pending = deferred<boolean>()
    const save = vi.fn(() => pending.promise)
    const query = async () => ({ data: [{ id: 1, name: 'A' }] })
    const root = mount(TableGrid, {
      props: {
        columns,
        changeConfig: true,
        proxyConfig: { query, save, reloadAfterMutation: false },
      },
    })
    await flushPromises()
    expect(
      (await root.vm.getTable()!.updateRow(1, { name: 'B' })).applied,
    ).toBe(true)
    expect((await root.vm.commitProxy('query')).status).toBe('dirty')
    const operation = root.vm.commitProxy('save')
    await flushPromises()
    expect(save).toHaveBeenCalledOnce()
    expect((await root.vm.commitProxy('save')).status).toBe('busy')
    expect((await root.vm.commitProxy('refresh')).status).toBe('busy')
    pending.resolve(true)
    expect((await operation).status).toBe('success')
    expect(root.vm.getTable()!.getChangeRecords().updated).toHaveLength(0)
    expect(root.find('.s-table__data-row').text()).toBe('1B')
    root.unmount()
  })

  it('retains externally replaced data when a pending save completes', async () => {
    const pending = deferred<boolean>()
    const root = mount(TableGrid, {
      props: {
        columns,
        changeConfig: true,
        proxyConfig: {
          query: () => ({ data: [{ id: 1, name: 'A' }] }),
          save: () => pending.promise,
        },
      },
    })
    await flushPromises()
    await root.vm.getTable()!.updateRow(1, { name: 'B' })
    const save = root.vm.commitProxy('save')
    await flushPromises()
    await root.setProps({ data: [{ id: 1, name: 'C' }] })
    pending.resolve(true)
    expect((await save).status).toBe('stale')
    expect(root.find('.s-table__data-row').text()).toBe('1C')
    expect(root.vm.getTable()!.getChangeRecords().updated).toHaveLength(0)
    root.unmount()
  })

  it('deletes explicit rows and reloads without silently treating reload failure as write failure', async () => {
    const query = vi
      .fn()
      .mockResolvedValueOnce({ data: [{ id: 1, name: 'A' }] })
      .mockRejectedValueOnce(new Error('reload'))
    const remove = vi.fn<
      (request: { rows: readonly TableRow[] }) => Promise<boolean>
    >(async () => true)
    const root = mount(TableGrid, {
      props: { columns, proxyConfig: { query, delete: remove } },
    })
    await flushPromises()
    expect((await root.vm.commitProxy('delete', [])).status).toBe('empty')
    const result = await root.vm.commitProxy('delete', [{ id: 1, name: 'A' }])
    expect(result.status).toBe('success')
    expect(result.reload?.status).toBe('error')
    expect(remove.mock.calls[0][0]).toMatchObject({
      rows: [{ id: 1, name: 'A' }],
      action: 'delete',
    })
    root.unmount()
  })
})
