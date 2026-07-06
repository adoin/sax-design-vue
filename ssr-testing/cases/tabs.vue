<template>
  <vs-tabs v-model="active">
    <vs-tab label="A">A</vs-tab>
    <vs-tab label="B">B</vs-tab>
  </vs-tabs>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const active = ref('A')
</script>
