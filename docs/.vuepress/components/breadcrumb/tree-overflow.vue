<script setup lang="ts">
import { shallowRef } from 'vue'
import type { BreadcrumbItem } from 'sax-design-vue'

const width = shallowRef('320px')
const widthOptions = [
  { label: 'Narrow · 320px', value: '320px' },
  { label: 'Wide · 680px', value: '680px' },
]

const items: BreadcrumbItem[] = [
  { title: 'Workspace', url: '#default' },
  {
    title: 'Projects',
    url: '#tree-shortcuts',
    children: [
      { title: 'Design system', url: '#color' },
      { title: 'Customer portal', url: '#separator' },
    ],
  },
  {
    title: 'Design system',
    url: '#tree-shortcuts',
    children: [
      { title: 'Navigation patterns', url: '#alignment' },
      { title: 'Data display', url: '#default' },
    ],
  },
  { title: 'Navigation patterns', url: '#alignment' },
  { title: 'Breadcrumb', active: true },
]
</script>

<template>
  <div class="breadcrumb-overflow-demo">
    <s-select v-model="width" label="Available width" :options="widthOptions" />
    <div class="breadcrumb-overflow-demo__stage" :style="{ width }">
      <s-breadcrumb :items="items" trigger="click" />
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
