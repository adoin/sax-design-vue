<template>
  <vs-textarea v-model="text" width="300px" label="Fixed width" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const text = ref('')
</script>
