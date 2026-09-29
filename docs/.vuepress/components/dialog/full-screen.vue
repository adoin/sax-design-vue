<script setup lang="ts">
import { ref } from 'vue'
const visible = ref(false)
const draft = ref(
  'This draft stays intact when the dialog is minimized and restored.',
)
</script>

<template>
  <s-button @click="visible = true">Open full-screen workspace</s-button>
  <s-dialog
    v-model="visible"
    full-screen
    lock-scroll
    title="Draft workspace"
    minimized-label="Draft in progress"
  >
    <s-textarea v-model="draft" label="Draft content" :rows="6" />
    <template #footer>
      <s-button @click="visible = false">Finish editing</s-button>
    </template>
  </s-dialog>
</template>
