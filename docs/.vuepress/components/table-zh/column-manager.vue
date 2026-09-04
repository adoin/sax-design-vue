<script setup lang="ts">
import { computed, ref, shallowRef } from 'vue'
import type {
  TableColumn,
  TableColumnState,
  TableInstance,
  TableRow,
  TableVirtualSource,
} from 'sax-design-vue'

const table = ref<TableInstance>()
const state = ref<TableColumnState[]>([])
const virtual = shallowRef(true)
const large = shallowRef(false)
const loading = shallowRef(false)
const description = '整理项目需求与设计文档，协调团队进度，并跟进本周交付事项。'
const rows: TableRow[] = Array.from({ length: 200 }, (_, id) => ({
  id,
  name: `成员 ${id}`,
  description: id % 3 ? description : description.repeat(3),
  status: '进行中',
  children:
    id === 0
      ? [{ id: 10001, name: '子任务', description, status: '进行中' }]
      : undefined,
}))
const columns: TableColumn[] = [
  { field: 'id', title: '编号', width: 80, fixed: 'left' },
  { field: 'name', title: '成员', width: 160, treeNode: true },
  { field: 'description', title: '工作说明', width: 240 },
  ...Array.from({ length: 20 }, (_, index): TableColumn => ({
    field: `metric${index}`,
    title: `指标 ${index}`,
    width: 120,
    cell: ({ row }) => String(Number(row.id) + index),
  })),
  { field: 'status', title: '状态', width: 120, fixed: 'right' },
]
const source: TableVirtualSource = {
  rowCount: 1_000_000,
  columnCount: 100_000,
  columnWidth: 120,
  fixedLeftCount: 1,
  fixedRightCount: 1,
  row: (id) => ({
    id,
    name: `成员 ${id}`,
    description: id % 3 ? description : description.repeat(3),
    status: '进行中',
  }),
  column: (index) =>
    index < 3
      ? columns[index]
      : index === 99_999
        ? columns[columns.length - 1]
        : {
            field: `metric${index}`,
            title: `指标 ${index}`,
            cell: ({ row }) => String(Number(row.id) + index),
          },
}
const virtualConfig = computed(() =>
  virtual.value || large.value
    ? { height: 320, horizontal: true, dynamic: true, estimateSize: 64 }
    : false,
)
const jump = () => {
  table.value?.scrollToRow(large.value ? source.rowCount - 1 : 199, 'end')
  table.value?.scrollToColumn(
    large.value ? source.columnCount - 2 : columns.length - 2,
    'end',
  )
}
</script>

<template>
  <div class="column-manager-demo">
    <div class="column-manager-controls">
      <s-button size="small" :disabled="loading" @click="state = []"
        >恢复列设置</s-button
      >
      <s-checkbox v-model="virtual" :disabled="large">双轴虚拟滚动</s-checkbox>
      <s-checkbox v-model="large" @update:model-value="state = []"
        >百万行生成数据</s-checkbox
      >
      <s-checkbox v-model="loading">加载状态</s-checkbox>
      <s-button size="small" type="flat" @click="jump">定位末列</s-button>
    </div>
    <s-table
      ref="table"
      v-model:column-state="state"
      :data="large ? [] : rows"
      :columns="large ? [] : columns"
      :virtual-source="large ? source : undefined"
      :virtual-config="virtualConfig"
      :tree-config="large ? undefined : { defaultExpandedKeys: [0] }"
      :loading="loading"
      column-manager-config
      resize-config
      striped
    />
    <s-text role="status" aria-live="polite"
      >已调整列数: {{ state.length }}</s-text
    >
  </div>
</template>

<style scoped>
.column-manager-demo {
  display: grid;
  width: 100%;
  min-width: 0;
  gap: 16px;
}
.column-manager-controls {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}
</style>
