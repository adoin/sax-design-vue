<template>
  <button
    ref="root$"
    :class="buttonClasses"
    :style="buttonStyles"
    :disabled="disabled || loading"
    :aria-busy="loading ? 'true' : undefined"
    @click="handleClick"
    @mousedown="mouseDown"
  >
    <div :class="ns.e('content')">
      <slot />
    </div>

    <div
      v-if="$slots.animate"
      :class="[ns.e('animate'), ns.em('animate', animationType)]"
    >
      <slot name="animate" />
    </div>

    <Transition :name="ns.b('loading')" appear>
      <div v-if="loading" :class="ns.e('loading')">
        <slot name="loading">
          <span :class="ns.e('loading-track')" aria-hidden="true" />
        </slot>
      </div>
    </Transition>
  </button>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, ref, useSlots, watch } from 'vue'
import {
  useColor,
  useNamespace,
  useShape,
  useVuesaxBaseComponent,
} from '@vuesax-alpha/hooks'
import {
  getVsColor,
  ripple,
  rippleCut,
  rippleReverse,
} from '@vuesax-alpha/utils'
import { buttonProps } from './button'

defineOptions({
  name: 'SButton',
})

const props = defineProps(buttonProps)
const emit = defineEmits<{
  (event: 'click', value: MouseEvent): void
}>()
const slots = useSlots()

const ns = useNamespace('button')
const shape = useShape<'circle' | 'square'>()

const root$ = ref<HTMLButtonElement>()

let debounceTimer: ReturnType<typeof setTimeout> | undefined
let throttleTimer: ReturnType<typeof setTimeout> | undefined
let throttleLocked = false
let hasWarnedClickLimitConflict = false

const isClickLimitDelay = (value: number | false): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value >= 0

const clearClickLimitTimers = () => {
  if (debounceTimer !== undefined) {
    clearTimeout(debounceTimer)
    debounceTimer = undefined
  }

  if (throttleTimer !== undefined) {
    clearTimeout(throttleTimer)
    throttleTimer = undefined
  }

  throttleLocked = false
}

watch(
  [() => props.debounce, () => props.throttle],
  ([debounce, throttle]) => {
    clearClickLimitTimers()

    const hasConflict =
      isClickLimitDelay(debounce) && isClickLimitDelay(throttle)

    if (hasConflict && !hasWarnedClickLimitConflict) {
      console.error(
        '[SButton] debounce and throttle cannot both be numbers. Only debounce will be applied.',
      )
      hasWarnedClickLimitConflict = true
    } else if (!hasConflict) {
      hasWarnedClickLimitConflict = false
    }
  },
  { immediate: true },
)

watch([() => props.disabled, () => props.loading], () => {
  clearClickLimitTimers()
})

onBeforeUnmount(clearClickLimitTimers)

const vsBaseClasses = useVuesaxBaseComponent(useColor())

const resolvedType = computed(() => {
  if (props.border) return 'border'
  if (props.flat) return 'flat'
  if (props.floating) return 'floating'
  if (props.gradient) return 'gradient'
  if (props.shadow) return 'shadow'
  if (props.relief) return 'relief'
  if (props.transparent) return 'transparent'
  return props.type
})

const resolvedShape = computed(() => {
  if (props.circle) return 'circle'
  if (props.square) return 'square'
  return shape.value
})

const buttonClasses = computed(() => {
  return [
    ns.b(),
    vsBaseClasses,
    resolvedShape.value && ns.m(resolvedShape.value),
    props.active && ns.m('active'),
    slots.animate && ns.m('animate'),
    props.animationType && ns.m(`animate-${props.animationType}`),
    props.animateInactive && ns.m('animate-inactive'),
    props.block && ns.m('block'),
    props.icon && ns.m('icon'),
    props.loading && ns.m('loading'),
    props.loading && ns.m(`loading-${props.loadingType}`),
    ns.em('size', props.size),
    ns.m(resolvedType.value),
    props.upload && ns.m('upload'),
  ]
})

const buttonStyles = computed(() => {
  return [
    ns.cssVar({
      color: getVsColor(props.color),
    }),
  ]
})

const mouseDown = (evs: MouseEvent) => {
  if (props.disabled || props.loading) return

  // ripple effect
  if (props.ripple === 'reverse') {
    rippleReverse(evs)
  } else if (props.ripple === 'cut') {
    rippleCut(evs)
  } else {
    if (resolvedType.value === 'flat') {
      ripple(
        evs,
        !props.active && document.activeElement !== root$.value
          ? 'inherit'
          : undefined,
        !props.active && document.activeElement !== root$.value,
      )
    } else {
      ripple(evs, undefined, false)
    }
  }
}

const handleClick = (event: MouseEvent) => {
  if (props.disabled || props.loading) {
    event.preventDefault()
    return
  }

  if (isClickLimitDelay(props.debounce)) {
    if (debounceTimer !== undefined) clearTimeout(debounceTimer)

    debounceTimer = setTimeout(() => {
      debounceTimer = undefined
      if (!props.disabled && !props.loading) emit('click', event)
    }, props.debounce)
    return
  }

  if (isClickLimitDelay(props.throttle)) {
    if (throttleLocked) return

    throttleLocked = true
    emit('click', event)
    throttleTimer = setTimeout(() => {
      throttleTimer = undefined
      throttleLocked = false
    }, props.throttle)
    return
  }

  emit('click', event)
}
</script>
