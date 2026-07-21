<template>
  <div class="center">
    <s-date-picker
      v-model="value"
      type="datetime"
      placeholder="Pick date and time"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref('')
</script>
