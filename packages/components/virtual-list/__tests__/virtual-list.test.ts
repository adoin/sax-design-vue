import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import VirtualList from '../src/virtual-list.vue'

const settle = async () => {
  await nextTick()
  await Promise.resolve()
  await nextTick()
}

describe('VirtualList', () => {
  afterEach(() => vi.restoreAllMocks())

  it.each([40, 400, 10000])(
    'windows and locates fixed-height arrays of %i rows',
    async (count) => {
      const wrapper = mount(VirtualList, {
        props: {
          items: Array.from({ length: count }, (_, id) => ({ id })),
          estimateSize: 40,
          dynamic: false,
          overscan: 3,
        },
      })
      await settle()
      const element = wrapper.vm.getScrollElement()!
      Object.defineProperty(element, 'clientHeight', { value: 200 })
      wrapper.vm.measure()
      wrapper.vm.scrollToIndex(count - 10, 'start')
      await settle()
      expect(element.scrollTop).toBe((count - 10) * 40)
      expect(wrapper.vm.getVisibleRange()?.start).toBe(count - 10)
      expect(wrapper.findAll('.s-vl__item').length).toBeLessThan(20)
      wrapper.vm.scrollBy(-80)
      expect(element.scrollTop).toBe((count - 12) * 40)
      wrapper.vm.scrollBy(Number.NaN)
      expect(element.scrollTop).toBe((count - 12) * 40)
      wrapper.unmount()
    },
  )

  it('measures small dynamic lists and resets retained heights', async () => {
    let height = 72
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
      () => ({ height }) as DOMRect,
    )
    const wrapper = mount(VirtualList, {
      props: {
        items: Array.from({ length: 400 }, (_, id) => ({ id })),
        dynamic: true,
        retainMaxSize: true,
        estimateSize: 40,
        itemKey: (item: unknown) => (item as { id: number }).id,
      },
    })
    await settle()
    expect(wrapper.findAll('.s-vl__item')[1].attributes('style')).toContain(
      '--s-vl-item-start: 72px',
    )
    height = 44
    wrapper.vm.measureVisible()
    await settle()
    expect(wrapper.findAll('.s-vl__item')[1].attributes('style')).toContain(
      '--s-vl-item-start: 72px',
    )
    await wrapper.vm.resetMeasurements()
    await settle()
    expect(wrapper.findAll('.s-vl__item')[1].attributes('style')).toContain(
      '--s-vl-item-start: 44px',
    )
    await wrapper.setProps({ dynamic: false })
    await settle()
    expect(wrapper.findAll('.s-vl__item')[1].attributes('style')).toContain(
      '--s-vl-item-start: 40px',
    )
    wrapper.unmount()
  })

  it('replaces equal-length data without retaining stale row heights', async () => {
    let height = 72
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
      () => ({ height }) as DOMRect,
    )
    const wrapper = mount(VirtualList, {
      props: {
        items: ['a', 'b', 'c'],
        dynamic: true,
        estimateSize: 40,
        itemKey: (item: unknown) => String(item),
      },
    })
    await settle()
    height = 36
    await wrapper.setProps({ items: ['c', 'b', 'a'] })
    await settle()
    expect(wrapper.findAll('.s-vl__item')[1].attributes('style')).toContain(
      '--s-vl-item-start: 36px',
    )
    await wrapper.setProps({ items: [] })
    expect(wrapper.findAll('.s-vl__item')).toHaveLength(0)
    await wrapper.setProps({ items: ['z'] })
    await settle()
    expect(wrapper.findAll('.s-vl__item')).toHaveLength(1)
    wrapper.unmount()
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
        default: ({ item }) => (item as { id: string }).id,
      },
    })

    expect(wrapper.text()).toContain('row-0')
    expect(itemAt.mock.calls.length).toBeLessThan(20)
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
    element.scrollTo = vi.fn(
      (options?: ScrollToOptions | number, y?: number) => {
        element.scrollTop =
          typeof options === 'number' ? (y ?? 0) : (options?.top ?? 0)
      },
    )
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

  it('discards queued measurements when a source index belongs to a new key', async () => {
    let prefix = 'old'
    let height = 72
    const rect = vi
      .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
      .mockImplementation(() => ({ height }) as DOMRect)
    const keyAt = (index: number) => `${prefix}:${index}`
    const wrapper = mount(VirtualList, {
      props: {
        count: 100_000,
        itemAt: (index: number) => index,
        itemKeyAt: keyAt,
        estimateSize: 38,
        dynamic: true,
        retainMaxSize: true,
      },
    })
    await nextTick()
    await Promise.resolve()
    await nextTick()
    const queued: VoidFunction[] = []
    const microtask = vi
      .spyOn(globalThis, 'queueMicrotask')
      .mockImplementation((callback) => queued.push(callback))
    try {
      height = 120
      wrapper.vm.measureVisible()
      expect(queued).toHaveLength(1)
      // The source changes before Vue replaces the old measured elements.
      prefix = 'new'
      queued.shift()!()
      microtask.mockRestore()
      height = 44
      await wrapper.setProps({ itemKeyAt: (index: number) => keyAt(index) })
      await Promise.resolve()
      await nextTick()
      expect(wrapper.findAll('.s-vl__item')[1].attributes('style')).toContain(
        '--s-vl-item-start: 44px',
      )
    } finally {
      microtask.mockRestore()
      wrapper.unmount()
      rect.mockRestore()
    }
  })

  it('exposes the mounted half-open item range including overscan', async () => {
    const wrapper = mount(VirtualList, {
      props: {
        count: 1_000_000,
        estimateSize: 44,
        height: 280,
        overscan: 6,
        dynamic: false,
        itemAt: (index: number) => ({ id: index }),
      },
    })
    await nextTick()
    const range = wrapper.vm.getItemRange()
    expect(range).toEqual({
      start: expect.any(Number),
      end: expect.any(Number),
    })
    expect(range!.end).toBeGreaterThan(range!.start)
    expect(range!.end).toBeGreaterThan(3)
    expect(range!.end - range!.start).toBeLessThan(40)
    wrapper.unmount()
  })
})
