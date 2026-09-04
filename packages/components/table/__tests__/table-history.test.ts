import { describe, expect, it } from 'vitest'
import { createTableHistoryStore } from '../src/history-store'
import { createTableChangeStore } from '../src/change-store'
import type { TableHistoryEntry } from '../src/table-history'

const entry = (id: number): TableHistoryEntry => ({
  forward: [
    {
      type: 'insert',
      rowKey: id,
      row: { id },
      position: { index: 0 },
      patches: [],
    },
  ],
  backward: [
    {
      type: 'remove',
      rowKey: id,
      row: { id },
      position: { index: 0 },
      patches: [],
    },
  ],
  before: [],
  after: [],
})

describe('bounded table operation history', () => {
  it('moves only an accepted replay and clears the redo branch on a new operation', () => {
    const history = createTableHistoryStore()
    for (const id of [1, 2]) history.push(entry(id))
    const rejected = history.prepare('undo')!
    rejected.cancel()
    expect(rejected.commit()).toBe(false)
    expect(history.state()).toMatchObject({ undoCount: 2, redoCount: 0 })
    expect(history.prepare('undo')!.commit()).toBe(true)
    expect(history.prepare('redo')!.entry.forward[0].rowKey).toBe(2)
    history.push(entry(3))
    expect(history.state()).toMatchObject({ undoCount: 2, redoCount: 0 })
  })

  it('invalidates pending steps on clear and retains adjacent redo dependencies under a limit', () => {
    const history = createTableHistoryStore()
    for (const id of [1, 2, 3]) history.push(entry(id))
    for (let i = 0; i < 3; i++) history.prepare('undo')!.commit()
    history.setLimit(1)
    expect(history.prepare('redo')!.entry.forward[0].rowKey).toBe(1)
    const pending = history.prepare('redo')!
    history.clear()
    expect(pending.current()).toBe(false)
    expect(pending.commit()).toBe(false)
    expect(history.state()).toEqual({
      undoCount: 0,
      redoCount: 0,
      canUndo: false,
      canRedo: false,
    })
  })

  it('evicts old undo steps while preserving the current data baseline', () => {
    const history = createTableHistoryStore()
    history.setLimit(2)
    for (const id of [1, 2, 3]) history.push(entry(id))
    expect(history.prepare('undo')!.entry.forward[0].rowKey).toBe(3)
    history.prepare('undo')!.commit()
    expect(history.prepare('undo')!.entry.forward[0].rowKey).toBe(2)
    history.prepare('undo')!.commit()
    expect(history.prepare('undo')).toBeUndefined()
  })

  it('restores sparse journal checkpoints without clearing unrelated changed rows', () => {
    const journal = createTableChangeStore()
    const first = journal.prepare([
      {
        type: 'update',
        rowKey: 1,
        row: { id: 1, name: 'B' },
        before: { id: 1, name: 'A' },
        fields: ['name'],
        position: { index: 0 },
      },
    ])
    const checkpoint = first.checkpoint()
    first.commit()
    journal
      .prepare([
        { type: 'insert', rowKey: 2, row: { id: 2 }, position: { index: 1 } },
      ])
      .commit()
    journal.prepareCheckpoint(checkpoint.before).commit()
    expect(journal.getRecords()).toMatchObject({
      updated: [],
      inserted: [{ rowKey: 2 }],
    })
    journal.prepareCheckpoint(checkpoint.after).commit()
    expect(journal.getRecords().updated[0].fields[0]).toMatchObject({
      oldValue: 'A',
      value: 'B',
    })
    const stale = journal.prepareCheckpoint(checkpoint.before)
    journal.reset()
    expect(stale.commit()).toBe(false)
  })
})
