<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import type {
  TableColumn,
  TableDataMutationResult,
  TableExposes,
  TableRow,
} from 'sax-design-vue'

const table = ref<TableExposes>()
const rows = ref<TableRow[]>([
  { id: 1, name: '工作区', lazy: true },
  { id: 5, name: '独立项目' },
])
const loaded = ref(false)
const expanded = ref<number[]>([])
const virtual = ref(true)
const busy = ref(false)
const count = shallowRef(0)
const message = ref('加载分支后，可以修改、插入或删除其中的记录。')
const nextId = ref(10)
const columns: TableColumn[] = [
  { field: 'name', title: '名称', width: 260, fixed: 'left', treeNode: true },
  { field: 'note', title: '说明', minWidth: 440 },
  { field: 'id', title: '编号', width: 90, fixed: 'right' },
]
const load = async () => [
  {
    id: 2,
    name: '组件分组',
    children: [
      {
        id: 3,
        name: '按钮',
        note: '已加载的后代可以独立修改，无须修改父节点。',
      },
    ],
  },
]
const expand = async () => {
  if (!table.value || !rows.value[0] || rows.value[0].id !== 1) return
  await table.value.toggleRowExpand(rows.value[0], true)
  expanded.value = [1, 2]
  loaded.value = true
}
const refresh = () => {
  const records = table.value?.getChangeRecords()
  if (records)
    count.value =
      records.inserted.length + records.updated.length + records.removed.length
}
const run = async (
  action: () => Promise<TableDataMutationResult> | undefined,
) => {
  busy.value = true
  try {
    const result = await action()
    message.value = result?.applied
      ? '已应用变更。'
      : '目标暂不可用，请先还原或加载分支。'
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <div class="changes-tree">
    <div class="changes-tree__controls">
      <s-button size="small" :disabled="busy" @click="expand"
        >加载并展开</s-button
      >
      <s-button
        size="small"
        :disabled="busy || !loaded"
        @click="run(() => table?.updateRow(3, { name: '更新后的按钮' }))"
        >修改后代</s-button
      >
      <s-button
        size="small"
        :disabled="busy || !loaded"
        @click="
          run(() =>
            table?.insertRows([{ id: nextId++, name: '新组件' }], {
              parentKey: 2,
            }),
          )
        "
        >插入子行</s-button
      >
      <s-button
        size="small"
        flat
        :disabled="busy"
        @click="run(() => table?.removeRows([1]))"
        >删除分支</s-button
      >
      <s-button
        size="small"
        flat
        :disabled="busy"
        @click="run(() => table?.revertChanges([1]))"
        >还原分支</s-button
      >
      <s-checkbox v-model="virtual">虚拟滚动</s-checkbox>
      <s-tag>变更行数: {{ count }}</s-tag>
    </div>
    <s-table
      ref="table"
      v-model:data="rows"
      v-model:expanded-keys="expanded"
      :columns="columns"
      :tree-config="{ hasChildren: 'lazy', load }"
      :virtual-config="
        virtual ? { height: 220, dynamic: true, horizontal: true } : false
      "
      change-config
      @changes-change="refresh"
    />
    <p role="status">{{ message }}</p>
  </div>
</template>

<style scoped>
.changes-tree {
  width: 100%;
}
.changes-tree__controls {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
}
</style>
