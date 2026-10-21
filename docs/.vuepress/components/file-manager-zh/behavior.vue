<script setup lang="ts">
import { shallowRef } from 'vue'
import { SConfigProvider, SFileManager, SSwitch } from 'sax-design-vue'
import type { FileManagerEntry } from 'sax-design-vue'
const files = shallowRef<FileManagerEntry[]>([
  { id: 'folder', parentId: null, kind: 'folder', name: '资料' },
  {
    id: 'document',
    parentId: null,
    kind: 'file',
    name: '笔记.txt',
    permissions: { delete: false },
  },
])
const dragDrop = shallowRef(true)
const wheelZoom = shallowRef(true)
const deleteKey = shallowRef(false)
</script>

<template>
  <div class="behavior-controls">
    <label><SSwitch v-model="dragDrop" /> 拖放移动</label
    ><label><SSwitch v-model="wheelZoom" /> Shift + 滚轮缩放</label
    ><label><SSwitch v-model="deleteKey" /> Delete 快捷键</label>
  </div>
  <SConfigProvider
    :file-manager="{ behavior: { dragDrop, wheelZoom, deleteKey } }"
    ><SFileManager
      v-model="files"
      :height="340"
      :behavior="{ openOn: 'double-click' }"
  /></SConfigProvider>
</template>

<style scoped>
.behavior-controls {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}
.behavior-controls label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
</style>
