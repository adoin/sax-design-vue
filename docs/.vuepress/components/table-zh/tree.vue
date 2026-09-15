<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import type { TableColumn, TableTreeConfig } from 'sax-design-vue'

interface FileRow {
  id: string
  name: string
  kind: string
  size?: string
  hasChildren?: boolean
  children?: FileRow[]
  [key: string]: unknown
}

const expandedKeys = shallowRef(['src'])
const lazyLoading = ref(false)
const lazyLoaded = ref(false)
const columns: TableColumn<FileRow>[] = [
  {
    field: 'name',
    title: '名称',
    minWidth: 220,
    treeNode: true,
    slots: { default: 'fileNameCell' },
  },
  {
    field: 'kind',
    title: '类型',
    width: 150,
    slots: { default: 'kind' },
  },
  { field: 'size', title: '大小', width: 100, align: 'right' },
]

const rows: FileRow[] = [
  {
    id: 'src',
    name: 'src',
    kind: '目录',
    children: [
      { id: 'components', name: 'components', kind: '目录', hasChildren: true },
      { id: 'main', name: 'main.ts', kind: 'TypeScript', size: '4 KB' },
    ],
  },
  { id: 'package', name: 'package.json', kind: 'JSON', size: '3 KB' },
]

const treeConfig: TableTreeConfig<FileRow> = {
  children: 'children',
  hasChildren: 'hasChildren',
  line: true,
  async load({ row }) {
    if (row.id !== 'components') return []
    lazyLoading.value = true
    try {
      await new Promise((resolve) => setTimeout(resolve, 800))
      lazyLoaded.value = true
      return [
        { id: 'table', name: 'table.vue', kind: 'Vue 组件', size: '12 KB' },
        { id: 'form', name: 'form.vue', kind: 'Vue 组件', size: '9 KB' },
      ]
    } finally {
      lazyLoading.value = false
    }
  },
}
</script>

<template>
  <s-table
    v-model:expanded-keys="expandedKeys"
    :data="rows"
    :columns="columns"
    :tree-config="treeConfig"
    row-key="id"
  >
    <template #fileNameCell="{ row, value }">
      <div class="tree-name">
        <strong>{{ value }}</strong>
        <small>{{ row.kind }}</small>
        <s-tag v-if="row.id === 'components'" size="small">
          {{
            lazyLoading
              ? '正在异步加载'
              : lazyLoaded
                ? '已懒加载'
                : '展开后加载'
          }}
        </s-tag>
      </div>
    </template>
    <template #kind="{ value }">
      <span class="kind-pill">{{ value }}</span>
    </template>
  </s-table>
</template>

<style scoped>
.tree-name {
  display: grid;
  gap: 2px;
}

.tree-name small {
  color: hsl(var(--sax-text-color-secondary));
}

.tree-name .s-tag {
  width: fit-content;
}

.kind-pill {
  display: inline-flex;
  width: fit-content;
  padding: 3px 8px;
  border-radius: var(--sax-radius-pill);
  background: hsl(var(--sax-primary) / 0.1);
  color: hsl(var(--sax-primary));
  font-size: 12px;
}
</style>
