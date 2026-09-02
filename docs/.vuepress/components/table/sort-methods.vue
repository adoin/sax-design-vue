<script setup lang="ts">
import { ref } from 'vue'
import type { TableColumn, TableSort } from 'sax-design-vue'

const sorts = ref<TableSort[]>([])
const rows = ['10', '2', '30', '2'].map((value, id) => ({
  id,
  numeric: value,
  text: value,
  predicate: value,
  binary: value,
}))
const columns: TableColumn[] = [
  { field: 'numeric', title: 'Number', sortable: true, sortMethod: 'number' },
  { field: 'text', title: 'String', sortable: true, sortMethod: 'string' },
  {
    field: 'predicate',
    title: 'Boolean function',
    sortable: true,
    sortMethod: (a, b) => Number(a) > Number(b),
  },
  {
    field: 'binary',
    title: '0 / 1 function',
    sortable: true,
    sortMethod: (a, b) => (Number(a) > Number(b) ? 1 : 0),
  },
]
</script>

<template>
  <div class="sort-methods-example">
    <s-button size="small" type="flat" @click="sorts = []"
      >Reset order</s-button
    >
    <p>
      Each column contains the same numeric strings. Compare ascending Number
      (2, 2, 10, 30) with String (10, 2, 2, 30); both functions match Number.
    </p>
    <s-table v-model:sort-by="sorts" :data="rows" :columns="columns" striped />
  </div>
</template>

<style scoped>
.sort-methods-example {
  width: 100%;
}
.sort-methods-example p {
  margin: 12px 0 16px;
  font-size: 0.85rem;
}
</style>
