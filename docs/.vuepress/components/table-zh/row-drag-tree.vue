<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import type {
  TableColumn,
  TableRowDragConfig,
  TableRowDragResult,
} from 'sax-design-vue'
interface ProjectRow {
  id: number
  name: string
  note: string
  kind: 'folder' | 'item'
  locked?: boolean
  children?: ProjectRow[]
}
const columns: TableColumn<ProjectRow>[] = [
  {
    field: 'name',
    title: '项目',
    width: 240,
    fixed: 'left',
    treeNode: true,
    dragSort: true,
  },
  { field: 'note', title: '说明', minWidth: 350 },
  { field: 'id', title: 'ID', width: 100, fixed: 'right' },
]
const rows = ref<ProjectRow[]>([
  {
    id: 1,
    name: '工作区',
    note: '应用包目录。',
    kind: 'folder',
    children: [
      { id: 11, name: '组件库', note: '可复用控件。', kind: 'item' },
      { id: 12, name: '交互预览', note: '在线示例。', kind: 'item' },
    ],
  },
  {
    id: 2,
    name: '文档',
    note: '开发者指南。',
    kind: 'folder',
    children: [
      { id: 21, name: '介绍', note: '快速开始。', kind: 'item' },
      { id: 22, name: '示例', note: '用法参考。', kind: 'item' },
    ],
  },
  {
    id: 3,
    name: '归档',
    note: '锁定目录。',
    kind: 'folder',
    locked: true,
  },
])
const expanded = ref([1, 2])
const message = shallowRef(
  '拖到文件夹中部可更换父节点，拖到上下边缘则插入前后位置。',
)
const rowDragConfig: TableRowDragConfig<ProjectRow> = {
  tree: {
    allowReparent: true,
    allowDropInside: true,
    maxDepth: 2,
    expandOnDrop: true,
  },
  draggableMethod: ({ row }) => !row.locked,
  dropMethod: ({ targetRow, position, targetChildCount }) =>
    !targetRow.locked && (position !== 'inside' || targetChildCount < 4),
}
const report = (result: TableRowDragResult<ProjectRow>) => {
  if (result.reason === 'cancelled') {
    message.value = '已取消拖拽。'
    return
  }
  if (!result.applied || !result.request) {
    message.value = '当前目标不允许放置。'
    return
  }
  const { row, targetRow, position, reparented } = result.request
  message.value = `${row.name} 已移动到 ${targetRow.name}${position === 'inside' ? ' 内部' : position === 'before' ? ' 之前' : ' 之后'}${reparented ? '，父节点已改变' : ''}。`
}
</script>

<template>
  <div class="row-drag-tree-demo">
    <s-table
      v-model:data="rows"
      v-model:expanded-keys="expanded"
      :columns="columns"
      :row-drag-config="rowDragConfig"
      :tree-config="{}"
      :virtual-config="{ height: 260, dynamic: true, horizontal: true }"
      @row-drag-end="report"
    />
    <p role="status">{{ message }}</p>
  </div>
</template>
