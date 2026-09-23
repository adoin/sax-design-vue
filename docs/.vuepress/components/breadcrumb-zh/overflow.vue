<script setup lang="ts">
import { shallowRef } from 'vue'
import type { BreadcrumbItem } from 'sax-design-vue'

const width = shallowRef('300px')
const widthOptions = [
  { label: '窄 · 300px', value: '300px' },
  { label: '中 · 420px', value: '420px' },
  { label: '宽 · 680px', value: '680px' },
]

const items: BreadcrumbItem[] = [
  { title: '工作区', url: '#default' },
  { title: '产品设计与组件资源库', url: '#color' },
  { title: '导航模式', url: '#separator' },
  { title: '响应式布局行为', url: '#alignment' },
  { title: '面包屑', active: true },
]
</script>

<template>
  <div class="breadcrumb-overflow-demo">
    <s-select v-model="width" label="可用宽度" :options="widthOptions" />
    <div class="breadcrumb-overflow-demo__stage" :style="{ width }">
      <s-breadcrumb :items="items" />
    </div>
  </div>
</template>

<style scoped>
.breadcrumb-overflow-demo {
  display: grid;
  gap: 14px;
  width: 100%;
}

.breadcrumb-overflow-demo__stage {
  box-sizing: border-box;
  max-width: 100%;
  padding: 8px;
  border-radius: var(--sax-radius-sm);
  background: color-mix(in srgb, var(--sax-css-primary) 5%, transparent);
}
</style>
