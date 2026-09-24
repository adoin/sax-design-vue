import { onBeforeUnmount, onMounted, watch } from 'vue'
import { anchorRouteKey } from './anchor-router'
import type { Ref } from 'vue'
import type { AnchorRouterAdapter } from '../../types'
import type { AnchorRouteContext } from './anchor-router'

export interface UseAnchorRoutePrefetchOptions {
  enabled: Readonly<Ref<boolean>>
  router: Readonly<Ref<AnchorRouterAdapter | undefined>>
  context: Readonly<Ref<AnchorRouteContext | undefined>>
}

export const useAnchorRoutePrefetch = ({
  enabled,
  router,
  context,
}: UseAnchorRoutePrefetchOptions) => {
  const prefetchedRouteKeys = new Set<string>()
  let mounted = false
  let activeRouter: AnchorRouterAdapter | undefined
  let cancelScheduledPrefetch: (() => void) | undefined

  const prefetch = (href: string) => {
    const adapter = router.value
    const routeKey = anchorRouteKey(href)
    if (!adapter?.prefetch || !routeKey || prefetchedRouteKeys.has(routeKey))
      return

    prefetchedRouteKeys.add(routeKey)
    try {
      Promise.resolve(adapter.prefetch.call(adapter, href)).catch(() => {
        prefetchedRouteKeys.delete(routeKey)
      })
    } catch {
      prefetchedRouteKeys.delete(routeKey)
    }
  }

  const run = () => {
    cancelScheduledPrefetch = undefined
    const routeContext = context.value
    if (!enabled.value || !router.value?.prefetch || !routeContext) return

    const currentKey = anchorRouteKey(routeContext.current.href)
    if (currentKey) prefetchedRouteKeys.add(currentKey)
    if (routeContext.previous) prefetch(routeContext.previous.href)
    if (routeContext.next) prefetch(routeContext.next.href)
  }

  const schedule = () => {
    cancelScheduledPrefetch?.()
    cancelScheduledPrefetch = undefined

    const adapter = router.value
    if (adapter !== activeRouter) {
      activeRouter = adapter
      prefetchedRouteKeys.clear()
    }
    if (
      !mounted ||
      !enabled.value ||
      !adapter?.prefetch ||
      !context.value ||
      typeof window === 'undefined'
    )
      return

    if (typeof window.requestIdleCallback === 'function') {
      const handle = window.requestIdleCallback(run, { timeout: 1000 })
      cancelScheduledPrefetch = () => window.cancelIdleCallback(handle)
      return
    }

    const handle = window.setTimeout(run, 100)
    cancelScheduledPrefetch = () => window.clearTimeout(handle)
  }

  watch(
    [
      enabled,
      router,
      () => context.value?.current.href,
      () => context.value?.previous?.href,
      () => context.value?.next?.href,
    ],
    schedule,
  )

  onMounted(() => {
    mounted = true
    schedule()
  })
  onBeforeUnmount(() => {
    mounted = false
    cancelScheduledPrefetch?.()
  })
}
