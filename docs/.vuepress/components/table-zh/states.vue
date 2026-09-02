<script setup lang="ts">
import { ref } from 'vue'
import type { TableColumn, TableFlatRow } from 'sax-design-vue'
const loading = ref(false)
const empty = ref(false)
const showHeader = ref(true)
const rows = [
  { id: 1, member: { name: '林晓' }, status: '正常', attention: false },
  { id: 2, member: { name: '陈屿' }, status: '待检查', attention: true },
]
const columns: TableColumn[] = [
  { field: 'id', title: '#', width: 70 },
  { field: 'member.name', title: '成员（嵌套字段）' },
  { field: 'status', title: '状态' },
]
const rowClass = ({ row }: TableFlatRow) =>
  row.attention ? 'attention-row' : ''
</script>

<template>
  <div class="states-example">
    <div class="table-controls">
      <span class="state-control"
        >加载中<s-switch v-model="loading" aria-label="加载中"
      /></span>
      <span class="state-control"
        >空数据<s-switch v-model="empty" aria-label="空数据"
      /></span>
      <span class="state-control"
        >显示表头<s-switch v-model="showHeader" aria-label="显示表头"
      /></span>
    </div>
    <s-table
      :data="empty ? [] : rows"
      :columns="columns"
      :loading="loading"
      :show-header="showHeader"
      :row-class="rowClass"
    >
      <template #header><strong>成员检查清单</strong></template>
      <template #footer>记录数: {{ empty ? 0 : rows.length }}</template>
      <template #notFound>
        <div class="empty-content">
          <span>当前没有记录</span
          ><s-button size="small" type="flat" @click="empty = false"
            >恢复示例数据</s-button
          >
        </div>
      </template>
    </s-table>
  </div>
</template>

<style scoped>
.states-example {
  width: 100%;
}
.table-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 20px;
  margin-bottom: 16px;
}
.state-control {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.empty-content {
  display: flex;
  align-items: center;
  gap: 12px;
}
:deep(.attention-row) {
  --s-table-row-surface: color-mix(
    in srgb,
    hsl(var(--sax-warn)) 12%,
    hsl(var(--sax-background))
  );
}
</style>
