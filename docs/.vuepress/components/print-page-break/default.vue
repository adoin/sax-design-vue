<template>
  <s-print ref="printer"
    ><p>First page</p>
    <s-print-page-break />
    <p>Second page</p></s-print
  ><s-button @click="printer?.print()">Print with page break</s-button>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
const printer = ref<{ print: () => void }>()
</script>
