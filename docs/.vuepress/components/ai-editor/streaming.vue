<script setup lang="ts">
import { ref } from 'vue'
import type { AiEditorInstance, AiEditorRequest } from 'sax-design-vue'
const editor = ref<AiEditorInstance>()
const text = ref(
  'Next week: continue the portal release, finish permission migration, monitor sign-in metrics, and update the business team.',
)
async function* request({ signal, report }: AiEditorRequest) {
  report({ status: 'researching', sources: [{ label: 'Weekly project plan' }] })
  const answer =
    'Next week we will focus on three actions:\n1. Complete permission migration and acceptance for 12 enterprise customers by Wednesday.\n2. Expand the rollout from 30% to 60% while monitoring sign-in success and alerts.\n3. Share the release assessment, remaining risks, and next steps with the business team on Friday.'
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
      title="Expand next week’s action plan"
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
