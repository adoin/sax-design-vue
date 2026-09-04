<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import type {
  TableColumn,
  TableEditEndParams,
  TableExposes,
  TableMergeConfig,
} from 'sax-design-vue'

const table = ref<TableExposes>()
const virtual = shallowRef(false)
const pending = shallowRef(false)
const notes = ref<Record<number, string>>({})
const rows = shallowRef([
  { id: 1, team: '设计', project: '设计系统', owner: 'Alex', hours: 12 },
  { id: 2, team: '设计', project: '文档', owner: 'Sam', hours: 8 },
  { id: 3, team: '设计', project: '图标', owner: 'Taylor', hours: 6 },
  { id: 4, team: '研发', project: '工作台', owner: 'Morgan', hours: 16 },
  { id: 5, team: '研发', project: '组件', owner: 'Casey', hours: 10 },
  { id: 6, team: '研发', project: '集成', owner: 'Jordan', hours: 14 },
])
const columns: TableColumn[] = [
  { key: 'details', type: 'expand', width: 56, fixed: 'left' },
  { field: 'team', title: '团队', width: 140, fixed: 'left', editor: true },
  { field: 'project', title: '项目', minWidth: 200, editor: true },
  { field: 'owner', title: '负责人', minWidth: 150 },
  { field: 'hours', title: '工时', width: 100, fixed: 'right' },
]
const merges: TableMergeConfig = {
  body: [
    { row: 0, col: 1, rowspan: 3, colspan: 1 },
    { row: 3, col: 1, rowspan: 3, colspan: 1 },
  ],
}
const save = ({ rowKey, updatedRow }: TableEditEndParams) => {
  rows.value = rows.value.map((row) =>
    row.id === rowKey ? (updatedRow as typeof row) : row,
  )
  pending.value = false
}
</script>

<template>
  <div class="merging-edit-demo">
    <div class="merging-edit-demo__controls">
      <s-checkbox v-model="virtual">虚拟行</s-checkbox>
      <s-button size="small" :disabled="!pending" @click="table?.commitEdit()"
        >保存</s-button
      >
      <s-button
        size="small"
        flat
        :disabled="!pending"
        @click="table?.cancelEdit()"
        >取消</s-button
      >
    </div>
    <s-table
      ref="table"
      :data="rows"
      :columns="columns"
      :merge-config="merges"
      :virtual-config="
        virtual ? { height: 280, dynamic: true, horizontal: true } : false
      "
      row-key="id"
      resize-config
      keyboard-config
      edit-config
      @edit-start="pending = true"
      @edit-commit="save"
      @edit-cancel="pending = false"
    >
      <template #detail="{ row, close }">
        <div class="merging-edit-demo__detail">
          <strong>{{ row.project }}</strong>
          <s-input v-model="notes[row.id]" label="项目备注" block />
          <s-button size="small" flat @click="close">关闭详情</s-button>
        </div>
      </template>
    </s-table>
  </div>
</template>

<style scoped>
.merging-edit-demo {
  width: 100%;
  min-width: 0;
}
.merging-edit-demo__controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}
.merging-edit-demo__detail {
  display: grid;
  gap: 12px;
}
.merging-edit-demo__detail > .s-button {
  justify-self: start;
}
</style>
