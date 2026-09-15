<template>
  <nav
    :class="[
      ns.b(),
      ns.m(direction),
      ns.is('affix', affix),
      ns.is('router', mode === 'router'),
    ]"
    :aria-label="t('vs.anchor.navigation')"
  >
    <div
      v-for="entry in visibleItems"
      :key="entry.key"
      :class="[
        ns.e('group'),
        ns.is('nested', entry.depth > 0),
        ns.is('branch-connection', entry.connectToParent),
        ns.is('branch-closure', entry.closeParentConnection),
      ]"
      :style="{
        '--s-anchor-depth-indent': `${entry.depth * 14}px`,
        '--s-anchor-guide-offset': `${10 + Math.max(0, entry.depth - 1) * 14}px`,
      }"
    >
      <div :class="ns.e('row')">
        <a
          :class="[
            ns.e('item'),
            ns.is('active', current === entry.item.href),
            ns.is('active-path', entry.activePath),
            ns.is('collapsible', entry.collapsible),
            ns.is('disabled', entry.item.disabled),
          ]"
          :href="entry.item.disabled ? undefined : entry.item.href"
          :aria-disabled="entry.item.disabled || undefined"
          :aria-current="
            current === entry.item.href
              ? entry.item.href.startsWith('#')
                ? 'location'
                : 'page'
              : undefined
          "
          :tabindex="entry.item.disabled ? -1 : undefined"
          @click="navigate(entry.item, $event)"
        >
          <span :class="ns.e('item-label')">
            <span
              v-if="direction === 'vertical' && current === entry.item.href"
              :class="ns.e('active-icon')"
              aria-hidden="true"
            >
              <slot
                name="active-icon"
                :item="entry.item"
                :href="entry.item.href"
              >
                <SIcon v-if="activeIcon" :name="activeIcon" />
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 32 32"
                >
                  <path d="M0 0h32v32H0z" fill="none" />
                  <path
                    fill="currentColor"
                    d="M16 2A11.013 11.013 0 0 0 5 13a10.9 10.9 0 0 0 2.216 6.6s.3.395.349.452L16 30l8.439-9.953c.044-.053.345-.447.345-.447l.001-.003A10.9 10.9 0 0 0 27 13A11.013 11.013 0 0 0 16 2m0 15a4 4 0 1 1 4-4a4.005 4.005 0 0 1-4 4"
                  />
                  <circle cx="16" cy="13" r="4" fill="none" />
                </svg>
              </slot>
            </span>
            <span>{{ entry.item.title }}</span>
          </span>
        </a>

        <button
          v-if="entry.collapsible"
          :class="[ns.e('collapse'), ns.is('collapsed', entry.collapsed)]"
          type="button"
          :aria-expanded="!entry.collapsed"
          :aria-label="`${t(entry.collapsed ? 'vs.anchor.expand' : 'vs.anchor.collapse')}: ${entry.item.title}`"
          @click="toggleCollapse(entry)"
        >
          <SIcon name="cb:chevron-down" />
        </button>
      </div>
    </div>

    <AnchorRouteBoundary
      v-if="routeBoundaryContext"
      :previous="routeBoundaryContext.previous"
      :next="routeBoundaryContext.next"
      :threshold="routeBoundaryOptions?.threshold"
      :arm-delay="routeBoundaryOptions?.armDelay"
      :route-cooldown="routeBoundaryOptions?.routeCooldown"
      :get-container="getContainer"
      @navigate="handleRouteBoundaryNavigate"
    >
      <template v-if="$slots['route-previous']" #previous="slotProps">
        <slot name="route-previous" v-bind="slotProps" />
      </template>
      <template v-if="$slots['route-next']" #next="slotProps">
        <slot name="route-next" v-bind="slotProps" />
      </template>
    </AnchorRouteBoundary>
  </nav>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { SIcon } from '@vuesax-alpha/components/icon'
import { useGlobalConfig, useLocale, useNamespace } from '@vuesax-alpha/hooks'
import AnchorRouteBoundary from './anchor-route-boundary.vue'
import { anchorEmits, anchorProps } from './anchor'
import {
  findAnchorRouteContext,
  isPlainAnchorRouteClick,
  readAnchorRouterLocation,
} from './anchor-router'
import type { AnchorItem } from './anchor'
import type {
  AnchorRouteBoundaryNavigateParams,
  AnchorRouteBoundarySlotParams,
} from './anchor-route-boundary'
import type { AnchorRouteBoundaryOptions } from '../../types'

defineOptions({ name: 'SAnchor' })

const props = defineProps(anchorProps)
const emit = defineEmits(anchorEmits)
const ns = useNamespace('anchor')
const { t } = useLocale()
const anchorConfig = useGlobalConfig('anchor')
const activeIcon = computed(() => anchorConfig.value?.activeIcon)
defineSlots<{
  'active-icon'?(params: { item: AnchorItem; href: string }): unknown
  'route-previous'?(params: AnchorRouteBoundarySlotParams): unknown
  'route-next'?(params: AnchorRouteBoundarySlotParams): unknown
}>()
const current = ref('')
const pendingHref = ref('')
const collapsedKeys = ref(new Set<string>())
const initializedCollapseKeys = new Set<string>()
let scrollContainer: HTMLElement | Window | undefined
let scrollSettleTimer: ReturnType<typeof setTimeout> | undefined
let scrollFrame: number | undefined

const routerAdapter = computed(() => props.router || anchorConfig.value?.router)
const routeBoundaryOptions = computed<AnchorRouteBoundaryOptions | undefined>(
  () => {
    const globalValue = anchorConfig.value?.routeBoundary
    const localValue = props.routeBoundary
    if (
      localValue === false ||
      (localValue === undefined && globalValue === false)
    )
      return
    return {
      ...(typeof globalValue === 'object' ? globalValue : {}),
      ...(typeof localValue === 'object' ? localValue : {}),
    }
  },
)
const routerLocation = computed(
  () =>
    readAnchorRouterLocation(routerAdapter.value) ||
    (!props.modelValue.startsWith('#') ? props.modelValue : ''),
)
const routeContext = computed(() =>
  props.mode === 'router' && routerLocation.value
    ? findAnchorRouteContext(props.items, routerLocation.value)
    : undefined,
)
const routeBoundaryContext = computed(() =>
  routerAdapter.value && routeBoundaryOptions.value
    ? routeContext.value
    : undefined,
)

export interface AnchorEntry {
  item: AnchorItem
  key: string
  depth: number
  collapsible: boolean
  collapsed: boolean
  activePath: boolean
  connectToParent: boolean
  closeParentConnection: boolean
}

const hasActiveDescendant = (item: AnchorItem): boolean =>
  Boolean(
    item.children?.some(
      (child) => child.href === current.value || hasActiveDescendant(child),
    ),
  )

const syncCollapsedState = () => {
  const next = new Set(collapsedKeys.value)
  const liveKeys = new Set<string>()
  const visit = (items: AnchorItem[], path: string) => {
    items.forEach((item, index) => {
      const key = `${path}${index}:${item.href}`
      liveKeys.add(key)
      if (!initializedCollapseKeys.has(key)) {
        initializedCollapseKeys.add(key)
        if (item.defaultCollapsed) next.add(key)
      }
      if (hasActiveDescendant(item)) next.delete(key)
      if (item.children?.length) visit(item.children, `${key}/`)
    })
  }
  visit(props.items, '')
  for (const key of next) if (!liveKeys.has(key)) next.delete(key)
  collapsedKeys.value = next
}

const flatItems = computed<AnchorItem[]>(() => {
  const result: AnchorItem[] = []
  const visit = (items: AnchorItem[]) =>
    items.forEach((item) => {
      result.push(item)
      if (item.children?.length) visit(item.children)
    })
  visit(props.items)
  return result
})
const visibleItems = computed<AnchorEntry[]>(() => {
  const result: AnchorEntry[] = []
  const visit = (items: AnchorItem[], depth: number, path: string) => {
    items.forEach((item, index) => {
      const key = `${path}${index}:${item.href}`
      const collapsible = Boolean(
        props.direction === 'vertical' &&
        item.collapsible &&
        item.children?.length,
      )
      const activePath = hasActiveDescendant(item)
      const collapsed = collapsible && collapsedKeys.value.has(key)
      result.push({
        item,
        key,
        depth,
        collapsible,
        collapsed,
        activePath,
        connectToParent: depth > 1 && index === 0,
        closeParentConnection: depth > 1 && index === items.length - 1,
      })
      if (props.direction === 'vertical' && item.children?.length && !collapsed)
        visit(item.children, depth + 1, `${key}/`)
    })
  }
  visit(props.items, 0, '')
  return result
})
const scrollOffset = computed(() => props.targetOffset ?? props.offset)

const getTarget = (href: string) => {
  if (!href.startsWith('#')) return null
  const id = href.slice(1).split('\\').join('\\\\').split('"').join('\\"')
  return document.querySelector<HTMLElement>(`[id="${id}"]`)
}

const setCurrent = (value: string) => {
  const nextValue = props.getCurrentAnchor?.(value) || value
  if (nextValue === current.value) return
  current.value = nextValue
  emit('update:modelValue', nextValue)
  emit('change', nextValue)
}
const navigateRoute = (href: string) => {
  const router = routerAdapter.value
  if (!router) return
  const method = props.replace && router.replace ? router.replace : router.push
  method.call(router, href)
}
const navigate = (item: AnchorItem, event: MouseEvent) => {
  if (item.disabled) {
    event.preventDefault()
    return
  }
  emit('click', item, event)
  if (!item.href.startsWith('#')) {
    if (
      props.mode === 'router' &&
      routerAdapter.value &&
      isPlainAnchorRouteClick(event)
    ) {
      event.preventDefault()
      navigateRoute(item.href)
      setCurrent(item.href)
    } else if (isPlainAnchorRouteClick(event)) setCurrent(item.href)
    return
  }

  event.preventDefault()
  pendingHref.value = item.href
  const target = getTarget(item.href)
  if (target) {
    if (!scrollContainer || scrollContainer === window) {
      window.scrollTo({
        top:
          window.scrollY +
          target.getBoundingClientRect().top -
          scrollOffset.value,
        behavior: props.scrollBehavior,
      })
    } else {
      const container = scrollContainer as HTMLElement
      scrollContainer.scrollTo({
        top:
          container.scrollTop +
          target.getBoundingClientRect().top -
          container.getBoundingClientRect().top -
          scrollOffset.value,
        behavior: props.scrollBehavior,
      })
    }
  }
  const method = props.replace ? 'replaceState' : 'pushState'
  window.history[method](null, '', item.href)
  setCurrent(item.href)
}
const handleRouteBoundaryNavigate = (
  params: AnchorRouteBoundaryNavigateParams,
) => {
  if (params.trigger === 'click' && !isPlainAnchorRouteClick(params.event))
    return
  params.event.preventDefault()
  navigateRoute(params.href)
}
const toggleCollapse = (entry: AnchorEntry) => {
  const next = new Set(collapsedKeys.value)
  if (next.has(entry.key)) next.delete(entry.key)
  else next.add(entry.key)
  collapsedKeys.value = next
  emit('collapseChange', entry.item, next.has(entry.key))
}
const updateCurrent = () => {
  const containerTop =
    scrollContainer && scrollContainer !== window
      ? (scrollContainer as HTMLElement).getBoundingClientRect().top
      : 0
  const threshold = props.offset + props.bounds
  const targetTop = (index: number) => {
    const target = getTarget(flatItems.value[index]?.href ?? '')
    return target
      ? target.getBoundingClientRect().top - containerTop
      : Number.POSITIVE_INFINITY
  }
  let index = flatItems.value.findIndex((item) => item.href === current.value)
  let active: AnchorItem | undefined
  if (index < 0) {
    flatItems.value.forEach((item, itemIndex) => {
      if (targetTop(itemIndex) <= threshold) active = item
    })
  } else {
    while (index > 0 && targetTop(index) > threshold) index--
    while (
      index + 1 < flatItems.value.length &&
      targetTop(index + 1) <= threshold
    )
      index++
    if (targetTop(index) <= threshold) active = flatItems.value[index]
  }

  if (
    scrollContainer &&
    scrollContainer !== window &&
    (scrollContainer as HTMLElement).scrollTop +
      (scrollContainer as HTMLElement).clientHeight >=
      (scrollContainer as HTMLElement).scrollHeight - props.bounds
  ) {
    active = [...flatItems.value].reverse().find((item) => !item.disabled)
  }

  if (active) setCurrent(active.href)
}
const settleScroll = () => {
  pendingHref.value = ''
  updateCurrent()
}
const handleScroll = () => {
  if (!pendingHref.value) {
    if (scrollFrame === undefined)
      scrollFrame = requestAnimationFrame(() => {
        scrollFrame = undefined
        updateCurrent()
      })
    return
  }

  if (scrollSettleTimer) clearTimeout(scrollSettleTimer)
  scrollSettleTimer = setTimeout(settleScroll, 140)
}

watch(
  () => props.modelValue,
  (value) => {
    current.value = value
  },
  { immediate: true },
)
watch(
  () => routeContext.value?.current.href,
  (href) => {
    if (href) setCurrent(href)
  },
  { immediate: true },
)
watch([() => props.items, current], syncCollapsedState, {
  immediate: true,
  deep: true,
})
onMounted(() => {
  scrollContainer = props.getContainer?.() || window
  updateCurrent()
  scrollContainer.addEventListener('scroll', handleScroll, { passive: true })
  scrollContainer.addEventListener('scrollend', settleScroll)
})
onBeforeUnmount(() => {
  if (scrollSettleTimer) clearTimeout(scrollSettleTimer)
  if (scrollFrame !== undefined) cancelAnimationFrame(scrollFrame)
  scrollContainer?.removeEventListener('scroll', handleScroll)
  scrollContainer?.removeEventListener('scrollend', settleScroll)
})
</script>
