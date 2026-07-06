<template>
  <vs-slider v-model="value" :min="0" :max="100" color="primary" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref(40)
</script>
