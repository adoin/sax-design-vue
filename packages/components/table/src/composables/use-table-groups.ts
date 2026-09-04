import { computed, nextTick, onBeforeUnmount, shallowRef, watch } from 'vue'
import { createTableAggregation } from './table-aggregation'
import { createTableGroupLayout } from './table-group-layout'
import {
  buildTableGroupModel,
  resolveRemoteTableGroups,
} from './table-group-model'
import type { TableFlatRow } from '../table'
import type { TableGroupConfig, TableGroupNode } from '../table-group'

interface TableGroupOptions {
  config: () => boolean | TableGroupConfig | undefined
  rows: () => readonly TableFlatRow[]
  filteredRows: () => readonly TableFlatRow[]
  sourceBounds: () => { offset: number; count: number } | undefined
  expandedKeys: () => readonly string[] | undefined
  disabled: () => boolean
  onExpandedKeysChange: (keys: string[]) => void
  onExpand: (params: { group: TableGroupNode; expanded: boolean }) => void
  onError: (error: unknown) => void
}

const emptySummary: Readonly<Record<string, unknown>> = Object.freeze(
  Object.create(null),
)
const groupMap = (nodes: readonly TableGroupNode[]) => {
  const map = new Map<string, TableGroupNode>()
  const stack = [...nodes].reverse()
  while (stack.length) {
    const group = stack.pop()!
    map.set(group.key, group)
    for (let index = group.children.length - 1; index >= 0; index--)
      stack.push(group.children[index])
  }
  return map
}

/** Own grouping state, leaving data ownership, renderers and virtual scrolling in STable. */
export function useTableGroups(options: TableGroupOptions) {
  const config = computed<TableGroupConfig>(() => {
    const value = options.config()
    return typeof value === 'object' ? value : {}
  })
  const enabled = computed(
    () => Boolean(options.config()) && config.value.enabled !== false,
  )
  const localKeys = shallowRef<ReadonlySet<string>>()
  let disposed = false
  let expansionRevision = 0
  const state = computed(() => {
    const source = options.sourceBounds()
    const rows = source ? [] : options.rows()
    const fallback = {
      rows,
      groups: [] as readonly TableGroupNode[],
      summary: emptySummary,
      rowOffset: source?.offset ?? 0,
      rowCount: source?.count ?? rows.length,
      error: undefined as unknown,
    }
    if (!enabled.value) return fallback
    try {
      const current = config.value
      if (current.mode === 'remote') {
        const groups = resolveRemoteTableGroups(
          current.remote?.groups ?? [],
          fallback.rowCount,
          fallback.rowOffset,
        )
        return {
          ...fallback,
          groups,
          summary: Object.freeze(
            Object.assign(Object.create(null), current.remote?.summary),
          ),
        }
      }
      if (source)
        throw new TypeError(
          'Generated sources require remote grouping metadata',
        )
      const model = buildTableGroupModel(
        rows,
        current.fields ?? [],
        current.aggregates ?? [],
      )
      let summary = model.summary
      if (current.summaryScope === 'filtered') {
        const aggregate = createTableAggregation(current.aggregates ?? [])
        for (const flat of options.filteredRows())
          aggregate.add(flat.row, flat.index)
        summary = aggregate.result()
      }
      return { ...fallback, ...model, summary }
    } catch (error) {
      return { ...fallback, error: error ?? new Error('Grouping failed') }
    }
  })
  const nodes = computed(() => groupMap(state.value.groups))
  const keys = computed<ReadonlySet<string>>(() => {
    const controlled = options.expandedKeys()
    if (controlled !== undefined) return new Set(controlled)
    return (
      localKeys.value ??
      new Set(config.value.defaultExpanded === false ? [] : nodes.value.keys())
    )
  })
  const expanded = (group: TableGroupNode) => keys.value.has(group.key)
  const layout = computed(() =>
    createTableGroupLayout(state.value.groups, state.value.rowCount, expanded, {
      rowOffset: state.value.rowOffset,
      subtotal: Boolean(config.value.subtotal),
    }),
  )
  const setExpandedKeys = async (requested: readonly string[]) => {
    if (disposed || !enabled.value || options.disabled()) return false
    const revision = ++expansionRevision
    const known = nodes.value
    const next = [...new Set(requested)].filter((key) => known.has(key))
    const current = [...keys.value].filter((key) => known.has(key))
    const changed =
      next.length !== current.length || next.some((key) => !keys.value.has(key))
    if (!changed) return true
    if (options.expandedKeys() === undefined) localKeys.value = new Set(next)
    options.onExpandedKeysChange(next)
    await nextTick()
    if (disposed || expansionRevision !== revision) return false
    const actualKeys = new Set(
      [...keys.value].filter((key) => nodes.value.has(key)),
    )
    return (
      actualKeys.size === next.length &&
      next.every((key) => actualKeys.has(key))
    )
  }
  const toggle = async (key: string, value?: boolean) => {
    const group = nodes.value.get(key)
    if (!group || disposed || options.disabled() || !enabled.value) return false
    const nextValue = value ?? !keys.value.has(key)
    const next = new Set(keys.value)
    if (nextValue) next.add(key)
    else next.delete(key)
    const changed = keys.value.has(key) !== nextValue
    const accepted = await setExpandedKeys([...next])
    const currentGroup = nodes.value.get(key)
    if (accepted && changed && !disposed && currentGroup)
      options.onExpand({ group: currentGroup, expanded: nextValue })
    return accepted && Boolean(currentGroup)
  }
  watch(
    () => state.value.error,
    (error) => {
      if (error !== undefined) options.onError(error)
    },
    { immediate: true },
  )
  watch(
    [
      enabled,
      () =>
        JSON.stringify(
          (config.value.fields ?? []).map((field) =>
            typeof field === 'string' ? field : field.field,
          ),
        ),
      () => config.value.mode,
      () => config.value.defaultExpanded,
    ],
    () => {
      localKeys.value = undefined
      expansionRevision++
    },
    { flush: 'sync' },
  )
  onBeforeUnmount(() => {
    disposed = true
    expansionRevision++
  })
  const revealRow = async (index: number, current: () => boolean) => {
    let level = state.value.groups
    while (level.length) {
      let low = 0
      let high = level.length - 1
      while (low <= high) {
        const middle = (low + high) >>> 1
        if (level[middle].rowStart <= index) low = middle + 1
        else high = middle - 1
      }
      const group = level[high]
      if (!group || index >= group.rowStart + group.rowCount) break
      if (!current()) return false
      if (!expanded(group) && !(await toggle(group.key, true))) return false
      level = group.children
    }
    return current()
  }
  return {
    revealRow,
    enabled,
    config,
    state,
    nodes,
    keys,
    // Explicit expansion state is independent of groups created by accepted data edits.
    expansionState: computed(() => options.expandedKeys() ?? localKeys.value),
    expanded,
    layout,
    setExpandedKeys,
    toggle,
  }
}
