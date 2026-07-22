<template>
  <div class="center">
    <s-date-picker v-model="value" :festival-method="festivalMethod" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref('')

const festivalMethod = ({ date }: { date: Date }) => {
  if (date.getDay() === 0 || date.getDay() === 6) {
    return { label: 'Rest', notice: true }
  }
}
</script>
