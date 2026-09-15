import { onBeforeUnmount, shallowRef, watch } from 'vue'
import type { Ref } from 'vue'

const MIN_THUMB_SIZE = 20
const OVERLAY_SCROLLBAR_HIT_SIZE = 6
const TRACK_INSET_PROPERTY = '--s-vl-scrollbar-track-inset'

interface ScrollbarAxis {
  clientSize: 'clientHeight' | 'clientWidth'
  position: number
  scrollPosition: 'scrollLeft' | 'scrollTop'
  scrollSize: 'scrollHeight' | 'scrollWidth'
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

const trackInset = (element: HTMLElement, clientSize: number) => {
  const view = element.ownerDocument.defaultView
  const value = Number.parseFloat(
    view?.getComputedStyle(element).getPropertyValue(TRACK_INSET_PROPERTY) ??
      '',
  )
  return clamp(Number.isFinite(value) ? value : 0, 0, clientSize / 2)
}

const thumbGeometry = (element: HTMLElement, axis: ScrollbarAxis) => {
  const viewportSize = element[axis.clientSize]
  const inset = trackInset(element, viewportSize)
  const trackSize = Math.max(0, viewportSize - inset * 2)
  const scrollSize = element[axis.scrollSize]
  const maxScroll = Math.max(0, scrollSize - viewportSize)
  const thumbSize = Math.min(
    trackSize,
    Math.max(MIN_THUMB_SIZE, (trackSize * viewportSize) / scrollSize),
  )
  const travel = Math.max(0, trackSize - thumbSize)
  const start =
    inset +
    (maxScroll ? (element[axis.scrollPosition] / maxScroll) * travel : 0)
  return {
    maxScroll,
    start,
    thumbSize,
    trackEnd: inset + trackSize,
    trackStart: inset,
    travel,
  }
}

/** Preserve native thumb dragging while adding direct native-track navigation. */
export const useScrollbarDrag = (
  scrollElement: Ref<HTMLElement | null>,
  onEnd?: (atEnd: boolean) => void,
) => {
  const dragging = shallowRef(false)
  let releaseTarget: Window | null = null

  const stop = () => {
    releaseTarget?.removeEventListener('mouseup', stop, true)
    releaseTarget?.removeEventListener('blur', stop)
    releaseTarget = null
    const element = scrollElement.value
    if (dragging.value)
      onEnd?.(
        element != null &&
          element.scrollHeight - element.clientHeight - element.scrollTop <= 2,
      )
    dragging.value = false
  }

  const start = (event: MouseEvent) => {
    const element = scrollElement.value
    if (!element || event.button !== 0 || event.target !== element) return

    const rect = element.getBoundingClientRect()
    const scaleX = rect.width / element.offsetWidth || 1
    const scaleY = rect.height / element.offsetHeight || 1
    const x = (event.clientX - rect.left) / scaleX
    const y = (event.clientY - rect.top) / scaleY
    const rightGutter =
      element.offsetWidth - element.clientLeft - element.clientWidth
    const bottomGutter =
      element.offsetHeight - element.clientTop - element.clientHeight
    const vertical =
      element.scrollHeight > element.clientHeight &&
      (x < element.clientLeft ||
        x >= element.clientLeft + element.clientWidth ||
        (rightGutter <= 0 &&
          x >= element.offsetWidth - OVERLAY_SCROLLBAR_HIT_SIZE))
    const horizontal =
      element.scrollWidth > element.clientWidth &&
      (y >= element.clientTop + element.clientHeight ||
        (bottomGutter <= 0 &&
          y >= element.offsetHeight - OVERLAY_SCROLLBAR_HIT_SIZE))
    if (!vertical && !horizontal) return
    // The bottom corner belongs to neither axis.
    if (vertical && horizontal) return

    const axis: ScrollbarAxis = vertical
      ? {
          clientSize: 'clientHeight',
          position: y - element.clientTop,
          scrollPosition: 'scrollTop',
          scrollSize: 'scrollHeight',
        }
      : {
          clientSize: 'clientWidth',
          position: x - element.clientLeft,
          scrollPosition: 'scrollLeft',
          scrollSize: 'scrollWidth',
        }
    const geometry = thumbGeometry(element, axis)
    if (
      axis.position < geometry.trackStart ||
      axis.position > geometry.trackEnd
    )
      return
    const pressesThumb =
      axis.position >= geometry.start &&
      axis.position <= geometry.start + geometry.thumbSize

    stop()
    if (!pressesThumb) {
      // Native track clicks page by one viewport and may be cancelled by the
      // virtualizer's drag lock. Map the click to the complete track instead.
      event.preventDefault()
      const thumbStart = clamp(
        axis.position - geometry.thumbSize / 2,
        geometry.trackStart,
        geometry.trackStart + geometry.travel,
      )
      element[axis.scrollPosition] = geometry.travel
        ? ((thumbStart - geometry.trackStart) / geometry.travel) *
          geometry.maxScroll
        : 0
      return
    }

    dragging.value = true
    releaseTarget = element.ownerDocument.defaultView
    releaseTarget?.addEventListener('mouseup', stop, true)
    releaseTarget?.addEventListener('blur', stop)
  }

  watch(
    scrollElement,
    (element, previous) => {
      stop()
      previous?.removeEventListener('mousedown', start)
      element?.addEventListener('mousedown', start)
    },
    { immediate: true, flush: 'post' },
  )

  onBeforeUnmount(() => {
    stop()
    scrollElement.value?.removeEventListener('mousedown', start)
  })

  return dragging
}
