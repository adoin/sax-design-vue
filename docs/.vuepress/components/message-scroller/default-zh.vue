<script setup lang="ts">
import { ref } from 'vue'
const messages = ref(
  Array.from({ length: 6 }, (_, i) => ({
    id: i,
    role: (i % 2 === 0 ? 'user' : 'assistant') as 'user' | 'assistant',
    content:
      i % 2 === 0
        ? `请帮我检查工作汇报的第 ${i / 2 + 1} 部分。`
        : '这部分可以补充本周完成的事项、当前风险和下周安排。',
  })),
)
let nextId = 6
function append() {
  messages.value.push({
    id: nextId++,
    role: 'assistant',
    content: '新的回答已到达。',
  })
}
function prepend() {
  messages.value.unshift({
    id: nextId++,
    role: 'user',
    content: '从历史记录加载的更早消息。',
  })
}
</script>

<template>
  <div class="agent-demo">
    <s-message-scroller :height="300"
      ><s-message
        v-for="message in messages"
        :key="message.id"
        :role="message.role"
        :author="message.role === 'user' ? '我' : 'Agent'"
        :content="message.content"
        :actions="false"
        ><template v-if="message.role === 'user'" #avatar
          ><s-avatar :size="30" shape="circle"
            ><img
              src="/avatars/avatar-5.png"
              alt="用户头像" /></s-avatar></template
      ></s-message>
    </s-message-scroller>
    <div class="agent-demo-actions">
      <s-button @click="append">追加消息</s-button
      ><s-button type="flat" @click="prepend">加载更早消息</s-button>
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
</style>
