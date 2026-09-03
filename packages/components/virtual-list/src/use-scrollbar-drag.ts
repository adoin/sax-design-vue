import { onBeforeUnmount, shallowRef, watch } from 'vue'
import type { Ref } from 'vue'

/** Track the native scrollbar without taking over its pointer handling. */
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
    const vertical =
      element.scrollHeight > element.clientHeight &&
      (x < element.clientLeft || x >= element.clientLeft + element.clientWidth)
    const horizontal =
      element.scrollWidth > element.clientWidth &&
      y >= element.clientTop + element.clientHeight
    if (!vertical && !horizontal) return

    stop()
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
