<template>
  <div ref="root" :class="ns.b()" :style="rootStyle">
    <div
      :class="[ns.e('content'), ns.is('affixed', affixed)]"
      :style="contentStyle"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { useNamespace } from '@vuesax-alpha/hooks'
import { affixEmits, affixProps } from './affix'
import type { CSSProperties } from 'vue'

defineOptions({ name: 'SAffix' })

const props = defineProps(affixProps)
const emit = defineEmits(affixEmits)
const ns = useNamespace('affix')
const root = ref<HTMLElement>()
const affixed = ref(false)
const rootWidth = ref(0)
const contentHeight = ref(0)
const scrollTarget = ref<HTMLElement | Window>(window)

const isContainerTarget = computed(() => scrollTarget.value !== window)
const usesBottom = computed(() => props.offsetBottom !== undefined)

const rootStyle = computed<CSSProperties>(() => {
  const position: CSSProperties = { zIndex: props.zIndex }

  if (isContainerTarget.value) {
    return {
      ...position,
      position: 'sticky',
      [usesBottom.value ? 'bottom' : 'top']:
        `${usesBottom.value ? props.offsetBottom : props.offsetTop}px`,
    }
  }

  return affixed.value
    ? { ...position, height: `${contentHeight.value}px` }
    : position
})

const contentStyle = computed<CSSProperties>(() => {
  const position: CSSProperties = { zIndex: props.zIndex }

  if (!affixed.value) return position

  if (isContainerTarget.value) return position

  return {
    ...position,
    position: 'fixed',
    width: `${rootWidth.value}px`,
    left: `${root.value?.getBoundingClientRect().left || 0}px`,
    [usesBottom.value ? 'bottom' : 'top']:
      `${usesBottom.value ? props.offsetBottom : props.offsetTop}px`,
  }
})

const setAffixed = (value: boolean) => {
  if (affixed.value === value) return
  affixed.value = value
  emit('change', value)
}

const update = () => {
  if (!root.value) return

  const rootRect = root.value.getBoundingClientRect()
  rootWidth.value = rootRect.width
  contentHeight.value = root.value.firstElementChild?.getBoundingClientRect().height || 0

  const targetRect =
    scrollTarget.value === window
      ? { top: 0, bottom: window.innerHeight }
      : (scrollTarget.value as HTMLElement).getBoundingClientRect()

  const boundary = (() => {
    if (scrollTarget.value === window) {
      return {
        top: targetRect.top + props.offsetTop,
        bottom: targetRect.bottom - (props.offsetBottom || 0),
      }
    }

    const target = scrollTarget.value as HTMLElement
    const style = window.getComputedStyle(target)
    return {
      top:
        targetRect.top +
        target.clientTop +
        Number.parseFloat(style.paddingTop) +
        props.offsetTop,
      bottom:
        targetRect.bottom -
        target.clientTop -
        Number.parseFloat(style.paddingBottom) -
        (props.offsetBottom || 0),
    }
  })()

  setAffixed(
    usesBottom.value
      ? rootRect.bottom >= boundary.bottom
      : rootRect.top <= boundary.top,
  )
}

onMounted(async () => {
  await nextTick()
  scrollTarget.value = props.target?.() || window
  scrollTarget.value.addEventListener('scroll', update, { passive: true })
  window.addEventListener('resize', update, { passive: true })
  update()
})

onBeforeUnmount(() => {
  scrollTarget.value.removeEventListener('scroll', update)
  window.removeEventListener('resize', update)
})
</script>
