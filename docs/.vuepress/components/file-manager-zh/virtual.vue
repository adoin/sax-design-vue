<script setup lang="ts">
import { shallowRef, useTemplateRef } from 'vue'
import { SButton, SFileManager, SSwitch, STag } from 'sax-design-vue'
import type { FileManagerEntry, FileManagerInstance } from 'sax-design-vue'
const manager = useTemplateRef<FileManagerInstance>('manager')
const showTree = shallowRef(false)
const files = shallowRef<FileManagerEntry[]>([])
const load = (count: number) => {
  files.value = Array.from({ length: count }, (_, index) => ({
    id: `file-${index}`,
    parentId: null,
    kind: 'file',
    name: `文件 ${String(index + 1).padStart(6, '0')}.${['md', 'png', 'json', 'txt'][index % 4]}`,
    size: 256 * (index + 1),
  }))
}
const jump = (position: 'start' | 'middle' | 'end') => {
  const index =
    position === 'start'
      ? 0
      : position === 'end'
        ? files.value.length - 1
        : Math.floor(files.value.length / 2)
  const entry = files.value[index]
  if (entry) manager.value?.scrollTo(entry.id)
}
load(10000)
</script>

<template>
  <div class="virtual-controls">
    <SButton size="small" @click="load(10000)">载入 1 万个文件</SButton>
    <SButton size="small" @click="load(100000)">载入 10 万个文件</SButton>
    <SButton size="small" type="transparent" @click="jump('start')"
      >开头</SButton
    >
    <SButton size="small" type="transparent" @click="jump('middle')"
      >中间</SButton
    >
    <SButton size="small" type="transparent" @click="jump('end')">末尾</SButton>
    <label><SSwitch v-model="showTree" />显示文件树</label>
    <STag>{{ files.length.toLocaleString() }} 个文件</STag>
  </div>
  <SFileManager
    ref="manager"
    v-model="files"
    :height="520"
    :show-tree="showTree"
    tree-show-files
  />
</template>

<style scoped>
.virtual-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  margin-bottom: 16px;
}
.virtual-controls label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
</style>
