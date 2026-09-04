<script setup lang="ts">
import { ref } from 'vue'
import type {
  TableColumn,
  TableExposes,
  TableHistoryState,
  TablePagerConfig,
} from 'sax-design-vue'
const table = ref<TableExposes>()
const grouped = ref(false)
const virtual = ref(false)
const pager = ref<TablePagerConfig>({ currentPage: 1, pageSize: 4 })
const history = ref<TableHistoryState>({
  undoCount: 0,
  redoCount: 0,
  canUndo: false,
  canRedo: false,
})
const rows = ref(
  Array.from({ length: 12 }, (_, index) => ({
    id: index + 1,
    name: `${index % 3 === 0 ? 'Alpha' : 'Beta'} ${index + 1}`,
    team: index < 6 ? '研发' : '设计',
    score: 60 + index,
  })),
)
const columns: TableColumn[] = [
  { field: 'id', title: '编号（只读）', width: 110, fixed: 'left' },
  { field: 'name', title: '项目', width: 210, editor: true },
  { field: 'team', title: '部门', minWidth: 140, editor: true },
  {
    field: 'score',
    title: '评分',
    width: 120,
    fixed: 'right',
    editor: { type: 'number' },
  },
]
const selectNames = async () => {
  const start = virtual.value
    ? 0
    : ((pager.value.currentPage ?? 1) - 1) * (pager.value.pageSize ?? 4)
  await table.value?.setCellRange({
    anchor: { rowKey: rows.value[start].id, columnKey: 'name' },
    focus: {
      rowKey: rows.value[Math.min(start + 3, rows.value.length - 1)].id,
      columnKey: 'name',
    },
  })
}
const searchAll = async () => {
  const result = await table.value?.findCells('Alpha', { scope: 'data' })
  if (result?.success) await table.value?.findNext({ focus: false })
  await table.value?.openFind()
}
</script>
<template>
  <div class="find-demo">
    <div class="find-demo__controls">
      <s-button size="small" @click="searchAll">跨页查找 Alpha</s-button>
      <s-button size="small" flat @click="selectNames">选择本页项目名</s-button>
      <s-button
        size="small"
        flat
        :disabled="!history.canUndo"
        @click="table?.undo()"
        >撤销</s-button
      >
      <s-button
        size="small"
        flat
        :disabled="!history.canRedo"
        @click="table?.redo()"
        >重做</s-button
      >
      <s-checkbox v-model="grouped">按部门分组</s-checkbox>
      <s-checkbox v-model="virtual">虚拟滚动</s-checkbox>
    </div>
    <s-table
      ref="table"
      v-model:data="rows"
      :columns="columns"
      row-key="id"
      find-config
      range-config
      edit-config
      change-config
      history-config
      validation-config
      :validation-rules="{
        name: { required: true, max: 24 },
        score: { type: 'number', min: 0, max: 100 },
      }"
      :pager-config="virtual ? false : pager"
      :group-config="grouped ? { fields: ['team'] } : false"
      :virtual-config="
        virtual ? { height: 280, horizontal: true, dynamic: true } : false
      "
      @update:pager-config="pager = $event"
      @history-change="history = $event"
    />
  </div>
</template>
<style scoped>
.find-demo {
  width: 100%;
}
.find-demo__controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}
</style>
