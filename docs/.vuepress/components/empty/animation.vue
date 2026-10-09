<script setup lang="ts">
import { shallowRef } from 'vue'
const animated = shallowRef(true)
const sequence = shallowRef(0)
</script>

<template>
  <div class="empty-demo">
    <div class="empty-controls">
      <s-switch v-model="animated" aria-label="Enable opening animation"
        >Enable opening animation</s-switch
      >
      <s-button
        size="small"
        type="flat"
        :disabled="!animated"
        @click="sequence++"
        >Replay animation</s-button
      >
    </div>
    <s-empty
      :key="sequence"
      :animated="animated"
      description="Nothing here yet"
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
