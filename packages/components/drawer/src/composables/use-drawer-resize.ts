import { computed, nextTick, onBeforeUnmount, shallowRef, watch } from 'vue'
import type { Ref } from 'vue'
import type {
  DrawerEmitsFn,
  DrawerPlacement,
  DrawerProps,
  DrawerResizeEvent,
} from '../drawer'

export const useDrawerResize = (
  props: DrawerProps,
  placement: Readonly<Ref<DrawerPlacement>>,
  panel: Readonly<Ref<HTMLElement | null | undefined>>,
  container: Readonly<Ref<HTMLElement | null | undefined>>,
  active: Readonly<Ref<boolean>>,
  emit: DrawerEmitsFn,
) => {
  const horizontal = computed(() => ['left', 'right'].includes(placement.value))
  const baseSize = computed(() => {
    const value = (horizontal.value ? props.width : props.height) ?? props.size
    return value === 'large' ? 736 : value === 'default' ? 360 : value
  })
  const resizedSize = shallowRef<number>()
  const resizing = shallowRef(false)
  const measured = shallowRef(0)
  const lower = shallowRef(0)
  const upper = shallowRef(0)
  const size = computed(() => resizedSize.value ?? baseSize.value)
  let document: Document | undefined
  let view: Window | null = null
  let frame = 0
  let startPosition = 0
  let initialSize = 0
  let pending: PointerEvent | undefined
  let minimum = 0
  let maximum = 0
  let pointerId = 0
  let cursor = ''
  let userSelect = ''
  let initialEvent: Event | undefined
  let observer: ResizeObserver | undefined
  const axisSize = (element: HTMLElement | null | undefined) => {
    const rect = element?.getBoundingClientRect()
    return (horizontal.value ? rect?.width : rect?.height) || 0
  }
  const viewportSize = () =>
    axisSize(container.value) ||
    (horizontal.value
      ? panel.value?.ownerDocument.defaultView?.innerWidth
      : panel.value?.ownerDocument.defaultView?.innerHeight) ||
    1024
  const pixels = (value: string | number | undefined, fallback: number) => {
    if (typeof value === 'number')
      return Number.isFinite(value) ? value : fallback
    if (!value) return fallback
    const parsed = Number.parseFloat(value)
    if (/^[\d.]+%$/.test(value.trim())) return (parsed * viewportSize()) / 100
    if (/^[\d.]+rem$/.test(value.trim()))
      return (
        parsed *
        Number.parseFloat(
          getComputedStyle(panel.value!.ownerDocument.documentElement).fontSize,
        )
      )
    if (/^[\d.]+vw$/.test(value.trim()))
      return (
        (parsed *
          (panel.value?.ownerDocument.defaultView?.innerWidth ?? 1024)) /
        100
      )
    if (/^[\d.]+vh$/.test(value.trim()))
      return (
        (parsed *
          (panel.value?.ownerDocument.defaultView?.innerHeight ?? 768)) /
        100
      )
    if (/^[\d.]+(?:px)?$/.test(value.trim())) return parsed
    // Resolve arbitrary CSS lengths once per gesture, not on pointer moves.
    const parent = container.value ?? panel.value?.parentElement
    if (!parent) return fallback
    const probe = parent.ownerDocument.createElement('div')
    Object.assign(probe.style, {
      position: 'absolute',
      visibility: 'hidden',
      pointerEvents: 'none',
      [horizontal.value ? 'width' : 'height']: value,
    })
    parent.append(probe)
    const measured = axisSize(probe)
    probe.remove()
    return measured || fallback
  }
  const measuredSize = () => axisSize(panel.value) || pixels(size.value, 360)
  const bounds = () => {
    const limit = Math.max(0, viewportSize())
    maximum = Math.max(0, Math.min(limit, pixels(props.maxSize, limit)))
    minimum = Math.max(0, Math.min(maximum, pixels(props.minSize, 120)))
    lower.value = minimum
    upper.value = maximum
  }
  const refresh = () => {
    if (!panel.value) return
    measured.value = measuredSize()
    bounds()
  }
  const info = (value: number, event: Event): DrawerResizeEvent => ({
    size: value,
    placement: placement.value,
    event,
  })
  const commit = (value: number, event: Event) => {
    const next = Math.round(Math.max(minimum, Math.min(maximum, value)))
    if (next === resizedSize.value) return
    resizedSize.value = next
    emit('update:size', next)
    if (horizontal.value) emit('update:width', next)
    else emit('update:height', next)
    emit('resize', info(next, event))
    nextTick(refresh)
  }
  const sign = () => (['right', 'bottom'].includes(placement.value) ? -1 : 1)
  const position = (event: PointerEvent) =>
    horizontal.value ? event.clientX : event.clientY
  const flush = () => {
    frame = 0
    if (pending && resizing.value)
      commit(
        initialSize + (position(pending) - startPosition) * sign(),
        pending,
      )
    pending = undefined
  }
  const move = (event: PointerEvent) => {
    if (event.pointerId !== pointerId) return
    pending = event
    if (!frame) frame = view?.requestAnimationFrame(flush) ?? 0
  }
  const finish = (event?: Event) => {
    if (!resizing.value) return
    if (frame) view?.cancelAnimationFrame(frame)
    if (pending && event) flush()
    else pending = undefined
    frame = 0
    resizing.value = false
    document?.removeEventListener('pointermove', move)
    document?.removeEventListener('pointerup', end)
    document?.removeEventListener('pointercancel', end)
    if (document) {
      document.body.style.cursor = cursor
      document.body.style.userSelect = userSelect
    }
    if (event || initialEvent)
      emit(
        'resizeEnd',
        info(resizedSize.value ?? initialSize, (event ?? initialEvent)!),
      )
  }
  const end = (event: PointerEvent) => {
    if (event.pointerId === pointerId) {
      if (event.type === 'pointerup') pending = event
      finish(event)
    }
  }
  const start = (event: PointerEvent) => {
    if (
      !props.resizable ||
      !active.value ||
      event.button !== 0 ||
      resizing.value
    )
      return
    event.preventDefault()
    document = panel.value?.ownerDocument
    if (!document) return
    view = document.defaultView
    pointerId = event.pointerId
    initialEvent = event
    bounds()
    initialSize = measuredSize()
    startPosition = position(event)
    cursor = document.body.style.cursor
    userSelect = document.body.style.userSelect
    document.body.style.cursor = horizontal.value ? 'ew-resize' : 'ns-resize'
    document.body.style.userSelect = 'none'
    resizing.value = true
    emit('resizeStart', info(initialSize, event))
    document.addEventListener('pointermove', move)
    document.addEventListener('pointerup', end)
    document.addEventListener('pointercancel', end)
  }
  const keydown = (event: KeyboardEvent) => {
    if (!props.resizable || !active.value) return
    const forward = horizontal.value ? 'ArrowRight' : 'ArrowDown'
    const backward = horizontal.value ? 'ArrowLeft' : 'ArrowUp'
    if (![forward, backward, 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    bounds()
    const current = measuredSize()
    const step = Math.max(1, props.resizeStep || 10) * (event.shiftKey ? 5 : 1)
    const value =
      event.key === 'Home'
        ? minimum
        : event.key === 'End'
          ? maximum
          : current + (event.key === forward ? 1 : -1) * sign() * step
    emit('resizeStart', info(current, event))
    commit(value, event)
    emit('resizeEnd', info(resizedSize.value ?? current, event))
  }
  watch([baseSize, placement], ([value, edge], [, previousEdge]) => {
    // A v-model echo of our own sample must not terminate the gesture.
    if (resizing.value && edge === previousEdge && value === resizedSize.value)
      return
    finish()
    resizedSize.value = undefined
  })
  watch([baseSize, active], () => nextTick(refresh))
  watch(
    () => props.resizable && active.value,
    (enabled) => {
      if (!enabled) finish()
    },
  )
  watch(
    panel,
    (element) => {
      observer?.disconnect()
      if (typeof ResizeObserver !== 'undefined' && element) {
        observer = new ResizeObserver(refresh)
        observer.observe(element)
      }
      nextTick(refresh)
    },
    { flush: 'post' },
  )
  onBeforeUnmount(() => {
    finish()
    observer?.disconnect()
  })
  return {
    size,
    baseSize,
    resizing,
    horizontal,
    resizedSize,
    start,
    keydown,
    measuredSize,
    actualSize: computed(() => measured.value || resizedSize.value || 0),
    minimum: lower,
    maximum: upper,
  }
}
