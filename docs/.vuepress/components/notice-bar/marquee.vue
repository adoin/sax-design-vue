<script setup lang="ts">
import { shallowRef } from 'vue'
const paused = shallowRef(false)
</script>

<template>
  <div class="notice-demo">
    <s-switch v-model="paused" aria-label="Pause scrolling"
      >Pause scrolling</s-switch
    ><s-notice-bar
      :paused="paused"
      :speed="42"
      :delay="500"
      content="Please review the latest workspace announcement before proceeding. This notice contains additional details about available resources, upcoming changes, and where to find help. Hover over it or focus its content to pause the continuous scrolling and read at your own pace."
    /><s-notice-bar content="Short notices stay still." />
  </div>
</template>

<style scoped>
.notice-demo {
  display: grid;
  align-items: start;
  justify-items: start;
  gap: 16px;
  width: 100%;
}
.notice-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  width: 100%;
}
.notice-grid p {
  margin: 0 0 12px;
}
</style>
