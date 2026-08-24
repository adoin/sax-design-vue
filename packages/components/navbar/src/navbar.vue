<template>
  <header ref="navbarRef" :class="navbarKls" :style="navbarStyles">
    <div :class="ns.e('content')">
      <div v-if="showBrand" :class="ns.e('brand')">
        <slot name="brand" v-bind="slotState">
          <slot name="left" v-bind="slotState" />
        </slot>
      </div>

      <nav
        v-if="showNavigation"
        :class="ns.e('navigation')"
        aria-label="Primary navigation"
      >
        <slot name="navigation" v-bind="slotState">
          <slot v-bind="slotState" />
        </slot>
      </nav>

      <div v-if="showActions" :class="ns.e('actions')">
        <slot name="actions" v-bind="slotState">
          <slot name="right" v-bind="slotState" />
        </slot>
      </div>
    </div>
  </header>
</template>

<script lang="ts" setup>
import {
  computed,
  onMounted,
  provide,
  reactive,
  ref,
  shallowRef,
  watch,
} from 'vue'
import { useEventListener, useResizeObserver } from '@vueuse/core'
import {
  useColor,
  useNamespace,
  useVuesaxBaseComponent,
} from '@vuesax-alpha/hooks'
import { getVsColor } from '@vuesax-alpha/utils'
import {
  navbarContextKey,
  navbarRegisterContextKey,
} from '@vuesax-alpha/tokens/navbar'
import { UPDATE_MODEL_EVENT } from '@vuesax-alpha/constants'
import { navbarEmits, navbarProps } from './navbar'
import type { CSSProperties } from 'vue'

defineOptions({ name: 'SNavbar' })

const props = defineProps(navbarProps)
const emit = defineEmits(navbarEmits)

const ns = useNamespace('navbar')
const navbarRef = ref<HTMLElement>()
const scrollTarget = shallowRef<EventTarget>()
const children = reactive<Set<string>>(new Set())

const state = reactive({
  scrollTop: 0,
  collapsed: false,
  hidden: false,
  scrolled: false,
})

const toCssLength = (value: number | string) =>
  typeof value === 'number' ? `${value}px` : value

const resolvedPosition = computed(() =>
  props.fixed ? 'fixed' : props.position,
)
const slotState = computed(() => ({
  collapsed: state.collapsed,
  scrolled: state.scrolled,
}))

const showBrand = computed(() => !(props.leftCollapsed && state.collapsed))
const showNavigation = computed(
  () => !(props.centerCollapsed && state.collapsed),
)
const showActions = computed(() => !(props.rightCollapsed && state.collapsed))

const vsBaseClasses = useVuesaxBaseComponent(useColor())
const navbarKls = computed(() => [
  ns.b(),
  vsBaseClasses,
  ns.m(props.variant),
  ns.m(props.size),
  ns.is(resolvedPosition.value, true),
  ns.is('shadow', props.shadow),
  ns.is('not-line', props.notLine),
  ns.is('hidden', state.hidden),
  ns.is('scrolled', state.scrolled),
  ns.is('shadow-active', state.scrolled && props.shadowScroll),
  ns.is('text-white', props.textWhite),
  ns.is('padding-scroll', props.paddingScroll),
  ns.is('blurred', props.blurred),
  ns.is('square', props.square),
  ns.is('collapsed', state.collapsed),
])

const navbarStyles = computed<CSSProperties>(() => ({
  ...ns.cssVar({ color: getVsColor(props.color) }),
  [ns.cssVarBlockName('content-width')]: toCssLength(props.contentWidth),
  [ns.cssVarBlockName('gap')]: toCssLength(props.gap),
}))

const readScrollTop = () => {
  if (scrollTarget.value instanceof HTMLElement)
    return scrollTarget.value.scrollTop
  return window.scrollY || window.pageYOffset
}

const handleScroll = () => {
  if (!scrollTarget.value) return

  const nextScrollTop = readScrollTop()
  const direction = Math.sign(nextScrollTop - state.scrollTop)

  state.hidden = Boolean(
    props.hideScroll && direction > 0 && nextScrollTop > 12,
  )
  state.scrolled = nextScrollTop > 0
  state.scrollTop = nextScrollTop
}

const resolveScrollTarget = () => {
  if (typeof window === 'undefined') return
  scrollTarget.value = props.targetScroll
    ? document.querySelector(props.targetScroll) || window
    : window
  handleScroll()
}

const updateCollapsed = (width: number) => {
  const next = props.collapseAt > 0 && width <= props.collapseAt
  if (next === state.collapsed) return

  state.collapsed = next
  emit('collapsed', next)
}

useResizeObserver(navbarRef, ([entry]) => {
  updateCollapsed(entry.contentRect.width)
})
useEventListener(scrollTarget, 'scroll', handleScroll, { passive: true })

watch(() => props.targetScroll, resolveScrollTarget)
watch(
  () => props.collapseAt,
  () => updateCollapsed(navbarRef.value?.clientWidth || 0),
)

provide(navbarContextKey, {
  modelValue: computed(() => props.modelValue),
})

provide(navbarRegisterContextKey, (id: string) => {
  children.add(id)

  return {
    unregister: () => children.delete(id),
    onClick: () => emit(UPDATE_MODEL_EVENT, id),
    isActive: computed(() => props.modelValue === id),
  }
})

onMounted(resolveScrollTarget)
</script>
