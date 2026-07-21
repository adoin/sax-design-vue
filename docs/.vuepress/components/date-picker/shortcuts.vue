<template>
  <div class="center">
    <s-date-picker
      v-model="value"
      :shortcuts="shortcuts"
      placeholder="Pick a day"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref('')

const shortcuts = [
  {
    text: 'Today',
    value: new Date(),
  },
  {
    text: 'Yesterday',
    value: () => {
      const date = new Date()
      date.setDate(date.getDate() - 1)
      return date
    },
  },
  {
    text: 'A week ago',
    value: () => {
      const date = new Date()
      date.setDate(date.getDate() - 7)
      return date
    },
  },
]
</script>
