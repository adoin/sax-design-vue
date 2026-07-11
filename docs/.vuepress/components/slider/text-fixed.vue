<template>
  <vs-slider v-model="val" text-fixed="%" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const val = ref(25)
</script>
