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
    clientHeight: { configurable: true, value: 300 },
    clientWidth: { configurable: true, value: 290 },
    offsetHeight: { configurable: true, value: 310 },
    offsetWidth: { configurable: true, value: 300 },
    scrollWidth: { configurable: true, value: 600 },
    scrollHeight: {
      configurable: true,
      get: () => virtualizer.totalSize.value,
    },
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
  const press = (x = 395, y = 100) => {
    const event = new MouseEvent('mousedown', {
      button: 0,
      cancelable: true,
      clientX: x,
      clientY: y,
    })
    element.dispatchEvent(event)
    return event
  }
  const pressVerticalThumb = () => {
    const trackSize = element.clientHeight
    const maxScroll = element.scrollHeight - trackSize
    const thumbSize = Math.min(
      trackSize,
      Math.max(20, (trackSize * trackSize) / element.scrollHeight),
    )
    const travel = trackSize - thumbSize
    const thumbStart = maxScroll ? (element.scrollTop / maxScroll) * travel : 0
    return press(395, 50 + thumbStart + thumbSize / 2)
  }
  const release = () => window.dispatchEvent(new MouseEvent('mouseup'))
  const measure = (index: number, size: number) =>
    virtualizer.resizeItems([{ index, key: index, size }])
  return {
    element,
    virtualizer,
    dragging,
    press,
    pressVerticalThumb,
    release,
    measure,
    wrapper,
  }
}

describe('Native virtual scrollbar dragging', () => {
  it('jumps directly to a clicked vertical track position', async () => {
    const { element, virtualizer, dragging, press } = await setup()
    const event = press(395, 200)
    const thumbSize = 20
    const travel = element.clientHeight - thumbSize
    const expected =
      ((200 - 50 - thumbSize / 2) / travel) *
      (element.scrollHeight - element.clientHeight)

    expect(event.defaultPrevented).toBe(true)
    expect(dragging.value).toBe(false)
    expect(element.scrollTop).toBeCloseTo(expected, 6)
    virtualizer.handleScroll(element)
    await vi.waitFor(() =>
      expect(virtualizer.scrollOffset.value).toBeCloseTo(expected, 6),
    )
  })

  it('jumps directly to a clicked horizontal track position', async () => {
    const { element, dragging, press } = await setup()
    const event = press(300, 355)
    const trackSize = element.clientWidth
    const thumbSize = (trackSize * trackSize) / element.scrollWidth
    const travel = trackSize - thumbSize
    const expected =
      ((300 - 100 - thumbSize / 2) / travel) *
      (element.scrollWidth - element.clientWidth)

    expect(event.defaultPrevented).toBe(true)
    expect(dragging.value).toBe(false)
    expect(element.scrollLeft).toBeCloseTo(expected, 6)
  })

  it('maps both axes within an inset track and ignores its rounded-end space', async () => {
    const { element, dragging, press } = await setup()
    const inset = 4
    element.style.setProperty('--s-vl-scrollbar-track-inset', `${inset}px`)

    const vertical = press(395, 200)
    const verticalTrack = element.clientHeight - inset * 2
    const verticalThumb = 20
    const verticalTravel = verticalTrack - verticalThumb
    const expectedTop =
      ((200 - 50 - inset - verticalThumb / 2) / verticalTravel) *
      (element.scrollHeight - element.clientHeight)
    expect(vertical.defaultPrevented).toBe(true)
    expect(element.scrollTop).toBeCloseTo(expectedTop, 6)

    const horizontal = press(300, 355)
    const horizontalTrack = element.clientWidth - inset * 2
    const horizontalThumb =
      (horizontalTrack * element.clientWidth) / element.scrollWidth
    const horizontalTravel = horizontalTrack - horizontalThumb
    const expectedLeft =
      ((300 - 100 - inset - horizontalThumb / 2) / horizontalTravel) *
      (element.scrollWidth - element.clientWidth)
    expect(horizontal.defaultPrevented).toBe(true)
    expect(element.scrollLeft).toBeCloseTo(expectedLeft, 6)
    expect(dragging.value).toBe(false)

    element.scrollTop = 0
    const roundedEnd = press(395, 52)
    expect(roundedEnd.defaultPrevented).toBe(false)
    expect(element.scrollTop).toBe(0)
  })

  it('recognizes a styled overlay scrollbar without a layout gutter', async () => {
    const { element, dragging, press } = await setup()
    Object.defineProperties(element, {
      clientWidth: { configurable: true, value: 300 },
      offsetHeight: { configurable: true, value: 300 },
    })
    const event = press(398, 200)

    expect(event.defaultPrevented).toBe(true)
    expect(dragging.value).toBe(false)
    expect(element.scrollTop).toBeGreaterThan(0)
  })

  it('keeps measuring rows without writing scrollTop until the thumb is released', async () => {
    const {
      element,
      virtualizer,
      dragging,
      pressVerticalThumb,
      release,
      measure,
    } = await setup()
    element.scrollTop = 24_000
    virtualizer.measureViewport()
    const write = vi.spyOn(element, 'scrollTop', 'set')
    pressVerticalThumb()
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
    const { element, virtualizer, pressVerticalThumb, release, measure } =
      await setup()
    element.scrollTop = 24_000
    virtualizer.measureViewport()
    const write = vi.spyOn(element, 'scrollTop', 'set')
    measure(499, 82)
    pressVerticalThumb()
    release()
    await nextTick()
    expect(write).not.toHaveBeenCalled()
    expect(virtualizer.totalSize.value).toBe(480_034)
  })

  it('does not pin the end during a drag or carry that pin into an upward scroll', async () => {
    const { element, virtualizer, pressVerticalThumb, release, measure } =
      await setup()
    element.scrollTop = element.scrollHeight - element.clientHeight
    virtualizer.measureViewport()
    const write = vi.spyOn(element, 'scrollTop', 'set')
    pressVerticalThumb()
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
    const { element, dragging, press, pressVerticalThumb, release, wrapper } =
      await setup()
    press(150, 100)
    expect(dragging.value).toBe(false)
    // Horizontal scrollbar also triggers dynamic row measurements.
    press(150, 355)
    expect(dragging.value).toBe(true)
    release()
    expect(dragging.value).toBe(false)
    pressVerticalThumb()
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
    press(110, 70)
    expect(dragging.value).toBe(true)
    wrapper.unmount()
    expect(dragging.value).toBe(false)
    press(110, 100)
    expect(dragging.value).toBe(false)
  })
})
