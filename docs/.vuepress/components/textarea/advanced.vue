<template>
  <s-textarea
    v-model="value"
    label="Feedback"
    placeholder="Write a short note"
    :max-length="120"
    show-word-count
    trim
    :auto-size="{ minRows: 3, maxRows: 7 }"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const value = ref('')
</script>
