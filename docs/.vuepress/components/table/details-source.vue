<script setup lang="ts">
import { ref } from 'vue'
import type {
  TableExposes,
  TableRowKey,
  TableVirtualSource,
} from 'sax-design-vue'

const table = ref<TableExposes>()
const expanded = ref<TableRowKey[]>(['row-0'])
const showMore = ref(true)
const source: TableVirtualSource = {
  rowCount: 1_000_000,
  columnCount: 100_000,
  fixedLeftCount: 1,
  fixedRightCount: 1,
  columnWidth: (index) => (index === 0 ? 56 : 140),
  rowKey: (index) => `row-${index}`,
  row: (index) => ({ id: index, name: `Record ${index + 1}` }),
  column: (index) =>
    index === 0
      ? { key: 'details', type: 'expand', width: 56 }
      : { field: 'name', title: `Column ${index}`, width: 140 },
}
const jump = async () => {
  await table.value?.toggleRowDetail(999_999, true)
  await table.value?.scrollToRow(999_999, 'end')
  await table.value?.scrollToColumn(99_998, 'end')
}
</script>

<template>
  <div class="source-details">
    <div class="source-details__controls">
      <s-button size="small" @click="jump">Open last record</s-button>
      <s-button size="small" flat @click="expanded = []"
        >Close all details</s-button
      >
      <s-checkbox v-model="showMore">Longer details</s-checkbox>
    </div>
    <s-table
      ref="table"
      v-model:detail-expanded-keys="expanded"
      :virtual-source="source"
      :virtual-config="{ height: 320, horizontal: true }"
      detail-config
      resize-config
    >
      <template #detail="{ row, close }">
        <div class="source-details__panel">
          <strong>{{ row.name }}</strong>
          <p>
            The detail panel follows the visible table width while the columns
            scroll horizontally.
          </p>
          <p v-if="showMore">
            Additional content can change the row height. Expand another record,
            jump across the table or hide this paragraph to update the measured
            height.
          </p>
          <s-button size="small" flat @click="close">Close details</s-button>
        </div>
      </template>
    </s-table>
  </div>
</template>

<style scoped>
.source-details {
  width: 100%;
}
.source-details__controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}
.source-details__panel p {
  margin: 12px 0;
  line-height: 1.7;
}
</style>
