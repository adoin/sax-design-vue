import { nextTick, onBeforeUnmount, onMounted, shallowRef, watch } from 'vue'

/** Keep footer rows steady across X windows; actual layout/data changes reset them. */
export function useTableFooterHeights(retain: () => boolean) {
  const heights = shallowRef(new Map<string, number>())
  const elements = new Map<string, HTMLElement>()
  const keys = new WeakMap<Element, string>()
  let observer: ResizeObserver | undefined
  let disposed = false
  const setElement = (key: string, element: unknown) => {
    const old = elements.get(key)
    if (old === element) return
    if (old) observer?.unobserve(old)
    if (element instanceof HTMLElement) {
      elements.set(key, element)
      keys.set(element, key)
      observer?.observe(element)
    } else elements.delete(key)
  }
  const measure = () => {
    heights.value = new Map()
    nextTick(() => {
      if (disposed || !retain()) return
      // Reobserve also reports unchanged sizes after a cache reset.
      elements.forEach((element) => {
        observer?.unobserve(element)
        observer?.observe(element)
      })
    })
  }
  onMounted(() => {
    if (typeof ResizeObserver === 'undefined') return
    observer = new ResizeObserver((entries) => {
      if (disposed || !retain()) return
      const next = new Map(heights.value)
      let changed = false
      entries.forEach((entry) => {
        const key = keys.get(entry.target)
        if (!key || elements.get(key) !== entry.target) return
        const height =
          entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height
        if (height > (next.get(key) ?? 0)) {
          next.set(key, height)
          changed = true
        }
      })
      if (changed) heights.value = next
    })
    elements.forEach((element) => observer?.observe(element))
  })
  watch(retain, measure)
  onBeforeUnmount(() => {
    disposed = true
    observer?.disconnect()
    elements.clear()
  })
  return { heights, setElement, measure }
}
