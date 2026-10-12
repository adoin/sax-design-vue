<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import type { SkeletonRow } from 'sax-design-vue'
const pattern = shallowRef('shapes')
const patterns: Record<string, SkeletonRow[]> = {
  shapes: [
    ['circle', 'square', { type: 'rectangle', width: 120, height: 64 }, 'line'],
  ],
  profile: [
    [
      { type: 'circle', size: 56 },
      {
        type: 'group',
        gap: 10,
        rows: [
          [{ type: 'line', width: '42%', height: 18 }],
          ['line'],
          [{ type: 'line', width: '72%' }],
        ],
      },
    ],
  ],
  article: [
    [{ type: 'rectangle', height: 140 }],
    [{ type: 'line', width: '55%', height: 20 }],
    ['line'],
    [{ type: 'line', width: '82%' }],
  ],
  list: [
    [
      { type: 'square', size: 48 },
      {
        type: 'group',
        gap: 8,
        rows: [
          [{ type: 'line', width: '60%' }],
          [{ type: 'line', width: '88%', height: 10 }],
        ],
      },
      { type: 'line', width: 40, height: 10 },
    ],
  ],
}
const rows = computed(() => patterns[pattern.value])
</script>
<template>
  <div class="skeleton-demo">
    <s-radio-group v-model="pattern">
      <s-radio value="shapes">基础形状</s-radio>
      <s-radio value="profile">用户资料</s-radio>
      <s-radio value="article">文章</s-radio>
      <s-radio value="list">列表</s-radio>
    </s-radio-group>
    <s-skeleton :rows="rows" :repeat="pattern === 'list' ? 3 : 1" />
  </div>
</template>
<style scoped>
.skeleton-demo {
  display: grid;
  width: 100%;
  min-width: 0;
  gap: 24px;
}
</style>
