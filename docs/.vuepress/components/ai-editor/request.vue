<script setup lang="ts">
import { ref } from 'vue'
import type { AiEditorInstance, AiEditorRequest } from 'sax-design-vue'
const editor = ref<AiEditorInstance>()
const text = ref(
  'Current risk: 12 enterprise customers still need permission migration, which may delay next week’s full release. Customer Success will confirm account mappings, Engineering will provide validation tools, and both teams will complete acceptance checks by Wednesday.',
)
const rejectRequest = ref(false)
const request = async ({ signal, report }: AiEditorRequest) => {
  report({ status: 'thinking' })
  await new Promise((resolve) => setTimeout(resolve, 500))
  if (signal.aborted) throw new Error('Request cancelled')
  report({
    status: 'researching',
    sources: [
      { label: 'Project status log' },
      { label: 'Permission migration checklist' },
    ],
  })
  await new Promise((resolve) => setTimeout(resolve, 600))
  if (signal.aborted) throw new Error('Request cancelled')
  if (rejectRequest.value)
    throw new Error(
      'The demo service is unavailable. Turn off failure mode and retry.',
    )
  return {
    text: 'Risk: permission migration is incomplete for 12 enterprise customers. Mitigation: Customer Success verifies account mappings and Engineering provides validation tools. Both teams complete acceptance by Wednesday; expand the rollout only after approval.',
    sources: [{ label: 'Project status log' }],
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
      title="Clarify risks and mitigation"
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
