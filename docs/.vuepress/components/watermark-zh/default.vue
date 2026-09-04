<script setup lang="ts">
import { shallowRef } from 'vue'
const count = shallowRef(0)
</script>

<template>
  <s-watermark content="Sax Design Vue" :font-size="16" :gap="72">
    <div class="watermark-document">
      <h3>内部预览</h3>
      <p>水印覆盖不透明内容，同时保留按钮、输入和文字选择交互。</p>
      <s-button @click="count++">已点击 {{ count }} 次</s-button>
    </div>
  </s-watermark>
</template>

<style scoped>
.watermark-document {
  padding: 32px;
  background: hsl(var(--sax-background));
}
</style>
