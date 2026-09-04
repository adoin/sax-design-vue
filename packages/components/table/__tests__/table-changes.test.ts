import { describe, expect, it, vi } from 'vitest'
import { createTableChangeStore } from '../src/change-store'
import {
  cloneTableDataValue,
  equalTableDataValue,
} from '../src/change-snapshot'
import {
  applyTableDataPatches,
  mergeTableDataChanges,
} from '../src/change-utils'
import type { TableRow, TableRowKey } from '../src/table'
import type { TableAcceptedDataOperation } from '../src/table-changes'

const update = (
  before: TableRow,
  row: TableRow,
  fields = ['name'],
  rowKey: TableRowKey = 1,
): TableAcceptedDataOperation => ({
  type: 'update',
  before,
  row,
  fields,
  rowKey,
  position: { index: 0 },
})
const inverse = (changes: ReturnType<typeof mergeTableDataChanges>) =>
  changes.map(({ field, oldValue, oldExists }) => ({
    field,
    value: oldValue,
    exists: oldExists,
  }))

describe('Table sparse accepted-change journal', () => {
  it('does not publish drafts, rejected proposals or cancelled transactions', () => {
    const notify = vi.fn()
    const store = createTableChangeStore(notify)
    const proposal = update({ name: 'A' }, { name: 'B' })
    const rejected = store.prepare([proposal])
    expect(store.getRecords()).toEqual({
      version: 0,
      inserted: [],
      updated: [],
      removed: [],
    })
    rejected.cancel()
    expect(rejected.commit()).toBe(false)
    expect(notify).not.toHaveBeenCalled()
    const accepted = store.prepare([proposal])
    expect(accepted.commit()).toBe(true)
    expect(accepted.commit()).toBe(false)
    expect(store.getRecords().updated[0].fields).toEqual([
      {
        field: 'name',
        value: 'B',
        exists: true,
        oldValue: 'A',
        oldExists: true,
      },
    ])
    expect(notify).toHaveBeenCalledTimes(1)
  })

  it('folds insert edits into one inserted row and cancels insert then remove', () => {
    const store = createTableChangeStore()
    const row = { id: 1, name: 'A' }
    store
      .prepare([{ type: 'insert', rowKey: 1, row, position: { index: 3 } }])
      .commit()
    const edited = { ...row, name: 'B' }
    store.prepare([update(row, edited)]).commit()
    expect(store.getRecords().inserted[0]).toMatchObject({
      row: edited,
      position: { index: 3 },
      fields: [],
    })
    expect(store.getRecords().updated).toEqual([])
    store
      .prepare([
        { type: 'remove', rowKey: 1, row: edited, position: { index: 3 } },
      ])
      .commit()
    expect(store.getRecord(1)).toBeUndefined()
  })

  it('retains the first baseline across repeated updates and clears a restored value', () => {
    const store = createTableChangeStore()
    const a = { name: 'A' },
      b = { name: 'B' },
      c = { name: 'C' }
    store.prepare([update(a, b), update(b, c)]).commit()
    expect(store.getRecord(1)?.fields[0]).toMatchObject({
      oldValue: 'A',
      value: 'C',
    })
    store.prepare([update(c, a)]).commit()
    expect(store.getRecord(1)).toBeUndefined()
  })

  it('keeps removed-row patches and position until its restoration is accepted', () => {
    const store = createTableChangeStore()
    const original = { id: 1, name: 'A' },
      edited = { id: 1, name: 'B' }
    store.prepare([update(original, edited)]).commit()
    store
      .prepare([
        {
          type: 'remove',
          rowKey: 1,
          row: edited,
          position: { index: 2, parentKey: 'p', beforeKey: 3 },
        },
      ])
      .commit()
    expect(store.getRecords().updated).toEqual([])
    const rejected = store.prepareRevert([1])
    expect(rejected.operations[0]).toMatchObject({
      type: 'restore',
      position: { index: 2, parentKey: 'p', beforeKey: 3 },
    })
    const restored = applyTableDataPatches(
      edited,
      rejected.operations[0].patches,
    )
    expect(restored).toEqual(original)
    expect(edited.name).toBe('B')
    rejected.cancel()
    expect(store.getRecords().removed).toHaveLength(1)
    const accepted = store.prepareRevert()
    expect(accepted.commit()).toBe(true)
    expect(store.getRecords().removed).toEqual([])
  })

  it('reverts selected keys independently and removes inserted rows on revert', () => {
    const store = createTableChangeStore()
    store
      .prepare([
        update({ name: 'A' }, { name: 'B' }),
        {
          type: 'insert',
          rowKey: '1',
          row: { name: 'new' },
          position: { index: 1 },
        },
      ])
      .commit()
    const revert = store.prepareRevert([1, 1, 'missing'])
    expect(revert.operations).toHaveLength(1)
    expect(revert.operations[0].type).toBe('update')
    revert.commit()
    expect(store.getRecord('1')?.type).toBe('insert')
    expect(store.prepareRevert().operations[0].type).toBe('remove')
  })

  it('merges concurrent changes on distinct keys, but rejects stale same-key proposals', () => {
    const store = createTableChangeStore()
    const first = store.prepare([update({ name: 'A' }, { name: 'B' })])
    const stale = store.prepare([update({ name: 'A' }, { name: 'C' })])
    const other = store.prepare([
      update({ name: 'X' }, { name: 'Y' }, ['name'], 2),
    ])
    expect(first.commit()).toBe(true)
    expect(other.commit()).toBe(true)
    expect(stale.commit()).toBe(false)
    expect(store.getRecords().updated).toHaveLength(2)
  })

  it('rejects a stale proposal even when intervening changes returned to baseline', () => {
    const store = createTableChangeStore()
    const a = { name: 'A' },
      b = { name: 'B' }
    const stale = store.prepare([update(a, { name: 'stale' })])
    store.prepare([update(a, b)]).commit()
    store.prepare([update(b, a)]).commit()
    expect(store.getRecord(1)).toBeUndefined()
    expect(stale.commit()).toBe(false)
  })

  it('does not clear newer changes for an older save acknowledgement', () => {
    const store = createTableChangeStore()
    store.prepare([update({ name: 'A' }, { name: 'B' })]).commit()
    const savedVersion = store.getRecords().version
    store.prepare([update({ name: 'B' }, { name: 'C' })]).commit()
    expect(store.accept(undefined, savedVersion)).toBe(false)
    expect(store.getRecord(1)?.fields[0].value).toBe('C')
    expect(store.accept([1], store.getRecords().version)).toBe(true)
    expect(store.getRecord(1)).toBeUndefined()
  })

  it.each(['accept', 'reset', 'dispose'] as const)(
    'invalidates pending work on %s',
    (action) => {
      const store = createTableChangeStore()
      const pending = store.prepare([update({ name: 'A' }, { name: 'B' })])
      store[action]()
      expect(pending.commit()).toBe(false)
      expect(store.getRecords().updated).toEqual([])
    },
  )

  it('rejects invalid batches atomically', () => {
    const store = createTableChangeStore()
    expect(() =>
      store.prepare([
        update({ name: 'A' }, { name: 'B' }),
        update({}, {}, ['__proto__.polluted'], 2),
      ]),
    ).toThrow('Invalid table field path')
    expect(() =>
      store.prepare([
        { type: 'insert', rowKey: Number.NaN, row: {}, position: { index: 0 } },
      ]),
    ).toThrow()
    expect(() =>
      store.prepare([
        { type: 'insert', rowKey: 1, row: {}, position: { index: -1 } },
      ]),
    ).toThrow()
    expect(store.getRecords().version).toBe(0)
    const insert: TableAcceptedDataOperation = {
      type: 'insert',
      rowKey: 1,
      row: {},
      position: { index: 0 },
    }
    expect(() => store.prepare([insert, insert])).toThrow()
    expect(store.getRecord(1)).toBeUndefined()
  })

  it('isolates snapshot fields and positions while retaining readonly consumer row references', () => {
    const store = createTableChangeStore()
    const before = { detail: { name: 'A' } },
      after = { detail: { name: 'B' } }
    store.prepare([update(before, after, ['detail'])]).commit()
    before.detail.name = 'external'
    const records = store.getRecords()
    expect(records.updated[0].row).toBe(after)
    records.updated[0].position.index = 77
    ;(records.updated[0].fields[0].oldValue as { name: string }).name =
      'tampered'
    expect(store.getRecord(1)?.position.index).toBe(0)
    expect(store.prepareRevert().operations[0].patches[0].value).toEqual({
      name: 'A',
    })
  })

  it('reads only touched generated fields without enumerating a generated row', () => {
    const reads: string[] = []
    const generated = (name: string) =>
      new Proxy(
        {},
        {
          has: (_, key) => key === 'name',
          get: (_, key) => {
            reads.push(String(key))
            if (key === 'name') return name
            throw new Error('Unrelated field read')
          },
          ownKeys: () => {
            throw new Error('Cannot materialize generated columns')
          },
        },
      )
    const store = createTableChangeStore()
    store.prepare([update(generated('A'), generated('B'))]).commit()
    expect(store.getRecords().updated[0].fields[0].oldValue).toBe('A')
    expect(store.prepareRevert().operations[0].patches[0].value).toBe('A')
    expect(reads.every((field) => field === 'name')).toBe(true)
  })
})

describe('Table reversible field patches', () => {
  it('supports getter-only generated rows without requiring materialized fields', () => {
    const row = (name: string) =>
      new Proxy(
        {},
        {
          get: (_, key) => (key === 'name' ? name : undefined),
          ownKeys: () => {
            throw new Error('No row materialization')
          },
        },
      )
    expect(
      mergeTableDataChanges(row('A'), row('B'), ['name'], [])[0],
    ).toMatchObject({ oldExists: true, oldValue: 'A', value: 'B' })
  })

  it('snapshots huge sparse arrays without visiting absent indices', () => {
    const value: unknown[] = []
    value.length = 1_000_000_000
    value[999_999_999] = { name: 'last' }
    const copied = cloneTableDataValue(value)
    expect(copied.length).toBe(value.length)
    expect(Object.keys(copied)).toEqual(['999999999'])
    expect(copied[999_999_999]).not.toBe(value[999_999_999])
    expect(equalTableDataValue(value, copied)).toBe(true)
    copied[0] = undefined
    expect(equalTableDataValue(value, copied)).toBe(false)
  })

  it('keeps cyclic array/object values and non-array types usable in a snapshot', () => {
    const row: { list: unknown[]; date: Date; map: Map<string, number> } = {
      list: [],
      date: new Date('2026-09-04'),
      map: new Map([['count', 3]]),
    }
    row.list.push(row, row.list)
    const copied = cloneTableDataValue(row)
    expect(copied).not.toBe(row)
    expect(copied.list[0]).toBe(copied)
    expect(copied.list[1]).toBe(copied.list)
    expect(copied.date.getTime()).toBe(row.date.getTime())
    expect(copied.map.get('count')).toBe(3)
    expect(equalTableDataValue(row, copied)).toBe(true)
  })

  it('records a whole-array replacement that only changes property presence', () => {
    const values: unknown[] = []
    values.length = 1
    const before = { values },
      after = { values: [undefined] }
    const changes = mergeTableDataChanges(before, after, ['values'], [])
    expect(changes).toHaveLength(1)
    expect(0 in applyTableDataPatches(after, inverse(changes)).values).toBe(
      false,
    )
  })

  it.each([
    [{}, { detail: { name: 'B' } }, 'detail.name'],
    [{ detail: null }, { detail: { name: 'B' } }, 'detail.name'],
    [{ detail: { name: undefined } }, { detail: { name: 'B' } }, 'detail.name'],
    [{ detail: {} }, { detail: { name: undefined } }, 'detail.name'],
    [{ values: [1] }, { values: [1, 2] }, 'values.1'],
  ] as [TableRow, TableRow, string][])(
    'restores missing and replaced container shapes (%j)',
    (before, after, field) => {
      const changes = mergeTableDataChanges(before, after, [field], [])
      expect(applyTableDataPatches(after, inverse(changes))).toStrictEqual(
        before,
      )
    },
  )

  it('merges child then parent replacements against the original ancestor', () => {
    const a = { detail: { name: 'A', count: 1 } }
    const b = { detail: { name: 'B', count: 1 } }
    const c = { detail: { name: 'C', count: 3 } }
    const first = mergeTableDataChanges(a, b, ['detail.name'], [])
    const second = mergeTableDataChanges(b, c, ['detail'], first)
    expect(second).toHaveLength(1)
    expect(second[0].field).toBe('detail')
    expect(applyTableDataPatches(c, inverse(second))).toStrictEqual(a)
  })

  it('merges parent then child changes without losing the original missing field', () => {
    const a = {},
      b = { detail: { name: 'B' } },
      c = { detail: { name: 'C' } }
    const first = mergeTableDataChanges(a, b, ['detail'], [])
    const second = mergeTableDataChanges(b, c, ['detail.name'], first)
    expect(second).toHaveLength(1)
    expect(applyTableDataPatches(c, inverse(second))).toStrictEqual(a)
  })

  it('preserves sparse array holes while copying an existing element path', () => {
    const values: { name: string }[] = []
    values.length = 3
    values[2] = { name: 'A' }
    const row = { values, untouched: { value: 1 } }
    const patched = applyTableDataPatches(row, [
      { field: 'values.2.name', value: 'B', exists: true },
    ])
    expect(0 in patched.values).toBe(false)
    expect(1 in patched.values).toBe(false)
    expect(patched.values[2].name).toBe('B')
    expect(row.values[2].name).toBe('A')
    expect(patched.untouched).toBe(row.untouched)
  })

  it('restores sparse array shape when an edit grows its length', () => {
    const values: string[] = []
    values.length = 2
    values[1] = 'B'
    const before = { values }
    const after = applyTableDataPatches(before, [
      { field: 'values.3', value: 'D', exists: true },
    ])
    const changes = mergeTableDataChanges(before, after, ['values.3'], [])
    const restored = applyTableDataPatches(after, inverse(changes))
    expect(restored.values.length).toBe(2)
    expect(0 in restored.values).toBe(false)
    expect(restored.values[1]).toBe('B')
  })
})
