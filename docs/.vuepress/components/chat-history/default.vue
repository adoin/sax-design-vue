<script setup lang="ts">
import { ref, useId } from 'vue'
import type { AgentHistoryMessage } from 'sax-design-vue'
const historyId = useId()
const open = ref(false)
const activeId = ref('')
const messages: AgentHistoryMessage[] = [
  {
    id: '1',
    role: 'user',
    content: 'How is the portal project progressing?',
  },
  {
    id: '2',
    role: 'assistant',
    content:
      'We delivered the sign-in redesign and single sign-on to 30% of users. Sign-in success rose from 96.8% to 99.2% and support tickets fell 18%. Monitoring is ready, and we will continue tracking conversion and error rates.',
  },
  {
    id: '3',
    role: 'user',
    content: 'What risks remain before release?',
  },
  {
    id: '4',
    role: 'assistant',
    content:
      'Twelve enterprise customers still use legacy permissions. Customer Success is verifying account mappings and Engineering is building migration checks. Both teams will complete acceptance before expanding the rollout.',
  },
  {
    id: '5',
    role: 'user',
    content: 'What is planned for next week?',
  },
  {
    id: '6',
    role: 'assistant',
    content:
      'Complete migration checks by Wednesday, then expand the rollout from 30% to 60%. On Friday, review sign-in metrics, alerts and customer feedback, and share the full-release recommendation with business owners.',
  },
  {
    id: '7',
    role: 'user',
    content: 'Summarize the results for management.',
  },
  {
    id: '8',
    role: 'assistant',
    content:
      'The portal redesign reached 99.2% sign-in success and reduced tickets by 18%. Next week we will complete permission migration, validate stability at a larger rollout, and deliver the release assessment on Friday.',
  },
]
function locate(message: AgentHistoryMessage) {
  activeId.value = message.id
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
      <s-message-scroller :height="320" :auto-follow="false"
        ><s-message
          v-for="message in messages"
          :id="historyId + '-' + message.id"
          :key="message.id"
          :data-message-id="message.id"
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
