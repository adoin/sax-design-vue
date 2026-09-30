<script setup lang="ts">
import { ref } from 'vue'
const first = ref('')
const second = ref('')
</script>

<template>
  <div class="placeholder-demo">
    <s-input
      v-model="first"
      block
      label="Search"
      placeholder="Search for something you like"
      allow-clear
    />
    <s-input
      v-model="second"
      block
      label="Notes"
      placeholder="Write down a new idea"
      allow-clear
    />
  </div>
</template>

<style scoped>
.placeholder-demo {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr));
  gap: 28px 24px;
  width: 100%;
  padding-top: 12px;
}
</style>
