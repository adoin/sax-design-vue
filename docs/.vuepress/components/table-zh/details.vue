<script setup lang="ts">
import { ref } from 'vue'
import type { TableColumn, TableRowKey } from 'sax-design-vue'

const expanded = ref<TableRowKey[]>([1])
const treeKeys = ref<TableRowKey[]>([])
const virtual = ref(false)
const notes = ref<Record<string, string>>({})
const showItems = ref(true)
const rows = [
  {
    id: 1,
    name: '设计工作区',
    owner: 'Alex',
    children: [{ id: 3, name: '移动端布局', owner: 'Morgan' }],
  },
  { id: 2, name: '组件库', owner: 'Sam' },
]
const columns: TableColumn[] = [
  { key: 'details', type: 'expand', width: 56, fixed: 'left' },
  { field: 'name', title: '项目', treeNode: true, minWidth: 260 },
  { field: 'owner', title: '负责人', minWidth: 140 },
  { field: 'id', title: 'ID', width: 80, fixed: 'right' },
]
const itemColumns: TableColumn[] = [
  { field: 'task', title: '任务', minWidth: 160 },
  { field: 'status', title: '状态', minWidth: 120 },
]
const items = [
  { task: '评审需求', status: '进行中' },
  { task: '准备预览', status: '待开始' },
]
</script>

<template>
  <div class="details-demo">
    <div class="details-demo__controls">
      <s-checkbox v-model="virtual">虚拟行滚动</s-checkbox>
      <s-checkbox v-model="showItems">显示相关任务</s-checkbox>
      <s-button size="small" flat @click="expanded = []">收起全部详情</s-button>
    </div>
    <s-table
      v-model:detail-expanded-keys="expanded"
      v-model:expanded-keys="treeKeys"
      :data="rows"
      :columns="columns"
      :tree-config="{}"
      :virtual-config="virtual ? { height: 260, horizontal: true } : false"
      row-key="id"
    >
      <template #detail="{ row, close }">
        <div class="details-demo__panel">
          <strong>{{ row.name }}</strong>
          <s-input
            v-model="notes[row.id]"
            label="项目备注"
            placeholder="填写备注"
            block
          />
          <s-table v-if="showItems" :data="items" :columns="itemColumns" />
          <s-button size="small" flat @click="close">收起详情</s-button>
        </div>
      </template>
    </s-table>
  </div>
</template>

<style scoped>
.details-demo {
  width: 100%;
}
.details-demo__controls {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
  align-items: center;
}
.details-demo__panel {
  display: grid;
  gap: 16px;
}
.details-demo__panel > .s-button {
  justify-self: start;
}
</style>
