<script setup lang="ts">
import { computed, nextTick, useTemplateRef } from 'vue'
import { SVirtualList } from '@vuesax-alpha/components/virtual-list'
import FileGlyph from './file-glyph.vue'
import { isFileHidden } from './file-model'
import type { FileManagerEntry, FileManagerId } from './types'
import type { VirtualListInstance } from '../../virtual-list'
import type { FileManagerState } from './use-file-manager'
const props = defineProps<{ state: FileManagerState; rootLabel: string }>()
const emit = defineEmits<{
  context: [
    event: MouseEvent | KeyboardEvent,
    entry?: FileManagerEntry,
    source?: 'tree',
  ]
  'drag-start': [event: DragEvent, entry: FileManagerEntry]
  'drag-over': [event: DragEvent, id: FileManagerId | null]
  drop: [event: DragEvent, id: FileManagerId | null]
}>()
const {
  directoryId,
  index,
  expanded,
  navigate,
  behavior,
  dropTarget,
  label,
  icons,
  treeShowFiles,
  graphicFor,
} = props.state
const list = useTemplateRef<VirtualListInstance>('list')
const tree = useTemplateRef<HTMLElement>('tree')
const rows = computed(() => {
  const result: {
    entry: FileManagerEntry
    depth: number
    hasChildren: boolean
  }[] = []
  const stack = (index.value.children.get(null) ?? [])
    .filter((entry) => entry.kind === 'folder' || treeShowFiles.value)
    .map((entry) => ({ entry, depth: 1 }))
    .reverse()
  const visited = new Set<FileManagerId>()
  while (stack.length) {
    const row = stack.pop()!
    if (
      visited.has(row.entry.id) ||
      (!behavior.value.showHidden && isFileHidden(row.entry))
    )
      continue
    visited.add(row.entry.id)
    const children =
      row.entry.kind === 'folder'
        ? (index.value.children.get(row.entry.id) ?? []).filter(
            (entry) =>
              (entry.kind === 'folder' || treeShowFiles.value) &&
              (behavior.value.showHidden || !isFileHidden(entry)),
          )
        : []
    result.push({ ...row, hasChildren: children.length > 0 })
    if (expanded.value.has(row.entry.id))
      for (let i = children.length - 1; i >= 0; i--)
        stack.push({ entry: children[i], depth: row.depth + 1 })
  }
  return result
})
const toggle = (id: FileManagerId) => {
  const next = new Set(expanded.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  expanded.value = next
}
const focusRow = async (position: number) => {
  const i = Math.max(0, Math.min(rows.value.length - 1, position))
  list.value?.scrollToIndex(i)
  await nextTick()
  tree.value?.querySelector<HTMLElement>(`[data-tree-index="${i}"]`)?.focus()
}
const clickEntry = (entry: FileManagerEntry, event: MouseEvent) => {
  if (entry.kind === 'folder') navigate(entry.id)
  else {
    props.state.select(entry, event)
    if (
      behavior.value.openOn === 'click' &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.shiftKey
    )
      props.state.open(entry)
  }
}
const targetId = (entry: FileManagerEntry) =>
  entry.kind === 'folder' ? entry.id : entry.parentId
const onKey = (event: KeyboardEvent, entry: FileManagerEntry) => {
  if (!behavior.value.keyboard || event.isComposing || event.altKey) return
  const position = rows.value.findIndex((row) => row.entry.id === entry.id)
  if (event.key === 'ArrowRight' && entry.kind === 'folder') {
    event.preventDefault()
    if (expanded.value.has(entry.id) && rows.value[position]?.hasChildren)
      focusRow(position + 1)
    else expanded.value = new Set([...expanded.value, entry.id])
  }
  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    if (expanded.value.has(entry.id)) {
      const next = new Set(expanded.value)
      next.delete(entry.id)
      expanded.value = next
    } else
      focusRow(rows.value.findIndex((row) => row.entry.id === entry.parentId))
  }
  if (event.key === 'ContextMenu' || (event.key === 'F10' && event.shiftKey))
    emit('context', event, entry, 'tree')
  if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
    event.preventDefault()
    focusRow(
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? rows.value.length - 1
          : position + (event.key === 'ArrowDown' ? 1 : -1),
    )
  }
  if (entry.kind === 'file' && event.key === 'Enter') {
    event.preventDefault()
    props.state.open(entry)
  }
  const ctx = { ...props.state.context(entry, 'tree'), selection: [entry] }
  if (event.key === 'F2' && behavior.value.renameKey) {
    event.preventDefault()
    navigate(entry.parentId)
    nextTick(() => props.state.rename(entry))
  }
  if (event.key === 'Delete' && behavior.value.deleteKey) {
    event.preventDefault()
    props.state.actions('delete', ctx)
  }
  if (event.ctrlKey || event.metaKey) {
    const action = ({ x: 'cut', c: 'copy', v: 'paste' } as const)[
      event.key.toLowerCase() as 'x' | 'c' | 'v'
    ]
    if (action && behavior.value.clipboard) {
      event.preventDefault()
      props.state.actions(action, ctx)
    }
  }
}
</script>

<template>
  <aside ref="tree" class="s-file-manager__tree" :aria-label="label('folders')">
    <button
      type="button"
      class="s-file-manager__tree-root"
      :class="{
        'is-current': directoryId === null,
        'is-drop-target': dropTarget === null,
      }"
      :aria-label="rootLabel"
      :title="rootLabel"
      @click="navigate(null)"
      @dragover.stop="emit('drag-over', $event, null)"
      @drop.stop="emit('drop', $event, null)"
    >
      <FileGlyph kind="home" :graphic="icons.home" />
    </button>
    <SVirtualList
      ref="list"
      :items="rows"
      :item-key="(row: any) => row.entry.id"
      :estimate-size="36"
      :dynamic="false"
      height="100%"
    >
      <template #default="{ index: rowIndex }">
        <template v-for="row in [rows[rowIndex]]" :key="row.entry.id">
          <div
            class="s-file-manager__tree-row"
            :class="{
              'is-current': directoryId === row.entry.id,
              'is-drop-target': dropTarget === row.entry.id,
              'is-hidden': isFileHidden(row.entry),
              'is-selected':
                row.entry.kind === 'file' &&
                state.selectedSet.value.has(row.entry.id),
            }"
            :style="{ paddingInlineStart: `${(row.depth - 1) * 16 + 8}px` }"
            @dragover.stop="emit('drag-over', $event, targetId(row.entry))"
            @drop.stop="emit('drop', $event, targetId(row.entry))"
            @contextmenu.stop="emit('context', $event, row.entry, 'tree')"
          >
            <button
              type="button"
              class="s-file-manager__expand"
              :aria-label="
                label(expanded.has(row.entry.id) ? 'collapse' : 'expand')
              "
              :disabled="!row.hasChildren"
              :aria-expanded="
                row.hasChildren ? expanded.has(row.entry.id) : undefined
              "
              @click="toggle(row.entry.id)"
            >
              {{
                row.hasChildren ? (expanded.has(row.entry.id) ? '⌄' : '›') : ''
              }}
            </button>
            <button
              data-tree-row
              :data-tree-index="rowIndex"
              type="button"
              class="s-file-manager__tree-name"
              :disabled="row.entry.disabled"
              :aria-current="
                directoryId === row.entry.id ? 'location' : undefined
              "
              :draggable="behavior.dragDrop && !row.entry.disabled"
              @dragstart="emit('drag-start', $event, row.entry)"
              @click="clickEntry(row.entry, $event)"
              @dblclick="
                row.entry.kind === 'file' &&
                behavior.openOn === 'double-click' &&
                state.open(row.entry)
              "
              @keydown="onKey($event, row.entry)"
            >
              <FileGlyph
                :kind="
                  row.entry.kind === 'folder'
                    ? expanded.has(row.entry.id) || directoryId === row.entry.id
                      ? 'folder-open'
                      : 'folder'
                    : 'file'
                "
                :graphic="
                  graphicFor(
                    row.entry,
                    expanded.has(row.entry.id) || directoryId === row.entry.id,
                  )
                "
              />
              <span>{{ row.entry.name }}</span>
            </button>
          </div>
        </template>
      </template>
    </SVirtualList>
  </aside>
</template>
