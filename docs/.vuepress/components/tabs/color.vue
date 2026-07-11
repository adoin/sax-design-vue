<template>
  <vs-tabs v-model="active" color="success">
    <vs-tab label="One">One</vs-tab>
    <vs-tab label="Two">Two</vs-tab>
  </vs-tabs>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const active = ref(0)
</script>
