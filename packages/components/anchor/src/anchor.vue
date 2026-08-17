<template>
  <nav
    :class="[ns.b(), ns.m(direction), ns.is('affix', affix)]"
    :aria-label="t('vs.anchor.navigation')"
  >
    <div v-for="item in items" :key="item.href" :class="ns.e('group')">
      <button
        :class="[
          ns.e('item'),
          ns.is('active', current === item.href),
          ns.is('disabled', item.disabled),
        ]"
        type="button"
        :disabled="item.disabled"
        @click="navigate(item)"
      >
        {{ item.title }}
      </button>

      <div v-if="item.children?.length" :class="ns.e('children')">
        <button
          v-for="child in item.children"
          :key="child.href"
          :class="[
            ns.e('item'),
            ns.em('item', 'child'),
            ns.is('active', current === child.href),
            ns.is('disabled', child.disabled),
          ]"
          type="button"
          :disabled="child.disabled"
          @click="navigate(child)"
        >
          {{ child.title }}
        </button>
      </div>
    </div>
  </nav>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
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
let scrollContainer: HTMLElement | Window | undefined
let scrollSettleTimer: ReturnType<typeof setTimeout> | undefined

const flatItems = computed<AnchorItem[]>(() => {
  const result: AnchorItem[] = []
  props.items.forEach((item: AnchorItem) => {
    result.push(item, ...(item.children || []))
  })
  return result
})
const scrollOffset = computed(() => props.targetOffset ?? props.offset)

const getTarget = (href: string) =>
  href.startsWith('#') ? document.getElementById(href.slice(1)) : null

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
