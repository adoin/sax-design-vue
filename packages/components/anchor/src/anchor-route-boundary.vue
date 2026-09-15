<template>
  <div :class="ns.b('route-boundaries')">
    <AnchorRouteBoundaryEdge
      v-if="previous"
      :item="previous"
      direction="previous"
      :visible="previousVisible"
      :navigating="navigatingDirection === 'previous'"
      :progress="previousProgress"
      @activate="handleClick('previous', $event)"
      @progress-complete="completeWheelNavigation('previous')"
    >
      <template v-if="$slots.previous" #default>
        <slot
          name="previous"
          :item="previous"
          direction="previous"
          :visible="previousVisible"
          :navigating="navigatingDirection === 'previous'"
          :progress="previousProgress"
        />
      </template>
    </AnchorRouteBoundaryEdge>

    <AnchorRouteBoundaryEdge
      v-if="next"
      :item="next"
      direction="next"
      :visible="nextVisible"
      :navigating="navigatingDirection === 'next'"
      :progress="nextProgress"
      @activate="handleClick('next', $event)"
      @progress-complete="completeWheelNavigation('next')"
    >
      <template v-if="$slots.next" #default>
        <slot
          name="next"
          :item="next"
          direction="next"
          :visible="nextVisible"
          :navigating="navigatingDirection === 'next'"
          :progress="nextProgress"
        />
      </template>
    </AnchorRouteBoundaryEdge>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  shallowRef,
  watch,
} from 'vue'
import { useNamespace } from '@vuesax-alpha/hooks'
import AnchorRouteBoundaryEdge from './anchor-route-boundary-edge.vue'
import {
  anchorRouteBoundaryEmits,
  anchorRouteBoundaryProps,
} from './anchor-route-boundary'
import {
  advanceAnchorRouteBoundaryIntent,
  createAnchorRouteBoundaryIntent,
  isAnchorRouteBoundaryCoolingDown,
  isNestedAnchorRouteBoundaryScroller,
  markAnchorRouteBoundaryNavigation,
} from './anchor-route-boundary-intent'
import type {
  AnchorRouteBoundaryDirection,
  AnchorRouteBoundaryItem,
  AnchorRouteBoundaryNavigateParams,
  AnchorRouteBoundarySlotParams,
  AnchorRouteBoundaryTrigger,
} from './anchor-route-boundary'

defineOptions({ name: 'SAnchorRouteBoundary' })

const props = defineProps(anchorRouteBoundaryProps)
const emit = defineEmits(anchorRouteBoundaryEmits)
defineSlots<{
  previous?(params: AnchorRouteBoundarySlotParams): unknown
  next?(params: AnchorRouteBoundarySlotParams): unknown
}>()
const ns = useNamespace('anchor')
const visibleDirection = shallowRef<AnchorRouteBoundaryDirection>()
const previousVisible = computed(() => visibleDirection.value === 'previous')
const nextVisible = computed(() => visibleDirection.value === 'next')
const previousProgress = shallowRef(0)
const nextProgress = shallowRef(0)
const navigatingDirection = shallowRef<AnchorRouteBoundaryDirection>()
interface PendingWheelNavigation {
  direction: AnchorRouteBoundaryDirection
  event: WheelEvent
}
const progressFallbackDelay = 160
let scrollContainer: HTMLElement | Window | undefined
let navigationResetTimer: ReturnType<typeof setTimeout> | undefined
let progressFallbackTimer: ReturnType<typeof setTimeout> | undefined
let pendingWheelNavigation: PendingWheelNavigation | undefined
let visibilityFrame: number | undefined
let preferredDirection: AnchorRouteBoundaryDirection = 'previous'
const intents = {
  previous: createAnchorRouteBoundaryIntent(0),
  next: createAnchorRouteBoundaryIntent(0),
}

const itemFor = (direction: AnchorRouteBoundaryDirection) =>
  props[direction] as AnchorRouteBoundaryItem | undefined
const visibleFor = (direction: AnchorRouteBoundaryDirection) =>
  direction === 'previous' ? previousVisible.value : nextVisible.value
const setProgress = (
  direction: AnchorRouteBoundaryDirection,
  value: number,
) => {
  if (direction === 'previous') previousProgress.value = value
  else nextProgress.value = value
}
const resetIntent = (direction: AnchorRouteBoundaryDirection) => {
  intents[direction] = createAnchorRouteBoundaryIntent(Date.now())
  setProgress(direction, 0)
}
const cancelPendingWheelNavigation = () => {
  if (progressFallbackTimer) clearTimeout(progressFallbackTimer)
  progressFallbackTimer = undefined
  pendingWheelNavigation = undefined
}
const resetAll = () => {
  cancelPendingWheelNavigation()
  navigatingDirection.value = undefined
  visibleDirection.value = undefined
  resetIntent('previous')
  resetIntent('next')
}
const resetWheelIntents = () => {
  cancelPendingWheelNavigation()
  resetIntent('previous')
  resetIntent('next')
}

const scrollMetrics = () => {
  const container = scrollContainer
  if (!container || container === window) {
    const scroller = document.scrollingElement || document.documentElement
    return {
      start: scroller.scrollTop,
      end: scroller.scrollTop + window.innerHeight,
      size: scroller.scrollHeight,
    }
  }

  const element = container as HTMLElement
  return {
    start: element.scrollTop,
    end: element.scrollTop + element.clientHeight,
    size: element.scrollHeight,
  }
}
const updateVisibility = () => {
  const metrics = scrollMetrics()
  const atPrevious = Boolean(props.previous) && metrics.start <= 2
  const atNext = Boolean(props.next) && metrics.end >= metrics.size - 2
  const nextDirection =
    atPrevious && atNext
      ? preferredDirection
      : atPrevious
        ? 'previous'
        : atNext
          ? 'next'
          : undefined

  if (nextDirection === visibleDirection.value) return
  cancelPendingWheelNavigation()
  const formerDirection = visibleDirection.value
  visibleDirection.value = nextDirection
  if (formerDirection) resetIntent(formerDirection)
  if (nextDirection) resetIntent(nextDirection)
}
const scheduleVisibility = () => {
  if (visibilityFrame !== undefined) return
  visibilityFrame = requestAnimationFrame(() => {
    visibilityFrame = undefined
    updateVisibility()
  })
}

const emitNavigate = (
  direction: AnchorRouteBoundaryDirection,
  trigger: AnchorRouteBoundaryTrigger,
  event: MouseEvent | WheelEvent,
) => {
  const item = itemFor(direction)
  if (!item || item.disabled || navigatingDirection.value) return

  navigatingDirection.value = direction
  const params: AnchorRouteBoundaryNavigateParams = {
    ...item,
    direction,
    trigger,
    event,
  }
  if (trigger === 'wheel') {
    markAnchorRouteBoundaryNavigation(Date.now())
    event.preventDefault()
  }
  emit('navigate', params)

  navigationResetTimer = setTimeout(() => {
    navigatingDirection.value = undefined
    resetIntent(direction)
  }, 1600)
}

const completeWheelNavigation = (direction: AnchorRouteBoundaryDirection) => {
  const pending = pendingWheelNavigation
  if (!pending || pending.direction !== direction) return
  cancelPendingWheelNavigation()
  if (!visibleFor(direction)) {
    resetIntent(direction)
    return
  }
  emitNavigate(direction, 'wheel', pending.event)
}

const scheduleWheelNavigation = (
  direction: AnchorRouteBoundaryDirection,
  event: WheelEvent,
) => {
  if (pendingWheelNavigation) return
  event.preventDefault()
  pendingWheelNavigation = { direction, event }
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
    nextTick(() => completeWheelNavigation(direction))
    return
  }
  progressFallbackTimer = setTimeout(
    () => completeWheelNavigation(direction),
    progressFallbackDelay,
  )
}

const handleClick = (
  direction: AnchorRouteBoundaryDirection,
  event: MouseEvent,
) => {
  cancelPendingWheelNavigation()
  const item = itemFor(direction)
  if (!item || item.disabled) {
    event.preventDefault()
    return
  }
  emitNavigate(direction, 'click', event)
}

const handleWheel = (event: WheelEvent) => {
  if (event.ctrlKey || event.deltaY === 0) {
    cancelPendingWheelNavigation()
    return
  }
  if (navigatingDirection.value) return
  if (isNestedAnchorRouteBoundaryScroller(event, scrollContainer)) {
    resetWheelIntents()
    return
  }
  if (pendingWheelNavigation) {
    event.preventDefault()
    return
  }
  const direction: AnchorRouteBoundaryDirection =
    event.deltaY < 0 ? 'previous' : 'next'
  preferredDirection = direction
  updateVisibility()
  const item = itemFor(direction)
  const now = Date.now()

  if (
    !item ||
    item.disabled ||
    !visibleFor(direction) ||
    isAnchorRouteBoundaryCoolingDown(now, props.routeCooldown)
  )
    return

  const pixels =
    event.deltaMode === WheelEvent.DOM_DELTA_LINE
      ? Math.abs(event.deltaY) * 16
      : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
        ? Math.abs(event.deltaY) * window.innerHeight
        : Math.abs(event.deltaY)
  const advanced = advanceAnchorRouteBoundaryIntent(intents[direction], {
    now,
    delta: pixels,
    threshold: props.threshold,
    armDelay: props.armDelay,
  })
  intents[direction] = advanced.state
  setProgress(direction, advanced.state.progress)

  if (advanced.triggered) scheduleWheelNavigation(direction, event)
}

watch(
  () => [props.previous?.href, props.next?.href],
  async () => {
    resetAll()
    await nextTick()
    updateVisibility()
  },
)

onMounted(() => {
  scrollContainer = props.getContainer?.() || window
  updateVisibility()
  scrollContainer.addEventListener('scroll', scheduleVisibility, {
    passive: true,
  })
  scrollContainer.addEventListener('wheel', handleWheel as EventListener, {
    passive: false,
  })
  if (scrollContainer === window)
    window.addEventListener('resize', scheduleVisibility, { passive: true })
})

onBeforeUnmount(() => {
  cancelPendingWheelNavigation()
  if (navigationResetTimer) clearTimeout(navigationResetTimer)
  if (visibilityFrame !== undefined) cancelAnimationFrame(visibilityFrame)
  scrollContainer?.removeEventListener('scroll', scheduleVisibility)
  scrollContainer?.removeEventListener('wheel', handleWheel as EventListener)
  if (scrollContainer === window)
    window.removeEventListener('resize', scheduleVisibility)
})
</script>
