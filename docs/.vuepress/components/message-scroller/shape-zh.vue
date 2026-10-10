<script setup lang="ts">
import { ref } from 'vue'
const messages = ref(
  Array.from({ length: 6 }, (_, i) => ({
    id: i,
    content: `对话消息 ${i + 1}`,
  })),
)
let nextId = 6
function append() {
  messages.value.push({ id: nextId++, content: '新的回答已到达。' })
}
function prepend() {
  messages.value.unshift({
    id: nextId++,
    content: '从历史记录加载的更早消息。',
  })
}
</script>

<template>
  <div class="agent-demo-shapes">
    <div class="agent-demo">
      <s-tag>圆角</s-tag>
      <s-message-scroller shape="rounded" :height="300"
        ><s-message
          v-for="message in messages"
          :key="message.id"
          :content="message.content"
          :actions="false"
      /></s-message-scroller>
      <div class="agent-demo-actions">
        <s-button @click="append">追加消息</s-button
        ><s-button type="flat" @click="prepend">加载更早消息</s-button>
      </div>
    </div>
    <div class="agent-demo">
      <s-tag>方角</s-tag>
      <s-message-scroller shape="square" :height="300"
        ><s-message
          v-for="message in messages"
          :key="message.id"
          :content="message.content"
          :actions="false"
      /></s-message-scroller>
      <div class="agent-demo-actions">
        <s-button @click="append">追加消息</s-button
        ><s-button type="flat" @click="prepend">加载更早消息</s-button>
      </div>
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
