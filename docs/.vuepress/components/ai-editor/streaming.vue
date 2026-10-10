<script setup lang="ts">
import { ref } from 'vue'
import type { AiEditorInstance, AiEditorRequest } from 'sax-design-vue'
const editor = ref<AiEditorInstance>()
const text = ref(
  'Streamed answers can arrive progressively while the reader keeps the original passage in view.',
)
async function* request({ signal, report }: AiEditorRequest) {
  report({ status: 'researching', sources: [{ label: 'Original passage' }] })
  const answer =
    'Keep the original passage visible. Present new information in small, readable pieces, and give the reader a clear way to stop or apply the answer.'
  const pieces = answer.match(/.{1,8}/g) || []
  for (const piece of pieces) {
    await new Promise((resolve) => setTimeout(resolve, 120))
    if (signal.aborted) return
    yield piece
  }
}
</script>

<template>
  <div class="stream-demo">
    <s-button size="small" @click="editor?.select(0, text.length)"
      >Select the paragraph</s-button
    >
    <s-ai-editor
      ref="editor"
      v-model="text"
      title="Progressive answers"
      :request="request"
    />
  </div>
</template>

<style scoped>
.stream-demo {
  display: grid;
  width: 100%;
  gap: 16px;
}
.stream-demo > .s-button {
  justify-self: start;
}
</style>
