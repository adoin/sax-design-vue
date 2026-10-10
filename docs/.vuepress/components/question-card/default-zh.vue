<script setup lang="ts">
import { ref } from 'vue'
import type { AgentAnswer, AgentQuestion } from 'sax-design-vue'
const index = ref(0)
const answers = ref<AgentAnswer[]>([])
const submitted = ref(false)
const questions: AgentQuestion[] = [
  {
    id: 'audience',
    title: '回答面向谁？',
    options: [
      { value: 'developer', label: '开发者' },
      { value: 'reader', label: '普通读者' },
    ],
    allowCustom: true,
  },
  {
    id: 'length',
    title: '需要多详细？',
    options: [
      { value: 'short', label: '简洁' },
      { value: 'long', label: '详细' },
    ],
    optional: true,
  },
]
function reset() {
  answers.value = []
  index.value = 0
  submitted.value = false
}
</script>

<template>
  <div class="agent-demo">
    <s-question-card
      v-model="answers"
      v-model:active-index="index"
      :questions="questions"
      @submit="submitted = true"
    /><s-tag v-if="submitted">回答已提交</s-tag
    ><s-button type="flat" @click="reset">重置回答</s-button>
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
