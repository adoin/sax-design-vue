import {
  computed,
  onBeforeUnmount,
  onMounted,
  readonly,
  shallowRef,
  watch,
} from 'vue'
import type { CarouselProps } from './carousel'

type CarouselEmit = {
  (event: 'update:modelValue', index: number): void
  (event: 'before-change', index: number, previous: number): void
  (event: 'after-change', index: number, previous: number): void
  (event: 'change', index: number, previous: number): void
}

export function useCarousel(props: CarouselProps, emit: CarouselEmit) {
  const current = shallowRef(0)
  const movementDelta = shallowRef(0)
  const isTransitioning = shallowRef(false)
  const isHovered = shallowRef(false)
  const manuallyPaused = shallowRef(false)
  let autoplayTimer: ReturnType<typeof setInterval> | undefined
  let transitionTimer: ReturnType<typeof setTimeout> | undefined

  const enabledCount = computed(
    () => props.items.filter((item) => !item.disabled).length,
  )

  const normalizeIndex = (index: number) => {
    const length = props.items.length
    if (!length) return 0
    if (props.loop) return ((index % length) + length) % length
    return Math.min(Math.max(index, 0), length - 1)
  }

  const findEnabled = (start: number, step: 1 | -1, includeStart = true) => {
    const length = props.items.length
    if (!length || enabledCount.value === 0) return null
    let index = normalizeIndex(start)
    for (let checked = 0; checked < length; checked += 1) {
      if ((includeStart || checked > 0) && !props.items[index]?.disabled) {
        return index
      }
      const nextIndex = index + step
      if (!props.loop && (nextIndex < 0 || nextIndex >= length)) return null
      index = normalizeIndex(nextIndex)
    }
    return null
  }

  const getSibling = (step: 1 | -1) => {
    if (props.items.length < 2 || enabledCount.value < 2) return null
    const requestedIndex = current.value + step
    if (
      !props.loop &&
      (requestedIndex < 0 || requestedIndex >= props.items.length)
    ) {
      return null
    }
    const index = findEnabled(requestedIndex, step, true)
    return index === current.value ? null : index
  }

  const prevDisabled = computed(() => getSibling(-1) === null)
  const nextDisabled = computed(() => getSibling(1) === null)

  const stopTimer = () => {
    if (autoplayTimer) clearInterval(autoplayTimer)
    autoplayTimer = undefined
  }

  const canAutoplay = () =>
    props.autoplay &&
    props.interval > 0 &&
    enabledCount.value > 1 &&
    !manuallyPaused.value &&
    !(props.pauseOnHover && isHovered.value) &&
    (typeof document === 'undefined' || !document.hidden)

  const startTimer = () => {
    stopTimer()
    if (!canAutoplay()) return
    autoplayTimer = setInterval(() => next(), props.interval)
  }

  const finishTransition = (index: number, previous: number) => {
    if (transitionTimer) clearTimeout(transitionTimer)
    isTransitioning.value = true
    transitionTimer = setTimeout(
      () => {
        isTransitioning.value = false
        emit('after-change', index, previous)
      },
      Math.max(0, props.transitionDuration),
    )
  }

  const resolveMovementDelta = (
    previousIndex: number,
    nextIndex: number,
    direction?: 1 | -1,
  ) => {
    const length = props.items.length
    if (!props.loop || length < 2) return nextIndex - previousIndex
    if (direction === 1)
      return (nextIndex - previousIndex + length) % length || length
    if (direction === -1)
      return -((previousIndex - nextIndex + length) % length || length)

    let delta = nextIndex - previousIndex
    if (delta > length / 2) delta -= length
    else if (delta < -length / 2) delta += length
    return delta
  }

  const setCurrent = (requestedIndex: number, directionHint?: 1 | -1) => {
    if (!props.items.length) return
    const direction: 1 | -1 =
      directionHint ?? (requestedIndex < current.value ? -1 : 1)
    const nextIndex = findEnabled(requestedIndex, direction, true)
    if (nextIndex === null || nextIndex === current.value) return
    const previousIndex = current.value
    movementDelta.value = resolveMovementDelta(
      previousIndex,
      nextIndex,
      directionHint,
    )
    emit('before-change', nextIndex, previousIndex)
    current.value = nextIndex
    emit('update:modelValue', nextIndex)
    emit('change', nextIndex, previousIndex)
    finishTransition(nextIndex, previousIndex)
    startTimer()
  }

  function previous() {
    const index = getSibling(-1)
    if (index !== null) setCurrent(index, -1)
  }

  function next() {
    const index = getSibling(1)
    if (index !== null) setCurrent(index, 1)
    else stopTimer()
  }

  const setActiveItem = (value: number | string) => {
    const index =
      typeof value === 'number'
        ? value
        : props.items.findIndex((item) => String(item.name) === value)
    if (index >= 0) setCurrent(index)
  }

  const pause = () => {
    manuallyPaused.value = true
    stopTimer()
  }

  const play = () => {
    manuallyPaused.value = false
    startTimer()
  }

  const handleMouseEnter = () => {
    isHovered.value = true
    if (props.pauseOnHover) stopTimer()
  }

  const handleMouseLeave = () => {
    isHovered.value = false
    startTimer()
  }

  const handleVisibilityChange = () => {
    if (document.hidden) stopTimer()
    else startTimer()
  }

  watch(
    () => props.modelValue,
    (value) => {
      const direction: 1 | -1 = value < current.value ? -1 : 1
      const normalized = findEnabled(value, direction, true)
      const nextIndex = normalized ?? 0
      if (nextIndex === current.value) return
      movementDelta.value = resolveMovementDelta(current.value, nextIndex)
      current.value = nextIndex
    },
    { immediate: true },
  )

  watch(
    () => [
      props.items.map((item) => item.disabled).join(','),
      props.autoplay,
      props.interval,
      props.loop,
      props.pauseOnHover,
    ],
    () => {
      const normalized = findEnabled(current.value, 1, true)
      current.value = normalized ?? 0
      startTimer()
    },
  )

  onMounted(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange)
    startTimer()
  })

  onBeforeUnmount(() => {
    document.removeEventListener('visibilitychange', handleVisibilityChange)
    stopTimer()
    if (transitionTimer) clearTimeout(transitionTimer)
  })

  return {
    activeIndex: readonly(current),
    current,
    movementDelta: readonly(movementDelta),
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
  }
}
