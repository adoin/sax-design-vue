<template>
  <vs-tabs v-model="active">
    <vs-tab label="Home">Home panel</vs-tab>
    <vs-tab label="Profile">Profile panel</vs-tab>
  </vs-tabs>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const active = ref(0)
</script>
