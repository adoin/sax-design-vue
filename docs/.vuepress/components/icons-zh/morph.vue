<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import type { SaxIconData } from 'sax-design-vue'

const changed = shallowRef(false)
const selected = shallowRef(0)
const duration = shallowRef(360)
const spring = shallowRef<'smooth' | 'snappy' | 'bouncy'>('snappy')
const examples = [
  {
    label: '展开与收起',
    from: 'cb:chevron-down',
    to: 'cb:chevron-up',
    description: '把向下箭头切换为向上箭头，适合展开和收起菜单。',
  },
  {
    label: '固定状态',
    from: 'cb:pin',
    to: 'cb:pin-filled',
    description: '在空心与实心图钉之间切换，表示未固定和已固定。',
  },
  {
    label: '显示与隐藏',
    from: 'cb:view',
    to: 'cb:view-off',
    description: '在眼睛与划线眼睛之间切换，表示显示和隐藏。',
  },
  {
    label: '多色图标',
    from: '',
    to: '',
    description: '图形切换时，填充颜色和透明度也会一起变化。',
  },
  {
    label: '渐变图标',
    from: '',
    to: '',
    description: '在渐变方形与渐变圆形之间切换，观察形状和颜色的连续变化。',
  },
]
const customIcons: SaxIconData[][] = [
  [
    {
      attributes: {
        viewBox: '0 0 24 24',
      },
      body: '<path fill="#ff004080" d="M2 2H15V15H2Z"/><path fill="rgb(0 120 255 / 75%)" d="M10 10H22V22H10Z"/>',
    },
    {
      attributes: {
        viewBox: '0 0 24 24',
      },
      body: '<path fill="hsl(160 90% 40%)" d="M10 10H22V22H10Z"/><path fill="#ff9900" d="M2 2H15V15H2Z"/>',
    },
  ],
  [
    {
      attributes: {
        viewBox: '0 0 24 24',
      },
      body: '<defs><linearGradient id="paint"><stop offset="0" stop-color="#ff0066"/><stop offset="1" stop-color="#4466ff"/></linearGradient></defs><path fill="url(#paint)" d="M3 3H21V21H3Z"/>',
    },
    {
      attributes: {
        viewBox: '0 0 24 24',
      },
      body: '<defs><linearGradient id="paint" x2="0%" y2="100%"><stop offset="0" stop-color="#00bb99"/><stop offset=".4" stop-color="#ffee00" stop-opacity=".7"/><stop offset="1" stop-color="#ff7700"/></linearGradient></defs><circle fill="url(#paint)" cx="12" cy="12" r="10"/>',
    },
  ],
]
const example = computed(() => examples[selected.value])
const options = examples.map((item, value) => ({ label: item.label, value }))
const name = computed(() =>
  changed.value ? example.value.to : example.value.from,
)
const iconData = computed(() =>
  selected.value >= 3
    ? customIcons[selected.value - 3][Number(changed.value)]
    : undefined,
)
</script>

<template>
  <div class="morph-demo">
    <div class="morph-demo__controls">
      <label class="morph-demo__field">
        <span>示例</span>
        <s-select v-model="selected" :options="options" aria-label="示例" />
      </label>
      <label class="morph-demo__field">
        <span>动画时长</span>
        <s-select
          v-model="duration"
          aria-label="动画时长"
          :options="[
            { label: '180 ms（更快）', value: 180 },
            { label: '360 ms（默认）', value: 360 },
            { label: '800 ms（更慢）', value: 800 },
          ]"
        />
      </label>
      <label class="morph-demo__field">
        <span>动画效果</span>
        <s-select
          v-model="spring"
          aria-label="动画效果"
          :options="[
            { label: '平滑', value: 'smooth' },
            { label: '轻微回弹（默认）', value: 'snappy' },
            { label: '明显回弹', value: 'bouncy' },
          ]"
        />
      </label>
    </div>
    <p class="morph-demo__description">{{ example.description }}</p>
    <div class="morph-demo__preview">
      <s-icon
        :name="name"
        :icon-data="iconData"
        :size="76"
        color="primary"
        :morph="{ duration, spring }"
        label="图标变形预览"
      />
      <s-button @click="changed = !changed">切换图标</s-button>
      <p>点击按钮，查看两种图标之间的过渡。</p>
    </div>
  </div>
</template>

<style scoped>
.morph-demo {
  display: grid;
  gap: 20px;
}
.morph-demo__controls {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
.morph-demo__field {
  display: grid;
  gap: 8px;
  flex: 1 1 160px;
  min-width: 0;
}
.morph-demo__description,
.morph-demo__preview p {
  margin: 0;
}
.morph-demo__preview {
  display: grid;
  justify-items: center;
  gap: 20px;
  padding: 28px;
  border-radius: 20px;
  background: var(--sax-css-background);
  box-shadow: inset 0 2px 10px
    color-mix(in srgb, var(--sax-css-text) 8%, transparent);
}
</style>
