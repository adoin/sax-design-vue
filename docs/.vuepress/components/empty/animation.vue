<script setup lang="ts">
import { shallowRef } from 'vue'
const animated = shallowRef(true)
</script>

<template>
  <div class="empty-demo">
    <s-switch v-model="animated" aria-label="Play illustration animation"
      >Play illustration animation</s-switch
    ><s-empty :animated="animated" description="Nothing here yet" />
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
