<script lang="ts" setup>
import { computed, shallowRef } from 'vue'
import { useRoute } from 'vue-router'

type PrismPreset = 'faceted' | 'soft'

const route = useRoute()
const isZh = computed(() => route.path.startsWith('/zh/'))
const activePreset = shallowRef<PrismPreset>('faceted')

const items = computed(() =>
  isZh.value
    ? [
        { title: '正面', description: '当前内容清晰可读' },
        { title: '侧面', description: '背面内容自然反向' },
        { title: '回转', description: '点击侧面完成切换' },
      ]
    : [
        { title: 'Front', description: 'Active content stays readable' },
        { title: 'Side', description: 'Back content reverses naturally' },
        { title: 'Turn', description: 'Click a side to rotate' },
      ],
)

const presets = computed(() => [
  {
    key: 'faceted' as const,
    label: isZh.value ? '硬朗棱面' : 'Faceted',
    radius: false,
    depth: 220,
  },
  {
    key: 'soft' as const,
    label: isZh.value ? '柔和圆角' : 'Soft corners',
    radius: 16,
    depth: 240,
  },
])

const currentPreset = computed(
  () =>
    presets.value.find((preset) => preset.key === activePreset.value) ??
    presets.value[0],
)
</script>

<template>
  <div class="prism-example">
    <div class="prism-example__controls">
      <s-button
        v-for="preset in presets"
        :key="preset.key"
        type="flat"
        size="small"
        :active="activePreset === preset.key"
        @click="activePreset = preset.key"
      >
        {{ preset.label }}
      </s-button>
    </div>

    <s-carousel
      :items="items"
      effect="prism"
      :autoplay="false"
      :radius="currentPreset.radius"
      :depth="currentPreset.depth"
      :perspective="900"
      draggable
      arrow="always"
      indicator-position="outside"
      height="280"
    >
      <template #item="{ item, index }">
        <div class="prism-slide" :class="`prism-slide--${index + 1}`">
          <span>0{{ index + 1 }}</span>
          <strong>{{ item.title }}</strong>
          <small>{{ item.description }}</small>
        </div>
      </template>
    </s-carousel>
  </div>
</template>

<style scoped>
.prism-example {
  min-width: 0;
}
.prism-example__controls {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}
.prism-slide {
  display: flex;
  height: 100%;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 4px;
  padding: 18px;
  border-radius: inherit;
  color: white;
  text-align: center;
}
.prism-slide--1 {
  background: linear-gradient(145deg, #285fff, #7656ee);
}
.prism-slide--2 {
  background: linear-gradient(145deg, #007f94, #38c9b0);
}
.prism-slide--3 {
  background: linear-gradient(145deg, #c8497b, #f47d65);
}
.prism-slide span {
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 0.08em;
  opacity: 0.82;
}
.prism-slide strong {
  font-size: 16px;
}
.prism-slide small {
  opacity: 0.76;
}
</style>
