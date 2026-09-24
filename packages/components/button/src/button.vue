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
      <span
        v-if="$slots.prefix"
        :class="[
          ns.e('prefix'),
          inlineLoadingPlacement === 'prefix' && 't-icon-swap',
        ]"
        :data-state="
          inlineLoadingPlacement === 'prefix'
            ? inlineLoaderShown
              ? 'loading'
              : 'content'
            : undefined
        "
        @transitionend="handleInlineSwapTransitionEnd($event, 'prefix')"
      >
        <span
          v-if="inlineLoadingPlacement === 'prefix'"
          class="t-icon"
          data-icon="content"
          :aria-hidden="inlineLoaderShown ? 'true' : undefined"
        >
          <slot name="prefix" />
        </span>
        <slot v-else name="prefix" />
        <IconLoading
          v-if="inlineLoadingPlacement === 'prefix'"
          class="t-icon"
          data-icon="loading"
          :active="inlineLoaderActive"
          @restored="handleInlineLoaderRestored('prefix')"
        />
      </span>

      <slot />

      <span
        v-if="$slots.suffix"
        :class="[
          ns.e('suffix'),
          inlineLoadingPlacement === 'suffix' && 't-icon-swap',
        ]"
        :data-state="
          inlineLoadingPlacement === 'suffix'
            ? inlineLoaderShown
              ? 'loading'
              : 'content'
            : undefined
        "
        @transitionend="handleInlineSwapTransitionEnd($event, 'suffix')"
      >
        <span
          v-if="inlineLoadingPlacement === 'suffix'"
          class="t-icon"
          data-icon="content"
          :aria-hidden="inlineLoaderShown ? 'true' : undefined"
        >
          <slot name="suffix" />
        </span>
        <slot v-else name="suffix" />
        <IconLoading
          v-if="inlineLoadingPlacement === 'suffix'"
          class="t-icon"
          data-icon="loading"
          :active="inlineLoaderActive"
          @restored="handleInlineLoaderRestored('suffix')"
        />
      </span>
    </div>

    <div
      v-if="$slots.animate"
      :class="[ns.e('animate'), ns.em('animate', animationType)]"
    >
      <slot name="animate" />
    </div>

    <Transition :name="ns.b('loading')" appear>
      <div
        v-if="
          props.loading &&
          ($slots.loading ||
            props.loadingType !== 'default' ||
            (!$slots.prefix && !$slots.suffix))
        "
        :class="ns.e('loading')"
      >
        <slot name="loading">
          <IconLoading v-if="props.loadingType === 'default'" />
          <span v-else :class="ns.e('loading-track')" aria-hidden="true" />
        </slot>
      </div>
    </Transition>
  </button>
</template>

<script lang="ts" setup>
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  watch,
} from 'vue'
import {
  useColor,
  useGlobalComponentProps,
  useNamespace,
  useShape,
  useSize,
  useVuesaxBaseComponent,
} from '@vuesax-alpha/hooks'
import {
  getVsColor,
  ripple,
  rippleCut,
  rippleReverse,
} from '@vuesax-alpha/utils'
import { IconLoading } from '@vuesax-alpha/components/icon'
import { buttonProps } from './button'

defineOptions({
  name: 'SButton',
})

const rawProps = defineProps(buttonProps)
const props = useGlobalComponentProps('button', rawProps)
const emit = defineEmits<{
  (event: 'click', value: MouseEvent): void
}>()
const slots = defineSlots<{
  default?(): unknown
  prefix?(): unknown
  suffix?(): unknown
  animate?(): unknown
  loading?(): unknown
}>()

const ns = useNamespace('button')
const shape = useShape<'circle' | 'square'>()
const size = useSize<string | number>()

const root$ = ref<HTMLButtonElement>()
type InlineLoadingPlacement = 'prefix' | 'suffix'

const inlineLoadingPlacement = computed<InlineLoadingPlacement | undefined>(
  () => {
    if (slots.prefix) return 'prefix'
    if (slots.suffix) return 'suffix'
    return undefined
  },
)
const inlineLoaderShown = shallowRef(false)
const inlineLoaderActive = shallowRef(false)
let inlineLoaderFirstPaintFrame: number | undefined
let inlineLoaderStartFrame: number | undefined

const isInlineDefaultLoadingRequested = () =>
  props.loading &&
  props.loadingType === 'default' &&
  !slots.loading &&
  inlineLoadingPlacement.value !== undefined

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const startInlineLoaderAfterSwap = () => {
  if (!inlineLoaderShown.value || !isInlineDefaultLoadingRequested()) return
  inlineLoaderActive.value = true
}

const syncInlineLoader = () => {
  if (isInlineDefaultLoadingRequested()) {
    const wasShown = inlineLoaderShown.value
    inlineLoaderShown.value = true

    if (wasShown) {
      inlineLoaderActive.value = true
      return
    }

    if (prefersReducedMotion()) inlineLoaderActive.value = true
    return
  }

  if (!inlineLoaderShown.value) return

  if (inlineLoaderActive.value) {
    inlineLoaderActive.value = false
    return
  }

  inlineLoaderShown.value = false
}

const clearInitialInlineLoaderFrames = () => {
  if (inlineLoaderFirstPaintFrame !== undefined) {
    cancelAnimationFrame(inlineLoaderFirstPaintFrame)
    inlineLoaderFirstPaintFrame = undefined
  }

  if (inlineLoaderStartFrame !== undefined) {
    cancelAnimationFrame(inlineLoaderStartFrame)
    inlineLoaderStartFrame = undefined
  }
}

const scheduleInitialInlineLoader = () => {
  if (
    !isInlineDefaultLoadingRequested() ||
    prefersReducedMotion() ||
    typeof requestAnimationFrame !== 'function'
  ) {
    syncInlineLoader()
    return
  }

  inlineLoaderFirstPaintFrame = requestAnimationFrame(() => {
    inlineLoaderFirstPaintFrame = undefined
    inlineLoaderStartFrame = requestAnimationFrame(() => {
      inlineLoaderStartFrame = undefined
      syncInlineLoader()
    })
  })
}

const handleInlineSwapTransitionEnd = (
  event: TransitionEvent,
  placement: InlineLoadingPlacement,
) => {
  if (
    placement !== inlineLoadingPlacement.value ||
    event.propertyName !== 'opacity' ||
    !(event.target instanceof HTMLElement) ||
    event.target.dataset.icon !== 'loading'
  )
    return

  if (isInlineDefaultLoadingRequested()) {
    startInlineLoaderAfterSwap()
    return
  }

  inlineLoaderShown.value = false
}

const handleInlineLoaderRestored = (placement: InlineLoadingPlacement) => {
  if (placement !== inlineLoadingPlacement.value) return

  if (isInlineDefaultLoadingRequested()) {
    inlineLoaderActive.value = true
    return
  }

  inlineLoaderShown.value = false
}

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

watch([() => props.loading, () => props.loadingType], syncInlineLoader)

onMounted(scheduleInitialInlineLoader)

onBeforeUnmount(clearClickLimitTimers)
onBeforeUnmount(clearInitialInlineLoaderFrames)

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
    ns.em('size', String(size.value)),
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
