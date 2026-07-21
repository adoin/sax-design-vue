<template>
  <div class="center">
    <s-date-picker v-model="value" placeholder="Pick a day" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref('')
</script>
