import { shallowRef } from 'vue'
import { useId } from '@vuesax-alpha/hooks'

/** Own one mutable filter/timeline for this surface, including retained globals. */
export const useDialogDissolve = () => {
  const filterId = `sax-dialog-dissolve-${useId().value}`
  const dissolved = shallowRef(false)
  let target: HTMLElement | undefined
  let previousFilter = ''
  let previousInert = false
  let finish: (() => void) | undefined
  const cancel = () => {
    if (target) {
      target.style.filter = previousFilter
      target.inert = previousInert
      target = undefined
    }
    dissolved.value = false
    finish?.()
    finish = undefined
  }
  const settled = (value: boolean) => {
    if (!value) return
    finish?.()
    finish = undefined
  }
  const play = async (element: HTMLElement | null | undefined) => {
    cancel()
    if (!element || element.ownerDocument.hidden) return
    target = element
    previousFilter = element.style.filter
    previousInert = element.inert
    element.inert = true
    element.style.filter = `url("#${filterId}")`
    const completed = new Promise<void>((resolve) => {
      finish = resolve
    })
    dissolved.value = true
    await completed
    // Leave the zero-alpha filter installed until removal or cancellation.
  }
  return { filterId, dissolved, play, cancel, settled }
}
