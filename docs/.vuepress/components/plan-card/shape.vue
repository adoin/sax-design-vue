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
  <div class="agent-demo-shapes">
    <div class="agent-demo">
      <s-tag>Rounded</s-tag>
      <s-plan-card
        v-model:expanded="expanded"
        shape="rounded"
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
    <div class="agent-demo">
      <s-tag>Square</s-tag>
      <s-plan-card
        v-model:expanded="expanded"
        shape="square"
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
