<script lang="ts" setup>
import { ref } from 'vue'

const sizes = ref({
  type: 'horizontal',
  size: [0.3, 0.4, 'rest'],
})
</script>

<template>
  <div class="splitter-sizing-demo">
    <s-splitter
      v-model="sizes"
      :precision="2"
      :gap="4"
      class="splitter-sizing-demo__canvas"
    >
      <s-splitter-item>
        <div class="splitter-sizing-demo__panel">Fixed</div>
      </s-splitter-item>
      <s-splitter-item>
        <div class="splitter-sizing-demo__panel">Fixed</div>
      </s-splitter-item>
      <s-splitter-item use-rest>
        <div class="splitter-sizing-demo__panel is-rest">use-rest</div>
      </s-splitter-item>
    </s-splitter>
    <code>{{ JSON.stringify(sizes) }}</code>
  </div>
</template>

<style scoped>
.splitter-sizing-demo {
  display: grid;
  gap: 12px;
}

.splitter-sizing-demo__canvas {
  min-height: 150px;
}

.splitter-sizing-demo__panel {
  position: relative;
  isolation: isolate;
  box-sizing: border-box;
  height: 100%;
  overflow: hidden;
  padding: 16px;
  border-radius: inherit;
  color: var(--s-text-color-primary);
  font-size: 12px;
  font-weight: 700;
  background: rgb(244 247 255 / 92%);
  box-shadow:
    0 8px 20px hsl(var(--sax-text) / 0.09),
    0 3px 8px hsl(var(--sax-primary) / 0.08);
  transition:
    filter 220ms ease,
    box-shadow 220ms ease;
}

.splitter-sizing-demo__panel::after {
  position: absolute;
  inset: 0;
  z-index: -1;
  background: linear-gradient(
    115deg,
    transparent 24%,
    rgb(255 255 255 / 48%) 48%,
    transparent 72%
  );
  content: '';
  pointer-events: none;
  transform: translateX(-120%);
  transition: transform 420ms cubic-bezier(0.22, 1, 0.36, 1);
}

.splitter-sizing-demo__panel.is-rest {
  background: rgb(241 251 247 / 92%);
}

.splitter-sizing-demo code {
  padding: 10px 12px;
  overflow-wrap: anywhere;
  border-radius: var(--s-border-radius-base);
  background: var(--s-fill-color-light);
  color: var(--s-text-color-primary);
  line-height: 1.6;
}

@media (hover: hover) and (pointer: fine) {
  .splitter-sizing-demo__panel:hover {
    filter: saturate(1.08) brightness(1.015);
    box-shadow:
      0 14px 30px hsl(var(--sax-text) / 0.12),
      0 6px 16px hsl(var(--sax-primary) / 0.14);
  }

  .splitter-sizing-demo__panel:hover::after {
    transform: translateX(120%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .splitter-sizing-demo__panel,
  .splitter-sizing-demo__panel::after {
    transition: none;
  }
}
</style>
