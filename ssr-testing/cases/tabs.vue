<template>
  <s-tabs v-model="active">
    <s-tab label="A">A</s-tab>
    <s-tab label="B">B</s-tab>
  </s-tabs>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const active = ref('A')
</script>
