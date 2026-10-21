<script setup lang="ts">
import { shallowRef, useTemplateRef } from 'vue'
import {
  SAgentEditor,
  SBreadcrumb,
  SButton,
  SFileManager,
  SInput,
  SSelect,
  SWindow,
} from 'sax-design-vue'
import type {
  FileManagerEntry,
  FileManagerInstance,
  WindowInstance,
} from 'sax-design-vue'

const text = shallowRef('')
const selectValue = shallowRef('a')
const files = shallowRef<FileManagerEntry[]>([
  { id: 'folder', parentId: null, kind: 'folder', name: 'Documents' },
])
const manager = useTemplateRef<FileManagerInstance>('manager')
const window = useTemplateRef<WindowInstance>('window')
const input = useTemplateRef<InstanceType<typeof SInput>>('input')
const inspect = () => {
  manager.value?.navigate(null)
  manager.value?.select(['folder'])
  manager.value?.rename(files.value[0])
  manager.value?.execute({ type: 'rename', ids: ['folder'], name: 'Updated' })
  manager.value?.scrollTo('folder')
  window.value?.focus()
  window.value?.rename()
  input.value?.focus()
  input.value?.clear()
}
</script>

<template>
  <SButton @click="inspect">Inspect</SButton>
  <SButton.ButtonGroup><SButton>Child</SButton></SButton.ButtonGroup>
  <SBreadcrumb
    ><SBreadcrumb.BreadcrumbItem to="/"
      >Home</SBreadcrumb.BreadcrumbItem
    ></SBreadcrumb
  >
  <SInput ref="input" v-model="text" />
  <SSelect v-model="selectValue"
    ><SSelect.Option value="a" label="A"
  /></SSelect>
  <SWindow ref="window" @update:rect="(rect) => rect.width.toFixed()"
    ><template #title="{ title }">{{ title.toUpperCase() }}</template></SWindow
  >
  <SAgentEditor v-model="text"
    ><template #toolbar="{ selection, activeFormats, format }"
      ><button @click="format('bold')">
        {{ selection.text }} {{ activeFormats.includes('bold') }}
      </button></template
    ></SAgentEditor
  >
  <SFileManager
    ref="manager"
    v-model="files"
    :before-operation="
      (operation, context, entries) =>
        !!operation.type && !!context.source && Array.isArray(entries)
    "
    @open="(entry) => entry.name.toUpperCase()"
    @operation="(operation, entries) => entries[0]?.name || operation.type"
  >
    <template #folder-preview="{ entry, view, selected, size }"
      >{{ entry.name }} {{ view }} {{ selected }} {{ size.toFixed() }}</template
    >
    <template #toolbar="{ directory, selection, pending }"
      >{{ directory?.name }} {{ selection.length }} {{ pending }}</template
    >
    <template #status="{ count, selected }"
      >{{ count.toFixed() }} {{ selected.toFixed() }}</template
    >
  </SFileManager>
</template>
