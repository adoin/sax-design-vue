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
  name: `Project ${id + 1}`,
  team: id < 20 ? 'Engineering' : 'Design',
  score: 70 + (id % 30),
  note: id % 5 === 0 ? `Project ${id + 1}\nNotes` : 'Notes',
}))
</script>

<template>
  <div class="range-demo">
    <div class="range-demo__controls">
      <s-button size="small" flat @click="table?.clearCellRange()"
        >Clear range</s-button
      >
      <s-checkbox v-model="grouped">Group by team</s-checkbox>
    </div>
    <p>
      Drag across cells, or hold Shift and click or use arrow keys to extend.
    </p>
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
      <s-table-column field="id" title="ID" fixed="left" :width="100" />
      <s-table-column field="name" title="Project" :width="180" />
      <s-table-column field="team" title="Team" :width="180" />
      <s-table-column field="score" title="Score" :width="180" />
      <s-table-column field="note" title="Notes" fixed="right" :width="180" />
    </s-table>
    <p role="status">
      Range:
      {{
        bounds
          ? bounds.rowEnd -
            bounds.rowStart +
            ' × ' +
            (bounds.colEnd - bounds.colStart)
          : 'No selection'
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
