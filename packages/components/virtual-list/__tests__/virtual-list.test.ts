import { nextTick, reactive } from 'vue'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import VirtualList from '../src/virtual-list.vue'

const virtualizerMocks = vi.hoisted(() => ({
  options: undefined as
    undefined | { value: { estimateSize: (index: number) => number } },
  measure: vi.fn(),
  resizeItem: vi.fn(),
  scrollToIndex: vi.fn(),
  scrollToOffset: vi.fn(),
  getTotalSize: vi.fn(() => 40),
  getVirtualItems: vi.fn(() => [
    { index: 0, key: 'alpha', start: 0, size: 40, end: 40, lane: 0 },
  ]),
}))

vi.mock('@tanstack/vue-virtual', () => ({
  useVirtualizer: (options: {
    value: { estimateSize: (index: number) => number }
  }) => {
    virtualizerMocks.options = options
    return { value: virtualizerMocks }
  },
}))

describe('VirtualList', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('caches dynamic row heights by stable item key', async () => {
    const rect = vi
      .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
      .mockReturnValue({ height: 64 } as DOMRect)
    const items = reactive([{ id: 'alpha', hover: false }])
    const wrapper = mount(VirtualList, {
      props: {
        items,
        itemKey: (item: unknown) => (item as { id: string }).id,
        dynamic: true,
      },
    })
    await nextTick()

    expect(virtualizerMocks.resizeItem).toHaveBeenCalledWith(0, 64)
    expect(virtualizerMocks.options?.value.estimateSize(0)).toBe(64)
    virtualizerMocks.resizeItem.mockClear()

    items[0].hover = true
    await nextTick()

    expect(virtualizerMocks.resizeItem).not.toHaveBeenCalled()

    rect.mockReturnValue({ height: 92 } as DOMRect)
    wrapper.vm.measureVisible()

    expect(virtualizerMocks.resizeItem).toHaveBeenCalledWith(0, 92)
    expect(virtualizerMocks.options?.value.estimateSize(0)).toBe(92)
  })

  it('retains the largest measured height when requested', async () => {
    const rect = vi
      .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
      .mockReturnValue({ height: 92 } as DOMRect)
    const wrapper = mount(VirtualList, {
      props: {
        items: [{ id: 'alpha' }],
        itemKey: (item: unknown) => (item as { id: string }).id,
        dynamic: true,
        retainMaxSize: true,
      },
    })
    await nextTick()

    expect(virtualizerMocks.resizeItem).toHaveBeenLastCalledWith(0, 92)
    rect.mockReturnValue({ height: 52 } as DOMRect)
    virtualizerMocks.resizeItem.mockClear()
    wrapper.vm.measureVisible()

    expect(virtualizerMocks.resizeItem).not.toHaveBeenCalled()
    expect(virtualizerMocks.options?.value.estimateSize(0)).toBe(92)
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

  it('resolves generated items only for the rendered window', () => {
    const itemAt = vi.fn((index: number) => ({ id: `row-${index}` }))
    const wrapper = mount(VirtualList, {
      props: {
        count: 100_000,
        itemAt,
        itemKey: (item: unknown) => (item as { id: string }).id,
      },
      slots: {
        default: ({ item }: { item: { id: string } }) => item.id,
      },
    })

    expect(wrapper.text()).toContain('row-0')
    expect(itemAt.mock.calls.length).toBeLessThan(20)
    expect(virtualizerMocks.options?.value.count).toBe(0)
    expect(wrapper.find('.s-vl__item').attributes('style')).toContain(
      '--s-vl-item-start: 0px',
    )
  })

  it('batches sparse generated-row measurements into stable offsets', async () => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      height: 72,
    } as DOMRect)
    const wrapper = mount(VirtualList, {
      props: {
        count: 100_000,
        itemAt: (index: number) => ({ id: index + 1 }),
        itemKeyAt: (index: number) => index + 1,
        estimateSize: 38,
        dynamic: true,
      },
    })

    await nextTick()
    await Promise.resolve()
    await nextTick()

    const rows = wrapper.findAll('.s-vl__item')
    expect(rows.length).toBeGreaterThan(1)
    expect(rows[1].attributes('style')).toContain('--s-vl-item-start: 72px')
    expect(virtualizerMocks.resizeItem).not.toHaveBeenCalled()
  })

  it('keeps sparse row offsets at the largest visited-window height', async () => {
    let measuredHeight = 72
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
      () => ({ height: measuredHeight }) as DOMRect,
    )
    const wrapper = mount(VirtualList, {
      props: {
        count: 100_000,
        itemAt: (index: number) => ({ id: index + 1 }),
        itemKeyAt: (index: number) => index + 1,
        estimateSize: 38,
        dynamic: true,
        retainMaxSize: true,
      },
    })

    await nextTick()
    await Promise.resolve()
    await nextTick()

    expect(wrapper.findAll('.s-vl__item')[1].attributes('style')).toContain(
      '--s-vl-item-start: 72px',
    )

    measuredHeight = 44
    wrapper.vm.measureVisible()
    await Promise.resolve()
    await nextTick()

    let rows = wrapper.findAll('.s-vl__item')
    expect(rows[0].attributes('style')).toContain('min-height: 72px')
    expect(rows[1].attributes('style')).toContain('--s-vl-item-start: 72px')

    measuredHeight = 96
    wrapper.vm.measureVisible()
    await Promise.resolve()
    await nextTick()

    rows = wrapper.findAll('.s-vl__item')
    expect(rows[0].attributes('style')).toContain('min-height: 96px')
    expect(rows[1].attributes('style')).toContain('--s-vl-item-start: 96px')
  })
})
