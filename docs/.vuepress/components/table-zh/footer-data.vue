<script setup lang="ts">
import { computed, ref } from 'vue'
import type { TableColumn, TableColumnState } from 'sax-design-vue'

const virtual = ref(false)
const multiple = ref(true)
const columnState = ref<TableColumnState[]>([])
const allRows = Array.from({ length: 60 }, (_, index) => ({
  id: index + 1,
  name: `订单 ${index + 1}`,
  quantity: (index % 5) + 1,
  amount: ((index % 5) + 1) * 24,
  note: index % 3 ? '待评审' : '发货前请与客户确认交付详情。',
  state: '就绪',
}))
const rows = computed(() => (virtual.value ? allRows : allRows.slice(0, 4)))
const footerData = computed(() => {
  const quantity = rows.value.reduce((sum, row) => sum + row.quantity, 0)
  const amount = rows.value.reduce((sum, row) => sum + row.amount, 0)
  const total = {
    kind: 'total',
    name: '合计',
    quantity,
    amount,
    note: `传入的全部 ${rows.value.length} 笔订单`,
    state: '已计算',
  }
  return multiple.value
    ? [
        total,
        {
          kind: 'average',
          name: '平均值',
          quantity: quantity / rows.value.length,
          amount: amount / rows.value.length,
          note: '每笔订单',
          state: '已计算',
        },
      ]
    : [total]
})
const money = (value: unknown) =>
  Number(value).toLocaleString('zh-CN', { style: 'currency', currency: 'CNY' })
const columns: TableColumn[] = [
  { field: 'name', title: '订单', width: 180, fixed: 'left' },
  {
    title: '订单明细',
    children: [
      {
        field: 'quantity',
        title: '数量',
        minWidth: 120,
        align: 'right',
        footerFormatter: ({ value }) => Number(value).toFixed(1),
      },
      {
        field: 'amount',
        title: '金额',
        minWidth: 160,
        align: 'right',
        cell: ({ value }) => money(value),
        footerFormatter: ({ value }) => money(value),
      },
      {
        field: 'note',
        title: '备注',
        minWidth: 260,
        showFooterOverflow: 'tooltip',
      },
    ],
  },
  { field: 'state', title: '状态', width: 120, fixed: 'right' },
]
</script>

<template>
  <div class="footer-data-demo">
    <s-checkbox v-model="multiple">显示合计与平均值</s-checkbox>
    <s-checkbox v-model="virtual">虚拟滚动（60 笔订单）</s-checkbox>
    <s-table
      v-model:column-state="columnState"
      :data="rows"
      :columns="columns"
      :footer-data="footerData"
      footer-row-key="kind"
      :virtual-config="
        virtual ? { height: 240, horizontal: true, dynamic: true } : false
      "
      column-manager-config
      resize-config
      row-key="id"
    >
      <template #footer-state="{ row }"
        ><s-tag>{{ row.state }}</s-tag></template
      >
    </s-table>
  </div>
</template>

<style scoped>
.footer-data-demo {
  width: 100%;
}
.footer-data-demo > .s-table-wrapper {
  margin-top: 16px;
}
</style>
