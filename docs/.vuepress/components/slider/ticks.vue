<template>
  <vs-slider v-model="val" ticks :step="10" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const val = ref(50)
</script>
