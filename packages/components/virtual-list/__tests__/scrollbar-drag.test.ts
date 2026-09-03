import { computed, defineComponent, h, nextTick, shallowRef } from 'vue'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useScrollbarDrag } from '../src/use-scrollbar-drag'
import { useSparseVirtualizer } from '../src/use-sparse-virtualizer'

const cleanups: (() => void)[] = []
afterEach(() => {
  cleanups.splice(0).forEach((cleanup) => cleanup())
  vi.restoreAllMocks()
})

const setup = async () => {
  const element = document.createElement('div')
  let virtualizer!: ReturnType<typeof useSparseVirtualizer>
  let dragging!: ReturnType<typeof useScrollbarDrag>
  Object.defineProperties(element, {
    clientHeight: { value: 300 },
    clientWidth: { value: 290 },
    offsetHeight: { value: 310 },
    offsetWidth: { value: 300 },
    scrollWidth: { value: 600 },
    scrollHeight: { get: () => virtualizer.totalSize.value },
  })
  vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
    left: 100,
    top: 50,
    width: 300,
    height: 310,
  } as DOMRect)
  const wrapper = mount(
    defineComponent({
      setup() {
        const scrollElement = shallowRef(element)
        dragging = useScrollbarDrag(scrollElement)
        virtualizer = useSparseVirtualizer({
          enabled: computed(() => true),
          count: computed(() => 10_000),
          estimateSize: computed(() => 48),
          overscan: computed(() => 8),
          retainMaxSize: computed(() => true),
          scrollElement,
          scrollbarDragging: dragging,
          getItemKey: (index) => index,
          onRangeChange: vi.fn(),
        })
        return () => h('div')
      },
    }),
  )
  cleanups.push(() => wrapper.unmount())
  await nextTick()
  const press = (x = 395, y = 100) =>
    element.dispatchEvent(
      new MouseEvent('mousedown', { button: 0, clientX: x, clientY: y }),
    )
  const release = () => window.dispatchEvent(new MouseEvent('mouseup'))
  const measure = (index: number, size: number) =>
    virtualizer.resizeItems([{ index, key: index, size }])
  return { element, virtualizer, dragging, press, release, measure, wrapper }
}

describe('Native virtual scrollbar dragging', () => {
  it('keeps measuring rows without writing scrollTop until the thumb is released', async () => {
    const { element, virtualizer, dragging, press, release, measure } =
      await setup()
    element.scrollTop = 24_000
    virtualizer.measureViewport()
    const write = vi.spyOn(element, 'scrollTop', 'set')
    press()
    expect(dragging.value).toBe(true)

    measure(499, 82)
    await nextTick()
    expect(virtualizer.totalSize.value).toBe(480_034)
    expect(write).not.toHaveBeenCalled()

    // A later native scroll event must not replay an old anchor adjustment.
    element.scrollTop = 48_000
    virtualizer.handleScroll(element)
    write.mockClear()
    measure(999, 96)
    await nextTick()
    expect(virtualizer.totalSize.value).toBe(480_082)
    expect(write).not.toHaveBeenCalled()

    release()
    expect(dragging.value).toBe(false)
    await nextTick()
    expect(write).not.toHaveBeenCalled()

    measure(999, 108)
    await nextTick()
    expect(element.scrollTop).toBe(48_012)
    expect(write).toHaveBeenCalledTimes(1)
  })

  it('discards a queued correction when a native drag starts before the render flush', async () => {
    const { element, virtualizer, press, release, measure } = await setup()
    element.scrollTop = 24_000
    virtualizer.measureViewport()
    const write = vi.spyOn(element, 'scrollTop', 'set')
    measure(499, 82)
    press()
    release()
    await nextTick()
    expect(write).not.toHaveBeenCalled()
    expect(virtualizer.totalSize.value).toBe(480_034)
  })

  it('does not pin the end during a drag or carry that pin into an upward scroll', async () => {
    const { element, virtualizer, press, release, measure } = await setup()
    element.scrollTop = element.scrollHeight - element.clientHeight
    virtualizer.measureViewport()
    const write = vi.spyOn(element, 'scrollTop', 'set')
    press()
    measure(9999, 96)
    await nextTick()
    expect(write).not.toHaveBeenCalled()
    release()
    element.scrollTop = 1000
    measure(10, 60)
    await nextTick()
    expect(element.scrollTop).toBe(1012)
  })

  it('only tracks scrollbar presses and cleans up after release outside, blur and unmount', async () => {
    const { element, dragging, press, release, wrapper } = await setup()
    press(150, 100)
    expect(dragging.value).toBe(false)
    // Horizontal scrollbar also triggers dynamic row measurements.
    press(150, 355)
    expect(dragging.value).toBe(true)
    release()
    expect(dragging.value).toBe(false)
    press()
    window.dispatchEvent(new Event('blur'))
    expect(dragging.value).toBe(false)

    // Left-hand scrollbar and a CSS-scaled viewport use client geometry.
    Object.defineProperty(element, 'clientLeft', { value: 10 })
    vi.mocked(element.getBoundingClientRect).mockReturnValue({
      left: 100,
      top: 50,
      width: 600,
      height: 620,
    } as DOMRect)
    press(110, 100)
    expect(dragging.value).toBe(true)
    wrapper.unmount()
    expect(dragging.value).toBe(false)
    press(110, 100)
    expect(dragging.value).toBe(false)
  })
})
