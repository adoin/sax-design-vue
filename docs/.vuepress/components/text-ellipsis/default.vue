<template>
  <s-text-ellipsis
    v-model:expanded="expanded"
    :line-clamp="2"
    expandable
    :content="content"
  />
</template>
<script lang="ts" setup>
import { ref } from 'vue'
const expanded = ref(false)
const content =
  'Sax Design Vue keeps component typography compact while preserving access to long descriptions. Expand this block to reveal the complete message without changing the surrounding layout.'
</script>
