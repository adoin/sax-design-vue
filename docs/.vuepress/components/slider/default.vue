<template>
  <vs-slider v-model="val" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const val = ref(30)
</script>
