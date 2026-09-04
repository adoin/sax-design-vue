<script setup lang="ts">
import { ref } from 'vue'
import type { TableRow, TableRowDragResult } from 'sax-design-vue'
const rows = ref<TableRow[]>([
  { id: 1, name: '工作区', lazy: true },
  {
    id: 2,
    name: '文档',
    children: [
      { id: 21, name: '介绍' },
      { id: 22, name: '示例' },
    ],
  },
])
const expanded = ref([2])
const message = ref('展开工作区加载子节点，然后调整同级顺序。')
const load = async () => [
  { id: 11, name: '组件库', note: '可复用控件与共享样式。' },
  { id: 12, name: '交互预览', note: '直接在浏览器中编辑组件示例。' },
  { id: 13, name: '发布', note: '准备下个版本。' },
]
const report = (result: TableRowDragResult) => {
  message.value = result.applied
    ? '同级顺序已更新。'
    : '只能调整同级节点的顺序。'
}
</script>

<template>
  <div class="row-drag-tree-demo">
    <s-table
      v-model:data="rows"
      v-model:expanded-keys="expanded"
      row-drag-config
      :tree-config="{ hasChildren: 'lazy', load }"
      :virtual-config="{ height: 260, dynamic: true, horizontal: true }"
      @row-drag-end="report"
    >
      <s-table-column
        field="name"
        title="项目"
        :width="240"
        fixed="left"
        tree-node
        drag-sort
      />
      <s-table-column field="note" title="说明" :min-width="350" />
      <s-table-column field="id" title="ID" :width="100" fixed="right" />
    </s-table>
    <p role="status">{{ message }}</p>
  </div>
</template>
