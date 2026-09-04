<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import type { TableActiveCell, TableExposes, TableRow } from 'sax-design-vue'
const table = ref<TableExposes>()
const active = shallowRef<TableActiveCell | null>(null)
const highlight = shallowRef<TableRow | null>(null)
const rows = ref([
  {
    id: 1,
    name: '工作区',
    count: 3,
    children: [{ id: 11, name: '子项目', count: 2 }],
  },
  { id: 2, name: '组件库', count: 8 },
])
</script>

<template>
  <div class="keyboard-demo">
    <div class="keyboard-demo__controls">
      <s-button size="small" @click="table?.setActiveCell(0, 0)">首格</s-button>
      <s-button size="small" flat @click="table?.clearActiveCell()"
        >清除活动格</s-button
      >
    </div>
    <s-table
      ref="table"
      v-model:active-cell="active"
      v-model:highlight="highlight"
      v-model:data="rows"
      row-key="id"
      keyboard-config
      edit-config
      change-config
      :tree-config="{}"
      :expanded-keys="[1]"
      column-manager-config
    >
      <s-table-column
        field="name"
        title="项目"
        tree-node
        fixed="left"
        :width="220"
        editor
      />
      <s-table-column field="count" title="数量" :editor="{ type: 'number' }" />
      <s-table-column field="id" title="ID" fixed="right" :width="120" />
    </s-table>
    <p role="status">
      活动格: {{ active ? `${active.rowKey} / ${active.columnKey}` : '—' }} ·
      选中行: {{ highlight?.name ?? '—' }}
    </p>
  </div>
</template>

<style scoped>
.keyboard-demo {
  width: 100%;
}
.keyboard-demo__controls {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}
.keyboard-demo > p {
  margin: 12px 0 0;
}
</style>
