<script setup lang="ts">
import { reactive } from 'vue'
import { SWindow } from 'sax-design-vue'
const rectangles = reactive([
  { x: 8, y: 8, width: 260, height: 180 },
  { x: 286, y: 8, width: 260, height: 180 },
])
</script>

<template>
  <div class="window-workspace">
    <SWindow
      v-model:rect="rectangles[0]"
      title="Rounded window"
      shape="rounded"
      :min-width="220"
      :min-height="140"
      ><p>Choose the window geometry independently.</p></SWindow
    >
    <SWindow
      v-model:rect="rectangles[1]"
      title="Square window"
      shape="square"
      :min-width="220"
      :min-height="140"
      ><p>Content and keyboard controls behave alike.</p></SWindow
    >
  </div>
</template>

<style scoped>
.window-workspace {
  position: relative;
  height: 240px;
  isolation: isolate;
}
p {
  padding: 12px;
}
</style>
