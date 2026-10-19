<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  shallowRef,
  useTemplateRef,
  watch,
} from 'vue'
import { useId, useLocale, useShape } from '@vuesax-alpha/hooks'
import { SButton } from '@vuesax-alpha/components/button'
import { SInput } from '@vuesax-alpha/components/input'
import { SIcon } from '@vuesax-alpha/components/icon'
import { constrainWindowRect, resizeWindowRect, windowProps } from './window'
import type {
  WindowBounds,
  WindowExposes,
  WindowRect,
  WindowResizeDirection,
} from './window'
import type { InputInstance } from '@vuesax-alpha/components/input'

defineOptions({ name: 'SWindow' })
const props = defineProps(windowProps)
const emit = defineEmits<{
  'update:rect': [rect: WindowRect]
  'update:title': [title: string]
  activate: []
  'drag-start': [rect: WindowRect]
  'drag-end': [rect: WindowRect]
  'resize-start': [rect: WindowRect]
  'resize-end': [rect: WindowRect]
}>()
const shape = useShape()
const { t } = useLocale()
const titleId = useId().value
const root = useTemplateRef<HTMLElement>('root')
const mover = useTemplateRef<HTMLButtonElement>('mover')
const editor = useTemplateRef<InputInstance>('editor')
const local = shallowRef<WindowRect>({ ...props.rect })
const bounds = shallowRef<WindowBounds>()
const editing = shallowRef(false)
const draft = shallowRef('')
const gesture = shallowRef<{
  id: number
  x: number
  y: number
  rect: WindowRect
  direction?: WindowResizeDirection
}>()
const directions: WindowResizeDirection[] = [
  'n',
  's',
  'e',
  'w',
  'ne',
  'nw',
  'se',
  'sw',
]
let observer: ResizeObserver | undefined
let frame = 0
let pending: WindowRect | undefined
const limits = () => (props.boundary ? bounds.value : undefined)
const normalize = (value: WindowRect) =>
  constrainWindowRect(value, props.minWidth, props.minHeight, limits())
function publish(rect: WindowRect) {
  const next = normalize(rect)
  if (
    Object.keys(next).every(
      (key) =>
        next[key as keyof WindowRect] === local.value[key as keyof WindowRect],
    )
  )
    return
  local.value = next
  emit('update:rect', { ...next })
}
watch(
  () => props.rect,
  (rect) => {
    local.value = normalize(rect)
  },
  { deep: true, immediate: true },
)
watch(
  () => [props.minWidth, props.minHeight, props.boundary],
  () => publish(local.value),
)
function flush() {
  cancelAnimationFrame(frame)
  frame = 0
  if (pending) {
    publish(pending)
    pending = undefined
  }
}
function start(event: PointerEvent, direction?: WindowResizeDirection) {
  if (
    event.button !== 0 ||
    gesture.value ||
    (direction ? !props.resizable : !props.draggable)
  )
    return
  event.preventDefault()
  emit('activate')
  gesture.value = {
    id: event.pointerId,
    x: event.clientX,
    y: event.clientY,
    rect: { ...local.value },
    direction,
  }
  root.value?.setPointerCapture?.(event.pointerId)
  if (direction) emit('resize-start', { ...local.value })
  else emit('drag-start', { ...local.value })
}
function move(event: PointerEvent) {
  const current = gesture.value
  if (!current || event.pointerId !== current.id) return
  const dx = event.clientX - current.x,
    dy = event.clientY - current.y
  pending = current.direction
    ? resizeWindowRect(
        current.rect,
        current.direction,
        dx,
        dy,
        props.minWidth,
        props.minHeight,
        limits(),
      )
    : { ...current.rect, x: current.rect.x + dx, y: current.rect.y + dy }
  if (!frame) frame = requestAnimationFrame(flush)
}
function finish(cancel = false) {
  const current = gesture.value
  if (!current) return
  flush()
  if (cancel) publish(current.rect)
  gesture.value = undefined
  if (root.value?.hasPointerCapture?.(current.id))
    root.value.releasePointerCapture(current.id)
  if (current.direction) emit('resize-end', { ...local.value })
  else emit('drag-end', { ...local.value })
}
function keyboard(event: KeyboardEvent, direction?: WindowResizeDirection) {
  if (
    (direction ? !props.resizable : !props.draggable) ||
    !event.key.startsWith('Arrow')
  )
    return
  event.preventDefault()
  const step = Math.max(1, props.keyboardStep) * (event.shiftKey ? 5 : 1)
  const dx =
    event.key === 'ArrowLeft' ? -step : event.key === 'ArrowRight' ? step : 0
  const dy =
    event.key === 'ArrowUp' ? -step : event.key === 'ArrowDown' ? step : 0
  publish(
    direction
      ? resizeWindowRect(
          local.value,
          direction,
          dx,
          dy,
          props.minWidth,
          props.minHeight,
          limits(),
        )
      : { ...local.value, x: local.value.x + dx, y: local.value.y + dy },
  )
  if (direction) emit('resize-end', { ...local.value })
  else emit('drag-end', { ...local.value })
}
async function rename() {
  draft.value = props.title
  editing.value = true
  await nextTick()
  editor.value?.focus()
  editor.value?.select()
}
function saveTitle(cancel = false) {
  if (!editing.value) return
  editing.value = false
  if (!cancel && draft.value.trim()) emit('update:title', draft.value.trim())
  mover.value?.focus({ preventScroll: true })
}
onMounted(() => {
  const parent = root.value?.parentElement
  if (!parent || typeof ResizeObserver === 'undefined') return
  observer = new ResizeObserver(() => {
    if (!parent.clientWidth || !parent.clientHeight) return
    bounds.value = { width: parent.clientWidth, height: parent.clientHeight }
    publish(local.value)
  })
  observer.observe(parent)
})
onBeforeUnmount(() => {
  observer?.disconnect()
  cancelAnimationFrame(frame)
})
const style = computed(() => ({
  left: `${local.value.x}px`,
  top: `${local.value.y}px`,
  width: `${local.value.width}px`,
  height: `${local.value.height}px`,
  zIndex: props.zIndex,
}))
defineExpose<WindowExposes>({
  focus: () => mover.value?.focus({ preventScroll: true }),
  rename,
})
</script>

<template>
  <section
    ref="root"
    class="s-window"
    :class="[
      { 'is-active': active, 'is-dragging': gesture },
      `s-window--${shape}`,
    ]"
    :style="style"
    role="region"
    :aria-label="title || t('vs.window.window')"
    @pointerdown="emit('activate')"
    @focusin="emit('activate')"
    @pointermove="move"
    @pointerup="finish()"
    @pointercancel="finish(true)"
    @lostpointercapture="finish()"
    @keydown.esc="gesture && finish(true)"
  >
    <header class="s-window__header">
      <SInput
        v-if="editing"
        ref="editor"
        v-model="draft"
        class="s-window__editor"
        :shape="shape"
        :aria-label="t('vs.window.rename')"
        @keydown.enter.prevent="saveTitle()"
        @keydown.esc.stop.prevent="saveTitle(true)"
        @blur="saveTitle()"
      />
      <button
        v-else
        ref="mover"
        class="s-window__title"
        type="button"
        :aria-label="`${t('vs.window.move')}: ${title}`"
        :aria-describedby="`${titleId}-help`"
        @pointerdown.stop="start($event)"
        @keydown="keyboard($event)"
      >
        <slot name="title" :title="title"
          ><span>{{ title }}</span></slot
        >
      </button>
      <span :id="`${titleId}-help`" class="s-window__sr">{{
        t('vs.window.keyboard')
      }}</span>
      <SButton
        v-if="titleEditable && !editing"
        type="transparent"
        icon
        :debounce="false"
        :shape="shape"
        :aria-label="t('vs.window.rename')"
        @click="rename"
        ><SIcon name="bx:pencil"
      /></SButton>
      <div v-if="$slots.actions" class="s-window__actions">
        <slot name="actions" />
      </div>
    </header>
    <div class="s-window__body"><slot /></div>
    <template v-if="resizable">
      <button
        v-for="direction in directions"
        :key="direction"
        type="button"
        class="s-window__resize"
        :class="`s-window__resize--${direction}`"
        :tabindex="direction === 'se' ? 0 : -1"
        :aria-label="`${t('vs.window.resize')}: ${direction}`"
        :aria-describedby="`${titleId}-help`"
        @pointerdown.stop="start($event, direction)"
        @keydown="keyboard($event, direction)"
      />
    </template>
  </section>
</template>
