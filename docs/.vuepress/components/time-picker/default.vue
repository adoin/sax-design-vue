<template>
  <div class="center">
    <s-time-picker v-model="value" placeholder="Select time" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref('')
</script>
