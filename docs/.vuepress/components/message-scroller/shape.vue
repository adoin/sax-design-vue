<script setup lang="ts">
import { ref } from 'vue'
const messages = ref(
  Array.from({ length: 6 }, (_, i) => ({
    id: i,
    content: `Conversation message ${i + 1}`,
  })),
)
let nextId = 6
function append() {
  messages.value.push({ id: nextId++, content: 'A new answer has arrived.' })
}
function prepend() {
  messages.value.unshift({
    id: nextId++,
    content: 'An earlier message loaded from history.',
  })
}
</script>

<template>
  <div class="agent-demo-shapes">
    <div class="agent-demo">
      <s-tag>Rounded</s-tag>
      <s-message-scroller shape="rounded" :height="300"
        ><s-message
          v-for="message in messages"
          :key="message.id"
          :content="message.content"
          :actions="false"
      /></s-message-scroller>
      <div class="agent-demo-actions">
        <s-button @click="append">Append message</s-button
        ><s-button type="flat" @click="prepend">Load earlier message</s-button>
      </div>
    </div>
    <div class="agent-demo">
      <s-tag>Square</s-tag>
      <s-message-scroller shape="square" :height="300"
        ><s-message
          v-for="message in messages"
          :key="message.id"
          :content="message.content"
          :actions="false"
      /></s-message-scroller>
      <div class="agent-demo-actions">
        <s-button @click="append">Append message</s-button
        ><s-button type="flat" @click="prepend">Load earlier message</s-button>
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
