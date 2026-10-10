import { onBeforeUnmount } from 'vue'

/** Scroll only the owning conversation viewport, then spotlight the actual bubble. */
export function useHistoryNavigation() {
  let cleanup = () => {}
  onBeforeUnmount(() => cleanup())
  return (target: HTMLElement) => {
    cleanup()
    const reduced =
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    const bubble =
      target.querySelector<HTMLElement>('.s-agent-message-body') ?? target
    let viewport = target.parentElement
    while (
      viewport &&
      !(
        viewport.scrollHeight > viewport.clientHeight &&
        /auto|scroll/.test(getComputedStyle(viewport).overflowY)
      )
    )
      viewport = viewport.parentElement
    let timer: ReturnType<typeof setTimeout> | undefined
    let highlighted = false
    const clear = () => {
      if (timer !== undefined) clearTimeout(timer)
      viewport?.removeEventListener('scrollend', highlight)
      bubble.removeEventListener('animationend', clear)
      bubble.classList.remove('s-agent-history-spotlight')
    }
    const highlight = () => {
      if (highlighted) return
      highlighted = true
      if (timer !== undefined) clearTimeout(timer)
      viewport?.removeEventListener('scrollend', highlight)
      // Flush a previous highlight removal so repeated selections restart it.
      bubble.getBoundingClientRect()
      bubble.classList.add('s-agent-history-spotlight')
      bubble.addEventListener('animationend', clear)
      timer = setTimeout(clear, reduced ? 800 : 2000)
    }
    cleanup = clear
    if (viewport) {
      const top = Math.max(
        0,
        Math.min(
          viewport.scrollHeight - viewport.clientHeight,
          viewport.scrollTop +
            target.getBoundingClientRect().top -
            viewport.getBoundingClientRect().top -
            16,
        ),
      )
      viewport.addEventListener('scrollend', highlight)
      if (Math.abs(viewport.scrollTop - top) < 1 || reduced) {
        viewport.scrollTo({ top, behavior: 'auto' })
        highlight()
      } else {
        viewport.scrollTo({ top, behavior: 'smooth' })
        timer = setTimeout(highlight, 600)
      }
    } else highlight()
  }
}
