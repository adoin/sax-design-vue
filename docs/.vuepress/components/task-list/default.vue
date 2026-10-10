<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import type { AgentTask } from 'sax-design-vue'
const expanded = ref(true)
const tasks = ref<AgentTask[]>([])
let timer: ReturnType<typeof setInterval> | undefined
const labels = ['Collect sources', 'Write the summary', 'Review the result']
function replay() {
  clearInterval(timer)
  tasks.value = labels.map((title, index) => ({
    id: String(index),
    title,
    status: index === 0 ? 'running' : 'pending',
    progress: index === 0 ? 0 : undefined,
  }))
  timer = setInterval(() => {
    const index = tasks.value.findIndex((task) => task.status === 'running')
    if (index < 0) {
      clearInterval(timer)
      return
    }
    const progress = Math.min(100, (tasks.value[index].progress ?? 0) + 5)
    tasks.value = tasks.value.map((task, i) => {
      if (i === index)
        return {
          ...task,
          status: progress === 100 ? 'complete' : 'running',
          progress: progress === 100 ? undefined : progress,
        }
      if (progress === 100 && i === index + 1)
        return { ...task, status: 'running', progress: 0 }
      return task
    })
  }, 120)
}
onMounted(replay)
onBeforeUnmount(() => clearInterval(timer))
</script>
<template>
  <div class="agent-demo">
    <s-task-list v-model:expanded="expanded" :tasks="tasks" />
    <s-button size="small" @click="replay">Replay tasks</s-button>
  </div>
</template>
<style scoped>
.agent-demo {
  display: grid;
  gap: 18px;
  width: 100%;
  min-width: 0;
}
.agent-demo > .s-button {
  justify-self: start;
}
</style>
