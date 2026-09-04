import { describe, expect, it } from 'vitest'
import { createTableDataIndex, planTableData } from '../src/change-data'
import type { TableRow } from '../src/table'

const index = (data: TableRow[]) =>
  createTableDataIndex({
    data,
    childrenField: 'children',
    key: (row) => row.id as number,
    children: (row) => (row.children as TableRow[] | undefined) ?? [],
  })
const patch = (value: unknown, field = 'name') => ({
  field,
  value,
  exists: true,
})

describe('Table immutable data plans', () => {
  it('updates nested fields while preserving every untouched branch', () => {
    const sibling = { id: 3, name: 'sibling' }
    const child = { id: 2, detail: { name: 'before' }, shared: {} }
    const other = { id: 4, name: 'other' }
    const data = [{ id: 1, children: [child, sibling] }, other]
    const next = planTableData(index(data), [
      { type: 'update', rowKey: 2, patches: [patch('after', 'detail.name')] },
    ])
    expect(next).not.toBe(data)
    expect(next[1]).toBe(other)
    const children = next[0].children as TableRow[]
    expect(children[0]).not.toBe(child)
    expect(children[0].detail).toEqual({ name: 'after' })
    expect(children[0].shared).toBe(child.shared)
    expect(children[1]).toBe(sibling)
    expect(child.detail.name).toBe('before')
  })

  it('combines multiple edits with insertions and deletions in source order', () => {
    const data = [{ id: 1 }, { id: 2 }, { id: 3 }]
    const next = planTableData(index(data), [
      { type: 'update', rowKey: 1, patches: [patch('A')] },
      { type: 'update', rowKey: 1, patches: [patch(3, 'count')] },
      { type: 'remove', rowKey: 2 },
      { type: 'insert', row: { id: 4 }, position: { index: 1 } },
      { type: 'insert', row: { id: 5 }, position: { index: 1 } },
    ])
    expect(next.map((row) => row.id)).toEqual([1, 4, 5, 3])
    expect(next[0]).toMatchObject({ name: 'A', count: 3 })
    expect(data).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }])
  })

  it('uses neighboring keys to restore positions after unrelated rows move', () => {
    const original = index([{ id: 1 }, { id: 2 }, { id: 3 }])
    const position = original.position(original.nodes.get(2)!)
    expect(position).toMatchObject({ index: 1, beforeKey: 3, afterKey: 1 })
    const changed = index([{ id: 0 }, { id: 1 }, { id: 3 }])
    const next = planTableData(changed, [
      { type: 'insert', row: { id: 2 }, position },
    ])
    expect(next.map((row) => row.id)).toEqual([0, 1, 2, 3])
  })

  it('preserves batch order after a shared anchor even when requested indices differ', () => {
    const next = planTableData(index([{ id: 1 }, { id: 2 }]), [
      { type: 'insert', row: { id: 3 }, position: { index: 0, afterKey: 1 } },
      { type: 'insert', row: { id: 4 }, position: { index: 1, afterKey: 1 } },
      { type: 'insert', row: { id: 5 }, position: { index: 2, afterKey: 1 } },
    ])
    expect(next.map((row) => row.id)).toEqual([1, 3, 4, 5, 2])
  })

  it('inserts and removes nested rows without deleting a supplied children property', () => {
    const data = [{ id: 1, children: [{ id: 2 }] }]
    const removed = planTableData(index(data), [{ type: 'remove', rowKey: 2 }])
    expect(removed).toEqual([{ id: 1, children: [] }])
    const restored = planTableData(index(removed), [
      { type: 'insert', row: { id: 2 }, position: { index: 0, parentKey: 1 } },
    ])
    expect(restored).toEqual(data)
    expect(data[0].children).toEqual([{ id: 2 }])
  })

  it('materializes only the edited lazy branch in the proposed data', () => {
    const child = { id: 2, name: 'loaded' }
    const data = [
      { id: 1, lazy: true },
      { id: 3, lazy: true },
    ]
    const tree = createTableDataIndex<TableRow>({
      data,
      childrenField: 'nodes',
      key: (row) => row.id as number,
      children: (row): TableRow[] => (row.id === 1 ? [child] : []),
    })
    const next = planTableData(tree, [
      { type: 'update', rowKey: 2, patches: [patch('edited')] },
    ])
    expect(next[0]).toMatchObject({ nodes: [{ id: 2, name: 'edited' }] })
    expect(next[1]).toBe(data[1])
    expect(data[0]).not.toHaveProperty('nodes')
    expect(child.name).toBe('loaded')
  })

  it('rejects missing, duplicate and cyclic keys before producing a data proposal', () => {
    expect(() => index([{}])).toThrow('stable row key')
    expect(() => index([{ id: 1 }, { id: 1 }])).toThrow('Duplicate')
    const row: TableRow = { id: 1 }
    row.children = [row]
    expect(() => index([row])).toThrow('cyclic')
    const data = [{ id: 1, children: [{ id: 2 }] }]
    expect(() =>
      planTableData(index(data), [
        {
          type: 'insert',
          row: { id: 3, children: [{ id: 2 }] },
          position: { index: 1 },
        },
      ]),
    ).toThrow('Duplicate')
    expect(() =>
      planTableData(index(data), [{ type: 'update', rowKey: 7, patches: [] }]),
    ).toThrow('not found')
    expect(data).toEqual([{ id: 1, children: [{ id: 2 }] }])
  })

  it('rejects key changes, structural field writes and mutations in removed branches', () => {
    const tree = index([{ id: 1, children: [{ id: 2 }] }])
    expect(() =>
      planTableData(tree, [
        { type: 'update', rowKey: 2, patches: [patch(3, 'id')] },
      ]),
    ).toThrow('stable row key')
    expect(() =>
      planTableData(tree, [
        { type: 'update', rowKey: 1, patches: [patch([], 'children')] },
      ]),
    ).toThrow('tree children')
    expect(() =>
      planTableData(tree, [
        { type: 'remove', rowKey: 1 },
        { type: 'update', rowKey: 2, patches: [patch('orphan')] },
      ]),
    ).toThrow('removed branch')
    expect(() =>
      planTableData(tree, [
        { type: 'remove', rowKey: 1 },
        {
          type: 'insert',
          row: { id: 3 },
          position: { index: 0, parentKey: 1 },
        },
      ]),
    ).toThrow('removed branch')
  })

  it('keeps unchanged array identity and does not read unrelated field getters', () => {
    const row = {
      id: 1,
      get unrelated() {
        throw new Error('Unrelated getter')
      },
    }
    const data = [row]
    const tree = index(data)
    expect(planTableData(tree, [])).toBe(data)
    expect(
      planTableData(tree, [{ type: 'update', rowKey: 1, patches: [] }]),
    ).toBe(data)
    expect(planTableData(tree, [{ type: 'remove', rowKey: 1 }])).toEqual([])
  })
})
