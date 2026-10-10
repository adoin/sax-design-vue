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
function locate(message: AgentHistoryMessage, group = '') {
  activeId.value = message.id
  document
    .querySelector<HTMLElement>(
      `#${CSS.escape(`${historyId}-${group}${message.id}`)}`,
    )
    ?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
}
</script>

<template>
  <div class="agent-demo-shapes">
    <div class="agent-demo">
      <s-tag>Rounded</s-tag>
      <s-chat-history
        v-model="open"
        shape="rounded"
        :messages="messages"
        :active-id="activeId"
        @select="locate($event, '1-')"
      >
        <s-message-scroller :height="220" :auto-follow="false"
          ><s-message
            v-for="message in messages"
            :id="historyId + '-1-' + message.id"
            :key="message.id"
            :role="message.role"
            :content="message.content"
            :actions="false"
        /></s-message-scroller>
      </s-chat-history>
    </div>
    <div class="agent-demo">
      <s-tag>Square</s-tag>
      <s-chat-history
        v-model="open"
        shape="square"
        :messages="messages"
        :active-id="activeId"
        @select="locate($event, '2-')"
      >
        <s-message-scroller :height="220" :auto-follow="false"
          ><s-message
            v-for="message in messages"
            :id="historyId + '-2-' + message.id"
            :key="message.id"
            :role="message.role"
            :content="message.content"
            :actions="false"
        /></s-message-scroller>
      </s-chat-history>
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
