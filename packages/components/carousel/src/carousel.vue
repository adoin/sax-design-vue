<script lang="ts" setup>
import { computed, shallowRef, watch } from 'vue'
import { SIcon } from '@vuesax-alpha/components/icon'
import { useLocale, useNamespace } from '@vuesax-alpha/hooks'
import { addUnit } from '@vuesax-alpha/utils'
import { carouselEmits, carouselProps } from './carousel'
import { useCarousel } from './use-carousel'
import type { CarouselItem } from './carousel'
import type { CSSProperties } from 'vue'

defineOptions({ name: 'SCarousel' })

defineSlots<{
  item(props: {
    item: CarouselItem
    index: number
    active: boolean
    offset: number
  }): unknown
  prev(props: { disabled: boolean }): unknown
  next(props: { disabled: boolean }): unknown
  indicator(props: {
    item: CarouselItem
    index: number
    active: boolean
  }): unknown
}>()

const props = defineProps(carouselProps)
const emit = defineEmits(carouselEmits)
const ns = useNamespace('carousel')
const { t } = useLocale()
const rootRef = shallowRef<HTMLElement | null>(null)
const dragOffset = shallowRef(0)
const isDragging = shallowRef(false)
let pointerId: number | null = null
let dragStart = 0
let suppressClick = false
let hasPointerCapture = false
let pressedItemIndex: number | null = null

interface RenderedCarouselItem {
  item: CarouselItem
  sourceIndex: number
  renderIndex: number
  cloned: boolean
  virtualEdge: boolean
  key: string
}

const {
  activeIndex,
  current,
  movementDelta,
  isTransitioning,
  prevDisabled,
  nextDisabled,
  setCurrent,
  setActiveItem,
  previous,
  next,
  pause,
  play,
  stopTimer,
  startTimer,
  handleMouseEnter,
  handleMouseLeave,
} = useCarousel(props, emit)

const orbitCursor = shallowRef(activeIndex.value)
const prismCursor = shallowRef(activeIndex.value)

watch(
  activeIndex,
  (value) => {
    if (props.effect === 'orbit') orbitCursor.value += movementDelta.value
    else orbitCursor.value = value

    if (props.effect === 'prism') prismCursor.value += movementDelta.value
    else prismCursor.value = value
  },
  { flush: 'sync' },
)

watch(
  () => [props.effect, props.items.length] as const,
  () => {
    orbitCursor.value = current.value
    prismCursor.value = current.value
  },
  { flush: 'sync' },
)

const isLayered = computed(() => props.effect !== 'slide')
const deckVisibleCount = computed(() =>
  Math.max(1, Math.min(4, Math.floor(props.deckVisible))),
)
const orbitBaseRenderCount = computed(() => {
  const length = props.items.length
  if (!length) return 0
  const filledLength = length >= 4 ? length : length * Math.ceil(4 / length)
  const maxVisible = Math.max(4, Math.floor(props.orbitMaxVisible))
  return Math.min(filledLength, maxVisible)
})
const orbitNeedsBalancedSlot = computed(
  () =>
    props.orbitAngle <= 0 &&
    orbitBaseRenderCount.value > 0 &&
    orbitBaseRenderCount.value % 2 === 0,
)
const orbitUsesExtraRealItem = computed(
  () =>
    orbitNeedsBalancedSlot.value &&
    props.items.length > orbitBaseRenderCount.value,
)
const orbitRealRenderCount = computed(
  () => orbitBaseRenderCount.value + Number(orbitUsesExtraRealItem.value),
)
const orbitHasBackPlaceholder = computed(
  () => orbitNeedsBalancedSlot.value && !orbitUsesExtraRealItem.value,
)
const orbitSlotCount = computed(
  () => orbitRealRenderCount.value + Number(orbitHasBackPlaceholder.value),
)
const normalizeItemIndex = (index: number, length: number) =>
  ((index % length) + length) % length
const renderedItems = computed<RenderedCarouselItem[]>(() => {
  if (props.effect !== 'orbit') {
    return props.items.map((item, sourceIndex) => ({
      item,
      sourceIndex,
      renderIndex: sourceIndex,
      cloned: false,
      virtualEdge: false,
      key: `${props.effect}-${String(item?.name ?? item?.src ?? item?.title ?? sourceIndex)}-${sourceIndex}`,
    }))
  }

  const length = props.items.length
  const visibleCount = orbitRealRenderCount.value
  if (!length || !visibleCount) return []

  const itemsBeforeActive = Math.floor((visibleCount - 1) / 2)
  const wrapsItems = props.loop || visibleCount > length
  const unclampedVisibleStart =
    Math.round(orbitCursor.value) - itemsBeforeActive
  const visibleStart = wrapsItems
    ? unclampedVisibleStart
    : Math.min(
        Math.max(current.value - itemsBeforeActive, 0),
        Math.max(0, length - visibleCount),
      )
  const usesOrbitBuffers = props.loop ? length > 1 : length > visibleCount
  const renderCount = props.loop
    ? visibleCount + (usesOrbitBuffers ? 2 : 0)
    : Math.min(length, visibleCount + (usesOrbitBuffers ? 2 : 0))
  const renderStart = wrapsItems
    ? visibleStart - Number(usesOrbitBuffers)
    : Math.min(
        Math.max(visibleStart - Number(usesOrbitBuffers), 0),
        Math.max(0, length - renderCount),
      )

  return Array.from({ length: renderCount }, (_, windowIndex) => {
    const renderIndex = renderStart + windowIndex
    const sourceIndex = normalizeItemIndex(renderIndex, length)
    const item = props.items[sourceIndex]
    return {
      item,
      sourceIndex,
      renderIndex,
      cloned: renderIndex !== sourceIndex,
      virtualEdge:
        usesOrbitBuffers &&
        (renderIndex < visibleStart ||
          renderIndex >= visibleStart + visibleCount),
      key: `${props.effect}-${String(item?.name ?? item?.src ?? item?.title ?? sourceIndex)}-${renderIndex}`,
    }
  })
})
const orbitStep = computed(() => {
  if (props.orbitAngle > 0) return Math.min(120, Math.max(12, props.orbitAngle))
  return orbitSlotCount.value ? 360 / orbitSlotCount.value : 0
})
const showArrows = computed(
  () => props.arrow !== 'never' && props.items.length > 1,
)
const showIndicators = computed(
  () => props.indicatorPosition !== 'none' && props.items.length > 1,
)
const previousIcon = computed(() =>
  props.direction === 'vertical' ? 'cb:chevron-up' : 'cb:chevron-left',
)
const nextIcon = computed(() =>
  props.direction === 'vertical' ? 'cb:chevron-down' : 'cb:chevron-right',
)

const rootClasses = computed(() => [
  ns.b(),
  ns.m(`arrow-${props.arrow}`),
  ns.m(`indicator-${props.indicatorPosition}`),
  ns.m(`indicator-${props.indicatorType}`),
  ns.m(`effect-${props.effect}`),
  ns.m(props.direction),
  ns.is('layered', isLayered.value),
  ns.is('dragging', isDragging.value),
  ns.is('transitioning', isTransitioning.value),
  ns.is('motion-blur', props.motionBlur && isTransitioning.value),
])

const rootStyle = computed<CSSProperties>(
  () =>
    ({
      height: addUnit(props.height),
      '--s-carousel-radius':
        props.radius === true
          ? 'var(--sax-radius-lg)'
          : props.radius === false
            ? '0px'
            : addUnit(props.radius),
      '--s-carousel-duration': `${Math.max(0, props.transitionDuration)}ms`,
      '--s-carousel-easing': props.easing,
      '--s-carousel-perspective': `${Math.max(0, props.perspective)}px`,
    }) as CSSProperties,
)

const trackStyle = computed<CSSProperties>(() => {
  if (props.effect === 'orbit') return {}
  if (props.effect === 'prism') return {}
  if (props.effect !== 'slide') return {}
  const offset = `calc(-${current.value * 100}% + ${dragOffset.value}px)`
  return {
    transform:
      props.direction === 'vertical'
        ? `translate3d(0, ${offset}, 0)`
        : `translate3d(${offset}, 0, 0)`,
  }
})

const getRelativeOffset = (index: number) => {
  const length = props.items.length
  let offset = index - current.value
  if (props.loop && length > 2 && Math.abs(offset) > length / 2) {
    offset += offset > 0 ? -length : length
  }
  return offset
}

const normalizeAngle = (angle: number) =>
  ((((angle + 180) % 360) + 360) % 360) - 180

const getOrbitAngle = (renderIndex: number, includeDrag = true) =>
  (renderIndex - orbitCursor.value) * orbitStep.value +
  (includeDrag ? dragOffset.value * 0.12 : 0)

const prismStep = computed(() =>
  props.items.length ? 360 / Math.max(3, props.items.length) : 0,
)

const getPrismAngle = (sourceIndex: number, includeDrag = true) =>
  (sourceIndex - prismCursor.value) * prismStep.value +
  (includeDrag ? dragOffset.value * 0.12 : 0)

const activeOrbitRenderIndex = computed(() => {
  const candidates = renderedItems.value.filter(
    (rendered) => rendered.sourceIndex === current.value,
  )
  if (!candidates.length) return -1
  return candidates.reduce((closest, candidate) =>
    Math.abs(normalizeAngle(getOrbitAngle(candidate.renderIndex, false))) <
    Math.abs(normalizeAngle(getOrbitAngle(closest.renderIndex, false)))
      ? candidate
      : closest,
  ).renderIndex
})

const activeOrbitItem = computed(() => props.items[current.value])
const activeOrbitKey = computed(
  () =>
    `orbit-focus-${String(
      activeOrbitItem.value?.name ??
        activeOrbitItem.value?.src ??
        activeOrbitItem.value?.title ??
        current.value,
    )}-${current.value}`,
)

const isRenderedActive = (rendered: RenderedCarouselItem) =>
  props.effect === 'orbit'
    ? rendered.renderIndex === activeOrbitRenderIndex.value
    : rendered.sourceIndex === current.value

const getRenderedOffset = (rendered: RenderedCarouselItem) =>
  props.effect === 'orbit' && orbitStep.value
    ? getOrbitAngle(rendered.renderIndex, false) / orbitStep.value
    : getRelativeOffset(rendered.sourceIndex)

const orbitTransform = (renderIndex: number, active: boolean) => {
  const isVertical = props.direction === 'vertical'
  const depth = Math.max(0, props.depth)
  const angle = getOrbitAngle(renderIndex)
  const rotate = isVertical ? `rotateX(${-angle}deg)` : `rotateY(${angle}deg)`
  const stageTilt = isVertical ? 'rotateY(8deg)' : 'rotateX(-7deg)'
  const stagePosition = isVertical
    ? 'translate3d(-16%, -50%, 0)'
    : 'translate3d(-50%, -12%, 0)'
  const scale = active ? 0.72 : 0.62
  return `${stagePosition} ${stageTilt} translateZ(${depth * 0.2}px) ${rotate} translateZ(${depth}px) scale(${scale})`
}

const orbitPlaceholderStyle = computed<CSSProperties>(() => {
  const offset = -Math.ceil(orbitRealRenderCount.value / 2)
  const renderIndex = orbitCursor.value + offset
  const normalizedAngle = normalizeAngle(getOrbitAngle(renderIndex, false))
  const radians = (normalizedAngle * Math.PI) / 180
  const frontness = (Math.cos(radians) + 1) / 2
  return {
    zIndex: Math.round(116 + frontness * 16),
    opacity: 0.78,
    transformOrigin: 'center center',
    transform: orbitTransform(renderIndex, false),
    pointerEvents: 'none',
  }
})

const prismTransform = (sourceIndex: number) => {
  const isVertical = props.direction === 'vertical'
  const angle = getPrismAngle(sourceIndex)
  const rotate = isVertical ? `rotateX(${-angle}deg)` : `rotateY(${angle}deg)`
  const stageTilt = isVertical ? 'rotateY(7deg)' : 'rotateX(-7deg)'
  const stagePosition = isVertical
    ? 'translate3d(-50%, -50%, 0)'
    : 'translate3d(-50%, -60%, 0)'
  const depth = Math.max(0, props.depth)
  const cameraOffset = depth * 0.08
  const faceRadius = depth * 0.82

  return `${stagePosition} ${stageTilt} translateZ(${cameraOffset}px) ${rotate} translateZ(${faceRadius}px) scale(0.78)`
}

const layeredTransform = (offset: number) => {
  const distance = Math.abs(offset)
  const drag = dragOffset.value * 0.22
  const isVertical = props.direction === 'vertical'
  const axis = (percentage: number, depth: number, rotate: number) =>
    isVertical
      ? `translate3d(0, calc(-50% + ${percentage}% + ${drag}px), ${depth}px) rotateX(${rotate}deg)`
      : `translate3d(calc(-50% + ${percentage}% + ${drag}px), 0, ${depth}px) rotateY(${rotate}deg)`

  if (props.effect === 'deck') {
    const side = Math.sign(offset)
    const position = offset === 0 ? 0 : side * (44 + (distance - 1) * 10)
    const scale =
      offset === 0
        ? 1
        : Math.max(
            0.64,
            Math.min(0.98, props.deckScale) - (distance - 1) * 0.06,
          )
    const z = offset === 0 ? 1 : -distance * Math.max(0, props.depth) * 0.32
    return `${axis(position, z, 0)} scale(${scale})`
  }
  return 'translate3d(0, 0, 0)'
}

const getItemStyle = (rendered: RenderedCarouselItem): CSSProperties => {
  const { renderIndex, sourceIndex } = rendered
  const offset = getRelativeOffset(sourceIndex)
  const distance = Math.abs(offset)
  if (props.effect === 'slide') return {}
  if (props.effect === 'fade') {
    return {
      zIndex: sourceIndex === current.value ? 2 : 1,
      opacity: sourceIndex === current.value ? 1 : 0,
    }
  }
  if (props.effect === 'orbit') {
    const active = isRenderedActive(rendered)
    const angle = getOrbitAngle(renderIndex)
    const normalizedAngle = normalizeAngle(angle)
    const radians = (normalizedAngle * Math.PI) / 180
    const frontness = (Math.cos(radians) + 1) / 2
    return {
      zIndex: rendered.virtualEdge
        ? 0
        : active
          ? 220
          : Math.round(80 + frontness * 120),
      opacity: rendered.virtualEdge ? 0 : active ? 1 : 0.3 + frontness * 0.58,
      transformOrigin: 'center center',
      transform: orbitTransform(renderIndex, active),
      pointerEvents:
        !rendered.virtualEdge && (active || Math.abs(normalizedAngle) <= 124)
          ? undefined
          : 'none',
    } as CSSProperties
  }
  if (props.effect === 'prism') {
    const angle = getPrismAngle(sourceIndex)
    const frontness = (Math.cos((angle * Math.PI) / 180) + 1) / 2
    return {
      zIndex: Math.round(100 + frontness * 100),
      opacity: 0.68 + frontness * 0.32,
      transformOrigin: 'center center',
      filter: `brightness(${0.64 + frontness * 0.36}) saturate(${0.62 + frontness * 0.38})`,
      transform: prismTransform(sourceIndex),
      pointerEvents: frontness >= 0.2 ? undefined : 'none',
    }
  }
  const visibleDistance = deckVisibleCount.value
  const deckFilter = props.deckBlur
    ? `blur(${distance * 1.6}px) brightness(${Math.max(0.72, 1 - distance * 0.1)}) saturate(${Math.max(0.68, 1 - distance * 0.12)})`
    : `brightness(${Math.max(0.78, 1 - distance * 0.08)}) saturate(${Math.max(0.76, 1 - distance * 0.1)})`
  return {
    zIndex: Math.max(1, 100 - distance),
    opacity: distance > visibleDistance ? 0 : 1,
    transformOrigin: 'center center',
    filter: deckFilter,
    transform: layeredTransform(offset),
    pointerEvents: distance > visibleDistance ? 'none' : undefined,
  }
}

const getItemClasses = (rendered: RenderedCarouselItem) => {
  const offset = getRenderedOffset(rendered)
  const active = isRenderedActive(rendered)
  return [
    ns.e('item'),
    ns.is('active', active),
    ns.is('previous', offset === -1),
    ns.is('next', offset === 1),
    ns.is('distant', Math.abs(offset) > 1),
    ns.is('clone', rendered.cloned),
    ns.is('virtual-edge', rendered.virtualEdge),
    ns.is('disabled', Boolean(rendered.item?.disabled)),
  ]
}

const handleIndicatorEnter = (index: number) => {
  if (props.trigger === 'hover' && !props.items[index]?.disabled)
    setCurrent(index)
}

const activateLayeredItem = (index: number) => {
  if (
    !isLayered.value ||
    index === current.value ||
    props.items[index]?.disabled
  ) {
    return
  }

  if (props.effect === 'prism') {
    const angle = normalizeAngle(getPrismAngle(index, false))
    if (angle < 0) previous()
    else if (angle > 0) next()
    return
  }

  setCurrent(index)
}

const handleItemClick = (index: number) => {
  if (suppressClick) return
  activateLayeredItem(index)
}

const handleLayeredSurfaceClick = (event: MouseEvent) => {
  if (!isLayered.value || suppressClick || !rootRef.value) return
  const target = event.target
  if (
    target instanceof Element &&
    target.closest('button, a, input, select, textarea, [data-carousel-index]')
  ) {
    return
  }

  const candidates = Array.from(
    rootRef.value.querySelectorAll<HTMLElement>('[data-carousel-index]'),
  )
    .filter((element) => {
      const style = window.getComputedStyle(element)
      if (
        style.pointerEvents === 'none' ||
        style.visibility === 'hidden' ||
        Number(style.opacity) <= 0.01
      ) {
        return false
      }
      const rect = element.getBoundingClientRect()
      return (
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom
      )
    })
    .sort(
      (left, right) =>
        Number(right.style.zIndex || 0) - Number(left.style.zIndex || 0),
    )

  const index = Number(candidates[0]?.dataset.carouselIndex)
  if (Number.isInteger(index)) handleItemClick(index)
}

const pointerAllowed = (event: PointerEvent) =>
  event.isPrimary &&
  ((event.pointerType === 'mouse' && props.draggable) ||
    (event.pointerType !== 'mouse' && props.touchable))

const handlePointerDown = (event: PointerEvent) => {
  const target = event.target
  if (
    !pointerAllowed(event) ||
    props.items.length < 2 ||
    (target instanceof Element &&
      target.closest('button, a, input, select, textarea'))
  ) {
    return
  }
  const item =
    target instanceof Element
      ? target.closest<HTMLElement>('[data-carousel-index]')
      : null
  pressedItemIndex = item ? Number(item.dataset.carouselIndex) : null
  pointerId = event.pointerId
  dragStart = props.direction === 'vertical' ? event.clientY : event.clientX
  dragOffset.value = 0
  hasPointerCapture = false
  stopTimer()
}

const handlePointerMove = (event: PointerEvent) => {
  if (pointerId !== event.pointerId) return
  const point = props.direction === 'vertical' ? event.clientY : event.clientX
  const nextOffset = point - dragStart
  if (!isDragging.value && Math.abs(nextOffset) > 4) {
    isDragging.value = true
  }
  if (!isDragging.value) return
  dragOffset.value = nextOffset
  if (!hasPointerCapture) {
    rootRef.value?.setPointerCapture(event.pointerId)
    hasPointerCapture = true
  }
}

const finishPointer = (event: PointerEvent) => {
  if (pointerId !== event.pointerId) return
  const size =
    props.direction === 'vertical'
      ? rootRef.value?.clientHeight || 1
      : rootRef.value?.clientWidth || 1
  const threshold = Math.min(84, Math.max(34, size * 0.12))
  const distance = Math.abs(dragOffset.value)
  const moved = distance >= threshold
  const dragged = distance > 4
  const direction = dragOffset.value > 0 ? 'previous' : 'next'
  if (hasPointerCapture && rootRef.value?.hasPointerCapture(event.pointerId)) {
    rootRef.value.releasePointerCapture(event.pointerId)
  }
  pointerId = null
  hasPointerCapture = false
  dragOffset.value = 0
  isDragging.value = false
  if (moved) {
    suppressClick = true
    if (direction === 'previous') previous()
    else next()
    window.setTimeout(() => {
      suppressClick = false
    }, 0)
  } else if (dragged) {
    suppressClick = true
    window.setTimeout(() => {
      suppressClick = false
    }, 0)
    startTimer()
  } else {
    if (
      pressedItemIndex !== null &&
      pressedItemIndex !== current.value &&
      !props.items[pressedItemIndex]?.disabled
    ) {
      activateLayeredItem(pressedItemIndex)
    }
    startTimer()
  }
  pressedItemIndex = null
}

const cancelPointer = (event: PointerEvent) => {
  if (pointerId !== event.pointerId) return
  if (hasPointerCapture && rootRef.value?.hasPointerCapture(event.pointerId)) {
    rootRef.value.releasePointerCapture(event.pointerId)
  }
  pointerId = null
  hasPointerCapture = false
  pressedItemIndex = null
  dragOffset.value = 0
  isDragging.value = false
  startTimer()
}

const handleKeydown = (event: KeyboardEvent) => {
  if (!props.keyboard) return
  const previousKey = props.direction === 'vertical' ? 'ArrowUp' : 'ArrowLeft'
  const nextKey = props.direction === 'vertical' ? 'ArrowDown' : 'ArrowRight'
  if (event.key === previousKey) {
    event.preventDefault()
    previous()
  } else if (event.key === nextKey) {
    event.preventDefault()
    next()
  } else if (event.key === 'Home') {
    event.preventDefault()
    const index = props.items.findIndex((item) => !item.disabled)
    if (index >= 0) setCurrent(index)
  } else if (event.key === 'End') {
    event.preventDefault()
    let index = props.items.length - 1
    while (index >= 0 && props.items[index]?.disabled) index -= 1
    if (index >= 0) setCurrent(index)
  }
}

defineExpose({
  activeIndex,
  setActiveItem,
  prev: previous,
  next,
  play,
  pause,
})
</script>

<template>
  <section
    ref="rootRef"
    :class="rootClasses"
    :style="rootStyle"
    role="region"
    aria-roledescription="carousel"
    :aria-live="autoplay ? 'off' : 'polite'"
    :tabindex="keyboard ? 0 : undefined"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @keydown="handleKeydown"
    @pointerdown="handlePointerDown"
    @pointermove="handlePointerMove"
    @pointerup="finishPointer"
    @pointercancel="cancelPointer"
    @click="handleLayeredSurfaceClick"
  >
    <div :class="ns.e('viewport')">
      <div
        v-if="effect === 'orbit' && activeOrbitItem"
        :class="ns.e('orbit-focus')"
      >
        <Transition name="s-carousel-orbit-focus">
          <article
            :key="activeOrbitKey"
            :class="ns.e('orbit-focus-card')"
            role="group"
            aria-roledescription="slide"
            :aria-label="`${current + 1} / ${items.length}`"
          >
            <slot
              name="item"
              :item="activeOrbitItem"
              :index="current"
              :active="true"
              :offset="0"
            >
              <img
                v-if="activeOrbitItem.src"
                :class="ns.e('image')"
                :src="activeOrbitItem.src"
                :alt="activeOrbitItem.alt || activeOrbitItem.title || ''"
                draggable="false"
              />
              <div
                v-if="activeOrbitItem.title || activeOrbitItem.description"
                :class="ns.e('caption')"
              >
                <strong v-if="activeOrbitItem.title">{{
                  activeOrbitItem.title
                }}</strong>
                <span v-if="activeOrbitItem.description">{{
                  activeOrbitItem.description
                }}</span>
              </div>
            </slot>
          </article>
        </Transition>
      </div>

      <div :class="ns.e('track')" :style="trackStyle">
        <article
          v-if="effect === 'orbit' && orbitHasBackPlaceholder"
          :class="[ns.e('item'), ns.e('orbit-placeholder')]"
          :style="orbitPlaceholderStyle"
          role="presentation"
          aria-hidden="true"
        />
        <template v-for="rendered in renderedItems" :key="rendered.key">
          <article
            :data-carousel-index="rendered.sourceIndex"
            :class="getItemClasses(rendered)"
            :style="getItemStyle(rendered)"
            role="group"
            aria-roledescription="slide"
            :aria-label="`${rendered.sourceIndex + 1} / ${items.length}`"
            :aria-hidden="effect === 'orbit' || !isRenderedActive(rendered)"
            @click.stop="handleItemClick(rendered.sourceIndex)"
          >
            <div :class="ns.e('item-content')">
              <slot
                name="item"
                :item="rendered.item"
                :index="rendered.sourceIndex"
                :active="isRenderedActive(rendered)"
                :offset="getRenderedOffset(rendered)"
              >
                <img
                  v-if="rendered.item.src"
                  :class="ns.e('image')"
                  :src="rendered.item.src"
                  :alt="rendered.item.alt || rendered.item.title || ''"
                  draggable="false"
                />
                <div
                  v-if="rendered.item.title || rendered.item.description"
                  :class="ns.e('caption')"
                >
                  <strong v-if="rendered.item.title">{{
                    rendered.item.title
                  }}</strong>
                  <span v-if="rendered.item.description">{{
                    rendered.item.description
                  }}</span>
                </div>
              </slot>
            </div>
          </article>
        </template>
      </div>

      <button
        v-if="showArrows"
        :class="[ns.e('arrow'), ns.e('arrow-prev')]"
        type="button"
        :disabled="prevDisabled"
        :aria-label="t('vs.carousel.previous')"
        @click.stop="previous"
      >
        <slot name="prev" :disabled="prevDisabled">
          <SIcon :name="previousIcon" />
        </slot>
      </button>
      <button
        v-if="showArrows"
        :class="[ns.e('arrow'), ns.e('arrow-next')]"
        type="button"
        :disabled="nextDisabled"
        :aria-label="t('vs.carousel.next')"
        @click.stop="next"
      >
        <slot name="next" :disabled="nextDisabled">
          <SIcon :name="nextIcon" />
        </slot>
      </button>
    </div>

    <div v-if="showIndicators" :class="ns.e('indicators')" role="tablist">
      <button
        v-for="(item, index) in items"
        :key="item.name ?? index"
        :class="[ns.e('indicator'), ns.is('active', index === current)]"
        type="button"
        role="tab"
        :disabled="item.disabled"
        :aria-label="item.label || t('vs.carousel.goto', { index: index + 1 })"
        :aria-selected="index === current"
        @mouseenter="handleIndicatorEnter(index)"
        @click.stop="setCurrent(index)"
      >
        <slot
          name="indicator"
          :item="item"
          :index="index"
          :active="index === current"
        >
          <span v-if="indicatorType === 'number'">{{ index + 1 }}</span>
        </slot>
      </button>
    </div>
  </section>
</template>
