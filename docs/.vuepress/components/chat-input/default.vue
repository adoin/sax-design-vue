<script setup lang="ts">
import { ref } from 'vue'
import type { AgentAttachment, ChatInputModel } from 'sax-design-vue'
const text = ref('')
const loading = ref(false)
const sent = ref('')
const attachments = ref<AgentAttachment[]>([])
const model = ref('gpt-6.1-sol')
const fast = ref(false)
const reasoning = ref('medium')
const efforts = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'xhigh', label: 'Very high' },
  { value: 'max', label: 'Maximum' },
  { value: 'ultra', label: 'Ultra' },
]
const recommended = {
  value: 'recommended',
  label: 'Default',
  description: 'Recommended models',
}
const otherModels = { value: 'others', label: 'Other models' }
const models: ChatInputModel[] = [
  {
    value: 'gpt-6.1-sol',
    label: 'GPT-6.1 Sol',
    group: recommended,
    capabilities: {
      fast: true,
      reasoning: { options: efforts, default: 'medium' },
    },
  },
  {
    value: 'gpt-6-astra',
    label: 'GPT-6 Astra',
    group: recommended,
    capabilities: {
      fast: true,
      reasoning: { options: efforts, default: 'medium' },
    },
  },
  {
    value: 'gpt-6-luna',
    label: 'GPT-6 Luna',
    group: recommended,
    capabilities: {
      fast: true,
      reasoning: { options: efforts.slice(0, 5), default: 'medium' },
    },
  },
  {
    value: 'claude',
    label: 'Claude',
    group: otherModels,
    capabilities: {
      reasoning: {
        options: [
          { value: 'off', label: 'Off' },
          { value: 'adaptive', label: 'Automatic' },
        ],
        default: 'adaptive',
      },
    },
  },
  {
    value: 'gemini',
    label: 'Gemini',
    group: otherModels,
    capabilities: {
      reasoning: {
        options: [
          { value: 'light', label: 'Light' },
          { value: 'deep', label: 'Deep' },
        ],
        default: 'light',
      },
    },
  },
  { value: 'chatgpt', label: 'ChatGPT', group: otherModels, capabilities: {} },
]
function send(value: string) {
  sent.value = value || 'Attachment sent'
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
      speech-language="en-US"
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
