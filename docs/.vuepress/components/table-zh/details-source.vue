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
  row: (index) => ({ id: index, name: `记录 ${index + 1}` }),
  column: (index) =>
    index === 0
      ? { key: 'details', type: 'expand', width: 56 }
      : { field: 'name', title: `列 ${index}`, width: 140 },
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
      <s-button size="small" @click="jump">展开最后一条</s-button>
      <s-button size="small" flat @click="expanded = []">收起全部详情</s-button>
      <s-checkbox v-model="showMore">显示较长详情</s-checkbox>
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
          <p>横向滚动列时，详情面板保持与表格可见区域等宽。</p>
          <p v-if="showMore">
            追加内容会改变行高。可以展开其他记录、跳转到表格远端，或隐藏本段文字，查看高度更新。
          </p>
          <s-button size="small" flat @click="close">收起详情</s-button>
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
