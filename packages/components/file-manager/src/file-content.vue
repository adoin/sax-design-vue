<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  shallowRef,
  useTemplateRef,
  watch,
} from 'vue'
import { SVirtualList } from '@vuesax-alpha/components/virtual-list'
import { SInput } from '@vuesax-alpha/components/input'
import FilePreview from './file-preview.vue'
import { gridColumns } from './file-model'
import type { VirtualListInstance } from '../../virtual-list'
import type {
  FileManagerEntry,
  FileManagerId,
  FileManagerPreviewContext,
  FileManagerPreviewRenderer,
} from './types'
import type { FileManagerState } from './use-file-manager'
const props = defineProps<{
  state: FileManagerState
  renderers: FileManagerPreviewRenderer[]
}>()
defineSlots<{
  'folder-preview'?: (context: FileManagerPreviewContext) => any
}>()
const emit = defineEmits<{
  context: [event: MouseEvent | KeyboardEvent, entry?: FileManagerEntry]
  'drag-start': [event: DragEvent, entry: FileManagerEntry]
  'drag-over': [event: DragEvent, id: FileManagerId | null]
  drop: [event: DragEvent, id: FileManagerId | null]
}>()
const {
  visible,
  directoryId,
  selectedSet,
  focusedId,
  editingId,
  draft,
  tileSize,
  behavior,
  view,
  pending,
  clipboard,
  label,
  select,
  open,
  commitRename,
  setSelection,
} = props.state
const root = useTemplateRef<HTMLElement>('root')
const list = useTemplateRef<VirtualListInstance>('list')
const width = shallowRef(640)
const columns = computed(() =>
  view.value === 'list' ? 1 : gridColumns(width.value, tileSize.value),
)
const rowSize = computed(() =>
  view.value === 'list' ? 48 : Math.round(tileSize.value * 0.72) + 64,
)
const rowCount = computed(() => Math.ceil(visible.value.length / columns.value))
const rowAt = (row: number) =>
  visible.value.slice(row * columns.value, (row + 1) * columns.value)
let observer: ResizeObserver | undefined
let disposed = false
onMounted(() => {
  if (!root.value) return
  width.value = root.value.clientWidth || 640
  if (typeof ResizeObserver !== 'undefined') {
    observer = new ResizeObserver(([entry]) => {
      width.value = entry.contentRect.width
    })
    observer.observe(root.value)
  }
})
watch(
  [columns, rowSize],
  async (_, old) => {
    const oldColumns = old[0] || columns.value
    const firstRow = list.value?.getVisibleRange()?.start ?? 0
    const anchor = visible.value[firstRow * oldColumns]?.id
    await nextTick()
    if (disposed) return
    list.value?.measure()
    const itemIndex = visible.value.findIndex((entry) => entry.id === anchor)
    if (itemIndex >= 0)
      list.value?.scrollToIndex(Math.floor(itemIndex / columns.value), 'start')
  },
  { flush: 'pre' },
)
watch(directoryId, () => nextTick(() => list.value?.scrollToOffset(0)))
const reveal = async (id: FileManagerId) => {
  const index = visible.value.findIndex((entry) => entry.id === id)
  if (index < 0) return
  list.value?.scrollToIndex(Math.floor(index / columns.value))
  await nextTick()
  root.value?.focus({ preventScroll: true })
}
watch(editingId, async (id) => {
  if (id === undefined) return
  await reveal(id)
  await nextTick()
  const input = root.value?.querySelector<HTMLInputElement>('input')
  input?.focus()
  input?.select()
})
const cancelRename = () => {
  editingId.value = undefined
  root.value?.focus()
}
const click = (entry: FileManagerEntry, event: MouseEvent) => {
  select(entry, event)
  root.value?.focus({ preventScroll: true })
  if (
    behavior.value.openOn === 'click' &&
    !event.shiftKey &&
    !event.ctrlKey &&
    !event.metaKey
  )
    open(entry)
}
let typeahead = ''
let typedAt = 0
const onKey = (event: KeyboardEvent) => {
  if (
    !behavior.value.keyboard ||
    event.altKey ||
    event.defaultPrevented ||
    event.isComposing ||
    (event.target instanceof Element &&
      event.target.closest('input,textarea,[contenteditable="true"],button'))
  )
    return
  const position = Math.max(
    0,
    visible.value.findIndex((entry) => entry.id === focusedId.value),
  )
  const delta: Record<string, number> = {
    ArrowRight: 1,
    ArrowLeft: -1,
    ArrowDown: columns.value,
    ArrowUp: -columns.value,
    Home: -visible.value.length,
    End: visible.value.length,
    PageDown: columns.value * 4,
    PageUp: -columns.value * 4,
  }
  if (event.key in delta && visible.value.length) {
    event.preventDefault()
    let i =
      focusedId.value === undefined && event.key !== 'End'
        ? 0
        : Math.max(
            0,
            Math.min(visible.value.length - 1, position + delta[event.key]),
          )
    const step = delta[event.key] < 0 ? -1 : 1
    while (i >= 0 && i < visible.value.length && visible.value[i].disabled)
      i += step
    const entry = visible.value[i]
    if (!entry) return
    if ((event.ctrlKey || event.metaKey) && !event.shiftKey)
      focusedId.value = entry.id
    else select(entry, event)
    reveal(entry.id)
    return
  }
  if (event.key === ' ' && focusedId.value !== undefined) {
    const entry = visible.value.find((entry) => entry.id === focusedId.value)
    if (entry) {
      event.preventDefault()
      select(entry, {
        shiftKey: event.shiftKey,
        ctrlKey: behavior.value.multiple && behavior.value.toggleSelect,
        metaKey: false,
      })
    }
    return
  }
  if (
    behavior.value.typeahead &&
    event.key.length === 1 &&
    !event.ctrlKey &&
    !event.metaKey
  ) {
    const now = Date.now()
    typeahead = now - typedAt > 700 ? event.key : typeahead + event.key
    typedAt = now
    const normalized = typeahead.toLocaleLowerCase()
    const next = visible.value.find(
      (entry) =>
        !entry.disabled &&
        entry.name.toLocaleLowerCase().startsWith(normalized),
    )
    if (next) {
      event.preventDefault()
      select(next, { shiftKey: false, ctrlKey: false, metaKey: false })
      reveal(next.id)
    }
  }
  if (event.key === 'ContextMenu' || (event.key === 'F10' && event.shiftKey)) {
    emit(
      'context',
      event,
      visible.value.find((entry) => entry.id === focusedId.value),
    )
    return
  }
  if (event.key === 'Enter' && focusedId.value !== undefined) {
    const entry = visible.value.find((entry) => entry.id === focusedId.value)
    if (entry) {
      event.preventDefault()
      open(entry)
    }
  }
}
const formatSize = (size?: number) =>
  size === undefined
    ? '—'
    : size < 1024
      ? `${size} B`
      : size < 1024 ** 2
        ? `${(size / 1024).toFixed(1)} KB`
        : `${(size / 1024 ** 2).toFixed(1)} MB`
const formatDate = (value?: string | number) => {
  if (value === undefined) return '—'
  const date = new Date(value)
  return Number.isNaN(+date) ? '—' : date.toLocaleDateString()
}
defineExpose({
  reveal,
  columns,
  getScrollElement: () => list.value?.getScrollElement(),
})
onBeforeUnmount(() => {
  disposed = true
  observer?.disconnect()
})
</script>

<template>
  <div
    ref="root"
    class="s-file-manager__content"
    :class="`is-${view}`"
    role="listbox"
    tabindex="0"
    :aria-label="label('contents')"
    :aria-multiselectable="behavior.multiple"
    :aria-busy="pending"
    @keydown="onKey"
    @click.self="setSelection([])"
    @contextmenu.self="emit('context', $event)"
    @dragover.self="emit('drag-over', $event, directoryId)"
    @drop.self="emit('drop', $event, directoryId)"
  >
    <div
      v-if="view === 'list'"
      class="s-file-manager__list-header"
      aria-hidden="true"
    >
      <span>{{ label('name') }}</span
      ><span>{{ label('modified') }}</span
      ><span>{{ label('size') }}</span>
    </div>
    <SVirtualList
      ref="list"
      :count="rowCount"
      :item-at="rowAt"
      :estimate-size="rowSize"
      :dynamic="false"
      :overscan="3"
      :max-rendered-items="32"
      height="100%"
      @click.self="setSelection([])"
      @contextmenu="emit('context', $event)"
      @dragover="emit('drag-over', $event, directoryId)"
      @drop="emit('drop', $event, directoryId)"
    >
      <template #default="{ index: rowIndex }">
        <div
          class="s-file-manager__row"
          :style="{
            gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            height: `${rowSize}px`,
          }"
          @click.self="setSelection([])"
        >
          <div
            v-for="entry in rowAt(rowIndex)"
            :key="entry.id"
            class="s-file-manager__entry"
            :class="{
              'is-selected': selectedSet.has(entry.id),
              'is-focused': focusedId === entry.id,
              'is-cut': clipboard?.cut && clipboard.ids.includes(entry.id),
              'is-disabled': entry.disabled,
              'is-drop-target': state.dropTarget.value === entry.id,
            }"
            role="option"
            :aria-selected="selectedSet.has(entry.id)"
            :aria-disabled="entry.disabled"
            :aria-label="entry.name"
            :title="entry.name"
            :draggable="
              behavior.dragDrop && !entry.disabled && editingId !== entry.id
            "
            @click.stop="click(entry, $event)"
            @dblclick.stop="behavior.openOn === 'double-click' && open(entry)"
            @contextmenu.stop="emit('context', $event, entry)"
            @dragstart.stop="emit('drag-start', $event, entry)"
            @dragover.stop="
              emit(
                'drag-over',
                $event,
                entry.kind === 'folder' ? entry.id : directoryId,
              )
            "
            @drop.stop="
              emit(
                'drop',
                $event,
                entry.kind === 'folder' ? entry.id : directoryId,
              )
            "
          >
            <FilePreview
              :context="{
                entry,
                view,
                selected: selectedSet.has(entry.id),
                size: tileSize,
              }"
              :renderers="renderers"
              ><template v-if="$slots['folder-preview']" #folder-preview="scope"
                ><slot name="folder-preview" v-bind="scope" /></template
            ></FilePreview>
            <SInput
              v-if="editingId === entry.id"
              v-model="draft"
              class="s-file-manager__rename"
              :aria-label="label('rename')"
              :disabled="pending"
              @click.stop
              @dblclick.stop
              @keydown.stop
              @keydown.enter.prevent="commitRename"
              @keydown.esc.prevent="cancelRename"
              @blur="commitRename"
            />
            <span v-else class="s-file-manager__name">{{ entry.name }}</span>
            <template v-if="view === 'list'"
              ><span class="s-file-manager__modified">{{
                formatDate(entry.modifiedAt)
              }}</span
              ><span class="s-file-manager__size">{{
                entry.kind === 'folder' ? '—' : formatSize(entry.size)
              }}</span></template
            >
          </div>
        </div>
      </template>
      <template v-if="!visible.length" #overlay
        ><div class="s-file-manager__empty">{{ label('empty') }}</div></template
      >
    </SVirtualList>
  </div>
</template>
