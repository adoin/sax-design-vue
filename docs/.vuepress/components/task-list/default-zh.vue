<script setup lang="ts">
import { ref } from 'vue'
import type { AgentTask } from 'sax-design-vue'
const expanded = ref(true)
const tasks = ref<AgentTask[]>([
  { id: '1', title: '收集资料', status: 'complete' },
  { id: '2', title: '撰写摘要', status: 'running', progress: 35 },
  { id: '3', title: '检查结果', status: 'pending' },
])
function select(task: AgentTask) {
  tasks.value = tasks.value.map((item) =>
    item.id === task.id
      ? {
          ...item,
          status: item.status === 'complete' ? 'pending' : 'complete',
          progress: item.status === 'complete' ? 0 : 100,
        }
      : item,
  )
}
</script>

<template>
  <div class="agent-demo">
    <s-task-list
      v-model:expanded="expanded"
      :tasks="tasks"
      interactive
      @task-click="select"
    />
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
