<script setup lang="ts">
import { ref } from 'vue'
import type { TableEditEndParams, TableExposes } from 'sax-design-vue'

const table = ref<TableExposes>()
const rows = ref([
  { id: 1, name: '设计评审', priority: 'normal' },
  { id: 2, name: '发布清单', priority: 'high' },
])
const pending = ref(false)
const options = [
  { label: '普通', value: 'normal' },
  { label: '高', value: 'high' },
]
const save = ({ rowKey, updatedRow }: TableEditEndParams) => {
  rows.value = rows.value.map((row) =>
    row.id === rowKey ? (updatedRow as typeof row) : row,
  )
  pending.value = false
}
</script>

<template>
  <s-table
    ref="table"
    :data="rows"
    :edit-config="{ mode: 'row', trigger: 'manual' }"
    row-key="id"
    @edit-start="pending = true"
    @edit-commit="save"
    @edit-cancel="pending = false"
  >
    <template #header>
      <s-button size="small" :disabled="!pending" @click="table?.commitEdit()"
        >保存整行</s-button
      >
      <s-button
        size="small"
        flat
        :disabled="!pending"
        @click="table?.cancelEdit()"
        >取消</s-button
      >
    </template>
    <s-table-column field="name" title="任务" :min-width="230" editor>
      <template #default="{ value }"
        ><strong>{{ value }}</strong></template
      >
      <template #edit="{ value, setValue }"
        ><s-input
          :model-value="String(value ?? '')"
          label="任务名称"
          block
          @update:model-value="setValue"
      /></template>
    </s-table-column>
    <s-table-column field="priority" title="优先级" :width="180" editor>
      <template #default="{ value }"
        ><s-tag>{{ value === 'high' ? '高' : '普通' }}</s-tag></template
      >
      <template #edit="{ value, setValue }"
        ><s-select
          :model-value="String(value)"
          :options="options"
          label="任务优先级"
          block
          @update:model-value="setValue"
      /></template>
    </s-table-column>
    <s-table-column title="操作" :width="110" fixed="right">
      <template #default="{ row }"
        ><s-button size="small" flat @click.stop="table?.startEdit(row, 'name')"
          >编辑</s-button
        ></template
      >
    </s-table-column>
  </s-table>
</template>
