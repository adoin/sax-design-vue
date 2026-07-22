<template><s-segmented v-model="value" :options="options" /></template>
<script lang="ts" setup>
import { ref } from 'vue'
const value = ref('week')
const options = [
  { label: 'Day', value: 'day' },
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
]
</script>
