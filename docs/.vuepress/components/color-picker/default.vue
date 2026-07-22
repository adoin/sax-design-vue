<template>
  <s-color-picker v-model="color" show-alpha :predefine="presets" />
  <p class="value">Selected: {{ color }}</p>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const color = ref('rgba(86, 103, 244, 0.88)')
const presets = ['#5667f4', '#2aa7a1', '#e77a66', '#f0a657', '#272b48']
</script>

<style scoped>
.value {
  margin: 10px 2px 0;
  color: var(--s-text-color-secondary);
  font-size: 12px;
}
</style>
