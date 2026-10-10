<script setup lang="ts">
import { ref } from 'vue'
import type { AgentTask } from 'sax-design-vue'
const expanded = ref(false)
const steps = ref<AgentTask[]>([
  {
    id: 'read',
    title: 'Read the request',
    description: 'Identify constraints and available sources.',
    status: 'complete',
  },
  {
    id: 'research',
    title: 'Review sources',
    description: 'Compare the available evidence.',
    status: 'running',
  },
  { id: 'answer', title: 'Prepare an answer', status: 'pending' },
])
function advance() {
  const index = steps.value.findIndex((item) => item.status === 'running')
  if (index < 0) return
  steps.value = steps.value.map((item, i) => ({
    ...item,
    status:
      i === index ? 'complete' : i === index + 1 ? 'running' : item.status,
  }))
}
</script>

<template>
  <div class="agent-demo-shapes">
    <div class="agent-demo">
      <s-tag>Rounded</s-tag>
      <s-reasoning-steps
        v-model:expanded="expanded"
        shape="rounded"
        :steps="steps"
        :sources="[
          { id: 'source', title: steps[1].title, icon: 'cb:document' },
        ]"
      />
      <s-button @click="advance">Complete current step</s-button>
    </div>
    <div class="agent-demo">
      <s-tag>Square</s-tag>
      <s-reasoning-steps
        v-model:expanded="expanded"
        shape="square"
        :steps="steps"
        :sources="[
          { id: 'source', title: steps[1].title, icon: 'cb:document' },
        ]"
      />
      <s-button @click="advance">Complete current step</s-button>
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
