<template>
  <vs-textarea v-model="text" :counter="25" counter-danger />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const text = ref('Hello world')
</script>
