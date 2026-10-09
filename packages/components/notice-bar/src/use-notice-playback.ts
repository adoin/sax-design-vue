import {
  computed,
  onActivated,
  onDeactivated,
  shallowRef,
  toValue,
  watch,
} from 'vue'
import type { MaybeRefOrGetter, Ref } from 'vue'

export const useNoticePlayback = (
  root: Readonly<Ref<HTMLElement | null>>,
  manualPause: MaybeRefOrGetter<boolean>,
  preferenceOverride: MaybeRefOrGetter<boolean | undefined>,
) => {
  const inView = shallowRef(false)
  const pageVisible = shallowRef(false)
  const reduced = shallowRef(false)
  const active = shallowRef(true)
  onActivated(() => {
    active.value = true
  })
  onDeactivated(() => {
    active.value = false
  })
  watch(
    root,
    (element, _previous, cleanup) => {
      inView.value = false
      if (!element) return
      const owner = element.ownerDocument
      const preference = owner.defaultView?.matchMedia?.(
        '(prefers-reduced-motion: reduce)',
      )
      const syncPage = () => {
        pageVisible.value = !owner.hidden
      }
      const syncPreference = () => {
        reduced.value = preference?.matches ?? false
      }
      syncPage()
      syncPreference()
      owner.addEventListener('visibilitychange', syncPage)
      preference?.addEventListener('change', syncPreference)
      let observer: IntersectionObserver | undefined
      if (typeof IntersectionObserver === 'undefined') inView.value = true
      else {
        observer = new IntersectionObserver((entries) => {
          inView.value = entries.some((entry) => entry.isIntersecting)
        })
        observer.observe(element)
      }
      cleanup(() => {
        observer?.disconnect()
        owner.removeEventListener('visibilitychange', syncPage)
        preference?.removeEventListener('change', syncPreference)
      })
    },
    { flush: 'post' },
  )
  const reducedMotion = computed(
    () => toValue(preferenceOverride) ?? reduced.value,
  )
  return {
    reducedMotion,
    paused: computed(
      () =>
        !active.value ||
        !root.value ||
        !inView.value ||
        !pageVisible.value ||
        reducedMotion.value ||
        toValue(manualPause),
    ),
  }
}
