import {
  computed,
  onActivated,
  onBeforeUnmount,
  onDeactivated,
  onMounted,
  shallowRef,
  toValue,
} from 'vue'
import type { MaybeRefOrGetter, Ref } from 'vue'

/** CSS owns the timeline; Vue only changes playback when visibility changes. */
export const useEmptyMotion = (
  element: Readonly<Ref<SVGSVGElement | null>>,
  enabled: MaybeRefOrGetter<boolean>,
) => {
  const inView = shallowRef(false)
  const pageVisible = shallowRef(false)
  const activated = shallowRef(true)
  let observer: IntersectionObserver | undefined
  let owner: Document | undefined
  const syncVisibility = () => {
    pageVisible.value = owner?.visibilityState !== 'hidden'
  }
  onMounted(() => {
    if (!element.value) return
    owner = element.value.ownerDocument
    syncVisibility()
    owner.addEventListener('visibilitychange', syncVisibility)
    if (typeof IntersectionObserver === 'undefined') inView.value = true
    else {
      observer = new IntersectionObserver((entries) => {
        inView.value = entries.some((entry) => entry.isIntersecting)
      })
      observer.observe(element.value)
    }
  })
  onActivated(() => {
    activated.value = true
    syncVisibility()
  })
  onDeactivated(() => {
    activated.value = false
  })
  onBeforeUnmount(() => {
    observer?.disconnect()
    owner?.removeEventListener('visibilitychange', syncVisibility)
  })
  return computed(
    () =>
      toValue(enabled) && inView.value && pageVisible.value && activated.value,
  )
}
