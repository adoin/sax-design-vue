<template><s-date-range-picker v-model="range" /></template>
<script lang="ts" setup>
import { ref } from 'vue'
const range = ref<[string, string]>(['2026-07-01', '2026-07-22'])
</script>
