import type { TableHistoryEntry, TableHistoryState } from './table-history'

/** Bounded operation history. A replay moves the cursor only after acceptance. */
export function createTableHistoryStore(
  onChange: (state: TableHistoryState) => void = () => {},
) {
  let undo: TableHistoryEntry[] = []
  let redo: TableHistoryEntry[] = []
  let revision = 0
  let limit = 100
  const state = (): TableHistoryState => ({
    undoCount: undo.length,
    redoCount: redo.length,
    canUndo: undo.length > 0,
    canRedo: redo.length > 0,
  })
  const changed = () => {
    revision++
    onChange(state())
  }
  const clear = () => {
    if (!undo.length && !redo.length) return
    undo = []
    redo = []
    changed()
  }
  const setLimit = (value?: number) => {
    limit =
      Number.isFinite(value) && Number(value) >= 1
        ? Math.floor(Number(value))
        : 100
    if (undo.length + redo.length > limit) {
      undo = undo.slice(-limit)
      const remaining = limit - undo.length
      redo = remaining > 0 ? redo.slice(-remaining) : []
      changed()
    }
  }
  const push = (entry: TableHistoryEntry) => {
    if (!entry.forward.length) return
    undo.push(entry)
    if (undo.length > limit) undo.splice(0, undo.length - limit)
    redo = []
    changed()
  }
  const prepare = (direction: 'undo' | 'redo') => {
    const from = direction === 'undo' ? undo : redo
    const to = direction === 'undo' ? redo : undo
    const entry = from[from.length - 1]
    if (!entry) return undefined
    const version = revision
    let settled = false
    const current = () =>
      !settled && revision === version && from[from.length - 1] === entry
    return {
      entry,
      current,
      cancel: () => {
        settled = true
      },
      commit: () => {
        if (!current()) return false
        settled = true
        from.pop()
        to.push(entry)
        changed()
        return true
      },
    }
  }
  return { state, push, prepare, clear, setLimit }
}
