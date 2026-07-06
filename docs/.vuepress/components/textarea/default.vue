<template>
  <vs-textarea v-model="text" label="Notes" :counter="100" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const text = ref('Hello textarea')
</script>
