<script setup lang="ts">
import { computed, onBeforeUnmount, shallowRef } from 'vue'
import type {
  IconMorphDetail,
  IconMorphEngine,
  SaxIconData,
} from 'sax-design-vue'

const flipped = shallowRef(false)
const pair = shallowRef(0)
const duration = shallowRef(600)
const mounted = shallowRef(true)
const running = shallowRef(false)
const stats = shallowRef<Record<string, string>>({})
const pairs = [
  { label: '方向', from: 'cb:chevron-down', to: 'cb:chevron-up' },
  { label: '固定', from: 'cb:pin', to: 'cb:pin-filled' },
  { label: '可见性', from: 'cb:view', to: 'cb:view-off' },
  { label: '不同坐标系', from: 'cb:add', to: 'sax:close' },
  { label: '描边与曲线', from: 'cb:chevron-down', to: 'cb:chevron-up' },
]
const name = computed(() =>
  flipped.value ? pairs[pair.value].to : pairs[pair.value].from,
)
const strokeIcons: SaxIconData[] = [
  {
    attributes: { viewBox: '0 0 24 24' },
    body: '<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><g transform="translate(2 2)"><path d="M2 3h16M2 10h16M2 17h16"/></g></g>',
  },
  {
    attributes: { viewBox: '0 0 32 32' },
    body: '<g fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="16" cy="16" r="11"/><path d="M12 12l8 8m0-8l-8 8"/></g>',
  },
]
const iconData = computed(() =>
  pair.value === 4 ? strokeIcons[Number(flipped.value)] : undefined,
)
const engines: { value: IconMorphEngine; label: string }[] = [
  { value: 'svg-morpheus', label: 'svg-morpheus-ts' },
  { value: 'builtin', label: '项目内置算法' },
]
let timer: ReturnType<typeof setInterval> | undefined
const stop = () => {
  clearInterval(timer)
  timer = undefined
  running.value = false
}
const stress = () => {
  stop()
  running.value = true
  let count = 0
  timer = setInterval(() => {
    flipped.value = !flipped.value
    if (++count === 20) stop()
  }, 80)
}
const record = (detail: IconMorphDetail) => {
  stats.value = {
    ...stats.value,
    [detail.engine]: `${detail.elapsed.toFixed(0)} ms`,
  }
}
const toggleMount = () => {
  stop()
  mounted.value = !mounted.value
}
onBeforeUnmount(stop)
</script>

<template>
  <div class="morph-compare">
    <div class="morph-compare__controls">
      <s-button
        v-for="(item, index) in pairs"
        :key="item.label"
        :type="pair === index ? 'solid' : 'flat'"
        @click="pair = index"
        >{{ item.label }}</s-button
      >
      <s-select
        v-model="duration"
        :aria-label="'动画时长'"
        :options="[
          { label: '300 ms', value: 300 },
          { label: '600 ms', value: 600 },
          { label: '1200 ms', value: 1200 },
        ]"
      />
    </div>
    <div class="morph-compare__controls">
      <s-button @click="flipped = !flipped">同步切换</s-button>
      <s-button type="flat" :disabled="running || !mounted" @click="stress"
        >连续切换 20 次</s-button
      >
      <s-button type="flat" @click="toggleMount">{{
        mounted ? '卸载图标' : '重新挂载'
      }}</s-button>
    </div>
    <div class="morph-compare__grid">
      <s-config-provider
        v-for="engine in engines"
        :key="engine.value"
        :icon="{ morph: { engine: engine.value, duration } }"
      >
        <section class="morph-compare__panel" :aria-label="engine.label">
          <h3>{{ engine.label }}</h3>
          <template v-if="mounted">
            <s-icon
              :name="name"
              :icon-data="iconData"
              :size="76"
              color="primary"
              :label="engine.label"
              @morph-end="record"
            />
            <s-tabs type="pill" :animated="false">
              <s-tab :name="0" :icon="name" label="标签图标"
                >通过 Tabs 的 icon 属性继承全局配置。</s-tab
              >
            </s-tabs>
          </template>
          <p v-else>图标已卸载</p>
          <p class="morph-compare__timing" aria-live="polite">
            上次完成耗时: {{ stats[engine.value] || '—' }}
          </p>
        </section>
      </s-config-provider>
    </div>
    <p>
      关闭变形的对照：
      <s-icon :name="name" :icon-data="iconData" :size="24" :morph="false" />
    </p>
    <p>
      遵循系统的减少动态效果设置。耗时是当前浏览器的动画墙钟时间，不代表性能基准。
    </p>
  </div>
</template>

<style scoped>
.morph-compare {
  display: grid;
  gap: 16px;
}
.morph-compare__controls {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}
.morph-compare__controls :deep(.s-select) {
  width: 150px;
}
.morph-compare__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}
.morph-compare__panel {
  display: grid;
  align-content: start;
  justify-items: center;
  gap: 20px;
  padding: 24px;
  border-radius: 20px;
  background: var(--sax-css-background);
  box-shadow: inset 0 2px 10px
    color-mix(in srgb, var(--sax-css-text) 8%, transparent);
}
.morph-compare__panel h3,
.morph-compare__panel p {
  margin: 0;
}
.morph-compare__timing {
  font-variant-numeric: tabular-nums;
}
@media (max-width: 600px) {
  .morph-compare__grid {
    grid-template-columns: 1fr;
  }
}
</style>
