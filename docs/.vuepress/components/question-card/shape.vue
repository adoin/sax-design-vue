<script setup lang="ts">
import { ref } from 'vue'
import type { AgentAnswer, AgentQuestion } from 'sax-design-vue'
const index = ref(0)
const answers = ref<AgentAnswer[]>([])
const submitted = ref(false)
const questions: AgentQuestion[] = [
  {
    id: 'audience',
    title: 'Who is the answer for?',
    options: [
      { value: 'developer', label: 'Developers' },
      { value: 'reader', label: 'General readers' },
    ],
    allowCustom: true,
  },
  {
    id: 'length',
    title: 'How detailed should it be?',
    options: [
      { value: 'short', label: 'Concise' },
      { value: 'long', label: 'Detailed' },
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
  <div class="agent-demo-shapes">
    <div class="agent-demo">
      <s-tag>Rounded</s-tag>
      <s-question-card
        v-model="answers"
        v-model:active-index="index"
        shape="rounded"
        :questions="questions"
        @submit="submitted = true"
      /><s-tag v-if="submitted">Answers submitted</s-tag
      ><s-button type="flat" @click="reset">Reset answers</s-button>
    </div>
    <div class="agent-demo">
      <s-tag>Square</s-tag>
      <s-question-card
        v-model="answers"
        v-model:active-index="index"
        shape="square"
        :questions="questions"
        @submit="submitted = true"
      /><s-tag v-if="submitted">Answers submitted</s-tag
      ><s-button type="flat" @click="reset">Reset answers</s-button>
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
