<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import type {
  TableContextMenuConfig,
  TableContextMenuSelectParams,
  TableExposes,
} from 'sax-design-vue'
const table = ref<TableExposes>()
const locked = shallowRef(false)
const message = shallowRef('右键或按 Shift + F10 打开菜单。')
const rows = ref([
  {
    id: 1,
    name: '工作区',
    count: 3,
    children: [{ id: 11, name: '子项目', count: 2 }],
  },
  { id: 2, name: '组件库', count: 8 },
])
const menu: TableContextMenuConfig = {
  header: (context) => [
    {
      label: '升序排序',
      value: 'sort',
      disabled:
        context.area !== 'header' ||
        context.group ||
        !context.column.sortable ||
        locked.value,
    },
  ],
  body: (context) => [
    { label: '查看记录', value: 'inspect', disabled: locked.value },
    {
      label: '编辑此单元格',
      value: 'edit',
      disabled: locked.value || context.column.field !== 'name',
    },
  ],
  footer: () => [
    {
      label: '查看汇总',
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
      <s-checkbox v-model="locked">禁用菜单操作</s-checkbox>
      <s-button size="small" @click="table?.commitEdit()">保存草稿</s-button>
      <s-button size="small" flat @click="table?.cancelEdit()"
        >放弃草稿</s-button
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
      :footer-data="[{ name: '查看汇总', count: 13 }]"
      @context-menu-select="selected"
    >
      <s-table-column title="项目">
        <template #columns>
          <s-table-column
            field="name"
            title="项目"
            tree-node
            sortable
            editor
            fixed="left"
            :width="240"
          />
          <s-table-column field="count" title="数量" sortable />
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
