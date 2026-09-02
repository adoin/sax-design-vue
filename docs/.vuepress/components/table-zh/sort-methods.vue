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
  { field: 'numeric', title: '数字排序', sortable: true, sortMethod: 'number' },
  { field: 'text', title: '字符串排序', sortable: true, sortMethod: 'string' },
  {
    field: 'predicate',
    title: '布尔函数',
    sortable: true,
    sortMethod: (a, b) => Number(a) > Number(b),
  },
  {
    field: 'binary',
    title: '0 / 1 函数',
    sortable: true,
    sortMethod: (a, b) => (Number(a) > Number(b) ? 1 : 0),
  },
]
</script>

<template>
  <div class="sort-methods-example">
    <s-button size="small" type="flat" @click="sorts = []"
      >恢复原始顺序</s-button
    >
    <p>
      四列都是相同的数字字符串。升序时，数字列为 2、2、10、30，字符串列为
      10、2、2、30；两种函数与数字列结果一致。
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
