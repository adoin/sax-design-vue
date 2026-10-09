<script setup lang="ts">
import { shallowRef } from 'vue'
import { zhCn } from 'sax-design-vue/locales'
import type { ProgressTexture } from 'sax-design-vue'
const animated = shallowRef(true)
const textures: Array<{
  value: ProgressTexture
  label: string
  color: string
}> = [
  { value: 'bubbles', label: '气泡', color: 'primary' },
  { value: 'waves', label: '海浪', color: 'success' },
  { value: 'sparkle', label: '星光', color: 'warn' },
]
</script>

<template>
  <s-config-provider :locale="zhCn">
    <div class="progress-texture-demo">
      <s-switch v-model="animated" aria-label="纹理动画">纹理动画</s-switch>
      <div
        v-for="item in textures"
        :key="item.value"
        class="progress-texture-row"
      >
        <div class="progress-texture-label">{{ item.label }}</div>
        <s-progress
          indeterminate
          :height="20"
          :texture="item.value"
          :color="item.color"
          :texture-animated="animated"
          :aria-label="item.label"
        />
      </div>
    </div>
  </s-config-provider>
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
.progress-texture-range label {
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
