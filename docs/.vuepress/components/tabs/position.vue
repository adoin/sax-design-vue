<template>
  <s-tabs v-model="active" position="bottom">
    <s-tab label="Top content">Content</s-tab>
    <s-tab label="More">More</s-tab>
  </s-tabs>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const active = ref(0)
</script>
