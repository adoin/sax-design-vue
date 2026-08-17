import { nextTick, reactive } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import VirtualList from '../src/virtual-list.vue'

const virtualizerMocks = vi.hoisted(() => ({
  measure: vi.fn(),
  measureElement: vi.fn(),
  scrollToIndex: vi.fn(),
  scrollToOffset: vi.fn(),
  getTotalSize: vi.fn(() => 40),
  getVirtualItems: vi.fn(() => [
    { index: 0, key: 'alpha', start: 0, size: 40, end: 40, lane: 0 },
  ]),
}))

vi.mock('@tanstack/vue-virtual', () => ({
  useVirtualizer: () => ({ value: virtualizerMocks }),
}))

describe('VirtualList', () => {
  it('measures rendered dynamic rows without resetting on nested item state', async () => {
    const items = reactive([{ id: 'alpha', hover: false }])
    mount(VirtualList, {
      props: {
        items,
        itemKey: (item: unknown) => (item as { id: string }).id,
        dynamic: true,
      },
    })
    await nextTick()

    expect(virtualizerMocks.measureElement).toHaveBeenCalled()
    virtualizerMocks.measure.mockClear()

    items[0].hover = true
    await nextTick()

    expect(virtualizerMocks.measure).not.toHaveBeenCalled()
  })

  it('resets measurements when the sizing mode changes', async () => {
    const wrapper = mount(VirtualList, {
      props: {
        items: [{ id: 'alpha' }],
        dynamic: true,
      },
    })
    virtualizerMocks.measure.mockClear()

    await wrapper.setProps({ dynamic: false })
    await nextTick()

    expect(virtualizerMocks.measure).toHaveBeenCalledTimes(1)
  })
})
