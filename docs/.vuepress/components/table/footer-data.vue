<script setup lang="ts">
import { computed, ref } from 'vue'
import type {
  TableColumn,
  TableColumnState,
  TableFooterConfig,
} from 'sax-design-vue'

const virtual = ref(false)
const multiple = ref(true)
const columnState = ref<TableColumnState[]>([])
const allRows = Array.from({ length: 60 }, (_, index) => ({
  id: index + 1,
  name: `Order ${index + 1}`,
  quantity: (index % 5) + 1,
  amount: ['24.10', '48.20', '72.30', '96.40', '120.50'][index % 5],
  note:
    index % 3
      ? 'Ready for review'
      : 'Review the delivery details with the customer before dispatch.',
  state: 'Ready',
}))
const rows = computed(() => (virtual.value ? allRows : allRows.slice(0, 4)))
const footerConfig = computed<TableFooterConfig>(() => ({
  rows: [
    {
      values: {
        kind: 'total',
        name: 'Total',
        state: 'Calculated',
      },
      aggregates: [
        { key: 'quantity', field: 'quantity', method: 'sum' },
        { key: 'amount', field: 'amount', method: 'sum' },
        {
          key: 'note',
          method: (cells) => `All ${cells.length} supplied orders`,
        },
      ],
    },
    ...(multiple.value
      ? [
          {
            values: {
              kind: 'average',
              name: 'Average',
              note: 'Per order',
              state: 'Calculated',
            },
            aggregates: [
              { key: 'quantity', field: 'quantity', method: 'average' },
              { key: 'amount', field: 'amount', method: 'average' },
            ],
          },
        ]
      : []),
  ],
}))
const fixedDecimal = (value: unknown, digits: number) => {
  const [integer = '0', fraction = ''] = String(value ?? 0).split('.')
  return `${integer}.${fraction.padEnd(digits, '0').slice(0, digits)}`
}
const money = (value: unknown) => `$${fixedDecimal(value, 2)}`
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
        footerFormatter: ({ value }) => fixedDecimal(value, 1),
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
  {
    field: 'state',
    title: 'State',
    width: 120,
    fixed: 'right',
    slots: { footer: 'orderStateFooter' },
  },
]
</script>

<template>
  <div :class="['footer-data-demo', { 'is-virtual': virtual }]">
    <s-table
      v-model:column-state="columnState"
      :data="rows"
      :columns="columns"
      :footer-config="footerConfig"
      footer-row-key="kind"
      :virtual-config="
        virtual ? { height: 'auto', horizontal: true, dynamic: true } : false
      "
      :toolbar-config="{ right: [{ itemRender: '$columnConfig' }] }"
      resize-config
      row-key="id"
    >
      <template #toolbar_left>
        <s-checkbox v-model="multiple">Show total and average</s-checkbox>
        <s-checkbox v-model="virtual"
          >Virtual scrolling with 60 orders</s-checkbox
        >
      </template>
      <template #orderStateFooter="{ row }"
        ><s-tag>{{ row.state }}</s-tag></template
      >
    </s-table>
  </div>
</template>

<style scoped>
.footer-data-demo {
  width: 100%;
}

.footer-data-demo.is-virtual {
  height: min(440px, 70vh);
}
</style>
