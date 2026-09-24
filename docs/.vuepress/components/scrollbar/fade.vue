<script setup lang="ts">
import { ref } from 'vue'

type FadeDirection =
  'y' | 'x' | 'top' | 'bottom' | 'left' | 'right' | 'start' | 'end'

const direction = ref<FadeDirection>('y')
const directions = [
  { label: 'Vertical edges', value: 'y' },
  { label: 'Horizontal edges', value: 'x' },
  { label: 'Top', value: 'top' },
  { label: 'Bottom', value: 'bottom' },
  { label: 'Left', value: 'left' },
  { label: 'Right', value: 'right' },
  { label: 'Inline start', value: 'start' },
  { label: 'Inline end', value: 'end' },
]
const rows = Array.from({ length: 18 }, (_, index) => index + 1)
</script>

<template>
  <div class="scroll-fade-demo">
    <s-select
      v-model="direction"
      label="Fade direction"
      :options="directions"
    />
    <s-scrollbar height="220" :fade="{ direction, size: 48 }" :always="false">
      <div class="scroll-fade-demo__content">
        <div v-for="row in rows" :key="row" class="scroll-fade-demo__row">
          <strong>Checkpoint {{ row }}</strong>
          <span>
            Scroll vertically or horizontally to watch each available edge fade
            independently.
          </span>
        </div>
      </div>
    </s-scrollbar>
  </div>
</template>

<style scoped>
.scroll-fade-demo {
  display: grid;
  max-width: 620px;
  gap: 14px;
}

.scroll-fade-demo > .s-select {
  max-width: 220px;
}

.scroll-fade-demo__content {
  display: grid;
  min-width: 720px;
  gap: 8px;
  padding: 4px 12px 4px 4px;
}

.scroll-fade-demo__row {
  display: grid;
  grid-template-columns: 120px minmax(480px, 1fr);
  gap: 16px;
  padding: 10px 12px;
  border-radius: var(--sax-radius-sm);
  background: var(--sax-css-color-gray-1);
}
</style>
