<script setup lang="ts">
import { h, shallowRef } from 'vue'
import { SButton, SFileManager, SSwitch } from 'sax-design-vue'
import type {
  FileManagerContext,
  FileManagerEntry,
  FileManagerMenuItem,
  FileManagerPreviewRenderer,
  FileManagerSortOption,
} from 'sax-design-vue'

const files = shallowRef<FileManagerEntry[]>([
  { id: 'photos', parentId: null, kind: 'folder', name: '摄影素材' },
  { id: 'projects', parentId: null, kind: 'folder', name: '项目文件' },
  { id: 'archive', parentId: 'projects', kind: 'folder', name: '归档' },
  {
    id: 'readme',
    parentId: null,
    kind: 'file',
    name: 'README.md',
    size: 2400,
    modifiedAt: '2026-10-20',
  },
  ...Array.from({ length: 4 }, (_, i): FileManagerEntry => ({
    id: `photo-${i}`,
    parentId: 'photos',
    kind: 'file',
    name: `风景 ${i + 1}.png`,
    thumbnail: `/foto${i + 1}.png`,
    size: 1024 * (100 + i * 25),
    modifiedAt: '2026-10-21',
  })),
  { id: 'scene', parentId: null, kind: 'file', name: '场景.scene' },
  { id: 'raster', parentId: null, kind: 'file', name: '封面.raster' },
  { id: 'binary', parentId: null, kind: 'file', name: 'payload.custombin' },
  {
    id: 'internal',
    parentId: null,
    kind: 'folder',
    name: '内部资料',
    hidden: true,
  },
  {
    id: 'cache',
    parentId: null,
    kind: 'file',
    name: 'cache.bin',
    hidden: true,
  },
])
const directory = shallowRef<string | number | null>(null)
const selection = shallowRef<(string | number)[]>([])
const readOnly = shallowRef(false)
const treeFiles = shallowRef(false)
const notice = shallowRef('')
const renderers: FileManagerPreviewRenderer[] = [
  {
    extensions: ['md', 'txt'],
    render: ({ entry, view }) =>
      view === 'list'
        ? h('strong', entry.name.endsWith('.md') ? 'MD' : 'TXT')
        : h('div', { class: 'document-preview' }, [
            h('strong', entry.name.endsWith('.md') ? 'MD' : 'TXT'),
            h('span', '文本预览'),
          ]),
  },
]
const folderImages = (entry: FileManagerEntry) =>
  files.value
    .filter((item) => item.parentId === entry.id && item.thumbnail)
    .slice(0, 4)
const menus = (ctx: FileManagerContext): FileManagerMenuItem[] => [
  ...(ctx.defaultItems ?? []).map((item) => ({
    ...item,
    disabled:
      item.disabled ||
      (readOnly.value &&
        [
          'rename',
          'delete',
          'cut',
          'paste',
          'hide',
          'unhide',
          'new-folder',
        ].includes(item.action ?? '')),
  })),
  { label: '查看信息', value: 'details', divided: true, disabled: !ctx.entry },
]
const sortOptions: FileManagerSortOption[] = [
  { key: 'name', label: '名称' },
  { key: 'modifiedAt', label: '修改时间' },
  { key: 'size', label: '大小' },
  {
    key: 'extension',
    label: '文件类型',
    compare: (a, b) =>
      (a.name.split('.').pop() || '').localeCompare(
        b.name.split('.').pop() || '',
      ),
  },
]
const thumbnails = { scene: '/file-manager-scene.svg', raster: '/foto1.png' }
const showLargeFolder = () => {
  const parent: FileManagerEntry = {
    id: 'large',
    parentId: null,
    name: '万条文件',
    kind: 'folder',
  }
  files.value = [
    ...files.value.filter(
      (entry) => entry.id !== 'large' && entry.parentId !== 'large',
    ),
    parent,
    ...Array.from({ length: 10000 }, (_, i): FileManagerEntry => ({
      id: `large-${i}`,
      parentId: 'large',
      kind: 'file',
      name: `文档 ${i + 1}.txt`,
      size: 256 * i,
    })),
  ]
  directory.value = 'large'
}
</script>

<template>
  <div class="manager-controls">
    <SSwitch v-model="readOnly" /> <span>只读模式</span
    ><SButton size="small" @click="showLargeFolder">打开 10,000 个文件</SButton
    ><SSwitch v-model="treeFiles" /><span>树内显示文件</span
    ><span aria-live="polite">{{ notice }}</span>
  </div>
  <SFileManager
    v-model="files"
    v-model:directory-id="directory"
    v-model:selected-ids="selection"
    :height="540"
    :tree-show-files="treeFiles"
    :thumbnails="thumbnails"
    :sort-options="sortOptions"
    :preview-renderers="renderers"
    :context-menu="menus"
    :before-operation="() => !readOnly"
    @open="notice = $event.name"
    @menu-select="
      (item, ctx) => {
        if (item.value === 'details') notice = ctx.entry?.name || ''
      }
    "
  >
    <template #folder-preview="{ entry, renderDefault }"
      ><div v-if="folderImages(entry).length" class="folder-collage">
        <img
          v-for="image in folderImages(entry)"
          :key="image.id"
          :src="image.thumbnail"
          alt=""
          loading="lazy"
        />
      </div>
      <component :is="renderDefault" v-else />
    </template>
  </SFileManager>
</template>

<style scoped>
.manager-controls {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 16px;
}
.folder-collage {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-template-rows: repeat(2, minmax(0, 1fr));
  width: 100%;
  height: 100%;
  gap: 3px;
  border-radius: 8px;
  overflow: hidden;
}
.folder-collage img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
:deep(.document-preview) {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  background: var(--sax-css-background);
  color: var(--sax-css-primary);
  border-radius: 8px;
}
:deep(.document-preview strong) {
  font-size: 24px;
}
:deep(.document-preview span) {
  font-size: 11px;
}
</style>
