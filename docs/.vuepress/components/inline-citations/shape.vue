<script setup lang="ts">
import type { AgentSource } from 'sax-design-vue'
const sources: AgentSource[] = [
  {
    id: 'vue',
    title: 'Vue',
    href: 'https://vuejs.org/guide/',
    description: 'The official Vue guide.',
  },
  {
    id: 'mdn',
    title: 'MDN',
    href: 'https://developer.mozilla.org/en-US/docs/Web/API',
    description: 'Web platform documentation.',
  },
]
</script>

<template>
  <div class="agent-demo-shapes">
    <div class="agent-demo">
      <s-tag>Rounded</s-tag>
      <p>
        Use a controlled model to keep state predictable.
        <s-inline-citations shape="rounded" :sources="sources" />
      </p>
    </div>
    <div class="agent-demo">
      <s-tag>Square</s-tag>
      <p>
        Use a controlled model to keep state predictable.
        <s-inline-citations shape="square" :sources="sources" />
      </p>
    </div>
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
.agent-demo-shapes {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
  gap: 24px;
  width: 100%;
}
</style>
