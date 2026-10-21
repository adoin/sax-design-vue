<script setup lang="ts">
import { shallowRef } from 'vue'
import { SButton, SFileManager, SInput, STag } from 'sax-design-vue'
import type { FileManagerEntry } from 'sax-design-vue'
const files = shallowRef<FileManagerEntry[]>([
  { id: 1, parentId: null, name: '设计资料', kind: 'folder' },
  { id: 2, parentId: null, name: '笔记.md', kind: 'file' },
])
</script>
<template>
  <SFileManager v-model="files" :height="340" tree-show-files>
    <template #toolbar="tools">
      <SInput
        :model-value="tools.search"
        :placeholder="'搜索名称'"
        :aria-label="'搜索名称'"
        clearable
        @update:model-value="tools.setSearch(String($event ?? ''))"
      />
      <SButton size="small" @click="tools.toggleView">{{
        tools.view === 'grid' ? '切换列表' : '切换图标'
      }}</SButton>
      <STag>{{ tools.selection.length }} 项已选</STag>
    </template>
  </SFileManager>
</template>
