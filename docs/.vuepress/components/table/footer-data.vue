<script setup lang="ts">
import { computed, ref } from 'vue'
import type { TableColumn, TableColumnState } from 'sax-design-vue'

const virtual = ref(false)
const multiple = ref(true)
const columnState = ref<TableColumnState[]>([])
const allRows = Array.from({ length: 60 }, (_, index) => ({
  id: index + 1,
  name: `Order ${index + 1}`,
  quantity: (index % 5) + 1,
  amount: ((index % 5) + 1) * 24,
  note:
    index % 3
      ? 'Ready for review'
      : 'Review the delivery details with the customer before dispatch.',
  state: 'Ready',
}))
const rows = computed(() => (virtual.value ? allRows : allRows.slice(0, 4)))
const footerData = computed(() => {
  const quantity = rows.value.reduce((sum, row) => sum + row.quantity, 0)
  const amount = rows.value.reduce((sum, row) => sum + row.amount, 0)
  const total = {
    kind: 'total',
    name: 'Total',
    quantity,
    amount,
    note: `All ${rows.value.length} supplied orders`,
    state: 'Calculated',
  }
  return multiple.value
    ? [
        total,
        {
          kind: 'average',
          name: 'Average',
          quantity: quantity / rows.value.length,
          amount: amount / rows.value.length,
          note: 'Per order',
          state: 'Calculated',
        },
      ]
    : [total]
})
const money = (value: unknown) =>
  Number(value).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
const columns: TableColumn[] = [
  { field: 'name', title: 'Order', width: 180, fixed: 'left' },
  {
    title: 'Order details',
    children: [
      {
        field: 'quantity',
        title: 'Quantity',
        minWidth: 120,
        align: 'right',
        footerFormatter: ({ value }) => Number(value).toFixed(1),
      },
      {
        field: 'amount',
        title: 'Amount',
        minWidth: 160,
        align: 'right',
        cell: ({ value }) => money(value),
        footerFormatter: ({ value }) => money(value),
      },
      {
        field: 'note',
        title: 'Notes',
        minWidth: 260,
        showFooterOverflow: 'tooltip',
      },
    ],
  },
  { field: 'state', title: 'State', width: 120, fixed: 'right' },
]
</script>

<template>
  <div class="footer-data-demo">
    <s-checkbox v-model="multiple">Show total and average</s-checkbox>
    <s-checkbox v-model="virtual">Virtual scrolling with 60 orders</s-checkbox>
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
