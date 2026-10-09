<script setup lang="ts">
import { shallowRef } from 'vue'
import type { NoticeBarItem } from 'sax-design-vue'
const paused = shallowRef(false)
const index = shallowRef(0)
const notices: NoticeBarItem[] = [
  {
    id: 'update',
    content: 'New release notes are ready to read.',
    type: 'primary',
  },
  {
    id: 'success',
    content: 'Shared resources have been updated.',
    type: 'success',
  },
  {
    id: 'maintenance',
    content: 'Please save your changes before maintenance.',
    type: 'warning',
  },
]
</script>

<template>
  <div class="notice-demo">
    <s-switch v-model="paused" aria-label="Pause autoplay"
      >Pause autoplay</s-switch
    ><s-notice-bar
      v-model:active-index="index"
      :items="notices"
      :paused="paused"
      :interval="3000"
      show-navigation
      show-indicator
    /><span role="status">Current notice: {{ index + 1 }}</span>
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
