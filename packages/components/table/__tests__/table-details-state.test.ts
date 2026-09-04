import { computed, defineComponent, h } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { tableEmits, tableProps } from '../src/table'
import { useTableDetails } from '../src/composables/use-table-details'
import type { TableFlatRow } from '../src/table'

const Harness = defineComponent({
  props: tableProps,
  emits: tableEmits,
  setup(props, { emit }) {
    return {
      details: useTableDetails(
        props,
        emit,
        computed(() => props.columns),
      ),
    }
  },
  render: () => h('div'),
})
const row = Object.freeze({ id: 1, name: 'Parent', children: [{ id: 2 }] })
const flat: TableFlatRow = {
  row,
  key: 1,
  index: 0,
  depth: 0,
  hasChildren: true,
  expanded: false,
  loading: false,
}
function deferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (error: unknown) => void
  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}

describe('table detail state', () => {
  it('opts in through expand columns and keeps tree keys and consumer rows unchanged', async () => {
    const wrapper = mount(Harness, {
      props: { columns: [{ type: 'expand' }], expandedKeys: [2] },
    })
    const details = wrapper.vm.details
    expect(details.enabled.value).toBe(true)
    expect(wrapper.emitted('update:detailExpandedKeys')).toBeUndefined()
    await details.toggle(flat)
    expect(details.keys.value.has(1)).toBe(true)
    expect(wrapper.emitted('update:detailExpandedKeys')?.[0]).toEqual([[1]])
    expect(wrapper.emitted('update:expandedKeys')).toBeUndefined()
    expect(row).toEqual({ id: 1, name: 'Parent', children: [{ id: 2 }] })
    await details.toggle(flat, false)
    expect(details.keys.value.size).toBe(0)
    await wrapper.setProps({ detailConfig: false })
    await details.toggle(flat, true)
    expect(details.keys.value.size).toBe(0)
    wrapper.unmount()
  })

  it('waits for controlled acceptance and does not fetch rejected expansion', async () => {
    const load = vi.fn(async () => 'loaded')
    const wrapper = mount(Harness, {
      props: { detailConfig: { load }, detailExpandedKeys: [] },
    })
    await wrapper.vm.details.toggle(flat, true)
    expect(wrapper.emitted('update:detailExpandedKeys')?.[0]).toEqual([[1]])
    expect(wrapper.vm.details.expanded(flat)).toBe(false)
    expect(load).not.toHaveBeenCalled()
    await wrapper.setProps({ detailExpandedKeys: [1] })
    await wrapper.vm.details.ensure(flat)
    expect(load).toHaveBeenCalledTimes(1)
    expect(wrapper.vm.details.stateFor(1).data).toBe('loaded')
    await wrapper.setProps({ detailExpandedKeys: [] })
    expect(wrapper.vm.details.stateFor(1).settled).toBe(false)
    wrapper.unmount()
  })

  it('deduplicates requests and ignores stale completion after collapse and reopen', async () => {
    const first = deferred<string>(),
      second = deferred<string>()
    const signals: AbortSignal[] = []
    const load = vi.fn(({ signal }: { signal: AbortSignal }) => {
      signals.push(signal)
      return signals.length === 1 ? first.promise : second.promise
    })
    const wrapper = mount(Harness, { props: { detailConfig: { load } } })
    const details = wrapper.vm.details
    const opening = details.toggle(flat, true)
    await flushPromises()
    const duplicate = details.ensure(flat)
    expect(load).toHaveBeenCalledTimes(1)
    await details.toggle(flat, false)
    expect(signals[0].aborted).toBe(true)
    const reopening = details.toggle(flat, true)
    await flushPromises()
    first.resolve('stale')
    await Promise.all([opening, duplicate])
    expect(details.stateFor(1).loading).toBe(true)
    second.resolve('fresh')
    await reopening
    expect(details.stateFor(1).data).toBe('fresh')
    expect(wrapper.emitted('detailLoad')).toHaveLength(1)
    expect(wrapper.emitted('detailLoadError')).toBeUndefined()
    await details.ensure(flat)
    expect(load).toHaveBeenCalledTimes(2)
    wrapper.unmount()
  })

  it('exposes errors for retry and clears payloads when data or loader changes', async () => {
    const error = new Error('Failed')
    const load = vi
      .fn()
      .mockRejectedValueOnce(error)
      .mockResolvedValue('retried')
    const wrapper = mount(Harness, {
      props: { detailConfig: { load, defaultExpandedKeys: [1] } },
    })
    const details = wrapper.vm.details
    await details.ensure(flat)
    expect(details.stateFor(1).error).toBe(error)
    expect(wrapper.emitted('detailLoadError')).toHaveLength(1)
    await details.ensure(flat)
    expect(load).toHaveBeenCalledTimes(1)
    await details.ensure(flat, true)
    expect(details.stateFor(1).data).toBe('retried')
    expect(details.stateFor(1).error).toBeUndefined()
    await wrapper.setProps({ data: [row] })
    expect(details.stateFor(1).settled).toBe(false)
    expect(details.keys.value.has(1)).toBe(true)
    await details.ensure(flat)
    expect(load).toHaveBeenCalledTimes(3)
    wrapper.unmount()
  })

  it('aborts on disable and unmount, including requests that ignore AbortSignal', async () => {
    const pending = deferred<string>()
    let signal!: AbortSignal
    const wrapper = mount(Harness, {
      props: {
        detailConfig: {
          load: (params) => {
            signal = params.signal
            return pending.promise
          },
        },
        detailExpandedKeys: [1],
      },
    })
    const promise = wrapper.vm.details.ensure(flat)
    await flushPromises()
    await wrapper.setProps({ detailConfig: false })
    expect(signal.aborted).toBe(true)
    wrapper.unmount()
    pending.resolve('ignored')
    await promise
    expect(wrapper.emitted('detailLoad')).toBeUndefined()
    expect(wrapper.emitted('detailLoadError')).toBeUndefined()
  })

  it('checks eligibility before loading externally expanded keys', async () => {
    const load = vi.fn(async () => null)
    const wrapper = mount(Harness, {
      props: {
        detailConfig: { checkMethod: () => false, load },
        detailExpandedKeys: [1],
      },
    })
    await wrapper.vm.details.ensure(flat)
    expect(wrapper.vm.details.expanded(flat)).toBe(false)
    expect(load).not.toHaveBeenCalled()
    wrapper.unmount()
  })
})
