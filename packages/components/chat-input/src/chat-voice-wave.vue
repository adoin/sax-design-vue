<script setup lang="ts">
defineProps<{ active: boolean; levels: number[] }>()
const idle = [7, 13, 20, 13, 7]
</script>
<template>
  <span class="s-chat-input__wave" aria-hidden="true">
    <span
      v-for="(height, index) in idle"
      :key="index"
      :style="{
        height: `${active ? 3 + (levels[index] || 0) * 17 : height}px`,
      }"
    />
  </span>
</template>
