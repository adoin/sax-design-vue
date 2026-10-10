<script setup lang="ts">
import type { AgentSource } from 'sax-design-vue'
const sources: AgentSource[] = [
  {
    id: 'vue',
    title: 'Vue',
    href: 'https://vuejs.org/guide/',
    description: 'Vue 官方指南。',
  },
  {
    id: 'mdn',
    title: 'MDN',
    href: 'https://developer.mozilla.org/en-US/docs/Web/API',
    description: 'Web 平台 API 文档。',
  },
]
</script>

<template>
  <div class="agent-demo">
    <p>
      使用受控模型使状态变化保持可预测。
      <s-inline-citations :sources="sources" />
    </p>
  </div>
</template>

<style scoped>
.agent-demo {
  display: flex;
  flex-direction: column;
  gap: 18px;
  width: 100%;
  min-width: 0;
}
.agent-demo-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
