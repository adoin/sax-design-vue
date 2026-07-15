<template>
  <s-textarea v-model="text" height="120px" label="Taller area" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const text = ref('')
</script>
