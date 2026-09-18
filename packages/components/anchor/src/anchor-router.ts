import type { AnchorRouterAdapter } from '../../types'
import type { AnchorItem } from './anchor'
import type { AnchorRouteBoundaryItem } from './anchor-route-boundary'

export type AnchorRouteItem = AnchorItem & { href: string }

export interface AnchorRouteContext {
  current: AnchorRouteItem
  previous?: AnchorRouteBoundaryItem
  next?: AnchorRouteBoundaryItem
}

export type AnchorNavigationKind = 'hash' | 'route' | 'native'

const anchorUrl = (href: string, base?: string) => {
  try {
    return new URL(
      href,
      base ||
        (typeof window !== 'undefined'
          ? window.location.href
          : 'http://anchor.local/'),
    )
  } catch {
    return
  }
}

const normalizedPathname = (pathname: string) =>
  pathname.length > 1 ? pathname.replace(/\/$/, '') : pathname

export const resolveAnchorNavigation = (
  href: string,
  currentHref?: string,
): { kind: AnchorNavigationKind; hash?: string } => {
  if (href.startsWith('#')) return { kind: 'hash', hash: href }
  const browserBase =
    typeof window !== 'undefined'
      ? window.location.href
      : 'http://anchor.local/'
  const current = anchorUrl(currentHref || browserBase, browserBase)
  const target = current && anchorUrl(href, current.href)
  if (!target || !current || target.origin !== current.origin)
    return { kind: 'native' }
  if (
    target.hash &&
    normalizedPathname(target.pathname) ===
      normalizedPathname(current.pathname) &&
    target.search === current.search
  )
    return { kind: 'hash', hash: target.hash }
  return { kind: 'route' }
}

const anchorRouteLocationKey = (href: string) => {
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
    const pathname = normalizedPathname(url.pathname)
    return `${url.origin}${pathname}${url.search}${url.hash}`
  } catch {
    return
  }
}

const anchorRouteHasHash = (href?: string) =>
  Boolean(href && !href.startsWith('#') && anchorUrl(href)?.hash)

export const anchorRouteKey = (href: string) => {
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
  const activeKey = anchorRouteKey(href)
  if (!activeKey) return
  const activeLocationKey = anchorRouteLocationKey(href)

  const routes: AnchorRouteItem[] = []
  const visit = (entries: AnchorItem[]) => {
    for (const item of entries) {
      if (item.href && anchorRouteKey(item.href))
        routes.push(item as AnchorRouteItem)
      if (item.children?.length) visit(item.children)
    }
  }
  visit(items)

  const current =
    routes.find(
      (item) => anchorRouteLocationKey(item.href) === activeLocationKey,
    ) ?? routes.find((item) => anchorRouteKey(item.href) === activeKey)
  if (!current) return

  const boundaries = routes.filter(
    (item) =>
      !item.disabled && (item.boundary ?? !anchorRouteHasHash(item.href)),
  )
  const index = boundaries.indexOf(current)
  const boundary = (candidate?: AnchorRouteItem) =>
    candidate ? { href: candidate.href, title: candidate.title } : undefined
  return {
    current,
    previous: index < 0 ? undefined : boundary(boundaries[index - 1]),
    next: index < 0 ? undefined : boundary(boundaries[index + 1]),
  }
}

export const isPlainAnchorRouteClick = (event: MouseEvent) =>
  event.button === 0 &&
  !event.metaKey &&
  !event.ctrlKey &&
  !event.shiftKey &&
  !event.altKey
