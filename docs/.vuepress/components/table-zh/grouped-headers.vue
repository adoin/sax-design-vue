<script setup lang="ts">
import { computed, ref } from 'vue'
import type { TableColumn, TableColumnState } from 'sax-design-vue'

const virtual = ref(false)
const columnState = ref<TableColumnState[]>([])
const rows = Array.from({ length: 100 }, (_, index) => ({
  id: index + 1,
  name: `成员 ${index + 1}`,
  team: index % 2 ? '研发' : '设计',
  city: index % 2 ? '伦敦' : '巴黎',
  notes:
    index % 3
      ? '可参与评审'
      : '正在跨团队协作准备下个版本，可参与设计和实现评审。',
  status: '在职',
}))
const columns: TableColumn[] = [
  { field: 'id', title: '编号', width: 72, fixed: 'left' },
  {
    title: '成员资料',
    children: [
      { field: 'name', title: '姓名', minWidth: 160, sortable: true },
      {
        title: '组织信息',
        children: [
          {
            field: 'team',
            title: '部门',
            minWidth: 150,
            filters: [
              { label: '设计', value: '设计' },
              { label: '研发', value: '研发' },
            ],
          },
          { field: 'city', title: '城市', minWidth: 140 },
        ],
      },
    ],
  },
  { field: 'notes', title: '备注', minWidth: 260 },
  { field: 'status', title: '状态', width: 110, fixed: 'right' },
]
const visibleRows = computed(() => (virtual.value ? rows : rows.slice(0, 5)))
</script>

<template>
  <div class="grouped-demo">
    <s-checkbox v-model="virtual">虚拟滚动与动态行高</s-checkbox>
    <s-button size="small" flat @click="columnState = []">重置列设置</s-button>
    <s-table
      v-model:column-state="columnState"
      :data="visibleRows"
      :columns="columns"
      :virtual-config="
        virtual
          ? { height: 280, horizontal: true, dynamic: true, columnOverscan: 1 }
          : false
      "
      column-manager-config
      resize-config
      row-key="id"
    />
  </div>
</template>

<style scoped>
.grouped-demo {
  width: 100%;
}
.grouped-demo > .s-table-wrapper {
  margin-top: 16px;
}
</style>
