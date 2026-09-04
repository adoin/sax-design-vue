<script setup lang="ts">
const rows = [
  { name: '设计评审', hours: 3, amount: 240 },
  { name: '实现开发', hours: 5, amount: 400 },
]
const totals = [{ name: '合计', hours: 8, amount: 640 }]
const money = (value: unknown) =>
  Number(value).toLocaleString('zh-CN', { style: 'currency', currency: 'CNY' })
</script>

<template>
  <s-table :data="rows" :footer-data="totals" row-key="name" resize-config>
    <s-table-column field="name" title="服务" :min-width="180">
      <template #footer="{ value }"
        ><strong>{{ value }}</strong></template
      >
    </s-table-column>
    <s-table-column
      field="hours"
      title="工时"
      :min-width="120"
      align="right"
      footer-align="right"
    />
    <s-table-column field="amount" title="金额" :min-width="160" align="right">
      <template #default="{ value }">{{ money(value) }}</template>
      <template #footer="{ value }"
        ><strong>{{ money(value) }}</strong></template
      >
    </s-table-column>
    <template #footer>金额包含传入的全部服务。</template>
  </s-table>
</template>
