<script setup lang="ts">
import { SFileManager } from 'sax-design-vue'
import type { FileManagerEntry } from 'sax-design-vue'
const files: FileManagerEntry[] = [
  { id: 1, parentId: null, name: '文件夹', kind: 'folder' },
]
</script>

<template>
  <div class="shape-examples">
    <div>
      <p>圆角</p>
      <SFileManager
        :model-value="files"
        :height="300"
        :show-tree="false"
        :context-menu="false"
        :behavior="{ dragDrop: false }"
        shape="rounded"
      />
    </div>
    <div>
      <p>方形</p>
      <SFileManager
        :model-value="files"
        :height="300"
        :show-tree="false"
        :context-menu="false"
        :behavior="{ dragDrop: false }"
        shape="square"
      />
    </div>
  </div>
</template>

<style scoped>
.shape-examples {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}
@media (max-width: 700px) {
  .shape-examples {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
