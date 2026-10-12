import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  shallowRef,
  watch,
} from 'vue'
import type { Ref } from 'vue'

export const useMessageScroll = (
  viewport: Ref<HTMLElement | null>,
  content: Ref<HTMLElement | null>,
  props: { autoFollow: boolean; threshold: number; virtual?: boolean },
  emit: {
    (event: 'follow-change', value: boolean): void
    (event: 'reach-top'): void
  },
) => {
  const following = shallowRef(props.autoFollow)
  const atTop = shallowRef(true)
  const atBottom = shallowRef(true)
  const unread = shallowRef(false)
  let lastHeight = 0
  let frame: number | undefined
  let observer: ResizeObserver | undefined
  let mutation: MutationObserver | undefined
  let active = false
  let bindingVersion = 0
  let firstElementChild: Element | null = null
  const reducedMotion = () =>
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
  const setFollowing = (value: boolean) => {
    if (following.value !== value) {
      following.value = value
      emit('follow-change', value)
    }
  }
  const sync = () => {
    const el = viewport.value
    if (!el) return
    atTop.value = el.scrollTop <= 1
    atBottom.value =
      el.scrollHeight - el.clientHeight - el.scrollTop <=
      Math.max(0, props.threshold)
    if (atBottom.value) unread.value = false
  }
  const onScroll = (preserveFollowing = false, pauseFollowing = false) => {
    const wasTop = atTop.value
    sync()
    if (pauseFollowing) setFollowing(false)
    else if (!preserveFollowing)
      setFollowing(props.autoFollow && atBottom.value)
    else if (following.value && !atBottom.value) update()
    if (!wasTop && atTop.value) emit('reach-top')
  }
  const scrollToBottom = (smooth = true) => {
    const el = viewport.value
    if (!el) return
    setFollowing(props.autoFollow)
    unread.value = false
    el.scrollTo({
      top: el.scrollHeight,
      behavior: smooth && !reducedMotion() ? 'smooth' : 'auto',
    })
    sync()
  }
  const scrollToTop = () => {
    setFollowing(false)
    viewport.value?.scrollTo({
      top: 0,
      behavior: reducedMotion() ? 'auto' : 'smooth',
    })
  }
  const update = () => {
    if (!active || frame !== undefined) return
    frame = requestAnimationFrame(() => {
      frame = undefined
      const el = viewport.value
      if (!el || !active) return
      const height = el.scrollHeight
      if (following.value && props.autoFollow) scrollToBottom(false)
      else {
        // Preserve the visible transcript when history is prepended, including
        // wrapped message slots. Native scroll anchoring is disabled for parity.
        const newFirst = content.value?.firstElementChild ?? null
        if (
          !props.virtual &&
          firstElementChild &&
          newFirst !== firstElementChild &&
          content.value?.contains(firstElementChild)
        )
          el.scrollTop += height - lastHeight
        if (!props.virtual && height > lastHeight) unread.value = true
      }
      firstElementChild = content.value?.firstElementChild ?? null
      lastHeight = height
      sync()
    })
  }
  const attach = async () => {
    const version = ++bindingVersion
    observer?.disconnect()
    mutation?.disconnect()
    await nextTick()
    if (
      !active ||
      version !== bindingVersion ||
      !viewport.value ||
      !content.value
    )
      return
    firstElementChild = content.value.firstElementChild
    lastHeight = viewport.value.scrollHeight
    if (following.value && props.autoFollow) scrollToBottom(false)
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(update)
      observer.observe(content.value)
      observer.observe(viewport.value)
    }
    mutation = new MutationObserver(update)
    mutation.observe(content.value, {
      childList: true,
      subtree: true,
      characterData: true,
    })
    sync()
  }
  onMounted(() => {
    active = true
    attach()
  })
  watch(
    [viewport, content],
    () => {
      if (active) attach()
    },
    { flush: 'post' },
  )
  const notifyNewContent = () => {
    if (!following.value) unread.value = true
    update()
  }
  watch(
    () => props.autoFollow,
    (value) => {
      setFollowing(value && atBottom.value)
      if (following.value) update()
    },
  )
  onBeforeUnmount(() => {
    active = false
    bindingVersion++
    observer?.disconnect()
    mutation?.disconnect()
    if (frame !== undefined) cancelAnimationFrame(frame)
  })
  return {
    following: computed(() => following.value),
    atTop,
    atBottom,
    unread,
    onScroll,
    notifyNewContent,
    pauseFollow: () => setFollowing(false),
    scrollToTop,
    scrollToBottom,
  }
}
