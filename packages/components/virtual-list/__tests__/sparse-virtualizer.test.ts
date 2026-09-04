import { computed, defineComponent, h, nextTick, shallowRef } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import {
  MAX_PHYSICAL_ROW_HEIGHT,
  useSparseVirtualizer,
} from '../src/use-sparse-virtualizer'

function fixture(count = 1_000_000) {
  const element = document.createElement('div')
  const dragging = shallowRef(false)
  let virtualizer!: ReturnType<typeof useSparseVirtualizer>
  let top = 0
  const write = vi.fn((value: number) => {
    top =
      Math.round(
        Math.max(0, Math.min(value, element.scrollHeight - 320)) * 64,
      ) / 64
  })
  Object.defineProperties(element, {
    scrollTop: { get: () => top, set: write },
    clientHeight: { value: 320 },
    scrollHeight: { get: () => virtualizer?.physicalSize.value ?? 0 },
    scrollTo: {
      value: vi.fn((options: ScrollToOptions) => {
        element.scrollTop = Math.max(
          0,
          Math.min(options.top ?? 0, element.scrollHeight - 320),
        )
      }),
    },
  })
  const wrapper = mount(
    defineComponent({
      setup() {
        virtualizer = useSparseVirtualizer({
          enabled: computed(() => true),
          count: computed(() => count),
          estimateSize: computed(() => 64),
          overscan: computed(() => 3),
          retainMaxSize: computed(() => true),
          scrollbarDragging: dragging,
          scrollElement: shallowRef(element),
          getItemKey: (index) => index,
          onRangeChange: () => {},
        })
        return () => h('div')
      },
    }),
  )
  return { wrapper, element, dragging, virtualizer, write }
}

describe('compressed sparse row coordinates', () => {
  it('reaches the millionth row without exceeding native layout height', async () => {
    const { wrapper, element, virtualizer: s } = fixture()
    await nextTick()
    s.scrollToIndex(999_999, 'end')
    expect(s.totalSize.value).toBe(64_000_000)
    expect(element.scrollHeight).toBe(MAX_PHYSICAL_ROW_HEIGHT)
    expect(element.scrollTop).toBe(MAX_PHYSICAL_ROW_HEIGHT - 320)
    expect(s.virtualItems.value[s.virtualItems.value.length - 1]?.index).toBe(
      999_999,
    )
    expect(s.virtualItems.value.length).toBeLessThan(15)
    const last = s.virtualItems.value[s.virtualItems.value.length - 1]!
    expect(last.end - s.scrollOffset.value + s.physicalOffset.value).toBe(
      MAX_PHYSICAL_ROW_HEIGHT,
    )
    wrapper.unmount()
  })

  it('maps native thumb movement and preserves precise programmatic offsets', async () => {
    const { wrapper, element, virtualizer: s } = fixture()
    await nextTick()
    s.scrollToIndex(500_000, 'start')
    expect(s.scrollOffset.value).toBe(32_000_000)
    s.handleScroll(element)
    await vi.waitFor(() => expect(s.scrollOffset.value).toBe(32_000_000))
    element.scrollTop = (MAX_PHYSICAL_ROW_HEIGHT - 320) / 4
    s.handleScroll(element)
    await vi.waitFor(() =>
      expect(s.scrollOffset.value).toBe((64_000_000 - 320) / 4),
    )
    expect(s.virtualItems.value.some((item) => item.index === 249_999)).toBe(
      true,
    )
    wrapper.unmount()
  })

  it('anchors dynamic height changes in logical pixels and leaves active thumb drags alone', async () => {
    const { wrapper, element, dragging, virtualizer: s, write } = fixture()
    await nextTick()
    s.scrollToIndex(500_000, 'start')
    s.resizeItems([{ index: 0, key: 0, size: 128 }])
    await nextTick()
    expect(s.scrollOffset.value).toBe(32_000_064)
    expect(
      s.virtualItems.value.find((item) => item.index === 500_000)?.start,
    ).toBe(32_000_064)
    dragging.value = true
    const calls = write.mock.calls.length
    const top = element.scrollTop
    s.resizeItems([{ index: 0, key: 0, size: 256 }])
    await nextTick()
    expect(element.scrollTop).toBe(top)
    expect(write.mock.calls.length).toBe(calls)
    dragging.value = false
    s.scrollToIndex(999_999, 'end')
    expect(s.virtualItems.value[s.virtualItems.value.length - 1]?.index).toBe(
      999_999,
    )
    s.resetMeasurements()
    expect(s.measuredSizeCache.size).toBe(0)
    expect(s.totalSize.value).toBe(64_000_000)
    wrapper.unmount()
  })

  it('keeps small-list offsets and height unchanged', async () => {
    const { wrapper, element, virtualizer: s } = fixture(10_000)
    await nextTick()
    s.scrollToIndex(100, 'start')
    expect(s.compressed.value).toBe(false)
    expect(element.scrollTop).toBe(6400)
    expect(s.physicalSize.value).toBe(s.totalSize.value)
    wrapper.unmount()
  })

  it('does not replay a scheduled end adjustment after unmount', async () => {
    const { wrapper, virtualizer: s, write } = fixture()
    await nextTick()
    vi.useFakeTimers()
    try {
      s.scrollToIndex(999_999, 'end')
      s.resizeItems([{ index: 999_999, key: 999_999, size: 128 }])
      await nextTick()
      wrapper.unmount()
      const calls = write.mock.calls.length
      vi.runAllTimers()
      expect(write.mock.calls.length).toBe(calls)
    } finally {
      vi.useRealTimers()
    }
  })
})
