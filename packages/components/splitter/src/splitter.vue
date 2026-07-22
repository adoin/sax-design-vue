<template>
  <div
    ref="rootRef"
    :class="[
      ns.b(),
      ns.m(direction),
      ns.is('dragging', dragging),
      ns.is('disabled', disabled),
    ]"
  >
    <div :class="ns.e('panel')" :style="firstPanelStyle">
      <slot name="first" />
    </div>
    <button
      :class="ns.e('handle')"
      type="button"
      :disabled="disabled"
      :aria-label="`Resize ${direction} panels`"
      @pointerdown="startDrag"
    >
      <span :class="ns.e('grip')"><i /><i /><i /></span>
    </button>
    <div :class="ns.e('panel')"><slot name="second" /></div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useNamespace } from '@vuesax-alpha/hooks'
import { splitterEmits, splitterProps } from './splitter'
import type { CSSProperties } from 'vue'

defineOptions({ name: 'SSplitter' })

const props = defineProps(splitterProps)
const emit = defineEmits(splitterEmits)
const ns = useNamespace('splitter')
const rootRef = ref<HTMLElement>()
const current = ref(50)
const dragging = ref(false)

const clamp = (value: number) => Math.min(Math.max(value, props.min), props.max)
const firstPanelStyle = computed<CSSProperties>(() => ({
  flex: `0 0 ${current.value}%`,
}))

const setCurrent = (value: number, emitChange = false) => {
  const next = clamp(value)
  if (next === current.value) return
  current.value = next
  emit('update:modelValue', next)
  if (emitChange) emit('change', next)
}

const onPointerMove = (event: PointerEvent) => {
  const root = rootRef.value
  if (!dragging.value || !root) return
  const rect = root.getBoundingClientRect()
  const length = props.direction === 'horizontal' ? rect.width : rect.height
  const offset =
    props.direction === 'horizontal'
      ? event.clientX - rect.left
      : event.clientY - rect.top
  if (length) setCurrent((offset / length) * 100)
}

const stopDrag = () => {
  if (!dragging.value) return
  dragging.value = false
  emit('change', current.value)
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', stopDrag)
}

const startDrag = (event: PointerEvent) => {
  if (props.disabled) return
  event.preventDefault()
  dragging.value = true
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', stopDrag, { once: true })
}

watch(
  () => [props.modelValue, props.min, props.max],
  () => {
    current.value = clamp(props.modelValue)
  },
  { immediate: true },
)

onBeforeUnmount(stopDrag)
</script>
