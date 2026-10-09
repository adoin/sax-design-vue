<script setup lang="ts">
import { shallowRef } from 'vue'
const size = shallowRef(160)
</script>

<template>
  <div class="empty-demo">
    <s-slider
      v-model="size"
      :min="96"
      :max="240"
      :step="8"
      aria-label="插画尺寸"
    /><span role="status">{{ size }}px</span
    ><s-empty :image-size="size" description="没有匹配的内容" />
  </div>
</template>

<style scoped>
.empty-demo {
  display: grid;
  justify-items: center;
  gap: 16px;
  width: min(100%, 360px);
}
</style>
