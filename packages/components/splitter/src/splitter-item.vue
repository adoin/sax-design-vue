<template>
  <div
    :class="[
      ns.e('panel'),
      ns.is('group', isGroup),
      ns.is('disabled', itemDisabled),
    ]"
    :style="panelStyle"
  >
    <div
      v-if="isGroup"
      :class="[ns.e('group'), ns.em('group', nestedDirection)]"
    >
      <slot />
    </div>
    <slot v-else />
  </div>
  <button
    v-if="!isLast"
    type="button"
    role="separator"
    :class="[ns.e('handle'), ns.is('active', dragging)]"
    :disabled="handleDisabled"
    :aria-label="t('vs.splitter.resize', { direction })"
    :aria-orientation="separatorOrientation"
    :aria-valuemin="Math.round(handleBounds.min * 100)"
    :aria-valuemax="Math.round(handleBounds.max * 100)"
    :aria-valuenow="Math.round(currentSize * 100)"
    @pointerdown="startDrag"
    @keydown="handleKeydown"
  >
    <span :class="ns.e('rail')" aria-hidden="true">
      <i />
      <i />
    </span>
  </button>
</template>

<script lang="ts" setup>
import { computed, inject, onBeforeUnmount, provide, ref } from 'vue'
import { useLocale, useNamespace } from '@vuesax-alpha/hooks'
import {
  createSplitterGroupContext,
  splitterGroupContextKey,
} from './splitter-context'
import { isSplitterGroupValue } from './splitter'
import { splitterItemProps } from './splitter-item'

import type { CSSProperties } from 'vue'

defineOptions({ name: 'SSplitterItem' })

const props = defineProps(splitterItemProps)
const ns = useNamespace('splitter')
const { t } = useLocale()
const group = inject(splitterGroupContextKey)

if (!group) {
  throw new Error('[SSplitterItem] must be used inside SSplitter')
}

const itemId = Symbol('splitter-item')
const dragging = ref(false)
const registeredItem = {
  id: itemId,
  min: computed(() => props.min),
  max: computed(() => props.max),
  disabled: computed(() => props.disabled),
  useRest: computed(() => props.useRest),
}

group.register(registeredItem)

const index = computed(() => group.items.findIndex(({ id }) => id === itemId))
const itemCount = computed(() => group.items.length)
const itemValue = computed(() => group.model.value?.size[index.value] ?? 'rest')
const isGroup = computed(() => isSplitterGroupValue(itemValue.value))
const nestedDirection = computed(() =>
  isSplitterGroupValue(itemValue.value) ? itemValue.value.type : 'horizontal',
)
const direction = computed(() => group.model.value?.type ?? 'horizontal')
const currentSize = computed(() => group.sizes.value[index.value] ?? 0)
const isLast = computed(
  () => index.value < 0 || index.value >= itemCount.value - 1,
)
const itemDisabled = computed(() => group.root.disabled.value || props.disabled)
const handleDisabled = computed(() => {
  const next = group.items[index.value + 1]
  return itemDisabled.value || !next || next.disabled.value
})
const separatorOrientation = computed(() =>
  direction.value === 'horizontal' ? 'vertical' : 'horizontal',
)
const panelStyle = computed<CSSProperties>(() => ({
  flexBasis: '0px',
  flexGrow: currentSize.value,
  flexShrink: 1,
}))

const nestedPath = computed(() => [...group.path.value, index.value])
const nestedModel = computed(() =>
  isSplitterGroupValue(itemValue.value) ? itemValue.value : undefined,
)
const nestedContext = createSplitterGroupContext(
  group.root,
  nestedPath,
  nestedModel,
)

provide(splitterGroupContextKey, nestedContext)

const getItemMin = (itemIndex: number) => {
  const item = group.items[itemIndex]
  return Math.max(0, item?.min.value ?? group.root.minSize.value)
}

const getItemMax = (itemIndex: number) => {
  const item = group.items[itemIndex]
  return Math.min(1, Math.max(0, item?.max.value ?? 1))
}

const getHandleBounds = (sizes = group.sizes.value) => {
  const firstIndex = index.value
  const pairSize = (sizes[firstIndex] ?? 0) + (sizes[firstIndex + 1] ?? 0)
  const min = Math.max(
    getItemMin(firstIndex),
    pairSize - getItemMax(firstIndex + 1),
  )
  const max = Math.min(
    getItemMax(firstIndex),
    pairSize - getItemMin(firstIndex + 1),
  )

  return {
    pairSize,
    min: Math.min(min, max),
    max: Math.max(min, max),
  }
}

const handleBounds = computed(() => getHandleBounds())

const resizeTo = (firstSize: number, sizes: number[], commit = false) => {
  const firstIndex = index.value
  const { pairSize, min, max } = getHandleBounds(sizes)
  const precision = group.root.precision.value
  const step = 10 ** -precision
  const snappedMin = Math.ceil(min / step) * step
  const snappedMax = Math.floor(max / step) * step
  const snapped = Math.round(firstSize / step) * step
  const nextFirst = Number(
    Math.min(Math.max(snapped, snappedMin), snappedMax).toFixed(precision),
  )
  const nextSecond = Number((pairSize - nextFirst).toFixed(precision))
  group.root.updatePair(
    group.path.value,
    firstIndex,
    nextFirst,
    nextSecond,
    group.restIndex.value,
  )
  if (commit) group.root.commit()
}

let startPosition = 0
let startSizes: number[] = []
let containerLength = 0

const getPointerPosition = (event: PointerEvent) =>
  direction.value === 'horizontal' ? event.clientX : event.clientY

const onPointerMove = (event: PointerEvent) => {
  if (!dragging.value || !containerLength) return
  const delta = (getPointerPosition(event) - startPosition) / containerLength
  resizeTo((startSizes[index.value] ?? 0) + delta, startSizes)
}

const stopDrag = (commit = true) => {
  if (!dragging.value) return
  dragging.value = false
  group.root.dragging.value = false
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
  window.removeEventListener('pointercancel', onPointerCancel)
  if (commit) group.root.commit()
}

const onPointerUp = () => stopDrag()
const onPointerCancel = () => stopDrag(false)

const startDrag = (event: PointerEvent) => {
  if (handleDisabled.value) return
  const container = (event.currentTarget as HTMLElement).parentElement
  if (!container) return

  event.preventDefault()
  const rect = container.getBoundingClientRect()
  const handleRect = (
    event.currentTarget as HTMLElement
  ).getBoundingClientRect()
  const totalLength =
    direction.value === 'horizontal' ? rect.width : rect.height
  const handleLength =
    direction.value === 'horizontal' ? handleRect.width : handleRect.height
  containerLength = Math.max(
    0,
    totalLength - handleLength * Math.max(0, itemCount.value - 1),
  )
  startPosition = getPointerPosition(event)
  startSizes = [...group.sizes.value]
  dragging.value = true
  group.root.dragging.value = true
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp)
  window.addEventListener('pointercancel', onPointerCancel)
}

const handleKeydown = (event: KeyboardEvent) => {
  if (handleDisabled.value) return
  const horizontal = direction.value === 'horizontal'
  const decrease = horizontal
    ? event.key === 'ArrowLeft'
    : event.key === 'ArrowUp'
  const increase = horizontal
    ? event.key === 'ArrowRight'
    : event.key === 'ArrowDown'
  const sizes = [...group.sizes.value]
  const bounds = getHandleBounds(sizes)
  let next: number | undefined

  if (decrease) next = currentSize.value - group.root.keyboardStep.value
  if (increase) next = currentSize.value + group.root.keyboardStep.value
  if (event.key === 'Home') next = bounds.min
  if (event.key === 'End') next = bounds.max
  if (next === undefined) return

  event.preventDefault()
  resizeTo(next, sizes, true)
}

onBeforeUnmount(() => {
  stopDrag(false)
  group.unregister(itemId)
})
</script>
