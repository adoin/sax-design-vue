<script setup lang="ts">
import { ref } from 'vue'
import type { AiEditorInstance } from 'sax-design-vue'
const editor = ref<AiEditorInstance>()
const text = ref(
  'This week we shipped the customer portal sign-in redesign to 30% of users. Sign-in success increased from 96.8% to 99.2%.\n\nProgress: single sign-on and error monitoring are complete. Support tickets fell 18% week over week. The remaining legacy accounts will be migrated by Wednesday.\n\nRisks and next steps: a small set of enterprise accounts still uses legacy permissions. Next week we will validate migration, expand the rollout, and review conversion data on Friday.',
)
const answer =
  'This week we delivered the portal sign-in redesign to 30% of users, raising sign-in success by 2.4 percentage points to 99.2%.'
const selectSentence = () => {
  const end = text.value.search(/[!?。！？]|\.(?=\s|$)/)
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
      title="Customer portal · Weekly report"
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
