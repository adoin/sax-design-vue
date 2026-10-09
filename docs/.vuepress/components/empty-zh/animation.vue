<script setup lang="ts">
import { shallowRef } from 'vue'
const animated = shallowRef(true)
const sequence = shallowRef(0)
</script>

<template>
  <div class="empty-demo">
    <div class="empty-controls">
      <s-switch v-model="animated" aria-label="启用开盒动画"
        >启用开盒动画</s-switch
      >
      <s-button
        size="small"
        type="flat"
        :disabled="!animated"
        @click="sequence++"
        >重播动画</s-button
      >
    </div>
    <s-empty
      :key="sequence"
      :animated="animated"
      description="这里还没有内容"
    />
  </div>
</template>

<style scoped>
.empty-demo {
  display: grid;
  justify-items: center;
  gap: 16px;
  width: min(100%, 360px);
}
.empty-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 16px;
}
</style>
