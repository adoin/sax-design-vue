<template>
  <s-textarea
    v-model="text"
    label="Description"
    placeholder="Write something"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const text = ref('')
</script>
