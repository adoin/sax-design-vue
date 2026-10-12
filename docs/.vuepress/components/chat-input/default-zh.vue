<script setup lang="ts">
import { ref } from 'vue'
import type { AgentAttachment } from 'sax-design-vue'
const text = ref('')
const loading = ref(false)
const sent = ref('')
const attachments = ref<AgentAttachment[]>([])
const model = ref('gpt-6.1-sol')
const fast = ref(false)
const reasoning = ref('medium')
const efforts = [
  { value: 'low', label: '低' },
  { value: 'medium', label: '中' },
  { value: 'high', label: '高' },
  { value: 'xhigh', label: '极高' },
  { value: 'max', label: '最大' },
  { value: 'ultra', label: '超高' },
]
const models = [
  {
    value: 'gpt-6.1-sol',
    label: 'GPT-6.1 Sol',
    supportsFast: true,
    reasoningEfforts: efforts,
    defaultReasoning: 'medium',
  },
  {
    value: 'gpt-6-astra',
    label: 'GPT-6 Astra',
    supportsFast: true,
    reasoningEfforts: efforts,
    defaultReasoning: 'medium',
  },
  {
    value: 'gpt-6-luna',
    label: 'GPT-6 Luna',
    supportsFast: true,
    reasoningEfforts: efforts.slice(0, 5),
    defaultReasoning: 'medium',
  },
]
function send(value: string) {
  sent.value = value || '已发送附件'
  loading.value = true
}
function stop() {
  loading.value = false
  text.value = ''
  attachments.value = []
}
</script>

<template>
  <div class="agent-demo">
    <s-chat-input
      v-model="text"
      v-model:attachments="attachments"
      v-model:model="model"
      v-model:fast="fast"
      v-model:reasoning="reasoning"
      :loading="loading"
      :models="models"
      speech-language="zh-CN"
      @submit="send"
      @stop="stop"
    /><s-tag v-if="sent">{{ sent }}</s-tag>
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
