<script setup lang="ts">
import { ref } from 'vue'
import type { AgentTask } from 'sax-design-vue'
const expanded = ref(false)
const status = ref<'pending' | 'approved' | 'rejected'>('pending')
const run = ref(0)
const tasks: AgentTask[] = [
  { id: '0', title: 'Extract text from doc pages', status: 'pending' },
  { id: '1', title: 'Build the search index', status: 'pending' },
  { id: '2', title: 'Add the search endpoint', status: 'pending' },
  { id: '3', title: 'Connect the search shortcut', status: 'pending' },
  { id: '4', title: 'Optimize caching', status: 'pending' },
  { id: '5', title: 'Verify result ranking', status: 'pending' },
]
function replay() {
  status.value = 'pending'
  run.value++
}
</script>
<template>
  <div class="agent-demo">
    <s-plan-card
      :key="run"
      v-model:expanded="expanded"
      :status="status"
      :tasks="tasks"
      :auto-approve="5"
      title="Full-text search for the docs"
      description="Index every page, rank results by heading and body, and cache the results."
      content="Provide a shared search index and return matching pages with excerpts."
      @approve="status = 'approved'"
      @reject="status = 'rejected'"
    />
    <div class="agent-demo-actions">
      <s-button type="flat" @click="replay">Replay countdown</s-button>
    </div>
  </div>
</template>
<style scoped>
.agent-demo {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  min-width: 0;
}
.agent-demo-actions {
  display: flex;
  align-items: center;
}
</style>
