<script setup lang="ts">
import { shallowRef } from 'vue'
import type { ProgressTexture } from 'sax-design-vue'
const duration = shallowRef(2000)
const opacity = shallowRef(0.6)
const height = shallowRef(8)
const heights = [5, 8, 16, 32]
const speeds = [
  { value: 1000, label: 'Fast' },
  { value: 2000, label: 'Standard' },
  { value: 4000, label: 'Slow' },
  { value: 0, label: 'Static' },
]
const textures: Array<{ value: ProgressTexture; label: string }> = [
  { value: 'bubbles', label: 'Bubbles' },
  { value: 'waves', label: 'Sea waves' },
  { value: 'sparkle', label: 'Sparkle' },
]
</script>
<template>
  <div class="progress-texture-demo">
    <div class="progress-texture-buttons">
      <s-button
        v-for="value in heights"
        :key="value"
        size="small"
        type="flat"
        :active="height === value"
        @click="height = value"
        >{{ value }}px</s-button
      >
    </div>
    <div class="progress-texture-buttons">
      <s-button
        v-for="speed in speeds"
        :key="speed.value"
        size="small"
        type="flat"
        :active="duration === speed.value"
        @click="duration = speed.value"
        >{{ speed.label }}</s-button
      >
    </div>
    <div class="progress-texture-range">
      <div class="progress-texture-range-label">
        Texture opacity<span>{{ Math.round(opacity * 100) }}%</span>
      </div>
      <s-slider
        v-model="opacity"
        :min="0"
        :max="1"
        :step="0.05"
        aria-label="Texture opacity"
      />
    </div>
    <div
      v-for="item in textures"
      :key="item.value"
      class="progress-texture-row"
    >
      <div class="progress-texture-label">
        <span>{{ item.label }}</span
        ><span>{{ height }}px</span>
      </div>
      <s-progress
        :percent="72"
        :height="height"
        color="#875af0"
        :texture="item.value"
        :texture-duration="duration"
        :texture-opacity="opacity"
        :aria-label="item.label"
      />
    </div>
  </div>
</template>
<style scoped>
.progress-texture-demo {
  display: grid;
  gap: 20px;
  width: 100%;
  max-width: 640px;
  margin-inline: auto;
}
.progress-texture-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
}
.progress-texture-row {
  display: grid;
  gap: 10px;
  min-width: 0;
}
.progress-texture-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-size: 14px;
}
.progress-texture-range {
  display: grid;
  gap: 12px;
  width: 100%;
}
.progress-texture-range-label {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}
.progress-texture-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
</style>
