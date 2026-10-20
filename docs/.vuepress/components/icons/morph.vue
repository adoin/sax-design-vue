<script setup lang="ts">
import { computed, onBeforeUnmount, shallowRef } from 'vue'
import type { IconMorphDetail, SaxIconData } from 'sax-design-vue'

const flipped = shallowRef(false)
const pair = shallowRef(0)
const duration = shallowRef(600)
const spring = shallowRef<'smooth' | 'snappy' | 'bouncy'>('snappy')
const mounted = shallowRef(true)
const running = shallowRef(false)
const stats = shallowRef<Record<string, string>>({})
const pairs = [
  { label: 'Direction', from: 'cb:chevron-down', to: 'cb:chevron-up' },
  { label: 'Pin', from: 'cb:pin', to: 'cb:pin-filled' },
  { label: 'Visibility', from: 'cb:view', to: 'cb:view-off' },
  { label: 'Different viewBoxes', from: 'cb:add', to: 'sax:close' },
  { label: 'Strokes and curves', from: 'cb:chevron-down', to: 'cb:chevron-up' },
  { label: 'Contour origins', from: 'cb:chevron-down', to: 'cb:chevron-up' },
  { label: 'Global matching', from: 'cb:chevron-down', to: 'cb:chevron-up' },
  { label: 'Multicolor', from: 'cb:chevron-down', to: 'cb:chevron-up' },
  { label: 'Linear gradient', from: 'cb:chevron-down', to: 'cb:chevron-up' },
  { label: 'Radial gradient', from: 'cb:chevron-down', to: 'cb:chevron-up' },
  { label: 'Gradient types', from: 'cb:chevron-down', to: 'cb:chevron-up' },
  { label: 'Group opacity', from: 'cb:chevron-down', to: 'cb:chevron-up' },
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
const comparisonIcons: SaxIconData[][] = [
  strokeIcons,
  [
    {
      attributes: { viewBox: '0 0 24 24' },
      body: '<path fill="none" stroke="currentColor" stroke-width="2" d="M4 4H20V20H4Z"/>',
    },
    {
      attributes: { viewBox: '0 0 24 24' },
      body: '<path fill="none" stroke="currentColor" stroke-width="2" d="M20 20H4V4H20Z"/>',
    },
  ],
  [
    {
      attributes: { viewBox: '0 0 24 24' },
      body: '<path fill="currentColor" d="M2 10h4v4H2Z"/><path fill="currentColor" d="M8 10h4v4H8Z"/>',
    },
    {
      attributes: { viewBox: '0 0 24 24' },
      body: '<path fill="currentColor" d="M6 10h4v4H6Z"/><path fill="currentColor" d="M18 10h4v4H18Z"/>',
    },
  ],
  [
    {
      attributes: { viewBox: '0 0 24 24' },
      body: '<path fill="#ff004080" d="M2 2H15V15H2Z"/><path fill="rgb(0 120 255 / 75%)" d="M10 10H22V22H10Z"/>',
    },
    {
      attributes: { viewBox: '0 0 24 24' },
      body: '<path fill="hsl(160 90% 40%)" d="M10 10H22V22H10Z"/><path fill="#ff9900" d="M2 2H15V15H2Z"/>',
    },
  ],
  [
    {
      attributes: { viewBox: '0 0 24 24' },
      body: '<defs><linearGradient id="paint"><stop offset="0" stop-color="#ff0066"/><stop offset="1" stop-color="#4466ff"/></linearGradient></defs><path fill="url(#paint)" d="M3 3H21V21H3Z"/>',
    },
    {
      attributes: { viewBox: '0 0 24 24' },
      body: '<defs><linearGradient id="paint" x2="0%" y2="100%"><stop offset="0" stop-color="#00bb99"/><stop offset=".4" stop-color="#ffee00" stop-opacity=".7"/><stop offset="1" stop-color="#ff7700"/></linearGradient></defs><circle fill="url(#paint)" cx="12" cy="12" r="10"/>',
    },
  ],
  [
    {
      attributes: { viewBox: '0 0 24 24' },
      body: '<defs><radialGradient id="paint" cx="25%" cy="25%"><stop offset="0" stop-color="white"/><stop offset="1" stop-color="#0066ff"/></radialGradient></defs><circle fill="url(#paint)" cx="12" cy="12" r="10"/>',
    },
    {
      attributes: { viewBox: '0 0 24 24' },
      body: '<defs><radialGradient id="paint" cx="75%" cy="75%" r="70%"><stop offset="0" stop-color="#ffdd00"/><stop offset="1" stop-color="#ff0066"/></radialGradient></defs><circle fill="url(#paint)" cx="12" cy="12" r="10"/>',
    },
  ],
  [
    {
      attributes: { viewBox: '0 0 24 24' },
      body: '<defs><linearGradient id="paint"><stop offset="0" stop-color="#ff0066"/><stop offset="1" stop-color="#4466ff"/></linearGradient></defs><circle fill="url(#paint)" cx="12" cy="12" r="10"/>',
    },
    {
      attributes: { viewBox: '0 0 24 24' },
      body: '<defs><radialGradient id="paint"><stop offset="0" stop-color="#ffee00"/><stop offset="1" stop-color="#00aa99"/></radialGradient></defs><circle fill="url(#paint)" cx="12" cy="12" r="10"/>',
    },
  ],
  [
    {
      attributes: { viewBox: '0 0 24 24' },
      body: '<g opacity=".5"><path fill="#ff0066" d="M2 2H16V16H2Z"/><path fill="#0066ff" d="M8 8H22V22H8Z"/></g>',
    },
    {
      attributes: { viewBox: '0 0 24 24' },
      body: '<g opacity=".9"><path fill="#00aa99" d="M2 2H16V16H2Z"/><path fill="#ff9900" d="M8 8H22V22H8Z"/></g>',
    },
  ],
]
const iconData = computed(() =>
  pair.value >= 4
    ? comparisonIcons[pair.value - 4][Number(flipped.value)]
    : undefined,
)
const engines = [
  { value: 'svg-morpheus', label: 'svg-morpheus-ts 1.5.2', animated: true },
  { value: 'target', label: 'Static target', animated: false },
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
        :aria-label="'Animation duration'"
        :options="[
          { label: '300 ms', value: 300 },
          { label: '600 ms', value: 600 },
          { label: '1200 ms', value: 1200 },
        ]"
      />
      <s-select
        v-model="spring"
        aria-label="Shared easing"
        :options="[
          { label: 'Smooth', value: 'smooth' },
          { label: 'Snappy', value: 'snappy' },
          { label: 'Bouncy', value: 'bouncy' },
        ]"
      />
    </div>
    <div class="morph-compare__controls">
      <s-button @click="flipped = !flipped">Switch both</s-button>
      <s-button type="flat" :disabled="running || !mounted" @click="stress"
        >Switch 20 times</s-button
      >
      <s-button type="flat" @click="toggleMount">{{
        mounted ? 'Unmount icons' : 'Remount icons'
      }}</s-button>
    </div>
    <div class="morph-compare__grid">
      <s-config-provider
        v-for="engine in engines"
        :key="engine.value"
        :icon="{ morph: engine.animated ? { duration, spring } : false }"
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
              <s-tab :name="0" :icon="name" label="Tab icon"
                >The Tabs icon property inherits global defaults.</s-tab
              >
            </s-tabs>
          </template>
          <p v-else>Icons unmounted</p>
          <p class="morph-compare__timing" aria-live="polite">
            Last completed animation:
            {{ (engine.animated ? stats['svg-morpheus'] : '') || '—' }}
          </p>
        </section>
      </s-config-provider>
    </div>
    <p>
      Static reference:
      <s-icon :name="name" :icon-data="iconData" :size="24" :morph="false" />
    </p>
    <p>
      The animated icon uses the shared geometry and paint core. The target
      remains static. Respects reduced motion; wall time is not a performance
      benchmark.
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
