<script lang="ts" setup>
import { ref } from 'vue'

const zeroGap = ref({ type: 'horizontal', size: [0.5, 0.5] })
const singleGap = ref({ type: 'horizontal', size: [0.5, 0.5] })
const axisGap = ref({
  type: 'vertical',
  size: [{ type: 'horizontal', size: [0.5, 0.5] }, 0.5],
})
</script>

<template>
  <div class="splitter-gap-demo">
    <div class="splitter-gap-demo__item">
      <span>:gap="0"</span>
      <s-splitter v-model="zeroGap" :gap="0">
        <s-splitter-item><div class="panel is-a">A</div></s-splitter-item>
        <s-splitter-item><div class="panel is-b">B</div></s-splitter-item>
      </s-splitter>
    </div>

    <div class="splitter-gap-demo__item">
      <span>:gap="8"</span>
      <s-splitter v-model="singleGap" :gap="8">
        <s-splitter-item><div class="panel is-a">A</div></s-splitter-item>
        <s-splitter-item><div class="panel is-b">B</div></s-splitter-item>
      </s-splitter>
    </div>

    <div class="splitter-gap-demo__item is-axis">
      <span>:gap="[14, 2]"</span>
      <s-splitter v-model="axisGap" :gap="[14, 2]">
        <s-splitter-item>
          <s-splitter-item><div class="panel is-a">A</div></s-splitter-item>
          <s-splitter-item><div class="panel is-b">B</div></s-splitter-item>
        </s-splitter-item>
        <s-splitter-item><div class="panel is-c">C</div></s-splitter-item>
      </s-splitter>
    </div>
  </div>
</template>

<style scoped>
.splitter-gap-demo {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.splitter-gap-demo__item {
  display: grid;
  gap: 8px;
}

.splitter-gap-demo__item.is-axis {
  grid-column: 1 / -1;
}

.splitter-gap-demo__item > span {
  color: var(--s-text-color-secondary);
  font-size: 12px;
  font-weight: 700;
}

.splitter-gap-demo :deep(.s-splitter) {
  min-height: 120px;
}

.splitter-gap-demo__item.is-axis :deep(.s-splitter) {
  min-height: 190px;
}

.panel {
  position: relative;
  isolation: isolate;
  box-sizing: border-box;
  height: 100%;
  overflow: hidden;
  padding: 14px;
  border-radius: inherit;
  color: var(--s-text-color-primary);
  font-size: 12px;
  font-weight: 700;
  box-shadow:
    0 8px 20px hsl(var(--sax-text) / 0.09),
    0 3px 8px hsl(var(--sax-primary) / 0.08);
  transition:
    filter 220ms ease,
    box-shadow 220ms ease;
}

.panel::after {
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

.panel.is-a {
  background: rgb(246 244 255 / 92%);
}

.panel.is-b {
  background: rgb(242 247 255 / 92%);
}

.panel.is-c {
  background: rgb(253 249 242 / 92%);
}

@media (hover: hover) and (pointer: fine) {
  .panel:hover {
    filter: saturate(1.08) brightness(1.015);
    box-shadow:
      0 14px 30px hsl(var(--sax-text) / 0.12),
      0 6px 16px hsl(var(--sax-primary) / 0.14);
  }

  .panel:hover::after {
    transform: translateX(120%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .panel,
  .panel::after {
    transition: none;
  }
}

@media (max-width: 640px) {
  .splitter-gap-demo {
    grid-template-columns: 1fr;
  }

  .splitter-gap-demo__item.is-axis {
    grid-column: auto;
  }
}
</style>
