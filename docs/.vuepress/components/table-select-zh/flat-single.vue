<script setup lang="ts">
import { ref } from 'vue'
import type { TableColumn, TableRowKey } from 'sax-design-vue'
const value = ref<TableRowKey | undefined>('design')
const columns: TableColumn[] = [
  { field: 'name', title: '名称' },
  { field: 'members', title: '人数' },
]
const data = [
  { id: 'design', name: '设计', members: 8 },
  { id: 'engineering', name: '研发', members: 12 },
  { id: 'archive', name: '归档（禁用）', members: 3, disabled: true },
]
</script>

<template>
  <div class="table-select-example">
    <s-table-select
      v-model="value"
      :data="data"
      :columns="columns"
      row-key="id"
      label-key="name"
      clearable
      block
      :popup-config="{ width: 360 }"
      placeholder="请选择"
    />
    <p class="table-select-example__result">
      <span>已选键</span><code>{{ value ?? '—' }}</code>
    </p>
  </div>
</template>

<style scoped>
.table-select-example {
  display: grid;
  gap: 20px;
  width: 100%;
  min-width: 0;
}
.table-select-example__result {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 8px;
  margin: 0;
}
.table-select-example__result code {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
</style>
