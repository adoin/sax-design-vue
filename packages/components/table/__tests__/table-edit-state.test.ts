import { defineComponent, h } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { useTableEdit } from '../src/composables/use-table-edit'
import { tableEmits, tableProps } from '../src/table'
import { applyTableEditChanges } from '../src/edit-utils'
import type {
  TableColumn,
  TableEditContext,
  TableEditEndParams,
} from '../src/table'

const Harness = defineComponent({
  props: tableProps,
  emits: tableEmits,
  setup(props, { emit }) {
    return { editing: useTableEdit(props, emit) }
  },
  render: () => h('div'),
})
const row = Object.freeze({
  id: 1,
  name: 'Before',
  meta: Object.freeze({ score: 2 }),
  untouched: { label: 'Stable' },
})
const context = (
  column: TableColumn = { field: 'name', editor: true },
): TableEditContext => ({
  row,
  rowKey: 1,
  column,
  columnKey: column.field!,
  columnIndex: 0,
  rowIndex: 0,
  value: row.name,
  depth: 0,
  expanded: false,
  loading: false,
  toggleExpand: async () => {},
})

describe('table edit state', () => {
  it('requires explicit editing configuration and eligible fields', async () => {
    const wrapper = mount(Harness)
    const e = wrapper.vm.editing
    expect(e.start(context())).toBe(false)
    await wrapper.setProps({ editConfig: true })
    expect(e.start(context({ field: 'name' }))).toBe(false)
    expect(e.start(context({ field: 'name', type: 'seq', editor: true }))).toBe(
      false,
    )
    expect(e.start(context({ field: '__proto__.value', editor: true }))).toBe(
      false,
    )
    expect(
      e.start(context({ field: 'name', editor: { checkMethod: () => false } })),
    ).toBe(false)
    expect(e.start(context())).toBe(true)
    expect(wrapper.emitted('editStart')).toHaveLength(1)
    wrapper.unmount()
  })

  it('keeps cell drafts independent and emits immutable nested path changes', () => {
    const wrapper = mount(Harness, { props: { editConfig: true } })
    const e = wrapper.vm.editing
    const c = context({ field: 'meta.score', editor: { type: 'number' } })
    e.start(c)
    e.setValue(c, 7)
    expect(row.meta.score).toBe(2)
    expect(e.valueFor(c)).toBe(7)
    expect(e.commit()).toBe(true)
    const result = wrapper.emitted('editCommit')![0][0] as TableEditEndParams
    expect(result.updatedRow).toEqual({ ...row, meta: { score: 7 } })
    expect(result.updatedRow).not.toBe(row)
    expect(result.updatedRow.meta).not.toBe(row.meta)
    expect(result.updatedRow.untouched).toBe(row.untouched)
    expect(result.changes).toMatchObject([
      { field: 'meta.score', oldValue: 2, value: 7 },
    ])
    expect(e.record()).toBeNull()
    wrapper.unmount()
  })

  it('accumulates row fields, removes reverted changes and cancels without mutation', () => {
    const wrapper = mount(Harness, { props: { editConfig: { mode: 'row' } } })
    const e = wrapper.vm.editing
    const first = context(),
      second = context({ field: 'meta.score', editor: true })
    e.start(first)
    e.setValue(first, 'After')
    e.start(second)
    e.setValue(second, 10)
    expect(e.record()?.changes).toHaveLength(2)
    e.setValue(first, 'Before')
    expect(e.record()?.changes.map((change) => change.field)).toEqual([
      'meta.score',
    ])
    e.cancel('escape')
    expect(wrapper.emitted('editCancel')![0][0]).toMatchObject({
      reason: 'escape',
      mode: 'row',
    })
    expect(wrapper.emitted('editCommit')).toBeUndefined()
    expect(row.meta.score).toBe(2)
    wrapper.unmount()
  })

  it('applies switch and navigation policies and always cancels on external data replacement', async () => {
    const wrapper = mount(Harness, {
      props: { editConfig: { onSwitch: 'cancel', onContextChange: 'commit' } },
    })
    const e = wrapper.vm.editing
    e.start(context())
    e.setValue(context(), 'Draft')
    e.start(context({ field: 'meta.score', editor: true }))
    expect(wrapper.emitted('editCancel')![0][0]).toMatchObject({
      reason: 'switch',
    })
    e.contextChanged('page')
    expect(wrapper.emitted('editCommit')![0][0]).toMatchObject({
      reason: 'page',
    })
    e.start(context())
    await wrapper.setProps({ data: [{ ...row, name: 'External' }] })
    expect(e.record()).toBeNull()
    expect(wrapper.emitted('editCancel')!.at(-1)![0]).toMatchObject({
      reason: 'data',
    })
    wrapper.unmount()
  })

  it('guards in-place external conflicts and does not expose the internal draft through event snapshots', () => {
    const wrapper = mount(Harness, { props: { editConfig: true } })
    const e = wrapper.vm.editing
    const editable = { ...row },
      c = { ...context(), row: editable }
    e.start(c)
    e.setValue(c, 'Draft')
    e.record()!.updatedRow.name = 'Mutated snapshot'
    expect(e.record()!.updatedRow.name).toBe('Draft')
    editable.name = 'Remote edit'
    expect(e.commit()).toBe(false)
    expect(wrapper.emitted('editCancel')![0][0]).toMatchObject({
      reason: 'conflict',
    })
    expect(editable.name).toBe('Remote edit')
    wrapper.unmount()
  })

  it('keeps virtual drafts by default and applies explicit viewport leave behavior', async () => {
    const wrapper = mount(Harness, { props: { editConfig: { mode: 'row' } } })
    const e = wrapper.vm.editing
    e.start(context())
    e.setValue(context(), 'Draft')
    e.attach(context())()
    await flushPromises()
    expect(e.record()?.updatedRow.name).toBe('Draft')
    expect(e.consumeFocus(context())).toBe(true)
    expect(e.consumeFocus(context())).toBe(false)
    e.start(context())
    expect(e.consumeFocus(context())).toBe(true)
    await wrapper.setProps({ editConfig: { mode: 'row', onScroll: 'commit' } })
    const detachFirst = e.attach(context()),
      detachSecond = e.attach(context({ field: 'meta.score', editor: true }))
    detachFirst()
    await flushPromises()
    expect(wrapper.emitted('editCommit')).toBeUndefined()
    detachSecond()
    await flushPromises()
    expect(wrapper.emitted('editCommit')![0][0]).toMatchObject({
      reason: 'scroll',
    })
    wrapper.unmount()
  })

  it('cleans up active sessions and ignores deferred viewport actions after unmount', async () => {
    const wrapper = mount(Harness, {
      props: { editConfig: { onScroll: 'commit' } },
    })
    const e = wrapper.vm.editing
    e.start(context())
    const detach = e.attach(context())
    wrapper.unmount()
    detach()
    await flushPromises()
    expect(wrapper.emitted('editCancel')![0][0]).toMatchObject({
      reason: 'unmount',
    })
    expect(wrapper.emitted('editCommit')).toBeUndefined()
    expect(e.start(context())).toBe(false)
  })

  it('copies array paths and rejects prototype paths', () => {
    const source = { rows: [{ value: 1 }, { value: 2 }] }
    const changed = applyTableEditChanges(source, [
      {
        field: 'rows.0.value',
        column: {},
        columnKey: 'value',
        oldValue: 1,
        value: 3,
      },
      {
        field: '__proto__.polluted',
        column: {},
        columnKey: 'bad',
        oldValue: undefined,
        value: true,
      },
    ])
    expect(changed.rows).toEqual([{ value: 3 }, { value: 2 }])
    expect(source.rows[0].value).toBe(1)
    expect(changed.rows[1]).toBe(source.rows[1])
    expect(Object.prototype).not.toHaveProperty('polluted')
  })
})
