<template>
  <s-input
    v-model="value"
    placeholder="Search product"
    :max-length="40"
    show-word-count
    trim
    align="left"
    :prefix-config="{ content: '⌕' }"
    :suffix-config="{ content: '⌘ K' }"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const value = ref('')
</script>
