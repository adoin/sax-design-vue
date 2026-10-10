<script setup lang="ts">
import { ref } from 'vue'
import type { AiEditorInstance, AiEditorRequest } from 'sax-design-vue'
const editor = ref<AiEditorInstance>()
const text = ref(
  'A reusable component should make the common path simple and leave room for application-specific behavior.',
)
const rejectRequest = ref(false)
const request = async ({ selection, signal, report }: AiEditorRequest) => {
  report({ status: 'thinking' })
  await new Promise((resolve) => setTimeout(resolve, 500))
  if (signal.aborted) throw new Error('Request cancelled')
  report({
    status: 'researching',
    sources: [{ label: 'Component guidelines' }, { label: 'Document context' }],
  })
  await new Promise((resolve) => setTimeout(resolve, 600))
  if (signal.aborted) throw new Error('Request cancelled')
  if (rejectRequest.value)
    throw new Error(
      'The demo service is unavailable. Turn off failure mode and retry.',
    )
  return {
    text: `“${selection.text}” can be shortened to: Make the common path simple and keep extension points explicit.`,
    sources: [{ label: 'Component guidelines' }],
  }
}
</script>

<template>
  <div class="request-demo">
    <div class="request-demo__controls">
      <s-button size="small" @click="editor?.select(0, text.length)"
        >Select the paragraph</s-button
      >
      <s-checkbox v-model="rejectRequest">Simulate a failed request</s-checkbox>
    </div>
    <s-ai-editor
      ref="editor"
      v-model="text"
      title="Async assistance"
      :request="request"
    />
  </div>
</template>

<style scoped>
.request-demo {
  display: grid;
  width: 100%;
  gap: 16px;
}
.request-demo__controls {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}
</style>
