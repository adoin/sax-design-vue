<template>
  <div class="picker-row">
    <s-color-picker
      v-model="color"
      show-alpha
      format="rgb"
      :predefine="presets"
    />
  </div>
  <p class="value">Selected: {{ color }}</p>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const color = ref('rgba(86, 103, 244, 0.88)')
const presets = [
  { name: 'Sax blue', value: '#5667f4' },
  { name: 'Ocean', value: 'rgba(42, 167, 161, 0.82)' },
  { name: 'Coral', value: 'hsla(8, 72%, 65%, 0.9)' },
  { name: 'Sunset', value: '#f0a657' },
  { name: 'Ink', value: 'rgb(39, 43, 72)' },
]
</script>

<style scoped>
.picker-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.value {
  margin: 10px 2px 0;
  color: var(--s-text-color-secondary);
  font-size: 12px;
}
</style>
