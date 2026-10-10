<script setup lang="ts">
import { ref } from 'vue'
import type { AgentAttachment } from 'sax-design-vue'
const text = ref('')
const loading = ref(false)
const sent = ref('')
const attachments = ref<AgentAttachment[]>([])
function attach() {
  attachments.value = [
    ...attachments.value,
    { id: String(Date.now()), name: 'notes.txt' },
  ]
}
function remove(attachment: AgentAttachment) {
  attachments.value = attachments.value.filter(
    (item) => item.id !== attachment.id,
  )
}
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
  <div class="agent-demo-shapes">
    <div class="agent-demo">
      <s-tag>圆角</s-tag>
      <s-chat-input
        v-model="text"
        shape="rounded"
        :loading="loading"
        :attachments="attachments"
        @attach="attach"
        @remove-attachment="remove"
        @submit="send"
        @stop="stop"
      /><s-tag v-if="sent">{{ sent }}</s-tag>
    </div>
    <div class="agent-demo">
      <s-tag>方角</s-tag>
      <s-chat-input
        v-model="text"
        shape="square"
        :loading="loading"
        :attachments="attachments"
        @attach="attach"
        @remove-attachment="remove"
        @submit="send"
        @stop="stop"
      /><s-tag v-if="sent">{{ sent }}</s-tag>
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
