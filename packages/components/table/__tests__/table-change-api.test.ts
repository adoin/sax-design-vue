import { computed, defineComponent, h, nextTick, ref, shallowRef } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Table from '../src/table.vue'
import type {
  TableChangeConfig,
  TableDataChangeRequest,
  TableExposes,
  TableRow,
} from '../src/table'

const columns = [{ field: 'name', title: 'Name', editor: true }]
function host(
  initial: TableRow[],
  extra: Record<string, unknown> = {},
  accepts = true,
) {
  const data = ref(initial)
  const api = shallowRef<TableExposes>()
  const root = mount(
    defineComponent({
      setup: () => () =>
        h(Table, {
          ref: api,
          data: data.value,
          columns,
          changeConfig: true,
          editConfig: true,
          'onUpdate:data': (value: TableRow[]) => {
            if (accepts) data.value = value
          },
          ...extra,
        }),
    }),
  )
  return { root, table: root.findComponent(Table), data, api }
}

const intoView = Object.getOwnPropertyDescriptor(
  HTMLElement.prototype,
  'scrollIntoView',
)
beforeEach(() =>
  Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
    configurable: true,
    value: vi.fn(),
  }),
)
afterEach(() => {
  vi.restoreAllMocks()
  if (intoView)
    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', intoView)
  else Reflect.deleteProperty(HTMLElement.prototype, 'scrollIntoView')
})

describe('Table change API', () => {
  it('leaves mutation tracking off by default', async () => {
    const { root, table, data, api } = host([{ id: 1, name: 'A' }], {
      changeConfig: false,
    })
    expect(await api.value!.updateRow(1, { name: 'B' })).toEqual({
      applied: false,
      reason: 'disabled',
    })
    expect(data.value[0].name).toBe('A')
    expect(table.emitted('update:data')).toBeUndefined()
    root.unmount()
  })

  it('applies owned data proposals and separates local changes from a saved baseline', async () => {
    const initial = [
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
    ]
    const { root, data, api } = host(initial)
    expect(await api.value!.updateRow(1, { name: 'edited' })).toEqual({
      applied: true,
    })
    expect(data.value[0].name).toBe('edited')
    expect(initial[0].name).toBe('A')
    expect(api.value!.getChangeRecords().updated).toHaveLength(1)
    expect(
      await api.value!.insertRows([{ id: 3, name: 'new' }], { index: 1 }),
    ).toEqual({ applied: true })
    expect(data.value.map((row) => row.id)).toEqual([1, 3, 2])
    expect(await api.value!.removeRows([2])).toEqual({ applied: true })
    const saved = api.value!.getChangeRecords()
    expect(saved.inserted).toHaveLength(1)
    expect(saved.removed).toHaveLength(1)
    expect(api.value!.acceptChanges(saved.version - 1)).toBe(false)
    expect(api.value!.acceptChanges(saved.version)).toBe(true)
    expect(api.value!.getChangeRecords().updated).toEqual([])
    expect(data.value[0].name).toBe('edited')
    root.unmount()
  })

  it('keeps rejected proposals out of the journal', async () => {
    const { root, table, data, api } = host([{ id: 1, name: 'A' }], {}, false)
    expect(await api.value!.updateRow(1, { name: 'B' })).toEqual({
      applied: false,
      reason: 'rejected',
    })
    expect(data.value[0].name).toBe('A')
    expect(api.value!.getChangeRecords().updated).toEqual([])
    expect(table.emitted('dataChange')).toBeUndefined()
    root.unmount()
  })

  it('tracks accepted editor commits, not drafts or failed validation', async () => {
    const { root, table, data, api } = host([{ id: 1, name: 'A' }], {
      validationConfig: true,
      validationRules: { name: { required: true } },
    })
    await api.value!.startEdit(data.value[0], 'name')
    await table.get('input').setValue('')
    expect(api.value!.getChangeRecords().updated).toEqual([])
    expect(await api.value!.commitEdit()).toBe(false)
    expect(api.value!.getEditRecord()).not.toBeNull()
    await table.get('input').setValue('B')
    expect(await api.value!.commitEdit()).toBe(true)
    expect(data.value[0].name).toBe('B')
    expect(api.value!.getEditRecord()).toBeNull()
    expect(api.value!.getChangeRecords().updated[0].fields[0].oldValue).toBe(
      'A',
    )
    expect(table.emitted('editCommit')).toHaveLength(1)
    root.unmount()
  })

  it('retains the editor draft if the data owner rejects the commit', async () => {
    const { root, table, data, api } = host([{ id: 1, name: 'A' }], {}, false)
    await api.value!.startEdit(data.value[0], 'name')
    await table.get('input').setValue('B')
    expect(await api.value!.commitEdit()).toBe(false)
    expect(table.get('input').element.value).toBe('B')
    expect(api.value!.getChangeRecords().updated).toEqual([])
    expect(table.emitted('editCommit')).toBeUndefined()
    root.unmount()
  })

  it('restores edits, deleted rows and inserted rows together', async () => {
    const initial = [
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
      { id: 3, name: 'C' },
    ]
    const { root, data, api } = host(initial)
    await api.value!.updateRow(1, { name: 'edited' })
    await api.value!.removeRows([2])
    await api.value!.insertRows([{ id: 4, name: 'new' }], { index: 1 })
    expect(await api.value!.revertChanges()).toEqual({ applied: true })
    expect(data.value).toEqual(initial)
    expect(api.value!.getChangeRecords()).toMatchObject({
      inserted: [],
      updated: [],
      removed: [],
    })
    root.unmount()
  })

  it('restores a removed tree branch without restoring newly inserted descendants', async () => {
    const initial = [
      { id: 1, name: 'parent', children: [{ id: 2, name: 'child' }] },
    ]
    const { root, data, api } = host(initial, {
      treeConfig: { expandAll: true },
    })
    await api.value!.updateRow(2, { name: 'edited child' })
    await api.value!.insertRows([{ id: 3, name: 'new child' }], {
      parentKey: 1,
    })
    expect(await api.value!.removeRows([1])).toEqual({ applied: true })
    expect(data.value).toEqual([])
    expect(
      api.value!.getChangeRecords().removed.map((row) => row.rowKey),
    ).toEqual([2, 1])
    expect(api.value!.getChangeRecords().inserted).toEqual([])
    expect(await api.value!.revertChanges([1])).toEqual({ applied: true })
    expect(data.value).toEqual(initial)
    root.unmount()
  })

  it('edits loaded lazy children through accepted parent data', async () => {
    const child = { id: 2, name: 'loaded' }
    const { root, table, data, api } = host(
      [{ id: 1, name: 'parent', lazy: true }],
      {
        treeConfig: { hasChildren: 'lazy', load: async () => [child] },
      },
    )
    await api.value!.toggleRowExpand(data.value[0], true)
    await nextTick()
    expect(table.text()).toContain('loaded')
    expect(await api.value!.updateRow(2, { name: 'edited' })).toEqual({
      applied: true,
    })
    expect(table.text()).toContain('edited')
    expect(table.text()).not.toContain('loaded')
    expect(child.name).toBe('loaded')
    expect(await api.value!.revertChanges([2])).toEqual({ applied: true })
    expect(table.text()).toContain('loaded')
    root.unmount()
  })

  it('reverts changed and removed descendants across unchanged intermediate parents', async () => {
    const initial = [
      {
        id: 1,
        children: [
          {
            id: 2,
            children: [
              { id: 3, name: 'A' },
              { id: 4, name: 'B' },
            ],
          },
        ],
      },
      { id: 5, name: 'outside' },
    ]
    const { root, data, api } = host(initial, {
      treeConfig: { expandAll: true },
    })
    await api.value!.updateRow(3, { name: 'edited' })
    await api.value!.removeRows([4])
    await api.value!.updateRow(5, { name: 'keep' })
    expect(await api.value!.revertChanges([1])).toEqual({ applied: true })
    expect(data.value[0]).toEqual(initial[0])
    expect(data.value[1].name).toBe('keep')
    expect(
      api.value!.getChangeRecords().updated.map((entry) => entry.rowKey),
    ).toEqual([5])
    expect(api.value!.getChangeRecords().removed).toEqual([])
    root.unmount()
  })

  it('does not emit data proposals when there is nothing to insert, remove or revert', async () => {
    const { root, table, api } = host([{ id: 1, name: 'A' }])
    expect(await api.value!.insertRows([])).toEqual({ applied: true })
    expect(await api.value!.removeRows([])).toEqual({ applied: true })
    expect(await api.value!.revertChanges()).toEqual({ applied: true })
    expect(table.emitted('update:data')).toBeUndefined()
    expect(table.emitted('dataChange')).toBeUndefined()
    root.unmount()
  })

  it('cancels asynchronous ownership requests on a new baseline or unmount', async () => {
    let request: TableDataChangeRequest | undefined
    const apply = vi.fn((value: TableDataChangeRequest) => {
      request = value
      return new Promise<boolean>(() => {})
    })
    const { root, api } = host([{ id: 1, name: 'A' }], {
      changeConfig: { apply },
    })
    const pending = api.value!.updateRow(1, { name: 'B' })
    expect(await api.value!.removeRows([1])).toMatchObject({
      applied: false,
      reason: 'busy',
    })
    api.value!.resetChanges()
    expect(request?.signal.aborted).toBe(true)
    expect(await pending).toMatchObject({ applied: false, reason: 'cancelled' })
    const second = api.value!.updateRow(1, { name: 'C' })
    root.unmount()
    expect(await second).toMatchObject({ applied: false, reason: 'cancelled' })
  })

  it('ignores late adapter completion after an editor draft changes', async () => {
    let request: TableDataChangeRequest | undefined
    let finish: (accepted: boolean) => void = () => {}
    const config: TableChangeConfig = {
      apply: (value) => {
        request = value
        return new Promise((resolve) => {
          finish = resolve
        })
      },
    }
    const { root, table, data, api } = host([{ id: 1, name: 'A' }], {
      changeConfig: config,
    })
    await api.value!.startEdit(data.value[0], 'name')
    await table.get('input').setValue('B')
    const commit = api.value!.commitEdit()
    await table.get('input').setValue('C')
    expect(request?.signal.aborted).toBe(true)
    finish(true)
    expect(await commit).toBe(false)
    expect(api.value!.getChangeRecords().updated).toEqual([])
    root.unmount()
  })

  it('updates a generated row by stable key without enumerating its fields', async () => {
    const values = new Map<number, string>()
    const revision = shallowRef(0)
    const api = shallowRef<TableExposes>()
    const row = vi.fn(
      (id: number) =>
        new Proxy(
          { id },
          {
            get: (target, key) =>
              key === 'name'
                ? (values.get(id) ?? `Row ${id}`)
                : Reflect.get(target, key),
            ownKeys: () => {
              throw new Error('Do not enumerate generated fields')
            },
          },
        ),
    )
    const root = mount(
      defineComponent({
        setup: () => () => {
          return h(Table, {
            ref: api,
            'data-revision': revision.value,
            virtualSource: {
              rowCount: 1_000_000,
              columnCount: 1,
              row,
              rowKey: (i) => i,
              column: () => columns[0],
              columnWidth: 120,
            },
            virtualConfig: { height: 180, horizontal: true },
            changeConfig: {
              indexOf: (key) => (typeof key === 'number' ? key : -1),
              apply: (request) => {
                for (const operation of request.operations)
                  for (const patch of operation.patches)
                    if (patch.field === 'name')
                      values.set(
                        operation.rowKey as number,
                        patch.value as string,
                      )
                revision.value++
                return true
              },
            },
          })
        },
      }),
    )
    const before = row.mock.calls.length
    expect(await api.value!.updateRow(999_999, { name: 'changed' })).toEqual({
      applied: true,
    })
    expect(values.get(999_999)).toBe('changed')
    expect(api.value!.getChangeRecords().updated[0].fields[0].oldValue).toBe(
      'Row 999999',
    )
    expect(await api.value!.revertChanges()).toEqual({ applied: true })
    expect(values.get(999_999)).toBe('Row 999999')
    expect(row.mock.calls.length - before).toBeLessThan(60)
    await flushPromises()
    root.unmount()
  })

  it('retains committed records when an adapter replaces its immutable source getter', async () => {
    for (const key of ['clientWidth', 'offsetWidth'] as const)
      vi.spyOn(HTMLElement.prototype, key, 'get').mockReturnValue(600)
    for (const key of ['clientHeight', 'offsetHeight'] as const)
      vi.spyOn(HTMLElement.prototype, key, 'get').mockReturnValue(180)
    const values = shallowRef(new Map<number, string>())
    const api = shallowRef<TableExposes>()
    const keyAt = (index: number) => index
    const columnAt = () => columns[0]
    const source = computed(() => {
      const snapshot = values.value
      return {
        rowCount: 3,
        columnCount: 1,
        columnWidth: 120,
        rowKey: keyAt,
        column: columnAt,
        row: (id: number) => ({ id, name: snapshot.get(id) ?? `Row ${id}` }),
      }
    })
    const config: TableChangeConfig = {
      indexOf: (key) => Number(key),
      apply: ({ operations }) => {
        const next = new Map(values.value)
        for (const operation of operations)
          next.set(Number(operation.rowKey), operation.row.name as string)
        values.value = next
        return true
      },
    }
    const root = mount(
      defineComponent({
        setup: () => () =>
          h(Table, {
            ref: api,
            virtualSource: source.value,
            changeConfig: config,
            virtualConfig: { height: 180 },
            editConfig: true,
            resizeConfig: true,
          }),
      }),
    )
    const table = root.findComponent(Table)
    await table
      .get('[role="separator"]')
      .trigger('keydown', { key: 'ArrowRight' })
    const width = table.get('[role="columnheader"]').attributes('style')
    expect(await api.value!.startEdit(0, 0)).toBe(true)
    await table.get('.s-table__cell-editor input').setValue('Changed')
    const accepted = await api.value!.commitEdit()
    expect(table.emitted('editCancel')).toBeUndefined()
    expect(accepted).toBe(true)
    await flushPromises()
    expect(api.value!.getChangeRecords().updated).toHaveLength(1)
    expect(table.emitted('changesChange')).toHaveLength(1)
    expect(table.get('[role="columnheader"]').attributes('style')).toBe(width)
    root.unmount()
  })

  it('restores opaque generated rows and looks up current positions after source deletions', async () => {
    const count = 1_000_000
    const removed = new Set<number>()
    const values = new Map<number, string>()
    const revision = shallowRef(0)
    const api = shallowRef<TableExposes>()
    const keyAt = (index: number) => {
      let key = index
      for (const deleted of [...removed].sort((a, b) => a - b))
        if (deleted <= key) key++
      return key
    }
    const row = vi.fn((index: number) => {
      const key = keyAt(index)
      const name = values.get(key) ?? `Row ${key}`
      return new Proxy(
        {},
        {
          get: (_, field) => (field === 'name' ? name : undefined),
          ownKeys: () => {
            throw new Error('Do not enumerate generated fields')
          },
        },
      )
    })
    const requests: TableDataChangeRequest[] = []
    const root = mount(
      defineComponent({
        setup: () => () =>
          h(Table, {
            ref: api,
            'data-revision': revision.value,
            virtualSource: {
              rowCount: count - removed.size,
              columnCount: 1,
              row,
              rowKey: keyAt,
              column: () => columns[0],
              columnWidth: 120,
            },
            virtualConfig: { height: 180, horizontal: true },
            changeConfig: {
              indexOf: (key) =>
                typeof key === 'number' &&
                key >= 0 &&
                key < count &&
                !removed.has(key)
                  ? key - [...removed].filter((deleted) => deleted < key).length
                  : -1,
              apply: (request) => {
                requests.push(request)
                for (const operation of request.operations) {
                  const key = operation.rowKey as number
                  if (operation.type === 'remove') {
                    removed.add(key)
                    values.delete(key)
                  } else if (operation.type === 'insert') {
                    removed.delete(key)
                    values.set(key, operation.row.name as string)
                  } else
                    for (const patch of operation.patches)
                      values.set(key, patch.value as string)
                }
                revision.value++
                return true
              },
            },
          }),
      }),
    )
    const before = row.mock.calls.length
    expect(await api.value!.updateRow(count - 1, { name: 'saved' })).toEqual({
      applied: true,
    })
    expect(
      api.value!.acceptChanges(api.value!.getChangeRecords().version),
    ).toBe(true)
    expect(await api.value!.removeRows([count - 1])).toEqual({ applied: true })
    expect(await api.value!.revertChanges()).toEqual({ applied: true })
    expect(values.get(count - 1)).toBe('saved')
    expect(await api.value!.updateRow(count - 1, { name: 'draft' })).toEqual({
      applied: true,
    })
    expect(await api.value!.removeRows([0])).toEqual({ applied: true })
    expect(await api.value!.revertChanges([count - 1])).toEqual({
      applied: true,
    })
    expect(requests.at(-1)!.operations[0].position.index).toBe(count - 2)
    expect(values.get(count - 1)).toBe('saved')
    expect(row.mock.calls.length - before).toBeLessThan(150)
    root.unmount()
  })

  it('round-trips generated inserts, edits and removals using stable neighbor keys', async () => {
    const initial = [
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
      { id: 3, name: 'C' },
    ]
    const data = shallowRef(initial)
    const api = shallowRef<TableExposes>()
    const row = (index: number) => data.value[index]
    const keyAt = (index: number) => data.value[index].id
    const indexOf = (key: unknown) =>
      data.value.findIndex((entry) => entry.id === key)
    const config: TableChangeConfig = {
      indexOf,
      apply: ({ operations }) => {
        const next = [...data.value]
        for (const operation of operations) {
          const index = next.findIndex((entry) => entry.id === operation.rowKey)
          if (operation.type === 'remove') next.splice(index, 1)
          else if (operation.type === 'update')
            next[index] = {
              id: Number(operation.rowKey),
              name: operation.row.name as string,
            }
          else {
            const before = next.findIndex(
              (entry) => entry.id === operation.position.beforeKey,
            )
            const after = next.findIndex(
              (entry) => entry.id === operation.position.afterKey,
            )
            const position =
              before >= 0
                ? before
                : after >= 0
                  ? after + 1
                  : operation.position.index
            next.splice(position, 0, {
              id: Number(operation.rowKey),
              name: operation.row.name as string,
            })
          }
        }
        data.value = next
        return true
      },
    }
    const root = mount(
      defineComponent({
        setup: () => () =>
          h(Table, {
            ref: api,
            changeConfig: config,
            historyConfig: true,
            virtualSource: {
              rowCount: data.value.length,
              columnCount: 1,
              row,
              rowKey: keyAt,
              column: () => columns[0],
              columnWidth: 120,
            },
            virtualConfig: { height: 180 },
          }),
      }),
    )
    expect(await api.value!.updateRow(1, { name: 'edited' })).toEqual({
      applied: true,
    })
    expect(
      await api.value!.insertRows([{ id: 4, name: 'new' }], { index: 1 }),
    ).toEqual({ applied: true })
    expect(await api.value!.removeRows([2])).toEqual({ applied: true })
    expect(data.value.map((entry) => entry.id)).toEqual([1, 4, 3])
    expect(await api.value!.undo()).toEqual({ applied: true })
    expect(data.value.map((entry) => entry.id)).toEqual([1, 4, 2, 3])
    expect(await api.value!.undo()).toEqual({ applied: true })
    expect(data.value.map((entry) => entry.id)).toEqual([1, 2, 3])
    expect(await api.value!.undo()).toEqual({ applied: true })
    expect(data.value).toEqual(initial)
    expect(await api.value!.redo()).toEqual({ applied: true })
    expect(await api.value!.redo()).toEqual({ applied: true })
    expect(await api.value!.redo()).toEqual({ applied: true })
    expect(data.value.map((entry) => entry.id)).toEqual([1, 4, 3])
    expect(await api.value!.revertChanges()).toEqual({ applied: true })
    expect(data.value).toEqual(initial)
    root.unmount()
  })
})
