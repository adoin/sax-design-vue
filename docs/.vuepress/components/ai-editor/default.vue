<script setup lang="ts">
import { ref } from 'vue'
import type { AiEditorInstance } from 'sax-design-vue'
const editor = ref<AiEditorInstance>()
const text = ref(
  'A good document gives every idea a little room to breathe. Select a sentence to adjust its emphasis, explain it, or explore a different way of saying it.\n\nThe editor keeps your text and inline formatting separate so either can be saved with your document.',
)
const answer =
  'Start with one clear idea, then use a short supporting sentence. This makes the paragraph easier to read and keeps the meaning intact.'
const selectSentence = () => {
  const end = text.value.search(/[.!?。！？]/)
  editor.value?.select(0, end < 0 ? Math.min(36, text.value.length) : end + 1)
}
</script>

<template>
  <div class="editor-demo">
    <s-button size="small" @click="selectSentence"
      >Select the first sentence</s-button
    >
    <s-ai-editor
      ref="editor"
      v-model="text"
      title="A little room to think"
      :answer="answer"
    />
  </div>
</template>

<style scoped>
.editor-demo {
  display: grid;
  width: 100%;
  gap: 16px;
}
.editor-demo > .s-button {
  justify-self: start;
}
</style>
