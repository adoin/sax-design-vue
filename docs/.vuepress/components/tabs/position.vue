<template>
  <vs-tabs v-model="active" position="bottom">
    <vs-tab label="Top content">Content</vs-tab>
    <vs-tab label="More">More</vs-tab>
  </vs-tabs>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const active = ref(0)
</script>
