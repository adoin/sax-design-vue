<script setup lang="ts">
import { reactive } from 'vue'
import type { DividerProps } from 'sax-design-vue'

const settings = reactive({
  direction: 'horizontal' as DividerProps['direction'],
  variant: 'plain' as DividerProps['variant'],
  position: 'center' as DividerProps['position'],
  color: 'primary',
  background: 'transparent',
  labelColor: '',
  borderStyle: 'solid' as DividerProps['borderStyle'],
  borderHeight: '1px',
  gap: '12px',
  content: 'text' as 'text' | 'icon' | 'none',
})

const directionOptions = [
  { label: '水平', value: 'horizontal' },
  { label: '垂直', value: 'vertical' },
]
const contentOptions = [
  { label: '文字', value: 'text' },
  { label: '图标', value: 'icon' },
  { label: '仅线条', value: 'none' },
]
const positionOptions = [
  { label: '左侧', value: 'left' },
  { label: '偏左', value: 'left-center' },
  { label: '居中', value: 'center' },
  { label: '偏右', value: 'right-center' },
  { label: '右侧', value: 'right' },
]
const variantOptions = [
  { label: '朴素', value: 'plain' },
  { label: '柔和', value: 'soft' },
  { label: '实色', value: 'solid' },
]
const colorOptions = [
  { label: '中性', value: 'default' },
  { label: '主色', value: 'primary' },
  { label: '成功', value: 'success' },
  { label: '警告', value: 'warning' },
  { label: '危险', value: 'danger' },
  { label: '自定义紫色', value: '#8756d8' },
]
const backgroundOptions = [
  { label: '无', value: 'transparent' },
  { label: '淡紫', value: '#edf1ff' },
  { label: '薄荷绿', value: '#e8f7f1' },
  { label: '深色', value: 'dark' },
]
const labelColorOptions = [
  { label: '自动', value: '' },
  { label: '深蓝', value: '#334888' },
  { label: '深绿', value: '#246853' },
  { label: '白色', value: '#ffffff' },
]
const lineStyleOptions = [
  { label: '实线', value: 'solid' },
  { label: '虚线', value: 'dashed' },
  { label: '点线', value: 'dotted' },
]
const lineHeightOptions = [
  { label: '1 px', value: '1px' },
  { label: '2 px', value: '2px' },
  { label: '3 px', value: '3px' },
]
const gapOptions = [
  { label: '8 px', value: '8px' },
  { label: '12 px', value: '12px' },
  { label: '20 px', value: '20px' },
]
</script>

<template>
  <div class="divider-configurator">
    <div class="divider-configurator__controls">
      <div class="divider-configurator__group">
        <h3>内容与布局</h3>
        <div class="divider-configurator__fields">
          <s-select
            v-model="settings.direction"
            label="方向"
            :options="directionOptions"
          />
          <s-select
            v-model="settings.content"
            label="内容"
            :options="contentOptions"
            :disabled="settings.direction === 'vertical'"
          />
          <s-select
            v-model="settings.position"
            label="位置"
            :options="positionOptions"
            :disabled="
              settings.direction === 'vertical' || settings.content === 'none'
            "
          />
          <s-select
            v-model="settings.gap"
            label="内容间距"
            :options="gapOptions"
            :disabled="
              settings.direction === 'vertical' || settings.content === 'none'
            "
          />
        </div>
      </div>
      <div class="divider-configurator__group">
        <h3>外观</h3>
        <div class="divider-configurator__fields">
          <s-select
            v-model="settings.variant"
            label="标签样式"
            :options="variantOptions"
            :disabled="
              settings.direction === 'vertical' || settings.content === 'none'
            "
          />
          <s-select
            v-model="settings.color"
            label="强调色"
            :options="colorOptions"
          />
          <s-select
            v-model="settings.background"
            label="自定义背景"
            :options="backgroundOptions"
            :disabled="
              settings.direction === 'vertical' || settings.content === 'none'
            "
          />
          <s-select
            v-model="settings.labelColor"
            label="文字颜色"
            :options="labelColorOptions"
            :disabled="
              settings.direction === 'vertical' || settings.content === 'none'
            "
          />
          <s-select
            v-model="settings.borderStyle"
            label="线型"
            :options="lineStyleOptions"
          />
          <s-select
            v-model="settings.borderHeight"
            label="线条粗细"
            :options="lineHeightOptions"
          />
        </div>
      </div>
    </div>

    <div class="divider-configurator__preview">
      <span class="divider-configurator__eyebrow">实时预览</span>
      <div
        v-if="settings.direction === 'vertical'"
        class="divider-configurator__inline"
      >
        <span>概览</span>
        <s-divider
          direction="vertical"
          :color="settings.color"
          :border-style="settings.borderStyle"
          :border-height="settings.borderHeight"
        />
        <span>动态</span>
      </div>
      <div v-else class="divider-configurator__stack">
        <span>最近更新</span>
        <s-divider
          :variant="settings.variant"
          :position="settings.position"
          :color="settings.color"
          :background="settings.background"
          :label-color="settings.labelColor"
          :border-style="settings.borderStyle"
          :border-height="settings.borderHeight"
          :gap="settings.gap"
          :icon="settings.content === 'icon' ? 'cb:star' : undefined"
          :aria-label="settings.content === 'icon' ? '精选章节' : undefined"
        >
          <template v-if="settings.content === 'text'">章节详情</template>
        </s-divider>
        <span>更早的更新</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.divider-configurator {
  display: grid;
  width: 100%;
  gap: 20px;
}

.divider-configurator__controls {
  display: grid;
  gap: 16px;
}

.divider-configurator__group {
  display: grid;
  gap: 10px;
}

.divider-configurator__group h3 {
  margin: 0;
  color: var(--sax-css-text);
  font-size: 0.875rem;
  font-weight: 700;
}

.divider-configurator__fields {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(142px, 1fr));
  gap: 10px;
}

.divider-configurator__preview {
  display: grid;
  align-content: center;
  gap: 18px;
  padding: 22px 24px;
  border: 1px solid var(--sax-css-divider);
  border-radius: var(--sax-radius-xl);
  background: color-mix(
    in srgb,
    var(--sax-css-primary) 3%,
    var(--sax-css-background)
  );
}

.divider-configurator__eyebrow {
  color: var(--sax-css-text-color-regular);
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.09em;
  text-transform: uppercase;
}

.divider-configurator__stack {
  display: grid;
  width: 100%;
  gap: 10px;
  color: var(--sax-css-text);
  font-size: 0.875rem;
}

.divider-configurator__inline {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  color: var(--sax-css-text);
  font-size: 0.875rem;
}

@media (max-width: 520px) {
  .divider-configurator__preview {
    padding: 18px;
  }
}
</style>
