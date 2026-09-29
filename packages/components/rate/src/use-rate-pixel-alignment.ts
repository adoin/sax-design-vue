import { nextTick, onBeforeUnmount, onMounted, watch } from 'vue'
import type { Ref } from 'vue'

export const getRatePixelOffset = (center: number, pixelRatio: number) =>
  Math.round(center * pixelRatio) / pixelRatio - center

/** Keep the color boundary and star notch on the same physical pixel edge. */
export const useRatePixelAlignment = (
  root: Ref<HTMLElement | undefined>,
  itemClass: string,
  iconClass: string,
) => {
  const offsets = new WeakMap<HTMLElement, number>()
  let observer: ResizeObserver | undefined
  let frame = 0
  let mounted = false
  const align = () => {
    frame = 0
    if (!root.value) return
    const ratio = window.devicePixelRatio || 1
    const updates = Array.from(
      root.value.querySelectorAll<HTMLElement>(`.${itemClass} > .${iconClass}`),
      (icon) => {
        const rect = icon.getBoundingClientRect()
        const center = rect.left + rect.width / 2 - (offsets.get(icon) || 0)
        return {
          icon,
          offset: rect.width ? getRatePixelOffset(center, ratio) : 0,
        }
      },
    )
    for (const { icon, offset } of updates) {
      offsets.set(icon, offset)
      icon.style.setProperty('--sax-rate-pixel-offset', `${offset}px`)
    }
  }
  const schedule = () => {
    if (mounted && !frame) frame = requestAnimationFrame(align)
  }
  onMounted(() => {
    mounted = true
    nextTick(align)
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(schedule)
      observer.observe(root.value!)
      if (root.value?.parentElement) observer.observe(root.value.parentElement)
    }
    window.addEventListener('resize', schedule)
  })
  watch(root, schedule)
  onBeforeUnmount(() => {
    mounted = false
    observer?.disconnect()
    window.removeEventListener('resize', schedule)
    if (frame) cancelAnimationFrame(frame)
  })
  return schedule
}
