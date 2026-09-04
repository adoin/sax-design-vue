<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import type {
  TableContextMenuConfig,
  TableContextMenuSelectParams,
  TableExposes,
} from 'sax-design-vue'
const table = ref<TableExposes>()
const locked = shallowRef(false)
const message = shallowRef('Right-click or press Shift + F10 to open a menu.')
const rows = ref([
  {
    id: 1,
    name: 'Workspace',
    count: 3,
    children: [{ id: 11, name: 'Child project', count: 2 }],
  },
  { id: 2, name: 'Components', count: 8 },
])
const menu: TableContextMenuConfig = {
  header: (context) => [
    {
      label: 'Sort ascending',
      value: 'sort',
      disabled:
        context.area !== 'header' ||
        context.group ||
        !context.column.sortable ||
        locked.value,
    },
  ],
  body: (context) => [
    { label: 'Inspect record', value: 'inspect', disabled: locked.value },
    {
      label: 'Edit cell',
      value: 'edit',
      disabled: locked.value || context.column.field !== 'name',
    },
  ],
  footer: () => [
    {
      label: 'Inspect summary',
      value: 'summary',
      keepOpen: true,
      disabled: locked.value,
    },
  ],
}
const selected = ({ context, item }: TableContextMenuSelectParams) => {
  message.value = `${item.label} · ${context.column.title}${context.area === 'body' ? ` / ${context.rowKey}` : ''}`
  if (item.value === 'sort' && context.column.field)
    table.value?.setSort([{ field: context.column.field, order: 'asc' }])
  if (item.value === 'edit' && context.area === 'body')
    table.value?.startEdit(context.row, context.columnIndex)
}
</script>

<template>
  <div class="table-menu-demo">
    <div class="table-menu-demo__controls">
      <s-checkbox v-model="locked">Disable menu actions</s-checkbox>
      <s-button size="small" @click="table?.commitEdit()">Save draft</s-button>
      <s-button size="small" flat @click="table?.cancelEdit()"
        >Discard draft</s-button
      >
    </div>
    <s-table
      ref="table"
      v-model:data="rows"
      row-key="id"
      keyboard-config
      edit-config
      change-config
      :context-menu-config="menu"
      :tree-config="{}"
      :expanded-keys="[1]"
      :footer-data="[{ name: 'Inspect summary', count: 13 }]"
      @context-menu-select="selected"
    >
      <s-table-column title="Project">
        <template #columns>
          <s-table-column
            field="name"
            title="Project"
            tree-node
            sortable
            editor
            fixed="left"
            :width="240"
          />
          <s-table-column field="count" title="Quantity" sortable />
        </template>
      </s-table-column>
      <s-table-column field="id" title="ID" fixed="right" :width="100" />
    </s-table>
    <p role="status">{{ message }}</p>
  </div>
</template>

<style scoped>
.table-menu-demo {
  width: 100%;
}
.table-menu-demo__controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}
.table-menu-demo > p {
  margin: 12px 0 0;
}
</style>
