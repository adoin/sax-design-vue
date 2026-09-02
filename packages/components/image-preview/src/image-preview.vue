<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  shallowRef,
  useTemplateRef,
  watch,
} from 'vue'
import { useLocale, useLockscreen, useNamespace } from '@vuesax-alpha/hooks'
import ImagePreviewControls from './image-preview-controls.vue'
import { imagePreviewEmits, imagePreviewProps } from './image-preview'
import { useImageTransform } from './use-image-transform'

defineOptions({ name: 'SImagePreview' })

const props = defineProps(imagePreviewProps)
const emit = defineEmits(imagePreviewEmits)
const ns = useNamespace('image-preview')
const { t } = useLocale()
const previewRef = useTemplateRef<HTMLElement>('preview')
const activeIndex = shallowRef(0)
const lockscreenVisible = shallowRef(false)

const currentUrl = computed(() => props.urlList[activeIndex.value] ?? '')
const currentAlt = computed(() => props.altList[activeIndex.value] ?? '')
const showPrevious = computed(
  () => props.urlList.length > 1 && (props.infinite || activeIndex.value > 0),
)
const showNext = computed(
  () =>
    props.urlList.length > 1 &&
    (props.infinite || activeIndex.value < props.urlList.length - 1),
)
const labels = computed(() => ({
  close: t('vs.imagePreview.close'),
  previous: t('vs.imagePreview.previous'),
  next: t('vs.imagePreview.next'),
  zoomIn: t('vs.imagePreview.zoomIn'),
  zoomOut: t('vs.imagePreview.zoomOut'),
  rotateLeft: t('vs.imagePreview.rotateLeft'),
  rotateRight: t('vs.imagePreview.rotateRight'),
  fitToScreen: t('vs.imagePreview.fitToScreen'),
  originalSize: t('vs.imagePreview.originalSize'),
  reset: t('vs.imagePreview.reset'),
  toolbar: t('vs.imagePreview.toolbar'),
}))

const {
  transform,
  imageStyle,
  percentage,
  isFit,
  isDragging,
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
} = useImageTransform({
  minScale: () => Math.min(props.minScale, props.maxScale),
  maxScale: () => Math.max(props.minScale, props.maxScale),
  zoomRate: () => props.zoomRate,
})

let resizeObserver: ResizeObserver | undefined
let previouslyFocusedElement: HTMLElement | null = null

const updateViewport = () => {
  const element = previewRef.value
  if (!element) return
  const rect = element.getBoundingClientRect()
  setViewportSize(
    rect.width || window.innerWidth,
    rect.height || window.innerHeight,
  )
}

const observePreview = (element?: HTMLElement | null) => {
  resizeObserver?.disconnect()
  resizeObserver = undefined
  if (!element || typeof ResizeObserver === 'undefined') {
    if (element) updateViewport()
    return
  }
  resizeObserver = new ResizeObserver(([entry]) => {
    if (!entry) return
    setViewportSize(entry.contentRect.width, entry.contentRect.height)
  })
  resizeObserver.observe(element)
  updateViewport()
}

const setIndex = (index: number) => {
  const length = props.urlList.length
  if (!length) return
  activeIndex.value = props.infinite
    ? (index + length) % length
    : Math.min(Math.max(index, 0), length - 1)
  emit('switch', activeIndex.value)
}

const previous = () => {
  if (showPrevious.value) setIndex(activeIndex.value - 1)
}
const next = () => {
  if (showNext.value) setIndex(activeIndex.value + 1)
}
const close = () => {
  emit('update:modelValue', false)
  emit('close')
}
const onModalClick = () => {
  if (props.hideOnClickModal) close()
}
const onImageLoad = (event: Event) => {
  const image = event.currentTarget as HTMLImageElement
  setImageSize(image.naturalWidth, image.naturalHeight)
}
const onWheel = (event: WheelEvent) => {
  if (!props.wheelZoom) return
  event.preventDefault()
  const element = previewRef.value
  if (!element) return
  const rect = element.getBoundingClientRect()
  zoomBy(event.deltaY < 0 ? 1 : -1, {
    x: event.clientX - rect.left - rect.width / 2,
    y: event.clientY - rect.top - rect.height / 2,
  })
}
const onPointerDown = (event: PointerEvent) => {
  if (props.draggable) startPan(event)
}
const onKeydown = (event: KeyboardEvent) => {
  if (event.altKey || event.ctrlKey || event.metaKey) return
  if (event.key === 'Escape') {
    if (props.closeOnPressEscape) close()
    return
  }
  if (event.key === 'Tab') {
    const element = previewRef.value
    if (!element) return
    const focusable = Array.from(
      element.querySelectorAll<HTMLElement>(
        'button:not(:disabled), [href], [tabindex]:not([tabindex="-1"])',
      ),
    )
    if (!focusable.length) {
      event.preventDefault()
      element.focus()
      return
    }
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last?.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first?.focus()
    }
    return
  }
  if (event.key === 'ArrowLeft') previous()
  else if (event.key === 'ArrowRight') next()
  else if (event.key === '+' || event.key === '=') zoomIn()
  else if (event.key === '-' || event.key === '_') zoomOut()
  else if (event.key === '0') reset()
  else if (event.key.toLowerCase() === 'r') {
    if (event.shiftKey) rotateLeft()
    else rotateRight()
  } else if (event.key.toLowerCase() === 'f') toggleFit()
  else return
  event.preventDefault()
}

useLockscreen(lockscreenVisible)

watch(previewRef, (element) => observePreview(element), { flush: 'post' })
watch(currentUrl, () => clearImageSize())
watch(transform, (value) => emit('transform', value))
watch(
  () => props.modelValue,
  async (visible) => {
    lockscreenVisible.value = visible
    if (visible) {
      previouslyFocusedElement = document.activeElement as HTMLElement | null
      setIndex(props.initialIndex)
      reset()
      await nextTick()
      updateViewport()
      previewRef.value?.focus()
    } else {
      await nextTick()
      previouslyFocusedElement?.focus()
      previouslyFocusedElement = null
    }
  },
  { immediate: true },
)
watch(
  () => [props.initialIndex, props.urlList.length] as const,
  () => {
    if (props.modelValue) setIndex(props.initialIndex)
  },
)

onBeforeUnmount(() => resizeObserver?.disconnect())

defineExpose({
  close,
  next,
  previous,
  setIndex,
  zoomIn,
  zoomOut,
  rotateLeft,
  rotateRight,
  toggleFit,
  fitToScreen,
  showOriginal,
  reset,
})
</script>

<template>
  <Teleport to="body">
    <Transition name="s-image-preview-fade">
      <div
        v-if="modelValue"
        ref="preview"
        :class="ns.b()"
        :style="{ zIndex }"
        role="dialog"
        aria-modal="true"
        :aria-label="t('vs.imagePreview.label')"
        tabindex="-1"
        @keydown="onKeydown"
      >
        <div
          :class="[
            ns.e('canvas'),
            ns.is('pannable', draggable && canPan),
            ns.is('dragging', isDragging),
          ]"
          @click.self="onModalClick"
          @wheel="onWheel"
          @pointerdown="onPointerDown"
          @pointermove="movePan"
          @pointerup="endPan"
          @pointercancel="endPan"
        >
          <img
            v-if="currentUrl"
            :key="currentUrl"
            :class="ns.e('image')"
            :style="imageStyle"
            :src="currentUrl"
            :alt="currentAlt"
            draggable="false"
            @load="onImageLoad"
          />
        </div>

        <ImagePreviewControls
          :current="activeIndex + 1"
          :total="urlList.length"
          :percentage="percentage"
          :show-previous="showPrevious"
          :show-next="showNext"
          :show-toolbar="showToolbar"
          :can-zoom-in="canZoomIn"
          :can-zoom-out="canZoomOut"
          :can-reset="canReset"
          :is-fit="isFit"
          :labels="labels"
          @close="close"
          @previous="previous"
          @next="next"
          @zoom-in="zoomIn"
          @zoom-out="zoomOut"
          @rotate-left="rotateLeft"
          @rotate-right="rotateRight"
          @toggle-fit="toggleFit"
          @reset="reset"
        />
      </div>
    </Transition>
  </Teleport>
</template>
