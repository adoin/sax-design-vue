import {
  computed,
  onActivated,
  onDeactivated,
  shallowRef,
  toValue,
  watch,
} from 'vue'
import type { MaybeRefOrGetter, Ref } from 'vue'

/** CSS owns the timeline; only active, visible progress needs browser listeners. */
export const useProgressMotion = (
  element: Readonly<Ref<HTMLElement | null>>,
  enabled: MaybeRefOrGetter<boolean>,
) => {
  const inView = shallowRef(false)
  const pageVisible = shallowRef(false)
  const reducedMotion = shallowRef(false)
  const activated = shallowRef(true)
  onActivated(() => {
    activated.value = true
  })
  onDeactivated(() => {
    activated.value = false
  })
  watch(
    [element, () => toValue(enabled), activated],
    ([root, active, isActivated], _old, cleanup) => {
      inView.value = false
      reducedMotion.value = false
      if (!root || !active || !isActivated) return
      const owner = root.ownerDocument
      const preference = owner.defaultView?.matchMedia?.(
        '(prefers-reduced-motion: reduce)',
      )
      const syncPage = () => {
        pageVisible.value = !owner.hidden
      }
      const syncPreference = () => {
        reducedMotion.value = preference?.matches ?? false
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
        observer.observe(root)
      }
      cleanup(() => {
        observer?.disconnect()
        owner.removeEventListener('visibilitychange', syncPage)
        preference?.removeEventListener('change', syncPreference)
      })
    },
    { flush: 'post' },
  )
  return {
    playing: computed(
      () =>
        toValue(enabled) &&
        activated.value &&
        inView.value &&
        pageVisible.value &&
        !reducedMotion.value,
    ),
    reducedMotion,
  }
}
