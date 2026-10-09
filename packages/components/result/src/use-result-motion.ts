import { computed, onActivated, onDeactivated, shallowRef, watch } from 'vue'
import type { Ref } from 'vue'

export const useResultMotion = (
  scene: Readonly<Ref<SVGSVGElement | null>>,
  enabled: () => boolean,
) => {
  const started = shallowRef(false)
  const completed = shallowRef(false)
  const inView = shallowRef(false)
  const visible = shallowRef(false)
  const reduced = shallowRef(false)
  const active = shallowRef(true)
  onActivated(() => {
    active.value = true
  })
  onDeactivated(() => {
    active.value = false
  })
  watch(
    () => enabled(),
    () => {
      started.value = false
      completed.value = false
    },
  )
  watch(
    [scene, enabled, completed, active],
    ([element, animated, finished, activated], _old, cleanup) => {
      inView.value = false
      if (!element || !animated || finished || !activated) return
      const owner = element.ownerDocument
      const preference = owner.defaultView?.matchMedia?.(
        '(prefers-reduced-motion: reduce)',
      )
      const sync = () => {
        visible.value = !owner.hidden
        reduced.value = preference?.matches ?? false
      }
      sync()
      owner.addEventListener('visibilitychange', sync)
      preference?.addEventListener('change', sync)
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
        owner.removeEventListener('visibilitychange', sync)
        preference?.removeEventListener('change', sync)
      })
    },
    { flush: 'post' },
  )
  const playing = computed(
    () =>
      enabled() &&
      !completed.value &&
      active.value &&
      inView.value &&
      visible.value &&
      !reduced.value,
  )
  watch(playing, (value) => {
    if (value) started.value = true
  })
  return { started, completed, playing, reduced }
}
