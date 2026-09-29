<script setup lang="ts">
import { ref } from 'vue'
const visible = ref(false)
const draft = ref('这份草稿在最小化和恢复之间保留。')
</script>

<template>
  <s-button @click="visible = true">打开全屏工作区</s-button>
  <s-dialog
    v-model="visible"
    full-screen
    lock-scroll
    title="草稿工作区"
    minimized-label="正在编辑草稿"
  >
    <s-textarea v-model="draft" label="草稿内容" :rows="6" />
    <template #footer>
      <s-button @click="visible = false">完成编辑</s-button>
    </template>
  </s-dialog>
</template>
