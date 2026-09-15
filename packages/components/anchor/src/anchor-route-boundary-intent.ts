export interface AnchorRouteBoundaryIntentState {
  enteredAt: number
  lastWheelAt: number
  gestureReady: boolean
  progress: number
}

const scrollableOverflow = /^(auto|overlay|scroll)$/

export const isNestedAnchorRouteBoundaryScroller = (
  event: WheelEvent,
  container: HTMLElement | Window | undefined,
) => {
  if (!container) return false
  const boundary =
    container === window
      ? document.scrollingElement || document.documentElement
      : container

  for (const target of event.composedPath()) {
    if (target === boundary || target === document || target === window) break
    if (!(target instanceof HTMLElement)) continue
    const style = getComputedStyle(target)
    const vertical =
      target.scrollHeight > target.clientHeight &&
      scrollableOverflow.test(style.overflowY)
    const horizontal =
      target.scrollWidth > target.clientWidth &&
      scrollableOverflow.test(style.overflowX)
    if (vertical || horizontal) return true
  }
  return false
}

let lastWheelNavigationAt = Number.NEGATIVE_INFINITY

export const createAnchorRouteBoundaryIntent = (
  now: number,
): AnchorRouteBoundaryIntentState => ({
  enteredAt: now,
  lastWheelAt: now,
  gestureReady: false,
  progress: 0,
})

export const advanceAnchorRouteBoundaryIntent = (
  state: AnchorRouteBoundaryIntentState,
  options: {
    now: number
    delta: number
    threshold: number
    armDelay: number
  },
) => {
  const delay = Math.max(0, options.armDelay)
  const gap = options.now - state.lastWheelAt
  const next = { ...state, lastWheelAt: options.now }

  if (!next.gestureReady) {
    if (options.now - next.enteredAt < delay || gap < delay)
      return { state: next, triggered: false }
    next.gestureReady = true
  } else if (gap > 800) next.progress = 0

  next.progress = Math.min(
    1,
    next.progress + options.delta / Math.max(1, options.threshold),
  )
  return { state: next, triggered: next.progress >= 1 }
}

export const isAnchorRouteBoundaryCoolingDown = (
  now: number,
  cooldown: number,
) => now - lastWheelNavigationAt < Math.max(0, cooldown)

export const markAnchorRouteBoundaryNavigation = (now: number) => {
  lastWheelNavigationAt = now
}

export const resetAnchorRouteBoundaryNavigation = () => {
  lastWheelNavigationAt = Number.NEGATIVE_INFINITY
}
