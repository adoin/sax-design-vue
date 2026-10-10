<script setup lang="ts">
import type { AgentSource } from 'sax-design-vue'
const sources: AgentSource[] = [
  {
    id: 'vue',
    title: 'Vue',
    publisher: 'Vue.js',
    icon: 'cb:document',
    href: 'https://vuejs.org/guide/',
    description: 'The official Vue guide.',
  },
  {
    id: 'mdn',
    title: 'MDN',
    publisher: 'MDN Web Docs',
    icon: 'cb:document',
    href: 'https://developer.mozilla.org/en-US/docs/Web/API',
    description: 'Web platform documentation.',
  },
]
</script>

<template>
  <div class="agent-demo">
    <p>
      Use a controlled model to keep state predictable.
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
