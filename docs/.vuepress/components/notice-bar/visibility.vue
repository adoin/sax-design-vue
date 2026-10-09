<script setup lang="ts">
import { shallowRef } from 'vue'
const visible = shallowRef(true)
const closed = shallowRef(0)
</script>

<template>
  <div class="notice-demo">
    <s-button size="small" @click="visible = true">Show notice</s-button
    ><s-notice-bar
      v-model="visible"
      closable
      content="This notice can be closed and shown again."
      @close="closed++"
    /><span role="status">Close requests: {{ closed }}</span>
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
