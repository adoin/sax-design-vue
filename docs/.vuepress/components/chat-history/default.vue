<script setup lang="ts">
import { ref, useId } from 'vue'
import type { AgentHistoryMessage } from 'sax-design-vue'
const historyId = useId()
const open = ref(false)
const activeId = ref('')
const messages: AgentHistoryMessage[] = [
  { id: '1', role: 'user', content: 'How does streaming work?' },
  {
    id: '2',
    role: 'assistant',
    content: 'Append text chunks to the controlled text prop.',
  },
  { id: '3', role: 'user', content: 'Can I pause the reveal?' },
]
function locate(message: AgentHistoryMessage) {
  activeId.value = message.id
  document
    .querySelector<HTMLElement>(`#${CSS.escape(`${historyId}-${message.id}`)}`)
    ?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
}
</script>

<template>
  <div class="agent-demo">
    <s-chat-history
      v-model="open"
      :messages="messages"
      :active-id="activeId"
      @select="locate"
    >
      <s-message-scroller :height="220" :auto-follow="false"
        ><s-message
          v-for="message in messages"
          :id="historyId + '-' + message.id"
          :key="message.id"
          :role="message.role"
          :content="message.content"
          :actions="false"
      /></s-message-scroller>
    </s-chat-history>
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
