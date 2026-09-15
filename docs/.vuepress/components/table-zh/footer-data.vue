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
  name: `订单 ${index + 1}`,
  quantity: (index % 5) + 1,
  amount: ['24.10', '48.20', '72.30', '96.40', '120.50'][index % 5],
  note: index % 3 ? '待评审' : '发货前请与客户确认交付详情。',
  state: '就绪',
}))
const rows = computed(() => (virtual.value ? allRows : allRows.slice(0, 4)))
const footerConfig = computed<TableFooterConfig>(() => ({
  rows: [
    {
      values: {
        kind: 'total',
        name: '合计',
        state: '已计算',
      },
      aggregates: [
        { key: 'quantity', field: 'quantity', method: 'sum' },
        { key: 'amount', field: 'amount', method: 'sum' },
        {
          key: 'note',
          method: (cells) => `传入的全部 ${cells.length} 笔订单`,
        },
      ],
    },
    ...(multiple.value
      ? [
          {
            values: {
              kind: 'average',
              name: '平均值',
              note: '每笔订单',
              state: '已计算',
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
const money = (value: unknown) => `¥${fixedDecimal(value, 2)}`
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
        footerFormatter: ({ value }) => fixedDecimal(value, 1),
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
  {
    field: 'state',
    title: '状态',
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
        <s-checkbox v-model="multiple">显示合计与平均值</s-checkbox>
        <s-checkbox v-model="virtual">虚拟滚动（60 笔订单）</s-checkbox>
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
