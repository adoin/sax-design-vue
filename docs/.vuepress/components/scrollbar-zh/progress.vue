<script setup lang="ts">
import { computed, shallowRef } from 'vue'

const x = shallowRef(0)
const y = shallowRef(0)
const seek = (value: number) => {
  x.value = value
  y.value = value
}
const motionStyle = computed(() => ({
  left: `${x.value}%`,
  top: `${y.value}%`,
  transform: `translate(-50%, -50%) rotate(${y.value * 3.6}deg)`,
  opacity: 0.45 + (y.value / 100) * 0.55,
}))
</script>

<template>
  <div class="scroll-progress-demo">
    <div class="scroll-progress-demo__controls">
      <s-button size="small" type="flat" @click="seek(0)">起点</s-button>
      <s-button size="small" type="flat" @click="seek(50)">50%</s-button>
      <s-button size="small" type="flat" @click="seek(100)">终点</s-button>
      <span>X {{ x.toFixed(1) }}% · Y {{ y.toFixed(1) }}%</span>
    </div>
    <div class="scroll-progress-demo__scene" aria-label="由滚动进度驱动的动画">
      <div class="scroll-progress-demo__motion-area">
        <div class="scroll-progress-demo__marker" :style="motionStyle">S</div>
      </div>
    </div>
    <s-scrollbar v-model:x="x" v-model:y="y" height="220px" placement="outside">
      <div class="scroll-progress-demo__canvas">
        <div v-for="item in 12" :key="item" class="scroll-progress-demo__tile">
          区域 {{ item }}
        </div>
      </div>
    </s-scrollbar>
    <p>
      纵向滚动、按住 Shift 横向滚动，或拖动任一滑块。标记跟随两个轴移动，Y
      还控制旋转和透明度；按钮通过修改百分比反向控制滚动位置。
    </p>
  </div>
</template>

<style scoped>
.scroll-progress-demo {
  display: grid;
  gap: 18px;
  width: 100%;
  min-width: 0;
}
.scroll-progress-demo__controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  color: var(--sax-css-text-color-secondary);
}
.scroll-progress-demo__scene {
  padding: 28px;
  border-radius: 14px;
  background: color-mix(
    in srgb,
    var(--sax-css-primary) 8%,
    var(--sax-css-background)
  );
}
.scroll-progress-demo__motion-area {
  position: relative;
  height: 80px;
}
.scroll-progress-demo__marker {
  position: absolute;
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: var(--sax-css-primary);
  color: var(--sax-css-background);
  font-weight: 700;
}
.scroll-progress-demo__canvas {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  width: 1120px;
  padding: 8px;
  box-sizing: border-box;
}
.scroll-progress-demo__tile {
  display: grid;
  place-items: center;
  height: 120px;
  border-radius: 12px;
  color: var(--sax-css-text);
  background: color-mix(
    in srgb,
    var(--sax-css-primary) 8%,
    var(--sax-css-background)
  );
}
.scroll-progress-demo p {
  margin: 0;
  color: var(--sax-css-text-color-secondary);
}
@media (prefers-reduced-motion: reduce) {
  .scroll-progress-demo__marker {
    transform: translate(-50%, -50%) !important;
  }
}
</style>
