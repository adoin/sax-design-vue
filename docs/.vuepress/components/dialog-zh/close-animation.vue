<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(false)
const closeAnimation = ref(true)
</script>

<template>
  <div class="dialog-close-animation-example">
    <div class="animation-control">
      <s-switch v-model="closeAnimation" aria-label="关闭动画" />
      <span>关闭动画</span>
    </div>
    <s-button @click="visible = true">打开对话框</s-button>
    <s-dialog
      v-model="visible"
      :close-animation="closeAnimation"
      :width="440"
      title="粒子消散关闭"
      minimizable
    >
      <p>
        关闭时只有弹窗本体消散，遮罩保持不变。最小化后，关闭气泡也使用相同效果。
      </p>
    </s-dialog>
  </div>
</template>

<style scoped>
.dialog-close-animation-example {
  display: grid;
  justify-items: start;
  gap: 16px;
}
.animation-control {
  display: flex;
  align-items: center;
  gap: 8px;
}
.dialog-close-animation-example p {
  margin: 0;
  line-height: 1.6;
}
</style>
