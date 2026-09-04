<script setup lang="ts">
const rows = [
  { id: 1, name: 'Alex', status: '进行中' },
  { id: 2, name: 'Morgan', status: '进行中' },
]
</script>

<template>
  <s-table
    :data="rows"
    :column-manager-config="{ storageKey: 'sax-docs-table-columns-zh-v1' }"
  >
    <s-table-column field="id" title="编号" :width="80" />
    <s-table-column field="name" title="成员" />
    <s-table-column field="status" title="状态" />
  </s-table>
</template>
