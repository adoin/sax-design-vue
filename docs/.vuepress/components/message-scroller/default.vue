<script setup lang="ts">
import { ref } from 'vue'
const messages = ref(
  Array.from({ length: 6 }, (_, i) => ({
    id: i,
    role: (i % 2 === 0 ? 'user' : 'assistant') as 'user' | 'assistant',
    content:
      i % 2 === 0
        ? `Please review section ${i / 2 + 1} of my project report.`
        : 'Add completed work, outstanding risks, and the next steps for this section.',
  })),
)
let nextId = 6
function append() {
  messages.value.push({
    id: nextId++,
    role: 'assistant',
    content: 'A new answer has arrived.',
  })
}
function prepend() {
  messages.value.unshift({
    id: nextId++,
    role: 'user',
    content: 'An earlier message loaded from history.',
  })
}
const feedback = ref<Record<number, 'like' | 'dislike' | null>>({})
const editing = ref<number | null>(null)
const draft = ref('')
function edit(id: number, content: string) {
  editing.value = id
  draft.value = content
}
function save(id: number) {
  const message = messages.value.find((message) => message.id === id)
  if (message && draft.value.trim()) message.content = draft.value.trim()
  editing.value = null
}
function regenerate(id: number) {
  const message = messages.value.find((message) => message.id === id)
  if (message)
    message.content =
      'Integration and validation are complete. Track release risks and prioritize monitoring and error handling next week.'
}
</script>

<template>
  <div class="agent-demo">
    <s-message-scroller :height="300"
      ><s-message
        v-for="message in messages"
        :key="message.id"
        v-model:feedback="feedback[message.id]"
        :role="message.role"
        :author="message.role === 'user' ? 'You' : 'Agent'"
        :content="message.content"
        @edit="edit(message.id, message.content)"
        @regenerate="regenerate(message.id)"
        ><template v-if="editing === message.id" #default>
          <div class="message-edit">
            <s-input
              v-model="draft"
              block
              aria-label="Edit message content"
              @keydown.enter.prevent="save(message.id)"
            />
            <div class="agent-demo-actions">
              <s-button size="small" @click="save(message.id)">Save</s-button
              ><s-button size="small" type="flat" @click="editing = null"
                >Cancel</s-button
              >
            </div>
          </div>
        </template>
        <template v-if="message.role === 'user'" #avatar
          ><s-avatar :size="30" shape="circle"
            ><img
              src="/avatars/avatar-5.png"
              alt="Your avatar" /></s-avatar></template
      ></s-message>
    </s-message-scroller>
    <div class="agent-demo-actions">
      <s-button @click="append">Append message</s-button
      ><s-button type="flat" @click="prepend">Load earlier message</s-button>
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
.message-edit {
  display: grid;
  gap: 10px;
  width: 280px;
  max-width: 100%;
  min-width: 0;
}
</style>
