<template>
  <transition name="s-backtop-fade">
    <button
      v-if="visible"
      type="button"
      :class="ns.b()"
      :style="positionStyle"
      :aria-label="t('vs.backtop.label')"
      @click="handleClick"
    >
      <slot><icon-arrow :class="ns.e('icon')" less /></slot>
    </button>
  </transition>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { IconArrow } from '@vuesax-alpha/components/icon'
import { useLocale, useNamespace } from '@vuesax-alpha/hooks'
import { backtopEmits, backtopProps } from './backtop'
import type { CSSProperties } from 'vue'

defineOptions({ name: 'SBacktop' })

const props = defineProps(backtopProps)
const emit = defineEmits(backtopEmits)
const ns = useNamespace('backtop')
const { t } = useLocale()
const visible = ref(false)
const targetRect = ref<DOMRect>()
let scrollTarget: HTMLElement | Window | undefined

const positionStyle = computed<CSSProperties>(() => {
  if (props.target && targetRect.value) {
    return {
      position: 'fixed',
      right: `${window.innerWidth - targetRect.value.right + props.right}px`,
      bottom: `${window.innerHeight - targetRect.value.bottom + props.bottom}px`,
    }
  }

  return {
    position: 'fixed',
    right: `${props.right}px`,
    bottom: `${props.bottom}px`,
  }
})

const getScrollTop = () => {
  if (scrollTarget instanceof HTMLElement) return scrollTarget.scrollTop
  return window.scrollY
}

const getRemainingScroll = () => {
  if (scrollTarget instanceof HTMLElement)
    return (
      scrollTarget.scrollHeight -
      scrollTarget.clientHeight -
      scrollTarget.scrollTop
    )

  const documentElement = document.documentElement
  return documentElement.scrollHeight - window.innerHeight - window.scrollY
}

const updateVisible = () => {
  visible.value =
    getScrollTop() >= props.visibilityHeight ||
    (props.visibilityBottom !== undefined &&
      getRemainingScroll() <= props.visibilityBottom)
}

const updateTargetRect = () => {
  targetRect.value =
    scrollTarget instanceof HTMLElement
      ? scrollTarget.getBoundingClientRect()
      : undefined
}

const update = () => {
  updateVisible()
  updateTargetRect()
}

const handleClick = (event: MouseEvent) => {
  scrollTarget?.scrollTo({ top: 0, behavior: props.behavior })
  emit('click', event)
}

onMounted(() => {
  const target = props.target
    ? document.querySelector<HTMLElement>(props.target)
    : null
  scrollTarget = target || window
  scrollTarget.addEventListener('scroll', update, { passive: true })
  if (scrollTarget !== window)
    window.addEventListener('scroll', updateTargetRect, { passive: true })
  window.addEventListener('resize', updateTargetRect, { passive: true })
  update()
})

onBeforeUnmount(() => {
  scrollTarget?.removeEventListener('scroll', update)
  if (scrollTarget !== window)
    window.removeEventListener('scroll', updateTargetRect)
  window.removeEventListener('resize', updateTargetRect)
})
</script>
