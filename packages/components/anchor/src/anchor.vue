<template>
  <nav
    :class="[ns.b(), ns.m(direction), ns.is('affix', affix)]"
    :aria-label="t('vs.anchor.navigation')"
  >
    <div
      v-for="entry in visibleItems"
      :key="entry.key"
      :class="[ns.e('group'), ns.is('nested', entry.depth > 0)]"
      :style="{
        '--s-anchor-depth-indent': `${entry.depth * 14}px`,
        '--s-anchor-guide-offset': `${10 + Math.max(0, entry.depth - 1) * 14}px`,
      }"
    >
      <div :class="ns.e('row')">
        <button
          :class="[
            ns.e('item'),
            ns.is('active', current === entry.item.href),
            ns.is('active-path', entry.activePath),
            ns.is('disabled', entry.item.disabled),
          ]"
          type="button"
          :disabled="entry.item.disabled"
          @click="navigate(entry.item)"
        >
          {{ entry.item.title }}
        </button>

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
  </nav>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { SIcon } from '@vuesax-alpha/components/icon'
import { useLocale, useNamespace } from '@vuesax-alpha/hooks'
import { anchorEmits, anchorProps } from './anchor'
import type { AnchorItem } from './anchor'

defineOptions({ name: 'SAnchor' })

const props = defineProps(anchorProps)
const emit = defineEmits(anchorEmits)
const ns = useNamespace('anchor')
const { t } = useLocale()
const current = ref('')
const pendingHref = ref('')
const collapsedKeys = ref(new Set<string>())
const initializedCollapseKeys = new Set<string>()
let scrollContainer: HTMLElement | Window | undefined
let scrollSettleTimer: ReturnType<typeof setTimeout> | undefined

interface AnchorEntry {
  item: AnchorItem
  key: string
  depth: number
  collapsible: boolean
  collapsed: boolean
  activePath: boolean
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
      result.push({ item, key, depth, collapsible, collapsed, activePath })
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
const navigate = (item: AnchorItem) => {
  if (item.disabled) return
  emit('click', item)
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
  if (item.href.startsWith('#')) {
    const method = props.replace ? 'replaceState' : 'pushState'
    window.history[method](null, '', item.href)
  }
  setCurrent(item.href)
}
const toggleCollapse = (entry: AnchorEntry) => {
  const next = new Set(collapsedKeys.value)
  if (next.has(entry.key)) next.delete(entry.key)
  else next.add(entry.key)
  collapsedKeys.value = next
  emit('collapseChange', entry.item, next.has(entry.key))
}
const updateCurrent = () => {
  let active: AnchorItem | undefined
  flatItems.value.forEach((item: AnchorItem) => {
    const target = getTarget(item.href)
    const containerTop =
      scrollContainer && scrollContainer !== window
        ? (scrollContainer as HTMLElement).getBoundingClientRect().top
        : 0
    const targetTop = target
      ? target.getBoundingClientRect().top - containerTop
      : Number.POSITIVE_INFINITY
    if (target && targetTop <= props.offset + props.bounds) {
      active = item
    }
  })

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
    updateCurrent()
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
  scrollContainer?.removeEventListener('scroll', handleScroll)
  scrollContainer?.removeEventListener('scrollend', settleScroll)
})
</script>
