<script setup lang="ts">
import { shallowRef } from 'vue'
const value = shallowRef('')
const hint =
  'Describe your idea, including any details that help explain it.\nYou can enter multiple lines here.'
</script>

<template>
  <s-textarea
    v-model="value"
    label="Notes"
    :placeholder="hint"
    :auto-size="{ minRows: 3, maxRows: 5 }"
  />
</template>
