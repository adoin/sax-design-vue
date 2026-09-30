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
      label="搜索"
      placeholder="搜索你想要的内容"
      allow-clear
    />
    <s-input
      v-model="second"
      block
      label="笔记"
      placeholder="记录一个新的想法"
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
