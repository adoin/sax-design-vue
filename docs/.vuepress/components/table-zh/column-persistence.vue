<script setup lang="ts">
const rows = [
  { id: 1, name: 'Alex', status: '进行中' },
  { id: 2, name: 'Morgan', status: '进行中' },
]
</script>

<template>
  <s-table :data="rows">
    <template #toolbar_right>
      <s-table-column-config storage-key="sax-docs-table-columns-zh-v1" />
    </template>
    <s-table-column field="id" title="编号" :width="80" />
    <s-table-column field="name" title="成员" />
    <s-table-column field="status" title="状态" />
  </s-table>
</template>
