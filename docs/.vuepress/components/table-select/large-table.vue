<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import { useRoute } from 'vue-router'
import type { TableColumn, TableRow } from 'sax-design-vue'

const route = useRoute()
const isZh = computed(() => route.path.startsWith('/zh/'))
const value = shallowRef<number>()

const columns = computed<TableColumn[]>(() => [
  { field: 'name', title: isZh.value ? '成员' : 'Member', minWidth: 160 },
  { field: 'team', title: isZh.value ? '团队' : 'Team', minWidth: 130 },
  { field: 'role', title: isZh.value ? '角色' : 'Role', minWidth: 130 },
])
const data = computed<TableRow[]>(() =>
  Array.from({ length: 10_000 }, (_, index) => ({
    id: index + 1,
    name: isZh.value ? `成员 ${index + 1}` : `Member ${index + 1}`,
    team: isZh.value ? `团队 ${(index % 24) + 1}` : `Team ${(index % 24) + 1}`,
    role:
      index % 3 === 0
        ? isZh.value
          ? '设计'
          : 'Design'
        : index % 3 === 1
          ? isZh.value
            ? '研发'
            : 'Engineering'
          : isZh.value
            ? '产品'
            : 'Product',
  })),
)
const popupConfig = { width: 620, maxHeight: 380 }
const virtualConfig = {
  height: 300,
  estimateSize: 38,
  overscan: 7,
  dynamic: true,
}
const labelFormatter = (row: TableRow) => `${row.name} · ${row.team}`
</script>

<template>
  <div class="table-select-demo">
    <s-table-select
      v-model="value"
      :data="data"
      :columns="columns"
      :virtual-config="virtualConfig"
      :popup-config="popupConfig"
      :label-formatter="labelFormatter"
      striped
      block
      :placeholder="isZh ? '从 10,000 行中选择' : 'Select from 10,000 rows'"
    />
    <p>{{ isZh ? '已选择 ID' : 'Selected ID' }}：{{ value || '-' }}</p>
  </div>
</template>

<style scoped>
.table-select-demo {
  width: min(100%, 420px);
}

.table-select-demo p {
  margin: 10px 2px 0;
  color: var(--s-text-color-secondary);
  font-size: 12px;
}
</style>
