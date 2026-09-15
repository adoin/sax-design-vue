import type { AnchorRouterAdapter } from '../../types'
import type { AnchorItem } from './anchor'
import type { AnchorRouteBoundaryItem } from './anchor-route-boundary'

export interface AnchorRouteContext {
  current: AnchorItem
  previous?: AnchorRouteBoundaryItem
  next?: AnchorRouteBoundaryItem
}

const routeKey = (href: string) => {
  if (!href || href.startsWith('#')) return
  try {
    const browser = typeof window !== 'undefined'
    const base = browser ? window.location.href : 'http://anchor.local/'
    const url = new URL(href, base)
    if (
      (browser && url.origin !== window.location.origin) ||
      (!browser && url.origin !== 'http://anchor.local')
    )
      return
    const pathname =
      url.pathname.length > 1 ? url.pathname.replace(/\/$/, '') : url.pathname
    return `${url.origin}${pathname}${url.search}`
  } catch {
    return
  }
}

export const readAnchorRouterLocation = (
  router?: AnchorRouterAdapter,
): string | undefined => {
  const current = router?.current?.()
  if (current) return current

  const source = router?.currentRoute
  if (!source) return
  const route = 'value' in source ? source.value : source
  return route.fullPath || route.path
}

export const findAnchorRouteContext = (
  items: AnchorItem[],
  href: string,
): AnchorRouteContext | undefined => {
  const activeKey = routeKey(href)
  if (!activeKey) return

  const visit = (siblings: AnchorItem[]): AnchorRouteContext | undefined => {
    const index = siblings.findIndex(
      (item) => routeKey(item.href) === activeKey,
    )
    if (index >= 0) {
      const adjacent = (step: -1 | 1) => {
        for (
          let candidateIndex = index + step;
          candidateIndex >= 0 && candidateIndex < siblings.length;
          candidateIndex += step
        ) {
          const candidate = siblings[candidateIndex]
          if (!candidate.disabled && routeKey(candidate.href))
            return { href: candidate.href, title: candidate.title }
        }
      }
      return {
        current: siblings[index],
        previous: adjacent(-1),
        next: adjacent(1),
      }
    }

    for (const item of siblings) {
      if (!item.children?.length) continue
      const context = visit(item.children)
      if (context) return context
    }
  }

  return visit(items)
}

export const isPlainAnchorRouteClick = (event: MouseEvent) =>
  event.button === 0 &&
  !event.metaKey &&
  !event.ctrlKey &&
  !event.shiftKey &&
  !event.altKey
