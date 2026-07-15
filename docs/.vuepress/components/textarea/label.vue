<template>
  <s-textarea v-model="text" label="Description" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const text = ref('')
</script>
