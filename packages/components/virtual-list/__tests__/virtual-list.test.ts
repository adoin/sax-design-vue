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
  shouldAdjustScrollPositionOnItemSizeChange: undefined as
    (() => boolean) | undefined,
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

  it('drops retained maximum heights after a real layout reset', async () => {
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
    expect(virtualizerMocks.options?.value.estimateSize(0)).toBe(92)
    rect.mockReturnValue({ height: 52 } as DOMRect)
    await wrapper.vm.resetMeasurements()
    expect(virtualizerMocks.options?.value.estimateSize(0)).toBe(52)
    expect(virtualizerMocks.resizeItem).toHaveBeenLastCalledWith(0, 52)
    wrapper.unmount()
    rect.mockRestore()
  })

  it('suspends normal-list anchoring only while the native scrollbar is held', async () => {
    const wrapper = mount(VirtualList, {
      props: { items: [{ id: 'alpha' }], dynamic: true },
    })
    await nextTick()
    const element = wrapper.find('.s-vl__window').element as HTMLElement
    Object.defineProperties(element, {
      clientHeight: { value: 100 },
      clientWidth: { value: 190 },
      offsetHeight: { value: 100 },
      offsetWidth: { value: 200 },
      scrollHeight: { value: 1000 },
    })
    const rect = vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 0,
      width: 200,
      height: 100,
    } as DOMRect)
    element.dispatchEvent(
      new MouseEvent('mousedown', { button: 0, clientX: 195, clientY: 20 }),
    )
    expect(
      virtualizerMocks.shouldAdjustScrollPositionOnItemSizeChange?.(),
    ).toBe(false)
    window.dispatchEvent(new MouseEvent('mouseup'))
    expect(
      virtualizerMocks.shouldAdjustScrollPositionOnItemSizeChange,
    ).toBeUndefined()
    wrapper.unmount()
    rect.mockRestore()
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

  it('keeps the native track height stable during measurement and updates it on release', async () => {
    let rowHeight = 48
    const rect = vi
      .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
      .mockImplementation(function (this: HTMLElement) {
        return this.classList.contains('s-vl__window')
          ? ({ left: 0, top: 0, width: 300, height: 300 } as DOMRect)
          : ({ height: rowHeight } as DOMRect)
      })
    const wrapper = mount(VirtualList, {
      props: {
        count: 10_000,
        itemAt: (index: number) => index,
        estimateSize: 48,
        dynamic: true,
        retainMaxSize: true,
      },
    })
    await nextTick()
    await nextTick()
    const content = wrapper.find('.s-vl__content').element as HTMLElement
    const element = wrapper.find('.s-vl__window').element as HTMLElement
    Object.defineProperties(element, {
      clientHeight: { value: 300 },
      clientWidth: { value: 290 },
      offsetHeight: { value: 300 },
      offsetWidth: { value: 300 },
      scrollHeight: { get: () => Number.parseFloat(content.style.height) },
    })
    const initialHeight = element.scrollHeight
    element.dispatchEvent(
      new MouseEvent('mousedown', {
        button: 0,
        clientX: 295,
        clientY: 20,
      }),
    )
    rowHeight = 96
    wrapper.vm.measureVisible()
    await nextTick()
    await nextTick()
    expect(element.scrollHeight).toBe(initialHeight)
    expect(content.style.overflowY).toBe('clip')
    expect(wrapper.findAll('.s-vl__item')[1].attributes('style')).toContain(
      '--s-vl-item-start: 96px',
    )

    element.scrollTop = initialHeight - element.clientHeight
    element.scrollTo = vi.fn(({ top }: ScrollToOptions) => {
      element.scrollTop = top ?? 0
    })
    window.dispatchEvent(new MouseEvent('mouseup'))
    await nextTick()
    await nextTick()
    expect(element.scrollHeight).toBeGreaterThan(initialHeight)
    expect(content.style.overflowY).toBe('')
    await vi.waitFor(() => {
      expect(element.scrollTop).toBe(
        element.scrollHeight - element.clientHeight,
      )
    })
    wrapper.unmount()
    rect.mockRestore()
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
