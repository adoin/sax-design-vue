<script setup lang="ts">
import { shallowRef } from 'vue'
const animated = shallowRef(true)
</script>

<template>
  <div class="empty-demo">
    <s-switch v-model="animated" aria-label="播放插画动画"
      >播放插画动画</s-switch
    ><s-empty :animated="animated" description="这里还没有内容" />
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
