<template>
  <transition name="s-backtop-fade">
    <button
      v-if="visible"
      type="button"
      :class="ns.b()"
      :style="positionStyle"
      aria-label="Back to top"
      @click="handleClick"
    >
      <slot><icon-arrow :class="ns.e('icon')" less /></slot>
    </button>
  </transition>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { IconArrow } from '@vuesax-alpha/components/icon'
import { useNamespace } from '@vuesax-alpha/hooks'
import { backtopEmits, backtopProps } from './backtop'
import type { CSSProperties } from 'vue'

defineOptions({ name: 'SBacktop' })

const props = defineProps(backtopProps)
const emit = defineEmits(backtopEmits)
const ns = useNamespace('backtop')
const visible = ref(false)
let scrollTarget: HTMLElement | Window | undefined

const positionStyle = computed<CSSProperties>(() => ({
  right: `${props.right}px`,
  bottom: `${props.bottom}px`,
}))

const getScrollTop = () => {
  if (scrollTarget instanceof HTMLElement) return scrollTarget.scrollTop
  return window.scrollY
}

const updateVisible = () => {
  visible.value = getScrollTop() >= props.visibilityHeight
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
  scrollTarget.addEventListener('scroll', updateVisible, { passive: true })
  updateVisible()
})

onBeforeUnmount(() =>
  scrollTarget?.removeEventListener('scroll', updateVisible),
)
</script>
