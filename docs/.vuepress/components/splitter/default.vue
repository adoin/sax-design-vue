<script lang="ts" setup>
import { ref } from 'vue'

const layout = ref({
  type: 'vertical',
  size: [
    {
      type: 'horizontal',
      size: [0.3, 0.4, 'rest'],
    },
    'rest',
  ],
})
</script>

<template>
  <s-splitter v-model="layout" :gap="6" class="splitter-nested-demo">
    <s-splitter-item>
      <s-splitter-item>
        <div class="splitter-nested-demo__panel is-violet">Explorer</div>
      </s-splitter-item>
      <s-splitter-item>
        <div class="splitter-nested-demo__panel is-blue">Editor</div>
      </s-splitter-item>
      <s-splitter-item use-rest>
        <div class="splitter-nested-demo__panel is-mint">Preview</div>
      </s-splitter-item>
    </s-splitter-item>
    <s-splitter-item use-rest>
      <div class="splitter-nested-demo__panel is-warm">Console</div>
    </s-splitter-item>
  </s-splitter>
</template>

<style scoped>
.splitter-nested-demo {
  height: 320px;
}

.splitter-nested-demo__panel {
  position: relative;
  isolation: isolate;
  box-sizing: border-box;
  height: 100%;
  overflow: hidden;
  padding: 18px;
  border-radius: inherit;
  color: var(--s-text-color-primary);
  font-size: 13px;
  font-weight: 700;
  box-shadow:
    0 8px 20px rgba(var(--sax-text), 0.09),
    0 3px 8px rgba(var(--sax-primary), 0.08);
  transition:
    filter 220ms ease,
    box-shadow 220ms ease;
}

.splitter-nested-demo__panel::after {
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

.is-violet {
  background: rgb(246 244 255 / 92%);
}

.is-blue {
  background: rgb(242 247 255 / 92%);
}

.is-mint {
  background: rgb(242 251 248 / 92%);
}

.is-warm {
  background: rgb(253 249 242 / 92%);
}

@media (hover: hover) and (pointer: fine) {
  .splitter-nested-demo__panel:hover {
    filter: saturate(1.08) brightness(1.015);
    box-shadow:
      0 14px 30px rgba(var(--sax-text), 0.12),
      0 6px 16px rgba(var(--sax-primary), 0.14);
  }

  .splitter-nested-demo__panel:hover::after {
    transform: translateX(120%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .splitter-nested-demo__panel,
  .splitter-nested-demo__panel::after {
    transition: none;
  }
}
</style>
