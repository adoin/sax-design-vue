<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import type {
  TableActiveCell,
  TableExposes,
  TableMergeConfig,
  TableMergeRange,
  TableVirtualSource,
} from 'sax-design-vue'

const table = ref<TableExposes>()
const active = shallowRef<TableActiveCell | null>(null)
const merged = shallowRef(true)
const multiline = shallowRef(false)
const source: TableVirtualSource = {
  rowCount: 1_000_000,
  columnCount: 100_000,
  fixedLeftCount: 1,
  fixedRightCount: 1,
  rowKey: (index) => index,
  row: (index) => ({ id: index, name: `Record ${index}` }),
  column: (index) => ({ field: 'name', title: `Column ${index}`, width: 140 }),
  columnWidth: () => 140,
}
const merges: TableMergeConfig = {
  body: (query) => {
    const ranges: TableMergeRange[] = []
    for (
      let row = Math.floor(query.rowStart / 4) * 4;
      row < query.rowEnd;
      row += 4
    ) {
      for (
        let col = Math.floor(query.colStart / 8) * 8;
        col < query.colEnd;
        col += 8
      ) {
        ranges.push({ row, col, rowspan: 4, colspan: 8 })
      }
    }
    return ranges
  },
}
</script>

<template>
  <div class="merging-source-demo">
    <div class="merging-source-demo__controls">
      <s-button size="small" @click="table?.setActiveCell(0, 0)"
        >First region</s-button
      >
      <s-button size="small" @click="table?.setActiveCell(999999, 99998)"
        >Last region</s-button
      >
      <s-checkbox v-model="merged">Merge cells</s-checkbox>
      <s-checkbox v-model="multiline">Multiline content</s-checkbox>
    </div>
    <s-table
      ref="table"
      v-model:active-cell="active"
      :virtual-source="source"
      :merge-config="merged ? merges : false"
      :keyboard-config="{ rowIndexOf: Number }"
      :virtual-config="{ height: 280, dynamic: true, horizontal: true }"
      resize-config
    >
      <template #cell="{ rowIndex, columnIndex }">
        <span
          >{{ rowIndex }} / {{ columnIndex
          }}<template v-if="multiline">
            — This region contains a longer explanation that wraps in a narrow
            fixed column. Its complete text remains readable as the content
            grows. Moving across horizontal windows preserves the measured row
            heights.</template
          ></span
        >
      </template>
    </s-table>
    <p role="status">
      Active region origin:
      {{ active ? `${active.rowKey} / ${active.columnKey}` : '—' }}
    </p>
  </div>
</template>

<style scoped>
.merging-source-demo {
  width: 100%;
  min-width: 0;
}
.merging-source-demo__controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}
.merging-source-demo > p {
  margin: 12px 0 0;
}
</style>
