<script lang="ts" setup>
import { shallowRef } from 'vue'

const expanded = shallowRef(false)
const content =
  'Sax Design Vue keeps typography and interaction consistent across complex product screens. A shared visual language for spacing, color, and motion helps teams move between dense dashboards and focused detail views without losing context.'
</script>

<template>
  <s-text-ellipsis
    v-model:expanded="expanded"
    :line-clamp="2"
    expandable
    :content="content"
  />
</template>
