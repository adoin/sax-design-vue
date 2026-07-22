<template>
  <s-button @click="visible = true">Open confirmation</s-button>
  <s-dialog
    v-model="visible"
    title="Archive draft"
    content="This action can be undone from the archive."
    show-footer
    show-cancel-button
    show-confirm-button
    confirm-button-text="Archive"
    @confirm="confirmed = true"
  />
  <p v-if="confirmed">Archived.</p>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const visible = ref(false)
const confirmed = ref(false)
</script>
