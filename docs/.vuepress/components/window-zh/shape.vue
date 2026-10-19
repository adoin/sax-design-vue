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
      title="圆角窗口"
      shape="rounded"
      :min-width="220"
      :min-height="140"
      ><p>独立设置窗口外形。</p></SWindow
    >
    <SWindow
      v-model:rect="rectangles[1]"
      title="方形窗口"
      shape="square"
      :min-width="220"
      :min-height="140"
      ><p>内容与键盘操作保持一致。</p></SWindow
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
