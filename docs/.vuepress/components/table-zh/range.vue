<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import type {
  TableCellRange,
  TableCellRangeBounds,
  TableExposes,
} from 'sax-design-vue'
const table = ref<TableExposes>()
const selected = shallowRef<TableCellRange | null>(null)
const bounds = shallowRef<TableCellRangeBounds | null>(null)
const grouped = ref(false)
const rows = Array.from({ length: 40 }, (_, id) => ({
  id,
  name: `项目 ${id + 1}`,
  team: id < 20 ? '研发' : '设计',
  score: 70 + (id % 30),
  note: id % 5 === 0 ? `项目 ${id + 1}\n备注` : '备注',
}))
</script>

<template>
  <div class="range-demo">
    <div class="range-demo__controls">
      <s-button size="small" flat @click="table?.clearCellRange()"
        >清空选区</s-button
      >
      <s-checkbox v-model="grouped">按部门分组</s-checkbox>
    </div>
    <p>拖动单元格选择；按住 Shift 点击或使用方向键扩选。</p>
    <s-table
      ref="table"
      v-model:cell-range="selected"
      :data="rows"
      row-key="id"
      range-config
      :group-config="grouped ? { fields: ['team'] } : false"
      :merge-config="{ body: [{ row: 1, col: 1, rowspan: 2, colspan: 2 }] }"
      :virtual-config="{
        enabled: true,
        horizontal: true,
        height: 280,
        dynamic: true,
      }"
      column-manager-config
      resize-config
      @cell-range-change="bounds = $event.bounds"
    >
      <s-table-column field="id" title="编号" fixed="left" :width="100" />
      <s-table-column field="name" title="项目" :width="180" />
      <s-table-column field="team" title="部门" :width="180" />
      <s-table-column field="score" title="得分" :width="180" />
      <s-table-column field="note" title="备注" fixed="right" :width="180" />
    </s-table>
    <p role="status">
      选区:
      {{
        bounds
          ? bounds.rowEnd -
            bounds.rowStart +
            ' × ' +
            (bounds.colEnd - bounds.colStart)
          : '未选择'
      }}
    </p>
  </div>
</template>

<style scoped>
.range-demo {
  width: 100%;
}
.range-demo__controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}
.range-demo p {
  margin: 12px 0;
}
</style>
