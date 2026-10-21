<script setup lang="ts">
import { onBeforeUnmount, useTemplateRef } from 'vue'
import { useShape } from '@vuesax-alpha/hooks'
import {
  SBreadcrumb,
  SBreadcrumbItem,
} from '@vuesax-alpha/components/breadcrumb'
import { SButton } from '@vuesax-alpha/components/button'
import { SContextMenu } from '@vuesax-alpha/components/context-menu'
import { SConfigProvider } from '@vuesax-alpha/components/config-provider'
import FileTree from './file-tree.vue'
import FileContent from './file-content.vue'
import FileToolbar from './file-toolbar.vue'
import FileGlyph from './file-glyph.vue'
import { useFileManager } from './use-file-manager'
import { fileManagerProps } from './file-manager'
import type { ContextMenuInstance } from '../../context-menu'
import type {
  FileManagerAction,
  FileManagerContext,
  FileManagerEntry,
  FileManagerExposes,
  FileManagerId,
  FileManagerMenuItem,
  FileManagerOperation,
  FileManagerPreviewContext,
  FileManagerSort,
  FileManagerToolbarContext,
  FileManagerView,
} from './types'

defineOptions({ name: 'SFileManager' })
const props = defineProps(fileManagerProps)
const emit = defineEmits<{
  'update:modelValue': [entries: FileManagerEntry[]]
  'update:directoryId': [id: FileManagerId | null]
  'update:selectedIds': [ids: FileManagerId[]]
  'update:view': [view: FileManagerView]
  'update:tileSize': [size: number]
  'update:showHidden': [value: boolean]
  'update:sort': [sort: FileManagerSort]
  'selection-change': [entries: FileManagerEntry[]]
  navigate: [id: FileManagerId | null]
  open: [entry: FileManagerEntry]
  operation: [operation: FileManagerOperation, entries: FileManagerEntry[]]
  'operation-error': [error: unknown, operation: FileManagerOperation]
  'menu-select': [item: FileManagerMenuItem, context: FileManagerContext]
  refresh: [id: FileManagerId | null]
}>()
defineSlots<{
  'folder-preview'?: (context: FileManagerPreviewContext) => any
  toolbar?: (context: FileManagerToolbarContext) => any
  status?: (context: { count: number; selected: number }) => any
}>()
const state = useFileManager(
  props,
  emit as (event: string, ...args: any[]) => void,
)
const {
  label,
  directoryId,
  directory,
  selection,
  selectedIds,
  view,
  tileSize,
  behavior,
  visible,
  path,
  toolbar,
  showHidden,
  setShowHidden,
  icons,
  expanded,
  history,
  historyIndex,
  editingId,
  pending,
  error,
  clipboard,
  draggedIds,
  dropTarget,
  menuContext,
  menuItems,
  setSelection,
  setTileSize,
  navigate,
  goHistory,
  actions,
  context,
  canDrop,
  drop,
} = state
const shape = useShape()
const menu = useTemplateRef<ContextMenuInstance>('menu')
const content = useTemplateRef<InstanceType<typeof FileContent>>('content')
const root = useTemplateRef<HTMLElement>('root')
let hoverTimer: ReturnType<typeof setTimeout> | undefined
const clearHover = () => {
  clearTimeout(hoverTimer)
  hoverTimer = undefined
}
const onContext = (
  event: MouseEvent | KeyboardEvent,
  entry?: FileManagerEntry,
  source: FileManagerContext['source'] = 'content',
) => {
  if (props.contextMenu === false || pending.value) return
  if (entry?.disabled) return
  const chosen = entry
    ? source === 'content' && state.selectedSet.value.has(entry.id)
      ? selection.value
      : [entry]
    : []
  if (entry && (source !== 'content' || !state.selectedSet.value.has(entry.id)))
    setSelection([entry.id])
  if (!entry) setSelection([])
  menuContext.value = {
    entry,
    selection: chosen,
    directory: directory.value,
    source,
  }
  if (menuItems.value.length)
    menu.value?.show(
      event,
      event.target instanceof Element
        ? (event.target.closest<HTMLElement>('[role="option"]') ??
            root.value ??
            undefined)
        : (root.value ?? undefined),
    )
}
const menuSelect = (item: FileManagerMenuItem) => {
  emit('menu-select', item, menuContext.value)
  if (item.sort) state.setSort(item.sort)
  if (item.action) actions(item.action, menuContext.value)
}
const dragStart = (event: DragEvent, entry: FileManagerEntry) => {
  if (
    !behavior.value.dragDrop ||
    entry.disabled ||
    entry.permissions?.move === false ||
    pending.value
  ) {
    event.preventDefault()
    return
  }
  if (!state.selectedSet.value.has(entry.id)) setSelection([entry.id])
  draggedIds.value = state.selectedSet.value.has(entry.id)
    ? [...selectedIds.value]
    : [entry.id]
  event.dataTransfer?.setData('application/x-sax-files', 'internal')
  event.dataTransfer?.setData('text/plain', entry.name)
  if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move'
}
const dragOver = (event: DragEvent, id: FileManagerId | null) => {
  if (!canDrop(id)) {
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'none'
    dropTarget.value = undefined
    clearHover()
    return
  }
  event.preventDefault()
  if (event.dataTransfer) event.dataTransfer.dropEffect = 'move'
  if (dropTarget.value === id) return
  clearHover()
  dropTarget.value = id
  if (id !== null)
    hoverTimer = setTimeout(() => {
      expanded.value = new Set([...expanded.value, id])
    }, 600)
}
const onDragEnd = () => {
  draggedIds.value = []
  dropTarget.value = undefined
  clearHover()
}
const onDragLeave = (event: DragEvent) => {
  if (
    !event.relatedTarget ||
    !root.value?.contains(event.relatedTarget as Node)
  ) {
    dropTarget.value = undefined
    clearHover()
  }
}
const onDrop = (event: DragEvent, id: FileManagerId | null) => {
  event.preventDefault()
  clearHover()
  drop(id)
}
const onKey = (event: KeyboardEvent) => {
  if (
    !behavior.value.keyboard ||
    event.defaultPrevented ||
    event.isComposing ||
    (event.target instanceof Element &&
      event.target.closest('input,textarea,[contenteditable="true"],button'))
  )
    return
  const modifier = event.ctrlKey || event.metaKey
  let action: FileManagerAction | undefined
  if (modifier && event.key.toLowerCase() === 'a') action = 'select-all'
  if (modifier && behavior.value.clipboard)
    action =
      ({ x: 'cut', c: 'copy', v: 'paste' } as const)[
        event.key.toLowerCase() as 'x' | 'c' | 'v'
      ] ?? action
  if (event.key === 'Delete' && behavior.value.deleteKey) action = 'delete'
  if (event.key === 'F2' && behavior.value.renameKey) action = 'rename'
  if (modifier && event.shiftKey && event.key.toLowerCase() === 'n')
    action = 'new-folder'
  if (event.key === 'F5') action = 'refresh'
  if (action) {
    event.preventDefault()
    actions(action, context(undefined, 'keyboard'))
  }
  if (event.altKey && event.key === 'ArrowUp') {
    event.preventDefault()
    navigate(directory.value?.parentId ?? null)
  }
  if (event.altKey && event.key === 'ArrowLeft') {
    event.preventDefault()
    goHistory(-1)
  }
  if (event.altKey && event.key === 'ArrowRight') {
    event.preventDefault()
    goHistory(1)
  }
  if (event.key === 'Escape') {
    editingId.value = undefined
    clipboard.value = undefined
    draggedIds.value = []
    dropTarget.value = undefined
    setSelection([])
  }
}
const onWheel = (event: WheelEvent) => {
  if (
    !behavior.value.wheelZoom ||
    !event.shiftKey ||
    event.ctrlKey ||
    event.metaKey ||
    view.value !== 'grid' ||
    !(event.deltaY || event.deltaX)
  )
    return
  event.preventDefault()
  event.stopPropagation()
  setTileSize(tileSize.value + ((event.deltaY || event.deltaX) < 0 ? 12 : -12))
}
onBeforeUnmount(clearHover)
defineExpose<FileManagerExposes>({
  navigate,
  execute: state.operate,
  select: setSelection,
  rename: state.rename,
  scrollTo: (id: FileManagerId) => content.value?.reveal(id),
})
</script>

<template>
  <section
    ref="root"
    class="s-file-manager"
    :class="{
      'is-square': shape === 'square',
      'is-pending': pending,
      'has-tree': showTree,
    }"
    :style="{
      height: typeof height === 'number' ? `${height}px` : height,
      '--s-file-manager-tree-width': `${Math.max(140, treeWidth)}px`,
    }"
    :aria-label="label('label')"
    :aria-busy="pending"
    @keydown="onKey"
    @wheel.capture="onWheel"
    @dragleave="onDragLeave"
    @dragend="onDragEnd"
  >
    <SConfigProvider :shape="shape">
      <header class="s-file-manager__navigation">
        <div class="s-file-manager__history">
          <SButton
            :debounce="false"
            icon
            type="transparent"
            :aria-label="label('back')"
            :title="label('back')"
            :disabled="historyIndex <= 0"
            @click="goHistory(-1)"
            ><FileGlyph kind="back" :graphic="icons.back"
          /></SButton>
          <SButton
            :debounce="false"
            icon
            type="transparent"
            :aria-label="label('forward')"
            :title="label('forward')"
            :disabled="historyIndex >= history.length - 1"
            @click="goHistory(1)"
            ><FileGlyph kind="forward" :graphic="icons.forward"
          /></SButton>
          <SButton
            :debounce="false"
            icon
            type="transparent"
            :aria-label="label('up')"
            :title="label('up')"
            :disabled="directoryId === null"
            @click="navigate(directory?.parentId ?? null)"
            ><FileGlyph kind="up" :graphic="icons.up"
          /></SButton>
          <SButton
            :debounce="false"
            icon
            type="transparent"
            :aria-label="label(showHidden ? 'hideHidden' : 'showHidden')"
            :title="label(showHidden ? 'hideHidden' : 'showHidden')"
            :aria-pressed="showHidden"
            @click="setShowHidden(!showHidden)"
            ><FileGlyph
              :kind="showHidden ? 'eye' : 'eye-off'"
              :graphic="showHidden ? icons.eye : icons.eyeOff"
          /></SButton>
        </div>
        <SBreadcrumb class="s-file-manager__path" separator="›">
          <SBreadcrumbItem
            :active="directoryId === null"
            @click.prevent="navigate(null)"
            @dragover.stop="dragOver($event, null)"
            @drop.stop="onDrop($event, null)"
            ><span
              :class="{ 'is-drop-target': dropTarget === null }"
              role="img"
              :aria-label="rootLabel || label('root')"
              :title="rootLabel || label('root')"
              ><FileGlyph kind="home" :graphic="icons.home" /></span
          ></SBreadcrumbItem>
          <SBreadcrumbItem
            v-for="(entry, i) in path"
            :key="entry.id"
            :active="i === path.length - 1"
            @click.prevent="navigate(entry.id)"
            @dragover.stop="dragOver($event, entry.id)"
            @drop.stop="onDrop($event, entry.id)"
            @contextmenu.stop="onContext($event, entry, 'breadcrumb')"
            ><span :class="{ 'is-drop-target': dropTarget === entry.id }">{{
              entry.name
            }}</span></SBreadcrumbItem
          >
        </SBreadcrumb>
      </header>
      <div class="s-file-manager__workspace">
        <FileTree
          v-if="showTree"
          :state="state"
          :root-label="rootLabel || label('root')"
          @context="onContext"
          @drag-start="dragStart"
          @drag-over="dragOver"
          @drop="onDrop"
        />
        <div class="s-file-manager__main">
          <div class="s-file-manager__toolbar">
            <slot name="toolbar" v-bind="toolbar"
              ><FileToolbar :state="state"
            /></slot>
          </div>
          <FileContent
            ref="content"
            :state="state"
            :renderers="previewRenderers"
            @context="onContext"
            @drag-start="dragStart"
            @drag-over="dragOver"
            @drop="onDrop"
            ><template v-if="$slots['folder-preview']" #folder-preview="scope"
              ><slot name="folder-preview" v-bind="scope" /></template
          ></FileContent>
          <footer class="s-file-manager__status" aria-live="polite">
            <slot
              name="status"
              :count="visible.length"
              :selected="selection.length"
              >{{
                label('status', {
                  count: visible.length,
                  selected: selection.length,
                })
              }}</slot
            ><span v-if="pending">{{ label('working') }}</span
            ><span v-if="error" role="alert">{{ error }}</span>
          </footer>
        </div>
      </div>
      <SContextMenu ref="menu" :items="menuItems" @select="menuSelect" />
    </SConfigProvider>
  </section>
</template>
