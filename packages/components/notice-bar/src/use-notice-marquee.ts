import {
  computed,
  nextTick,
  onBeforeUnmount,
  shallowRef,
  useId,
  watch,
} from 'vue'
import type { Ref } from 'vue'
import type { NoticeBarProps } from './notice-bar'

export const useNoticeMarquee = (
  props: NoticeBarProps,
  viewport: Readonly<Ref<HTMLElement | null>>,
  content: Readonly<Ref<HTMLElement | null>>,
  copy: Readonly<Ref<HTMLElement | null>>,
  track: Readonly<Ref<HTMLElement | null>>,
  enabled: Readonly<Ref<boolean>>,
  revision: Readonly<Ref<unknown>>,
) => {
  const overflow = shallowRef(false)
  const distance = shallowRef(0)
  let observer: ResizeObserver | undefined
  let mutation: MutationObserver | undefined
  let frame = 0
  const copyId = `notice-copy-${useId()}`
  const syncCopy = () => {
    if (!copy.value || !content.value) return
    const fragment = content.value.ownerDocument.createDocumentFragment()
    for (const child of content.value.childNodes)
      fragment.append(child.cloneNode(true))
    const ids = new Map<string, string>()
    for (const node of fragment.querySelectorAll('[id]')) {
      ids.set(node.id, `${copyId}-${node.id}`)
      node.id = ids.get(node.id)!
    }
    for (const node of fragment.querySelectorAll('*')) {
      for (const attribute of Array.from(node.attributes)) {
        let value = attribute.value.replace(
          /url\(\s*(['"]?)#([^'"\s)]+)\1\s*\)/g,
          (_match, _quote: string, id: string) => `url(#${ids.get(id) ?? id})`,
        )
        if (
          ['href', 'xlink:href'].includes(attribute.name) &&
          value.startsWith('#')
        )
          value = `#${ids.get(value.slice(1)) ?? value.slice(1)}`
        if (
          ['for', 'aria-labelledby', 'aria-describedby'].includes(
            attribute.name,
          )
        )
          value = value
            .split(' ')
            .map((id) => ids.get(id) ?? id)
            .join(' ')
        if (value !== attribute.value) node.setAttribute(attribute.name, value)
      }
      node.removeAttribute('autofocus')
      node.removeAttribute('autoplay')
      if (['INPUT', 'SELECT', 'TEXTAREA', 'BUTTON'].includes(node.tagName)) {
        node.removeAttribute('name')
        node.removeAttribute('form')
      }
    }
    // Copy rendered DOM, not the Vue slot: stateful children mount only once.
    copy.value.replaceChildren(fragment)
  }
  const measure = () => {
    frame = 0
    if (!viewport.value || !content.value) {
      overflow.value = false
      return
    }
    const available = viewport.value.clientWidth
    const width = content.value.scrollWidth
    overflow.value = available > 0 && width > available + 1
    distance.value = width + Math.max(0, props.gap)
    syncCopy()
  }
  const queue = () => {
    if (!frame && typeof requestAnimationFrame === 'function')
      frame = requestAnimationFrame(measure)
  }
  watch(
    [viewport, content],
    () => {
      observer?.disconnect()
      mutation?.disconnect()
      if (typeof ResizeObserver !== 'undefined') {
        observer = new ResizeObserver(queue)
        if (viewport.value) observer.observe(viewport.value)
        if (content.value) observer.observe(content.value)
      }
      if (typeof MutationObserver !== 'undefined' && content.value) {
        mutation = new MutationObserver(queue)
        mutation.observe(content.value, {
          childList: true,
          characterData: true,
          subtree: true,
          attributes: true,
        })
      }
      nextTick(measure)
    },
    { flush: 'post' },
  )
  const reset = () => {
    nextTick(async () => {
      measure()
      await nextTick()
      const element = track.value
      if (!element) return
      if (typeof element.getAnimations === 'function') {
        for (const animation of element.getAnimations()) {
          if (
            'animationName' in animation &&
            animation.animationName === 's-notice-bar-scroll'
          )
            animation.currentTime = 0
        }
      } else {
        const previous = element.style.animationName
        element.style.animationName = 'none'
        element.getBoundingClientRect()
        element.style.animationName = previous
      }
    })
  }
  watch(copy, () => nextTick(syncCopy), { flush: 'post' })
  watch(
    [
      revision,
      () => props.wrapable,
      () => props.scrollable,
      () => props.gap,
      () => props.speed,
      () => props.duration,
      enabled,
    ],
    reset,
    { flush: 'post' },
  )
  onBeforeUnmount(() => {
    observer?.disconnect()
    mutation?.disconnect()
    if (frame) cancelAnimationFrame(frame)
  })
  const scrolling = computed(
    () =>
      enabled.value && props.scrollable && !props.wrapable && overflow.value,
  )
  const duration = computed(() =>
    props.speed && props.speed > 0
      ? Math.max(0.2, distance.value / props.speed)
      : Math.max(0.2, props.duration || 12),
  )
  return {
    scrolling,
    duration,
    reset,
    styles: computed(() => ({
      '--sax-notice-distance': `${-distance.value}px`,
      '--sax-notice-duration': `${duration.value}s`,
      '--sax-notice-delay': `${Math.max(0, props.delay) / 1000}s`,
      '--sax-notice-gap': `${Math.max(0, props.gap)}px`,
    })),
  }
}
