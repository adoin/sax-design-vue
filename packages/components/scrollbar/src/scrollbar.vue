<template>
  <div
    ref="scrollbarRef"
    :class="[ns.b(), ns.is('outside', outside)]"
    :style="
      outside ? { '--s-scrollbar-gap': `${Math.max(0, gap)}px` } : undefined
    "
  >
    <div
      ref="wrapRef"
      :class="wrapKls"
      :style="style"
      :tabindex="outside ? 0 : undefined"
      @scroll="handleScroll"
    >
      <component
        :is="tag"
        ref="resizeRef"
        :class="resizeKls"
        :style="viewStyle"
      >
        <slot />
      </component>
    </div>
    <template v-if="!native">
      <bar
        ref="barRef"
        :height="sizeHeight"
        :width="sizeWidth"
        :always="always"
        :ratio-x="ratioX"
        :ratio-y="ratioY"
        :thickness="thickness"
        :outside="outside"
      />
    </template>
  </div>
</template>
<script lang="ts" setup>
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  onUpdated,
  provide,
  reactive,
  ref,
  watch,
} from 'vue'
import { useEventListener, useResizeObserver } from '@vueuse/core'
import { addUnit, debugWarn, isNumber, isObject } from '@vuesax-alpha/utils'
import { scrollbarContextKey } from '@vuesax-alpha/tokens'
import { useNamespace } from '@vuesax-alpha/hooks'
import { GAP } from './util'
import Bar from './bar.vue'
import { scrollbarEmits, scrollbarProps } from './scrollbar'
import type { BarInstance } from './bar'
import type { CSSProperties, StyleValue } from 'vue'

const COMPONENT_NAME = 'SScrollbar'

defineOptions({
  name: COMPONENT_NAME,
})

const props = defineProps(scrollbarProps)
const emit = defineEmits(scrollbarEmits)

const ns = useNamespace('scrollbar')
const outside = computed(() => props.placement === 'outside' && !props.native)

let stopResizeObserver: (() => void) | undefined = undefined
let stopResizeListener: (() => void) | undefined = undefined
let updateFrame: number | undefined

const scrollbarRef = ref<HTMLDivElement>()
const wrapRef = ref<HTMLDivElement>()
const resizeRef = ref<HTMLElement>()

const sizeWidth = ref('0')
const sizeHeight = ref('0')
const barRef = ref<BarInstance>()
const ratioY = ref(1)
const ratioX = ref(1)

const FADE_REVEAL_DISTANCE = 96
const normalizeFadeDirection = (direction: string) =>
  ({ t: 'top', b: 'bottom', l: 'left', r: 'right', s: 'start', e: 'end' })[
    direction
  ] ?? direction
const fadeConfig = computed(() => {
  const value = props.fade
  if (value === false)
    return { enabled: false, direction: 'y' as const, size: '0px' }
  if (value === true)
    return {
      enabled: true,
      direction: 'y' as const,
      size: 'min(12%, 40px)',
    }
  if (typeof value === 'number')
    return {
      enabled: true,
      direction: 'y' as const,
      size: `${Math.max(0, value)}px`,
    }
  if (typeof value === 'string')
    return {
      enabled: true,
      direction: normalizeFadeDirection(value),
      size: 'min(12%, 40px)',
    }
  return {
    enabled: true,
    direction: normalizeFadeDirection(value.direction ?? 'y'),
    size:
      typeof value.size === 'number'
        ? `${Math.max(0, value.size)}px`
        : value.size || 'min(12%, 40px)',
  }
})
const fadeAxes = computed(() => {
  const direction = fadeConfig.value.direction
  return {
    x: ['x', 'left', 'right', 'start', 'end'].includes(direction),
    y: ['y', 'top', 'bottom'].includes(direction),
  }
})

const style = computed<StyleValue>(() => {
  const style: CSSProperties = {}
  if (props.height) style.height = addUnit(props.height)
  if (props.maxHeight) style.maxHeight = addUnit(props.maxHeight)
  if (fadeConfig.value.enabled)
    style['--s-scrollbar-fade-size'] = fadeConfig.value.size
  return [props.wrapStyle, style]
})

const wrapKls = computed(() => {
  return [
    props.wrapClass,
    ns.e('wrap'),
    { [ns.em('wrap', 'hidden-default')]: !props.native },
    ns.is('fade-x', fadeConfig.value.enabled && fadeAxes.value.x),
    ns.is('fade-y', fadeConfig.value.enabled && fadeAxes.value.y),
  ]
})

const resizeKls = computed(() => {
  return [ns.e('view'), props.viewClass]
})

const fadeProgress = (distance: number) =>
  Math.max(0, Math.min(1, distance / FADE_REVEAL_DISTANCE))
const updateFade = () => {
  const element = wrapRef.value
  if (!element) return
  const direction = fadeConfig.value.direction
  const enabled = fadeConfig.value.enabled
  const rtl =
    element.matches("[dir='rtl'], [dir='rtl'] *") ||
    getComputedStyle(element).direction === 'rtl'
  const maxY = Math.max(0, element.scrollHeight - element.clientHeight)
  const maxX = Math.max(0, element.scrollWidth - element.clientWidth)
  const topDistance = Math.max(0, Math.min(element.scrollTop, maxY))
  const bottomDistance = Math.max(0, maxY - topDistance)
  const rawLeft = element.scrollLeft
  const logicalStartDistance = rtl
    ? rawLeft <= 0
      ? Math.max(0, Math.min(-rawLeft, maxX))
      : Math.max(0, Math.min(maxX - rawLeft, maxX))
    : Math.max(0, Math.min(rawLeft, maxX))
  const logicalEndDistance = Math.max(0, maxX - logicalStartDistance)
  const leftDistance = rtl ? logicalEndDistance : logicalStartDistance
  const rightDistance = rtl ? logicalStartDistance : logicalEndDistance
  const top = enabled && (direction === 'y' || direction === 'top')
  const bottom = enabled && (direction === 'y' || direction === 'bottom')
  const left =
    enabled &&
    (direction === 'x' ||
      direction === 'left' ||
      (direction === 'start' && !rtl) ||
      (direction === 'end' && rtl))
  const right =
    enabled &&
    (direction === 'x' ||
      direction === 'right' ||
      (direction === 'start' && rtl) ||
      (direction === 'end' && !rtl))

  element.style.setProperty(
    '--s-scrollbar-fade-top',
    top
      ? `calc(var(--s-scrollbar-fade-size) * ${fadeProgress(topDistance)})`
      : '0px',
  )
  element.style.setProperty(
    '--s-scrollbar-fade-bottom',
    bottom
      ? `calc(var(--s-scrollbar-fade-size) * ${fadeProgress(bottomDistance)})`
      : '0px',
  )
  element.style.setProperty(
    '--s-scrollbar-fade-left',
    left
      ? `calc(var(--s-scrollbar-fade-size) * ${fadeProgress(leftDistance)})`
      : '0px',
  )
  element.style.setProperty(
    '--s-scrollbar-fade-right',
    right
      ? `calc(var(--s-scrollbar-fade-size) * ${fadeProgress(rightDistance)})`
      : '0px',
  )
}

const handleScroll = () => {
  if (wrapRef.value) {
    barRef.value?.handleScroll(wrapRef.value)
    updateFade()

    emit('scroll', {
      scrollTop: wrapRef.value.scrollTop,
      scrollLeft: wrapRef.value.scrollLeft,
    })
  }
}

// TODO: refactor method overrides, due to script setup dts
// @ts-nocheck
function scrollTo(xCord: number, yCord?: number): void
function scrollTo(options: ScrollToOptions): void
function scrollTo(arg1: unknown, arg2?: number) {
  if (isObject(arg1)) {
    wrapRef.value!.scrollTo(arg1)
  } else if (isNumber(arg1) && isNumber(arg2)) {
    wrapRef.value!.scrollTo(arg1, arg2)
  }
}

const setScrollTop = (value: number) => {
  if (!isNumber(value)) {
    debugWarn(COMPONENT_NAME, 'value must be a number')
    return
  }
  wrapRef.value!.scrollTop = value
}

const setScrollLeft = (value: number) => {
  if (!isNumber(value)) {
    debugWarn(COMPONENT_NAME, 'value must be a number')
    return
  }
  wrapRef.value!.scrollLeft = value
}

const update = () => {
  if (!wrapRef.value) return
  const offsetHeight = wrapRef.value.offsetHeight - GAP
  const offsetWidth = wrapRef.value.offsetWidth - GAP

  const originalHeight = offsetHeight ** 2 / wrapRef.value.scrollHeight
  const originalWidth = offsetWidth ** 2 / wrapRef.value.scrollWidth
  const height = Math.max(originalHeight, props.minSize)
  const width = Math.max(originalWidth, props.minSize)

  ratioY.value =
    originalHeight /
    (offsetHeight - originalHeight) /
    (height / (offsetHeight - height))
  ratioX.value =
    originalWidth /
    (offsetWidth - originalWidth) /
    (width / (offsetWidth - width))

  sizeHeight.value = height + GAP < offsetHeight ? `${height}px` : ''
  sizeWidth.value = width + GAP < offsetWidth ? `${width}px` : ''
  barRef.value?.handleScroll(wrapRef.value)
  updateFade()
}
const scheduleUpdate = () => {
  if (updateFrame !== undefined) return
  updateFrame = requestAnimationFrame(() => {
    updateFrame = undefined
    update()
  })
}

watch(
  () => props.noresize,
  (noresize) => {
    if (noresize) {
      stopResizeObserver?.()
      stopResizeListener?.()
    } else {
      ;({ stop: stopResizeObserver } = useResizeObserver(resizeRef, update))
      stopResizeListener = useEventListener('resize', update)
    }
  },
  { immediate: true },
)

watch(
  () => [props.maxHeight, props.height],
  () => {
    if (!props.native)
      nextTick(() => {
        update()
        if (wrapRef.value) {
          barRef.value?.handleScroll(wrapRef.value)
        }
      })
  },
)

watch(
  () => props.fade,
  () => nextTick(updateFade),
  { deep: true },
)

provide(
  scrollbarContextKey,
  reactive({
    scrollbarElement: scrollbarRef,
    wrapElement: wrapRef,
  }),
)

onMounted(() => nextTick(update))

onUpdated(scheduleUpdate)

onBeforeUnmount(() => {
  if (updateFrame !== undefined) cancelAnimationFrame(updateFrame)
})

defineExpose({
  /** @description scrollbar wrap ref */
  wrapRef,
  /** @description update scrollbar state manually */
  update,
  /** @description scrolls to a particular set of coordinates */
  scrollTo,
  /** @description set distance to scroll top */
  setScrollTop,
  /** @description set distance to scroll left */
  setScrollLeft,
  /** @description handle scroll event */
  handleScroll,
})
</script>
