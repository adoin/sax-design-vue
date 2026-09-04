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
  row: (index) => ({ id: index, name: `记录 ${index}` }),
  column: (index) => ({ field: 'name', title: `列 ${index}`, width: 140 }),
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
        >首个区域</s-button
      >
      <s-button size="small" @click="table?.setActiveCell(999999, 99998)"
        >末端区域</s-button
      >
      <s-checkbox v-model="merged">合并单元格</s-checkbox>
      <s-checkbox v-model="multiline">多行内容</s-checkbox>
    </div>
    <s-table
      ref="table"
      v-model:active-cell="active"
      :virtual-source="source"
      :merge-config="merged ? merges : false"
      :keyboard-config="{ rowIndexOf: (key) => Number(key) }"
      :virtual-config="{ height: 280, dynamic: true, horizontal: true }"
      resize-config
    >
      <template #cell="{ rowIndex, columnIndex }">
        <span
          >{{ rowIndex }} / {{ columnIndex
          }}<template v-if="multiline">
            —
            这是一段需要完整显示的区域说明。固定列中的较窄区域会自动换行，内容增减时重新计算所需高度。切换到其他横向窗口之后，已测得的高度仍保持一致。</template
          ></span
        >
      </template>
    </s-table>
    <p role="status">
      活动区域起点:
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
