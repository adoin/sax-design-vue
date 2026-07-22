<template>
  <s-calendar v-model="range" range show-week-number />
  <p class="value">Range: {{ range.join(' → ') || 'select dates' }}</p>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const range = ref<string[]>(['2026-07-14', '2026-07-22'])
</script>

<style scoped>
.value {
  margin: 10px 2px 0;
  color: var(--s-text-color-secondary);
  font-size: 12px;
}
</style>
