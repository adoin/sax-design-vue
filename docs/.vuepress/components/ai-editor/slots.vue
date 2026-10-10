<script setup lang="ts">
import { ref } from 'vue'
const text = ref(
  'A focused toolbar can offer only the formatting actions your document needs.',
)
const answer =
  'Use the toolbar slot to expose a smaller set of document actions.'
</script>

<template>
  <s-ai-editor v-model="text" title="Custom selection actions" :answer="answer">
    <template #toolbar="{ selection, format }">
      <s-button size="small" @mousedown.prevent @click="format('underline')"
        >Underline</s-button
      >
      <s-tag color="primary">{{ selection.text.length }} characters</s-tag>
    </template>
    <template #answer="{ text: reply }">
      <s-text color="primary">{{ reply }}</s-text>
    </template>
  </s-ai-editor>
</template>
