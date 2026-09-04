import { defineComponent, h, nextTick, shallowRef } from 'vue'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useTableGroups } from '../src/composables/use-table-groups'
import type { TableGroupConfig } from '../src/table-group'
import type { TableFlatRow } from '../src/table'

const cleanups: (() => void)[] = []
const flat = (team: string, hours: number, index: number): TableFlatRow => ({
  row: { team, hours },
  key: index,
  index,
  depth: 0,
  hasChildren: false,
  expanded: false,
  loading: false,
})
const fixture = () => {
  const config = shallowRef<boolean | TableGroupConfig>({
    fields: ['team'],
    aggregates: [{ key: 'hours', field: 'hours', method: 'sum' }],
    subtotal: true,
  })
  const rows = shallowRef([flat('A', 3, 0), flat('B', 5, 1), flat('A', 7, 2)])
  const filtered = shallowRef([...rows.value, flat('C', 11, 3)])
  const source = shallowRef<{ count: number; offset: number }>()
  const keys = shallowRef<readonly string[]>()
  const disabled = shallowRef(false)
  const update = vi.fn<(keys: string[]) => void>()
  const expand = vi.fn()
  const error = vi.fn()
  let controller!: ReturnType<typeof useTableGroups>
  const wrapper = mount(
    defineComponent({
      setup() {
        controller = useTableGroups({
          config: () => config.value,
          rows: () => rows.value,
          filteredRows: () => filtered.value,
          sourceBounds: () => source.value,
          expandedKeys: () => keys.value,
          disabled: () => disabled.value,
          onExpandedKeysChange: update,
          onExpand: expand,
          onError: error,
        })
        return () => h('div')
      },
    }),
  )
  cleanups.push(() => wrapper.unmount())
  return {
    config,
    rows,
    filtered,
    source,
    keys,
    disabled,
    update,
    expand,
    error,
    controller,
    wrapper,
  }
}
afterEach(() => cleanups.splice(0).forEach((cleanup) => cleanup()))

describe('Table grouping state', () => {
  it('defaults to expanded groups and separates data rows from rendered bands', async () => {
    const f = fixture()
    expect(f.controller.layout.value.dataCount).toBe(3)
    expect(f.controller.layout.value.count).toBe(7)
    const group = f.controller.state.value.groups[0]
    expect(await f.controller.toggle(group.key)).toBe(true)
    expect(f.controller.layout.value.dataCount).toBe(1)
    expect(f.controller.state.value.summary.hours).toBe(15)
    expect(f.expand).toHaveBeenCalledWith({ group, expanded: false })
    expect(f.rows.value.map((row) => row.key)).toEqual([0, 1, 2])
  })

  it('respects controlled rejection and accepts an updated model', async () => {
    const f = fixture()
    f.keys.value = []
    const key = f.controller.state.value.groups[0].key
    expect(await f.controller.toggle(key, true)).toBe(false)
    expect(f.controller.layout.value.dataCount).toBe(0)
    expect(f.expand).not.toHaveBeenCalled()
    f.update.mockImplementation((next) => {
      f.keys.value = next
    })
    expect(await f.controller.toggle(key, true)).toBe(true)
    expect(f.controller.layout.value.dataCount).toBe(2)
  })

  it('does not reset expansion when an inline configuration is recreated', async () => {
    const f = fixture()
    const key = f.controller.state.value.groups[0].key
    await f.controller.toggle(key, false)
    f.config.value = {
      ...(f.config.value as TableGroupConfig),
      fields: ['team'],
    }
    await nextTick()
    expect(f.controller.layout.value.dataCount).toBe(1)
    f.config.value = {
      ...(f.config.value as TableGroupConfig),
      fields: ['hours'],
    }
    await nextTick()
    expect(f.controller.layout.value.dataCount).toBe(3)
  })

  it('allows an inline controlled parent update without rejecting equivalent groups', async () => {
    const f = fixture()
    f.keys.value = []
    f.update.mockImplementation((next) => {
      f.keys.value = next
      f.config.value = { ...(f.config.value as TableGroupConfig) }
    })
    expect(
      await f.controller.toggle(f.controller.state.value.groups[0].key, true),
    ).toBe(true)
    expect(f.expand).toHaveBeenCalledTimes(1)
  })

  it('distinguishes current-page subtotals from the filtered overall summary', () => {
    const f = fixture()
    expect(f.controller.state.value.summary.hours).toBe(15)
    f.config.value = {
      ...(f.config.value as TableGroupConfig),
      summaryScope: 'filtered',
    }
    expect(f.controller.state.value.summary.hours).toBe(26)
    expect(
      f.controller.state.value.groups.map((group) => group.aggregates.hours),
    ).toEqual([10, 5])
  })

  it('uses sparse remote metadata and never reads the local row arrays', () => {
    const f = fixture()
    f.source.value = { count: 1_000_000_000, offset: 0 }
    f.rows.value = new Proxy([], {
      get() {
        throw new Error('Must not read source rows')
      },
    })
    f.filtered.value = f.rows.value
    f.config.value = {
      mode: 'remote',
      remote: {
        groups: [
          {
            key: 'all',
            field: 'team',
            value: 'All',
            rowStart: 0,
            rowCount: 1_000_000_000,
            aggregates: { hours: 42 },
          },
        ],
        summary: { hours: 42 },
      },
      subtotal: true,
    }
    expect(f.controller.state.value.summary.hours).toBe(42)
    expect(f.controller.layout.value.segmentCount).toBe(3)
    expect(f.controller.layout.value.count).toBe(1_000_000_002)
  })

  it('preserves source row indices in custom filtered summary callbacks', () => {
    const f = fixture()
    f.filtered.value = [flat('A', 1, 8), flat('B', 2, 20)]
    f.config.value = {
      fields: ['team'],
      summaryScope: 'filtered',
      aggregates: [
        {
          key: 'indices',
          method: {
            initial: () => 0,
            step: (state, cell) => Number(state) + cell.rowIndex,
          },
        },
      ],
    }
    expect(f.controller.state.value.summary.indices).toBe(28)
  })

  it('discards a pending expansion completion when grouping mode changes', async () => {
    const f = fixture()
    const pending = f.controller.toggle(
      f.controller.state.value.groups[0].key,
      false,
    )
    f.config.value = { mode: 'remote' }
    expect(await pending).toBe(false)
    expect(f.expand).not.toHaveBeenCalled()
  })

  it('starts collapsed when requested and retains nested state across parent toggles', async () => {
    const f = fixture()
    f.config.value = { fields: ['team', 'hours'], defaultExpanded: false }
    const parent = f.controller.state.value.groups[0]
    const child = parent.children[0]
    expect(f.controller.layout.value.dataCount).toBe(0)
    await f.controller.toggle(parent.key, true)
    await f.controller.toggle(child.key, true)
    expect(f.controller.layout.value.dataCount).toBe(1)
    await f.controller.toggle(parent.key, false)
    await f.controller.toggle(parent.key, true)
    expect(f.controller.layout.value.dataCount).toBe(1)
    expect(f.controller.keys.value.has(child.key)).toBe(true)
  })

  it('reports invalid local/source configuration and recovers after correction', async () => {
    const f = fixture()
    f.source.value = { count: 100, offset: 0 }
    await nextTick()
    expect(f.error).toHaveBeenCalledTimes(1)
    expect(f.controller.state.value.error).toBeInstanceOf(TypeError)
    expect(f.controller.layout.value.count).toBe(100)
    f.config.value = { mode: 'remote' }
    await nextTick()
    expect(f.controller.state.value.error).toBeUndefined()
    expect(f.controller.layout.value.count).toBe(100)
  })

  it('falls back to source row order after a reducer failure', async () => {
    const f = fixture()
    f.config.value = {
      fields: ['team'],
      aggregates: [
        {
          key: 'a',
          method: {
            initial: () => 0,
            step: () => {
              throw new Error('bad reducer')
            },
          },
        },
      ],
    }
    await nextTick()
    expect(f.error).toHaveBeenCalledTimes(1)
    expect(f.controller.state.value.groups).toEqual([])
    expect(f.controller.state.value.rows).toBe(f.rows.value)
  })

  it('keeps disabled behavior unchanged and blocks expansion mutations', async () => {
    const f = fixture()
    f.disabled.value = true
    expect(
      await f.controller.toggle(f.controller.state.value.groups[0].key),
    ).toBe(false)
    expect(f.update).not.toHaveBeenCalled()
    f.config.value = false
    expect(f.controller.state.value.rows).toBe(f.rows.value)
    expect(f.controller.layout.value.count).toBe(3)
  })

  it('deduplicates known keys and suppresses stale expansion results', async () => {
    const f = fixture()
    const key = f.controller.state.value.groups[0].key
    expect(await f.controller.setExpandedKeys([key, key, 'missing'])).toBe(true)
    expect([...f.controller.keys.value]).toEqual([key])
    const first = f.controller.toggle(key, false)
    const second = f.controller.toggle(key, true)
    expect(await first).toBe(false)
    expect(await second).toBe(true)
    expect(f.expand).toHaveBeenCalledTimes(1)
  })

  it('does not publish completion after unmount or a mode change', async () => {
    const f = fixture()
    const pending = f.controller.toggle(
      f.controller.state.value.groups[0].key,
      false,
    )
    f.wrapper.unmount()
    expect(await pending).toBe(false)
    expect(f.expand).not.toHaveBeenCalled()
    expect(await f.controller.setExpandedKeys([])).toBe(false)
  })
})
