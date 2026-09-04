import { computed, nextTick, onBeforeUnmount, toRaw, watch } from 'vue'
import { createTableChangeStore } from '../change-store'
import {
  createTableDataIndex,
  planTableData,
  validTableDataKey,
} from '../change-data'
import { applyTableDataPatches, projectTableDataPatches } from '../change-utils'
import type { TableDataNode, TableDataPlanOperation } from '../change-data'
import type {
  TableEditRecord,
  TableEmitFn,
  TableProps,
  TableRow,
  TableRowKey,
} from '../table'
import type {
  TableAcceptedDataOperation,
  TableChangeTransaction,
  TableDataMutation,
  TableDataMutationResult,
  TableDataPosition,
} from '../table-changes'

interface ChangeOptions {
  children: (row: TableRow, key: TableRowKey) => TableRow[]
  changed: () => void
}

export function useTableChanges(
  props: TableProps,
  emit: TableEmitFn,
  options: ChangeOptions,
) {
  const config = computed(() =>
    typeof props.changeConfig === 'object' ? props.changeConfig : {},
  )
  const enabled = computed(
    () => Boolean(props.changeConfig) && config.value.enabled !== false,
  )
  const journal = createTableChangeStore((version) =>
    emit('changesChange', version),
  )
  let disposed = false
  let pending: { controller: AbortController; data?: TableRow[] } | undefined
  const childrenField = () => props.treeConfig?.children ?? 'children'
  const rowKey = (row: TableRow): TableRowKey => {
    const key =
      typeof props.rowKey === 'function'
        ? props.rowKey(row, -1)
        : row[props.rowKey]
    if (!validTableDataKey(key))
      throw new TypeError('Change tracking requires stable row keys')
    return key
  }
  const index = () =>
    createTableDataIndex({
      data: props.data,
      childrenField: childrenField(),
      key: rowKey,
      children: options.children,
    })
  const sourceTarget = (key: TableRowKey) => {
    const source = props.virtualSource!
    if (!config.value.indexOf || !config.value.apply)
      throw new Error(
        'Generated data changes require indexOf and apply adapters',
      )
    const position = config.value.indexOf(key)
    if (
      !Number.isSafeInteger(position) ||
      position < 0 ||
      position >= source.rowCount
    )
      throw new Error('Generated row was not found')
    const row = source.row(position)
    const actual = source.rowKey?.(position) ?? rowKey(row)
    if (actual !== key)
      throw new Error('Generated row key does not match its index')
    const neighborKey = (index: number) =>
      index < 0 || index >= source.rowCount
        ? undefined
        : (source.rowKey?.(index) ?? rowKey(source.row(index)))
    return {
      row,
      position: {
        index: position,
        beforeKey: neighborKey(position + 1),
        afterKey: neighborKey(position - 1),
      },
    }
  }
  const cancel = () => {
    pending?.controller.abort()
    pending = undefined
  }
  const reset = () => {
    cancel()
    journal.reset()
  }
  const available = (): TableDataMutationResult | undefined =>
    disposed || !enabled.value || props.loading
      ? { applied: false, reason: 'disabled' }
      : pending
        ? { applied: false, reason: 'busy' }
        : undefined
  const apply = async (
    operations: TableDataMutation[],
    transaction: TableChangeTransaction,
    data?: TableRow[],
    current: () => boolean = () => true,
  ): Promise<TableDataMutationResult> => {
    if (!operations.length) {
      const applied = current() && transaction.commit()
      transaction.cancel()
      return applied
        ? { applied: true }
        : { applied: false, reason: 'cancelled' }
    }
    const controller = new AbortController()
    const request = { controller, data }
    pending = request
    try {
      if (!current()) return { applied: false, reason: 'cancelled' }
      let accepted: boolean
      if (config.value.apply) {
        const result = config.value.apply({
          operations,
          data,
          signal: controller.signal,
        })
        accepted = await new Promise<boolean>((resolve, reject) => {
          const abort = () => resolve(false)
          controller.signal.addEventListener('abort', abort, { once: true })
          Promise.resolve(result)
            .then(resolve, reject)
            .finally(() =>
              controller.signal.removeEventListener('abort', abort),
            )
          if (controller.signal.aborted) resolve(false)
        })
      } else if (data) {
        emit('update:data', data)
        accepted = true
      } else throw new Error('Generated data changes require an apply adapter')
      await nextTick()
      if (controller.signal.aborted || disposed || !current())
        return { applied: false, reason: 'cancelled' }
      if (!accepted || (data && toRaw(props.data) !== toRaw(data)))
        return { applied: false, reason: 'rejected' }
      if (!transaction.commit()) return { applied: false, reason: 'cancelled' }
      options.changed()
      emit('dataChange', operations)
      return { applied: true }
    } catch (error) {
      return {
        applied: false,
        reason: controller.signal.aborted ? 'cancelled' : 'invalid',
        error,
      }
    } finally {
      transaction.cancel()
      if (pending === request) pending = undefined
    }
  }
  const guarded = async (action: () => Promise<TableDataMutationResult>) => {
    const failure = available()
    if (failure) return failure
    try {
      return await action()
    } catch (error) {
      return {
        applied: false,
        reason: 'invalid',
        error,
      } as TableDataMutationResult
    }
  }
  const updateRow = (
    key: TableRowKey,
    values: Record<string, unknown>,
    current?: () => boolean,
  ) =>
    guarded(async () => {
      const patches = Object.entries(values).map(([field, value]) => ({
        field,
        value,
        exists: true,
      }))
      const tree = props.virtualSource ? undefined : index()
      const node = tree?.nodes.get(key)
      const target = props.virtualSource
        ? sourceTarget(key)
        : node
          ? { row: node.row, position: tree!.position(node) }
          : undefined
      if (!target) throw new Error('Target row was not found')
      const row = props.virtualSource
        ? projectTableDataPatches(target.row, patches)
        : applyTableDataPatches(target.row, patches)
      const source = props.virtualSource
      const keyValue = (value: TableRow) =>
        typeof props.rowKey === 'function'
          ? props.rowKey(value, target.position.index)
          : value[props.rowKey]
      if (
        source?.rowKey
          ? keyValue(row) !== keyValue(target.row)
          : rowKey(row) !== rowKey(target.row)
      )
        throw new Error('A table mutation cannot change the stable row key')
      const operation: TableDataMutation = {
        type: 'update',
        rowKey: key,
        row,
        position: target.position,
        patches,
      }
      const data = tree
        ? planTableData(tree, [{ type: 'update', rowKey: key, patches }])
        : undefined
      return apply(
        [operation],
        journal.prepare([
          {
            ...operation,
            row,
            before: target.row,
            type: 'update',
            fields: Object.keys(values),
          },
        ]),
        data,
        current,
      )
    })
  const insertRows = (
    rows: TableRow[],
    position: Partial<TableDataPosition> = {},
  ) =>
    guarded(async () => {
      const tree = props.virtualSource ? undefined : index()
      if (props.virtualSource && position.parentKey !== undefined)
        throw new Error('Generated sources have no tree parent')
      const parent =
        position.parentKey === undefined
          ? undefined
          : tree?.nodes.get(position.parentKey)
      const count =
        props.virtualSource?.rowCount ??
        parent?.children.length ??
        props.data.length
      const start = position.index ?? count
      if (!Number.isSafeInteger(start) || start < 0)
        throw new RangeError('Invalid source row position')
      const operations: TableDataMutation[] = rows.map((row, offset) => ({
        type: 'insert',
        rowKey: rowKey(row),
        row,
        patches: [],
        position: { ...position, index: start + offset },
      }))
      const tracked: TableAcceptedDataOperation[] = []
      for (const operation of operations) {
        if (tree) {
          const branch = createTableDataIndex({
            ...tree,
            data: [operation.row],
          })
          for (const node of branch.nodes.values())
            tracked.push({
              type: 'insert',
              rowKey: node.key,
              row: node.row,
              position: node.parent
                ? branch.position(node)
                : operation.position,
            })
        } else {
          if (!config.value.indexOf || !config.value.apply)
            throw new Error('Generated data changes require adapters')
          const existingIndex = config.value.indexOf(operation.rowKey)
          if (existingIndex >= 0) throw new Error('Duplicate inserted row key')
          tracked.push({ ...operation, type: 'insert', row: operation.row })
        }
      }
      const data = tree
        ? planTableData(
            tree,
            operations.map((operation) => ({
              type: 'insert',
              row: operation.row,
              position: operation.position,
            })),
          )
        : undefined
      return apply(operations, journal.prepare(tracked), data)
    })
  const removeRows = (keys: TableRowKey[]) =>
    guarded(async () => {
      const tree = props.virtualSource ? undefined : index()
      const removed = new Map<TableRowKey, TableDataNode>()
      const operations: TableDataMutation[] = []
      const tracked: TableAcceptedDataOperation[] = []
      for (const key of new Set(keys)) {
        if (!tree) {
          const target = sourceTarget(key)
          operations.push({
            type: 'remove',
            rowKey: key,
            ...target,
            patches: [],
          })
          tracked.push({ type: 'remove', rowKey: key, ...target })
          continue
        }
        const node = tree.nodes.get(key)
        if (!node) throw new Error('Target row was not found')
        const collect = (current: TableDataNode) => {
          if (removed.has(current.key)) return
          removed.set(current.key, current)
          for (const child of current.children) collect(tree.rows.get(child)!)
        }
        collect(node)
      }
      if (tree)
        for (const node of removed.values()) {
          // A removed branch is tracked as individual loaded rows. Restoring parents
          // first avoids accidentally restoring newly inserted descendants.
          const row = node.children.length
            ? { ...node.row, [childrenField()]: [] }
            : node.row
          tracked.push({
            type: 'remove',
            rowKey: node.key,
            row,
            position: tree.position(node),
          })
          if (!node.parent || !removed.has(node.parent.key))
            operations.push({
              type: 'remove',
              rowKey: node.key,
              row: node.row,
              position: tree.position(node),
              patches: [],
            })
        }
      const data = tree
        ? planTableData(
            tree,
            operations.map(({ rowKey }) => ({ type: 'remove', rowKey })),
          )
        : undefined
      return apply(operations, journal.prepare(tracked), data)
    })
  const revertChanges = (keys?: TableRowKey[]) =>
    guarded(async () => {
      const records = journal.getRecords()
      const tree = props.virtualSource ? undefined : index()
      const selected = keys ? new Set(keys) : undefined
      const entries = [
        ...records.inserted,
        ...records.updated,
        ...records.removed,
      ]
      if (selected && tree) {
        // Include unchanged intermediate parents as well as removed descendants.
        const children = new Map<TableRowKey, Set<TableRowKey>>()
        const connect = (key: TableRowKey, parent?: TableRowKey) => {
          if (parent === undefined) return
          const siblings = children.get(parent) ?? new Set<TableRowKey>()
          siblings.add(key)
          children.set(parent, siblings)
        }
        for (const node of tree.nodes.values())
          connect(node.key, node.parent?.key)
        for (const entry of entries)
          connect(entry.rowKey, entry.position.parentKey)
        const pendingKeys = [...selected]
        while (pendingKeys.length) {
          for (const key of children.get(pendingKeys.pop()!) ?? []) {
            if (selected.has(key)) continue
            selected.add(key)
            pendingKeys.push(key)
          }
        }
      }
      const transaction = journal.prepareRevert(
        selected ? [...selected] : undefined,
      )
      const mutations: TableDataMutation[] = []
      let data = tree?.data
      try {
        if (tree) {
          let working = tree
          const removals = transaction.operations.filter(
            (operation) => operation.type === 'remove',
          )
          const removedKeys = new Set(
            removals.map((operation) => operation.rowKey),
          )
          const removePlans: TableDataPlanOperation[] = []
          for (const operation of removals) {
            const node = working.nodes.get(operation.rowKey)
            if (!node) throw new Error('Inserted row no longer exists')
            if (node.parent && removedKeys.has(node.parent.key)) continue
            removePlans.push({ type: 'remove', rowKey: node.key })
            mutations.push({ ...operation, type: 'remove' })
          }
          data = planTableData(working, removePlans)
          working = createTableDataIndex({ ...tree, data })
          const restores = transaction.operations.filter(
            (operation) => operation.type === 'restore',
          )
          while (restores.length) {
            const ready = restores
              .filter(
                (operation) =>
                  operation.position.parentKey === undefined ||
                  working.nodes.has(operation.position.parentKey),
              )
              .sort((a, b) => a.position.index - b.position.index)
            if (!ready.length)
              throw new Error('Restore the removed parent before its child')
            data = planTableData(
              working,
              ready.map((operation) => {
                const row = applyTableDataPatches(
                  operation.row,
                  operation.patches,
                )
                mutations.push({
                  ...operation,
                  row,
                  type: 'insert',
                  patches: [],
                })
                return {
                  type: 'insert' as const,
                  row,
                  position: operation.position,
                }
              }),
            )
            for (const operation of ready)
              restores.splice(restores.indexOf(operation), 1)
            working = createTableDataIndex({ ...tree, data })
          }
          const updates = transaction.operations.filter(
            (operation) => operation.type === 'update',
          )
          data = planTableData(
            working,
            updates.map((operation) => {
              const row = working.nodes.get(operation.rowKey)?.row
              if (!row) throw new Error('Changed row no longer exists')
              mutations.push({
                ...operation,
                row: applyTableDataPatches(row, operation.patches),
                type: 'update',
              })
              return {
                type: 'update' as const,
                rowKey: operation.rowKey,
                patches: operation.patches,
              }
            }),
          )
        } else {
          for (const operation of transaction.operations) {
            const target =
              operation.type === 'restore'
                ? undefined
                : sourceTarget(operation.rowKey)
            mutations.push({
              ...operation,
              position: target?.position ?? operation.position,
              type: operation.type === 'restore' ? 'insert' : operation.type,
              row:
                operation.type === 'restore'
                  ? projectTableDataPatches(operation.row, operation.patches)
                  : operation.type === 'update'
                    ? projectTableDataPatches(target!.row, operation.patches)
                    : target!.row,
            })
          }
        }
        return await apply(mutations, transaction, data)
      } catch (error) {
        transaction.cancel()
        throw error
      }
    })
  const applyEdit = async (record: TableEditRecord, current: () => boolean) => {
    if (!enabled.value) return true
    const values: Record<string, unknown> = {}
    for (const change of record.changes) values[change.field] = change.value
    return (await updateRow(record.rowKey, values, current)).applied
  }
  watch(
    () => props.data,
    (data) => {
      if (
        !enabled.value ||
        (pending?.data && toRaw(data) === toRaw(pending.data))
      )
        return
      reset()
    },
  )
  watch(
    [() => props.virtualSource?.row, () => props.virtualSource?.rowKey],
    () => {
      if (enabled.value && !pending) reset()
    },
  )
  watch(
    [
      enabled,
      () => config.value.dataKey,
      () => props.rowKey,
      () => props.treeConfig?.children,
    ],
    reset,
  )
  onBeforeUnmount(() => {
    disposed = true
    cancel()
    journal.dispose()
  })
  return {
    enabled,
    applyEdit,
    updateRow,
    insertRows,
    removeRows,
    revertChanges,
    getChangeRecords: journal.getRecords,
    acceptChanges: (version: number, keys?: TableRowKey[]) => {
      if (pending || !enabled.value) return false
      return journal.accept(keys, version)
    },
    resetChanges: reset,
    cancelDataChange: cancel,
  }
}
