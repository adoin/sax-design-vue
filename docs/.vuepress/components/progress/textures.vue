<script setup lang="ts">
import { shallowRef } from 'vue'
import type { ProgressTexture } from 'sax-design-vue'
const percent = shallowRef(68)
const animated = shallowRef(true)
const textures: Array<{ value: ProgressTexture; label: string }> = [
  { value: 'default', label: 'Plain' },
  { value: 'bubbles', label: 'Bubbles' },
  { value: 'waves', label: 'Sea waves' },
  { value: 'sparkle', label: 'Sparkle' },
]
</script>

<template>
  <div class="progress-texture-demo">
    <div class="progress-texture-controls">
      <s-switch v-model="animated" aria-label="Animate textures"
        >Animate textures</s-switch
      >
    </div>
    <div class="progress-texture-range">
      <div class="progress-texture-range-label">
        Progress<span>{{ percent }}%</span>
      </div>
      <s-slider v-model="percent" :aria-label="'Progress percentage'" />
    </div>
    <div
      v-for="item in textures"
      :key="item.value"
      class="progress-texture-row"
    >
      <div class="progress-texture-label">
        <span>{{ item.label }}</span
        ><code>{{ item.value }}</code>
      </div>
      <s-progress
        :percent="percent"
        :height="32"
        :texture="item.value"
        :texture-animated="animated"
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
