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
  { value: 'low', label: '低' },
  { value: 'medium', label: '中' },
  { value: 'high', label: '高' },
  { value: 'xhigh', label: '极高' },
  { value: 'max', label: '最大' },
  { value: 'ultra', label: '超高' },
]
const recommended = {
  value: 'recommended',
  label: '默认',
  description: '推荐模型集',
}
const otherModels = { value: 'others', label: '其他模型' }
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
          { value: 'off', label: '关闭' },
          { value: 'adaptive', label: '自动' },
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
          { value: 'light', label: '轻量' },
          { value: 'deep', label: '深入' },
        ],
        default: 'light',
      },
    },
  },
  { value: 'chatgpt', label: 'ChatGPT', group: otherModels, capabilities: {} },
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
