<template>
  <s-tabs v-model="active">
    <s-tab label="Home">Home panel</s-tab>
    <s-tab label="Profile">Profile panel</s-tab>
  </s-tabs>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const active = ref(0)
</script>
