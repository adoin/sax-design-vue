<template>
  <vs-tabs v-model="active" color="primary">
    <vs-tab label="One">Tab one</vs-tab>
    <vs-tab label="Two">Tab two</vs-tab>
  </vs-tabs>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const active = ref('One')
</script>
