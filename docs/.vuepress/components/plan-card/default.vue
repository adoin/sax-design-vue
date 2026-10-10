<script setup lang="ts">
import { ref } from 'vue'
import type { AgentTask } from 'sax-design-vue'
const expanded = ref(false)
const status = ref<'pending' | 'approved' | 'rejected'>('pending')
const tasks: AgentTask[] = [
  { id: '1', title: 'Read documentation', status: 'pending' },
  { id: '2', title: 'Draft the response', status: 'pending' },
]
</script>

<template>
  <div class="agent-demo">
    <s-plan-card
      v-model:expanded="expanded"
      :status="status"
      :tasks="tasks"
      title="Prepare a source-backed answer"
      description="Review sources before writing a concise response."
      content="Collect two independent sources, compare the claims, and include direct citations."
      @approve="status = 'approved'"
      @reject="status = 'rejected'"
    /><s-button type="flat" @click="status = 'pending'"
      >Reset decision</s-button
    >
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
