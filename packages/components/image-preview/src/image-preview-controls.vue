<script setup lang="ts">
import { SIcon } from '@vuesax-alpha/components/icon'
import { useNamespace } from '@vuesax-alpha/hooks'

interface Props {
  current: number
  total: number
  percentage: number
  showPrevious: boolean
  showNext: boolean
  showToolbar: boolean
  canZoomIn: boolean
  canZoomOut: boolean
  canReset: boolean
  isFit: boolean
  labels: {
    close: string
    previous: string
    next: string
    zoomIn: string
    zoomOut: string
    rotateLeft: string
    rotateRight: string
    fitToScreen: string
    originalSize: string
    reset: string
    toolbar: string
  }
}

defineProps<Props>()

defineEmits<{
  close: []
  previous: []
  next: []
  zoomIn: []
  zoomOut: []
  rotateLeft: []
  rotateRight: []
  toggleFit: []
  reset: []
}>()

const ns = useNamespace('image-preview')
</script>

<template>
  <button
    :class="ns.e('close')"
    type="button"
    :aria-label="labels.close"
    :title="labels.close"
    @click="$emit('close')"
  >
    <SIcon name="cb:close" />
  </button>

  <button
    v-if="showPrevious"
    :class="[ns.e('arrow'), ns.e('arrow-left')]"
    type="button"
    :aria-label="labels.previous"
    :title="labels.previous"
    @click="$emit('previous')"
  >
    <SIcon name="cb:chevron-left" />
  </button>

  <button
    v-if="showNext"
    :class="[ns.e('arrow'), ns.e('arrow-right')]"
    type="button"
    :aria-label="labels.next"
    :title="labels.next"
    @click="$emit('next')"
  >
    <SIcon name="cb:chevron-right" />
  </button>

  <div
    v-if="showToolbar"
    :class="ns.e('toolbar')"
    role="toolbar"
    :aria-label="labels.toolbar"
  >
    <span v-if="total > 1" :class="ns.e('counter')">
      {{ current }} / {{ total }}
    </span>
    <span v-if="total > 1" :class="ns.e('separator')" aria-hidden="true" />

    <button
      type="button"
      :class="ns.e('tool')"
      :disabled="!canZoomOut"
      :aria-label="labels.zoomOut"
      :title="labels.zoomOut"
      @click="$emit('zoomOut')"
    >
      <SIcon name="cb:zoom-out" />
    </button>
    <output :class="ns.e('percentage')" aria-live="polite">
      {{ percentage }}%
    </output>
    <button
      type="button"
      :class="ns.e('tool')"
      :disabled="!canZoomIn"
      :aria-label="labels.zoomIn"
      :title="labels.zoomIn"
      @click="$emit('zoomIn')"
    >
      <SIcon name="cb:zoom-in" />
    </button>

    <span :class="ns.e('separator')" aria-hidden="true" />
    <button
      type="button"
      :class="ns.e('tool')"
      :aria-label="labels.rotateLeft"
      :title="labels.rotateLeft"
      @click="$emit('rotateLeft')"
    >
      <SIcon name="cb:rotate" flip="horizontal" />
    </button>
    <button
      type="button"
      :class="ns.e('tool')"
      :aria-label="labels.rotateRight"
      :title="labels.rotateRight"
      @click="$emit('rotateRight')"
    >
      <SIcon name="cb:rotate" />
    </button>
    <button
      type="button"
      :class="[ns.e('tool'), ns.is('active', !isFit)]"
      :aria-label="isFit ? labels.originalSize : labels.fitToScreen"
      :title="isFit ? labels.originalSize : labels.fitToScreen"
      :aria-pressed="!isFit"
      @click="$emit('toggleFit')"
    >
      <SIcon name="cb:expand-all" />
    </button>
    <button
      type="button"
      :class="ns.e('tool')"
      :disabled="!canReset"
      :aria-label="labels.reset"
      :title="labels.reset"
      @click="$emit('reset')"
    >
      <SIcon name="cb:reset" />
    </button>
  </div>
</template>
