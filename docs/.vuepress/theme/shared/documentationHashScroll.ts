import type { RouterScrollBehavior } from 'vue-router'

export const documentationHashOffset = 124
// The chapter header settles into its fixed 57–115px band after route scrolling.
export const documentationRouterHashOffset = 164

const hashId = (hash: string) => {
  const encoded = hash.slice(1)
  try {
    return decodeURIComponent(encoded)
  } catch {
    return encoded
  }
}

export const waitForDocumentationHashTarget = (
  hash: string,
  isCurrent: () => boolean,
  maxWaitMs = 5000,
  settleMs = 200,
):
  | { el: HTMLElement; top: number }
  | Promise<{ el: HTMLElement; top: number } | { top: number } | false> => {
  const find = () => {
    // Heading ids need not be valid CSS selectors.
    // eslint-disable-next-line unicorn/prefer-query-selector
    return document.getElementById(hashId(hash))
  }
  const existing = find()
  if (existing) return { el: existing, top: documentationRouterHashOffset }
  if (typeof MutationObserver === 'undefined')
    return Promise.resolve({ top: 0 })

  return new Promise((resolve) => {
    let finished = false
    let quietTimer = 0
    let observedContent: Element | null = null
    let stableTop = Number.NaN
    let stableSamples = 0
    const observer = new MutationObserver(check)
    const resize =
      typeof ResizeObserver === 'undefined'
        ? undefined
        : new ResizeObserver(check)
    const timer = window.setTimeout(() => {
      const target = find()
      finish(
        target
          ? { el: target, top: documentationRouterHashOffset }
          : { top: 0 },
      )
    }, maxWaitMs)
    const finish = (
      position: { el: HTMLElement; top: number } | { top: number } | false,
    ) => {
      if (finished) return
      finished = true
      observer.disconnect()
      resize?.disconnect()
      window.clearTimeout(quietTimer)
      window.clearTimeout(timer)
      resolve(position)
    }
    const targetTop = (target: HTMLElement) =>
      target.getBoundingClientRect().top + window.scrollY
    const probe = () => {
      if (!isCurrent()) {
        finish(false)
        return
      }
      const target = find()
      if (!target) return
      const top = targetTop(target)
      stableSamples = Math.abs(top - stableTop) < 1 ? stableSamples + 1 : 0
      stableTop = top
      if (stableSamples >= 2) {
        finish({ el: target, top: documentationRouterHashOffset })
        return
      }
      quietTimer = window.setTimeout(probe, settleMs)
    }
    function check() {
      if (finished) return
      if (!isCurrent()) {
        finish(false)
        return
      }
      const target = find()
      if (!target) return
      const content = document.querySelector('.page .content__default')
      if (resize && content && content !== observedContent) {
        if (observedContent) resize.unobserve(observedContent)
        resize.observe(content)
        observedContent = content
      }
      stableTop = targetTop(target)
      stableSamples = 0
      window.clearTimeout(quietTimer)
      quietTimer = window.setTimeout(probe, settleMs)
    }
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    })
    check()
  })
}

export const createDocumentationHashScrollBehavior =
  (
    original: RouterScrollBehavior,
    isCurrent: (fullPath: string) => boolean,
  ): RouterScrollBehavior =>
  (to, from, savedPosition) => {
    if (savedPosition || !to.hash || typeof document === 'undefined')
      return original(to, from, savedPosition)
    return waitForDocumentationHashTarget(
      to.hash,
      () => isCurrent(to.fullPath) && window.location.hash === to.hash,
    )
  }
