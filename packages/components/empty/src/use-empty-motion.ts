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

/** Browser timelines own playback; Vue only handles visibility and preferences. */
export const useEmptyMotion = (
  element: Readonly<Ref<SVGSVGElement | null>>,
  enabled: MaybeRefOrGetter<boolean>,
) => {
  const inView = shallowRef(false)
  const pageVisible = shallowRef(false)
  const activated = shallowRef(true)
  const reducedMotion = shallowRef(false)
  let observer: IntersectionObserver | undefined
  let owner: Document | undefined
  let preference: MediaQueryList | undefined
  const syncPreference = () => {
    reducedMotion.value = preference?.matches ?? false
  }
  const syncVisibility = () => {
    pageVisible.value = owner?.visibilityState !== 'hidden'
  }
  onMounted(() => {
    if (!element.value) return
    owner = element.value.ownerDocument
    preference = owner.defaultView?.matchMedia?.(
      '(prefers-reduced-motion: reduce)',
    )
    syncPreference()
    preference?.addEventListener('change', syncPreference)
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
    preference?.removeEventListener('change', syncPreference)
  })
  const playing = computed(
    () =>
      toValue(enabled) &&
      !reducedMotion.value &&
      inView.value &&
      pageVisible.value &&
      activated.value,
  )
  return { playing, reducedMotion }
}
