import {
  computed,
  getCurrentScope,
  onScopeDispose,
  readonly,
  shallowRef,
  toValue,
} from 'vue'

import type { CSSProperties, MaybeRefOrGetter } from 'vue'

export type ImagePreviewScaleMode = 'fit' | 'original' | 'custom'

export interface ImagePreviewTransform {
  scale: number
  rotation: number
  offsetX: number
  offsetY: number
  mode: ImagePreviewScaleMode
}

export interface ImagePreviewZoomOrigin {
  x: number
  y: number
}

export interface UseImageTransformOptions {
  minScale: MaybeRefOrGetter<number>
  maxScale: MaybeRefOrGetter<number>
  zoomRate: MaybeRefOrGetter<number>
}

const FIT_HORIZONTAL_GUTTER = 112
const FIT_VERTICAL_GUTTER = 144

const normalizeRotation = (value: number) => ((value % 360) + 360) % 360

export const useImageTransform = (options: UseImageTransformOptions) => {
  const scale = shallowRef(1)
  const rotation = shallowRef(0)
  const offsetX = shallowRef(0)
  const offsetY = shallowRef(0)
  const mode = shallowRef<ImagePreviewScaleMode>('fit')
  const naturalWidth = shallowRef(0)
  const naturalHeight = shallowRef(0)
  const viewportWidth = shallowRef(0)
  const viewportHeight = shallowRef(0)
  const isDragging = shallowRef(false)

  let pointerId: number | undefined
  let dragStartX = 0
  let dragStartY = 0
  let dragOriginX = 0
  let dragOriginY = 0
  let pendingOffsetX = 0
  let pendingOffsetY = 0
  let panFrame: number | undefined

  const isQuarterTurn = computed(() => rotation.value % 180 !== 0)
  const rotatedWidth = computed(() =>
    isQuarterTurn.value ? naturalHeight.value : naturalWidth.value,
  )
  const rotatedHeight = computed(() =>
    isQuarterTurn.value ? naturalWidth.value : naturalHeight.value,
  )
  const availableWidth = computed(() =>
    Math.max(1, viewportWidth.value - FIT_HORIZONTAL_GUTTER),
  )
  const availableHeight = computed(() =>
    Math.max(1, viewportHeight.value - FIT_VERTICAL_GUTTER),
  )
  const fitScale = computed(() => {
    if (!rotatedWidth.value || !rotatedHeight.value) return 1
    return Math.min(
      1,
      availableWidth.value / rotatedWidth.value,
      availableHeight.value / rotatedHeight.value,
    )
  })
  const effectiveMinScale = computed(() =>
    Math.min(toValue(options.minScale), fitScale.value),
  )
  const displayedWidth = computed(() => rotatedWidth.value * scale.value)
  const displayedHeight = computed(() => rotatedHeight.value * scale.value)
  const maxOffsetX = computed(() =>
    Math.max(0, (displayedWidth.value - viewportWidth.value + 48) / 2),
  )
  const maxOffsetY = computed(() =>
    Math.max(0, (displayedHeight.value - viewportHeight.value + 48) / 2),
  )
  const canPan = computed(() => maxOffsetX.value > 0 || maxOffsetY.value > 0)
  const canZoomIn = computed(() => scale.value < toValue(options.maxScale))
  const canZoomOut = computed(() => scale.value > effectiveMinScale.value)
  const isFit = computed(() => mode.value === 'fit')
  const canReset = computed(
    () =>
      mode.value !== 'fit' ||
      rotation.value !== 0 ||
      offsetX.value !== 0 ||
      offsetY.value !== 0,
  )
  const percentage = computed(() => Math.round(scale.value * 100))
  const imageStyle = computed<CSSProperties>(() => ({
    width: naturalWidth.value ? `${naturalWidth.value}px` : undefined,
    height: naturalHeight.value ? `${naturalHeight.value}px` : undefined,
    maxWidth: naturalWidth.value ? 'none' : undefined,
    maxHeight: naturalHeight.value ? 'none' : undefined,
    transform: `translate3d(${offsetX.value}px, ${offsetY.value}px, 0) rotate(${rotation.value}deg) scale(${scale.value})`,
    transition: isDragging.value ? 'none' : undefined,
  }))

  const clampScale = (value: number) =>
    Math.min(
      Math.max(value, effectiveMinScale.value),
      toValue(options.maxScale),
    )

  const clampOffsets = () => {
    offsetX.value = Math.min(
      Math.max(offsetX.value, -maxOffsetX.value),
      maxOffsetX.value,
    )
    offsetY.value = Math.min(
      Math.max(offsetY.value, -maxOffsetY.value),
      maxOffsetY.value,
    )
  }

  const fitToScreen = () => {
    mode.value = 'fit'
    scale.value = fitScale.value
    offsetX.value = 0
    offsetY.value = 0
  }

  const showOriginal = () => {
    mode.value = 'original'
    scale.value = clampScale(1)
    offsetX.value = 0
    offsetY.value = 0
    clampOffsets()
  }

  const toggleFit = () => {
    if (mode.value === 'fit') showOriginal()
    else fitToScreen()
  }

  const reset = () => {
    rotation.value = 0
    fitToScreen()
  }

  const setImageSize = (width: number, height: number) => {
    naturalWidth.value = Math.max(0, width)
    naturalHeight.value = Math.max(0, height)
    if (mode.value === 'fit') fitToScreen()
    else clampOffsets()
  }

  const clearImageSize = () => {
    naturalWidth.value = 0
    naturalHeight.value = 0
    reset()
  }

  const setViewportSize = (width: number, height: number) => {
    viewportWidth.value = Math.max(0, width)
    viewportHeight.value = Math.max(0, height)
    if (mode.value === 'fit') fitToScreen()
    else clampOffsets()
  }

  const zoomBy = (direction: 1 | -1, origin?: ImagePreviewZoomOrigin) => {
    const factor =
      direction > 0 ? toValue(options.zoomRate) : 1 / toValue(options.zoomRate)
    const previousScale = scale.value
    const nextScale = clampScale(previousScale * factor)
    if (nextScale === previousScale) return

    mode.value = 'custom'
    if (origin) {
      const ratio = nextScale / previousScale
      offsetX.value = origin.x - (origin.x - offsetX.value) * ratio
      offsetY.value = origin.y - (origin.y - offsetY.value) * ratio
    }
    scale.value = nextScale
    clampOffsets()
  }

  const zoomIn = () => zoomBy(1)
  const zoomOut = () => zoomBy(-1)

  const rotateBy = (degrees: number) => {
    rotation.value = normalizeRotation(rotation.value + degrees)
    if (mode.value === 'fit') fitToScreen()
    else clampOffsets()
  }

  const rotateLeft = () => rotateBy(-90)
  const rotateRight = () => rotateBy(90)

  const startPan = (event: PointerEvent) => {
    if (event.button !== 0 || !canPan.value) return
    pointerId = event.pointerId
    dragStartX = event.clientX
    dragStartY = event.clientY
    dragOriginX = offsetX.value
    dragOriginY = offsetY.value
    pendingOffsetX = offsetX.value
    pendingOffsetY = offsetY.value
    isDragging.value = true
    ;(event.currentTarget as HTMLElement | null)?.setPointerCapture?.(
      event.pointerId,
    )
    event.preventDefault()
  }

  const movePan = (event: PointerEvent) => {
    if (!isDragging.value || event.pointerId !== pointerId) return
    pendingOffsetX = dragOriginX + event.clientX - dragStartX
    pendingOffsetY = dragOriginY + event.clientY - dragStartY
    if (panFrame !== undefined) return
    panFrame = requestAnimationFrame(() => {
      panFrame = undefined
      offsetX.value = pendingOffsetX
      offsetY.value = pendingOffsetY
      clampOffsets()
    })
  }

  const endPan = (event: PointerEvent) => {
    if (event.pointerId !== pointerId) return
    if (panFrame !== undefined) {
      cancelAnimationFrame(panFrame)
      panFrame = undefined
      offsetX.value = pendingOffsetX
      offsetY.value = pendingOffsetY
      clampOffsets()
    }
    ;(event.currentTarget as HTMLElement | null)?.releasePointerCapture?.(
      event.pointerId,
    )
    pointerId = undefined
    isDragging.value = false
  }

  if (getCurrentScope()) {
    onScopeDispose(() => {
      if (panFrame !== undefined) cancelAnimationFrame(panFrame)
    })
  }

  const transform = computed<ImagePreviewTransform>(() => ({
    scale: scale.value,
    rotation: rotation.value,
    offsetX: offsetX.value,
    offsetY: offsetY.value,
    mode: mode.value,
  }))

  return {
    scale: readonly(scale),
    rotation: readonly(rotation),
    mode: readonly(mode),
    isDragging: readonly(isDragging),
    transform,
    imageStyle,
    percentage,
    isFit,
    canPan,
    canZoomIn,
    canZoomOut,
    canReset,
    setImageSize,
    clearImageSize,
    setViewportSize,
    zoomIn,
    zoomOut,
    zoomBy,
    rotateLeft,
    rotateRight,
    toggleFit,
    fitToScreen,
    showOriginal,
    reset,
    startPan,
    movePan,
    endPan,
  }
}
