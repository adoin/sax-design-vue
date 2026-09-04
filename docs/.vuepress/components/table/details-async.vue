<script setup lang="ts">
import { ref } from 'vue'
import type {
  TableColumn,
  TableDetailConfig,
  TableRowKey,
} from 'sax-design-vue'

const expanded = ref<TableRowKey[]>([])
const rows = [
  { id: 1, name: 'Workspace overview' },
  { id: 2, name: 'Activity summary' },
]
const columns: TableColumn[] = [
  { key: 'details', type: 'expand', width: 56 },
  { field: 'name', title: 'Report', minWidth: 240 },
]
const attempts = new Map<TableRowKey, number>()
const config: TableDetailConfig = {
  load: async ({ row, rowKey, signal }) => {
    await new Promise<void>((resolve, reject) => {
      const abort = () => {
        clearTimeout(timer)
        signal.removeEventListener('abort', abort)
        reject(new DOMException('Aborted', 'AbortError'))
      }
      const timer = setTimeout(() => {
        signal.removeEventListener('abort', abort)
        resolve()
      }, 800)
      signal.addEventListener('abort', abort, { once: true })
      if (signal.aborted) abort()
    })
    const attempt = (attempts.get(rowKey) ?? 0) + 1
    attempts.set(rowKey, attempt)
    if (rowKey === 2 && attempt === 1) throw new Error('Demo request failed')
    return `${row.name}: the latest report is ready.`
  },
}
</script>

<template>
  <s-table
    v-model:detail-expanded-keys="expanded"
    :data="rows"
    :columns="columns"
    :detail-config="config"
    row-key="id"
  >
    <template #detail="{ data, reload, close }">
      <div class="async-details">
        <p>{{ data }}</p>
        <s-button size="small" flat @click="reload">Reload report</s-button>
        <s-button size="small" transparent @click="close"
          >Close details</s-button
        >
      </div>
    </template>
  </s-table>
</template>

<style scoped>
.async-details p {
  margin: 0 0 12px;
}
</style>
