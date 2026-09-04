<script setup lang="ts">
const rows = [
  { name: 'Design review', hours: 3, amount: 240 },
  { name: 'Implementation', hours: 5, amount: 400 },
]
const totals = [{ name: 'Total', hours: 8, amount: 640 }]
const money = (value: unknown) =>
  Number(value).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
</script>

<template>
  <s-table :data="rows" :footer-data="totals" row-key="name" resize-config>
    <s-table-column field="name" title="Service" :min-width="180">
      <template #footer="{ value }"
        ><strong>{{ value }}</strong></template
      >
    </s-table-column>
    <s-table-column
      field="hours"
      title="Hours"
      :min-width="120"
      align="right"
      footer-align="right"
    />
    <s-table-column
      field="amount"
      title="Amount"
      :min-width="160"
      align="right"
    >
      <template #default="{ value }">{{ money(value) }}</template>
      <template #footer="{ value }"
        ><strong>{{ money(value) }}</strong></template
      >
    </s-table-column>
    <template #footer>Amounts include all supplied services.</template>
  </s-table>
</template>
