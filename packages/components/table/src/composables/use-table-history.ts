import { computed, watch } from 'vue'
import { createTableHistoryStore } from '../history-store'
import { captureTableHistory, tableHistoryMatches } from '../history-data'
import { materializeTableBranch, planTableMutations } from '../change-mutations'
import { projectTableDataPatches } from '../change-utils'
import type { TableDataIndex } from '../change-data'
import type { TableHistoryTarget } from '../history-data'
import type { TableEmitFn, TableProps, TableRow, TableRowKey } from '../table'
import type {
  TableChangeTransaction,
  TableDataMutation,
  TableDataMutationResult,
} from '../table-changes'
import type { TableChangeCheckpoint } from '../table-history'

export interface TableHistoryAction {
  current: () => boolean
  commit: () => boolean
  cancel: () => void
}

interface HistoryOptions {
  tree: () => TableDataIndex | undefined
  target: (key: TableRowKey) => TableHistoryTarget
  prepare: (states: TableChangeCheckpoint[]) => TableChangeTransaction
  apply: (
    operations: TableDataMutation[],
    transaction: TableChangeTransaction,
    data: TableRow[] | undefined,
    current: () => boolean,
    replay: TableHistoryAction,
  ) => Promise<TableDataMutationResult>
  available: () => TableDataMutationResult | undefined
  editing: () => boolean
  cancel: () => void
}

/** Coordinate accepted history with the existing ownership and data-planning pipeline. */
export function useTableHistory(
  props: TableProps,
  emit: TableEmitFn,
  options: HistoryOptions,
) {
  const config = computed(() =>
    typeof props.historyConfig === 'object' ? props.historyConfig : {},
  )
  const enabled = computed(
    () =>
      Boolean(props.historyConfig) &&
      config.value.enabled !== false &&
      Boolean(props.changeConfig) &&
      (typeof props.changeConfig !== 'object' ||
        props.changeConfig.enabled !== false),
  )
  const store = createTableHistoryStore((state) => emit('historyChange', state))
  let epoch = 0
  const clear = () => {
    epoch++
    store.clear()
  }
  const capture = (
    operations: TableDataMutation[],
    transaction: TableChangeTransaction,
  ) => {
    if (!enabled.value) return undefined
    const tree = options.tree()
    const removed = new Set(
      operations
        .filter(({ type }) => type === 'remove')
        .map(({ rowKey }) => rowKey),
    )
    const entry = captureTableHistory(operations, transaction, (key) => {
      if (!tree) return options.target(key)
      const node = tree.nodes.get(key)
      if (!node) throw new Error('History row no longer exists')
      return {
        row: removed.has(key) ? materializeTableBranch(tree, node) : node.row,
        position: tree.position(node),
      }
    })
    const version = epoch
    return () => {
      if (enabled.value && version === epoch) store.push(entry)
    }
  }
  const replay = async (
    direction: 'undo' | 'redo',
  ): Promise<TableDataMutationResult> => {
    if (!enabled.value) return { applied: false, reason: 'disabled' }
    const failure = options.available()
    if (failure) return failure
    if (options.editing()) return { applied: false, reason: 'editing' }
    const action = store.prepare(direction)
    if (!action) return { applied: false, reason: 'empty' }
    let transaction: TableChangeTransaction | undefined
    try {
      const tree = options.tree()
      const target = (key: TableRowKey) => {
        if (!tree) return options.target(key)
        const node = tree.nodes.get(key)
        if (!node) throw new Error('History row no longer exists')
        return { row: node.row, position: tree.position(node) }
      }
      const { entry } = action
      const operations = direction === 'undo' ? entry.backward : entry.forward
      const expected = direction === 'undo' ? entry.forward : entry.backward
      if (!tableHistoryMatches(expected, target))
        return { applied: false, reason: 'conflict' }
      const proposal = tree
        ? planTableMutations(tree, operations)
        : {
            data: undefined,
            operations: operations.map((operation): TableDataMutation => {
              if (operation.type === 'insert') return operation
              const current = target(operation.rowKey)
              return {
                ...operation,
                ...current,
                row:
                  operation.type === 'update'
                    ? projectTableDataPatches(current.row, operation.patches)
                    : current.row,
              }
            }),
          }
      transaction = options.prepare(
        direction === 'undo' ? entry.before : entry.after,
      )
      return await options.apply(
        proposal.operations,
        transaction,
        proposal.data,
        action.current,
        action,
      )
    } catch (error) {
      return { applied: false, reason: 'invalid', error }
    } finally {
      transaction?.cancel()
      action.cancel()
    }
  }
  watch(enabled, () => {
    options.cancel()
    clear()
  })
  watch(
    () => config.value.limit,
    (limit) => {
      options.cancel()
      store.setLimit(limit)
    },
    { immediate: true },
  )
  return {
    capture,
    clear,
    undo: () => replay('undo'),
    redo: () => replay('redo'),
    getState: store.state,
    clearHistory: () => {
      options.cancel()
      clear()
    },
  }
}
