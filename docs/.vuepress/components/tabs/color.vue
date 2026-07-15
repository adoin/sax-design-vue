<template>
  <s-tabs v-model="active" color="success">
    <s-tab label="One">One</s-tab>
    <s-tab label="Two">Two</s-tab>
  </s-tabs>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const active = ref(0)
</script>
