import { nextTick, shallowRef } from 'vue'
import { useId } from '../use-id'

/** Own one mutable filter/timeline for this surface, including retained globals. */
export const useSurfaceDissolve = (
  duration: () => number,
  idPrefix = 'sax-surface-dissolve',
) => {
  const filterId = `${idPrefix}-${useId().value}`
  const dissolved = shallowRef(false)
  const active = shallowRef(false)
  let target: HTMLElement | undefined
  let previousFilter = ''
  let previousInert = false
  let previousOpacity = ''
  let version = 0
  let finish: (() => void) | undefined
  const cancel = () => {
    version++
    if (target) {
      target.style.filter = previousFilter
      target.inert = previousInert
      target.style.opacity = previousOpacity
      target = undefined
    }
    dissolved.value = false
    active.value = false
    finish?.()
    finish = undefined
  }
  const settled = (value: boolean) => {
    if (!value) return
    // Preserve the transparent end state while removing the filter graph.
    if (target) {
      target.style.opacity = '0'
      target.style.filter = previousFilter
    }
    active.value = false
    finish?.()
    finish = undefined
  }
  const play = async (element: HTMLElement | null | undefined) => {
    cancel()
    if (
      !element ||
      element.ownerDocument.hidden ||
      duration() === 0 ||
      element.ownerDocument.defaultView?.matchMedia?.(
        '(prefers-reduced-motion: reduce)',
      ).matches
    )
      return
    const run = version
    target = element
    previousFilter = element.style.filter
    previousInert = element.inert
    previousOpacity = element.style.opacity
    element.inert = true
    const completed = new Promise<void>((resolve) => {
      finish = resolve
    })
    active.value = true
    await nextTick()
    if (run !== version || !target) return
    element.style.filter = `url("#${filterId}")`
    dissolved.value = true
    await completed
  }
  return { filterId, dissolved, active, play, cancel, settled }
}
