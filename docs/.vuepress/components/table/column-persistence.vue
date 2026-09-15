<script setup lang="ts">
const rows = [
  { id: 1, name: 'Alex', status: 'In progress' },
  { id: 2, name: 'Morgan', status: 'In progress' },
]
</script>

<template>
  <s-table :data="rows">
    <template #toolbar_right>
      <s-table-column-config storage-key="sax-docs-table-columns-en-v1" />
    </template>
    <s-table-column field="id" title="ID" :width="80" />
    <s-table-column field="name" title="Member" />
    <s-table-column field="status" title="Status" />
  </s-table>
</template>
