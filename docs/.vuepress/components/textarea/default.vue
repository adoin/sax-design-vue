<template>
  <s-textarea v-model="text" placeholder="Write something" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const text = ref('')
</script>
