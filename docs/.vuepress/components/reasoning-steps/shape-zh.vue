<script setup lang="ts">
import { ref } from 'vue'
import type { AgentTask } from 'sax-design-vue'
const expanded = ref(true)
const steps = ref<AgentTask[]>([
  {
    id: 'read',
    title: '理解需求',
    description: '识别约束与可用资料。',
    status: 'complete',
  },
  {
    id: 'research',
    title: '核对资料',
    description: '对照已有信息。',
    status: 'running',
  },
  { id: 'answer', title: '整理回答', status: 'pending' },
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
      <s-tag>圆角</s-tag>
      <s-reasoning-steps
        v-model:expanded="expanded"
        shape="rounded"
        :steps="steps"
      />
      <s-button @click="advance">完成当前步骤</s-button>
    </div>
    <div class="agent-demo">
      <s-tag>方角</s-tag>
      <s-reasoning-steps
        v-model:expanded="expanded"
        shape="square"
        :steps="steps"
      />
      <s-button @click="advance">完成当前步骤</s-button>
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
