<script setup lang="ts">
import { shallowRef } from 'vue'
import { SButton, SFileManager, SInput, STag } from 'sax-design-vue'
import type { FileManagerEntry } from 'sax-design-vue'
const files = shallowRef<FileManagerEntry[]>([
  { id: 1, parentId: null, name: 'Design assets', kind: 'folder' },
  { id: 2, parentId: null, name: 'Notes.md', kind: 'file' },
])
</script>
<template>
  <SFileManager v-model="files" :height="340" tree-show-files>
    <template #toolbar="tools">
      <SInput
        :model-value="tools.search"
        :placeholder="'Search names'"
        :aria-label="'Search names'"
        clearable
        @update:model-value="tools.setSearch(String($event ?? ''))"
      />
      <SButton size="small" @click="tools.toggleView">{{
        tools.view === 'grid' ? 'Show list' : 'Show icons'
      }}</SButton>
      <STag>{{ tools.selection.length }} selected</STag>
    </template>
  </SFileManager>
</template>
