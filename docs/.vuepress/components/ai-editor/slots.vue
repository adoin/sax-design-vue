<script setup lang="ts">
import { ref } from 'vue'
const text = ref(
  'Support tickets are down and user feedback looks positive. The sign-in redesign seems to help.',
)
const answer =
  'During the sign-in rollout, support tickets fell 18% week over week. We will continue collecting user feedback and evaluate the redesign with data from the full release.'
</script>

<template>
  <s-ai-editor v-model="text" title="Executive update" :answer="answer">
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
