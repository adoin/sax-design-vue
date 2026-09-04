<script setup lang="ts">
import { ref } from 'vue'
import type {
  TableColumn,
  TableGridExposes,
  TableGridProxyConfig,
  TableGridProxyResult,
  TableRow,
} from 'sax-design-vue'

const grid = ref<TableGridExposes>()
const highlighted = ref<TableRow | null>(null)
const editing = ref(false)
const nextId = ref(4)
const message = ref(
  'Double-click a project, apply the draft, then save to the service.',
)
let serviceRows: TableRow[] = [
  { id: 1, name: 'Workspace' },
  { id: 2, name: 'Components' },
  { id: 3, name: 'Documentation' },
]
const columns: TableColumn[] = [
  { field: 'id', title: 'ID', width: 90, fixed: 'left' },
  {
    field: 'name',
    title: 'Project',
    minWidth: 280,
    editor: true,
    rules: { required: true, message: 'Enter a project name.' },
  },
]
const pause = (signal: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    const abort = () => {
      clearTimeout(timer)
      reject(signal.reason)
    }
    const timer = setTimeout(() => {
      signal.removeEventListener('abort', abort)
      resolve()
    }, 500)
    if (signal.aborted) abort()
    else signal.addEventListener('abort', abort, { once: true })
  })
const proxyConfig: TableGridProxyConfig = {
  async query({ pager, signal }) {
    await pause(signal)
    const size = pager ? (pager.pageSize ?? 5) : serviceRows.length
    const start = pager ? ((pager.currentPage ?? 1) - 1) * size : 0
    return {
      data: serviceRows.slice(start, start + size).map((row) => ({ ...row })),
      total: serviceRows.length,
    }
  },
  async save({ changes, signal }) {
    await pause(signal)
    const removed = new Set(changes.removed.map((entry) => entry.rowKey))
    const updated = new Map(
      changes.updated.map((entry) => [entry.rowKey, entry.row]),
    )
    serviceRows = serviceRows
      .filter((row) => !removed.has(Number(row.id)))
      .map((row) => ({ ...(updated.get(Number(row.id)) ?? row) }))
    serviceRows.push(...changes.inserted.map((entry) => ({ ...entry.row })))
  },
  async delete({ rows, signal }) {
    await pause(signal)
    const keys = new Set(rows.map((row) => row.id))
    serviceRows = serviceRows.filter((row) => !keys.has(row.id))
  },
}
const report = (result: TableGridProxyResult) => {
  message.value =
    result.status === 'success'
      ? result.reload?.status === 'error'
        ? 'Saved, but reloading failed. Refresh to retry.'
        : 'The service accepted the operation.'
      : result.status === 'dirty'
        ? 'Save or revert pending changes before reloading or deleting.'
        : result.status === 'editing'
          ? 'Apply or discard the current draft first.'
          : result.status === 'invalid'
            ? 'Correct the highlighted fields before saving.'
            : result.status === 'empty'
              ? 'There are no changes or selected rows.'
              : result.status === 'cancelled'
                ? 'Request cancelled. Check the service before retrying a write.'
                : 'The operation was not applied. Your local data is preserved.'
}
const save = async () => {
  const result = await grid.value?.commitProxy('save')
  if (result) report(result)
}
const remove = async () => {
  const result = await grid.value?.commitProxy('delete')
  if (result) report(result)
}
</script>

<template>
  <div class="grid-proxy-edit-demo">
    <s-table-grid
      ref="grid"
      v-model:highlight="highlighted"
      :columns="columns"
      :proxy-config="proxyConfig"
      :pager-config="{ pageSize: 5 }"
      :edit-config="{ mode: 'row' }"
      change-config
      history-config
      validation-config
      @edit-start="editing = true"
      @edit-commit="editing = false"
      @edit-cancel="editing = false"
    >
      <template #toolbar="{ busy, getTable, cancelProxy }">
        <s-button
          :disabled="busy || editing"
          @click="
            getTable()?.insertRows([{ id: nextId++, name: 'New project' }])
          "
          >Add row</s-button
        >
        <s-button :disabled="busy || !editing" @click="getTable()?.commitEdit()"
          >Apply draft</s-button
        >
        <s-button
          flat
          :disabled="busy || !editing"
          @click="getTable()?.cancelEdit()"
          >Discard draft</s-button
        >
        <s-button :disabled="busy || editing" @click="save"
          >Save changes</s-button
        >
        <s-button
          color="danger"
          flat
          :disabled="busy || editing || !highlighted"
          @click="remove"
          >Delete selected</s-button
        >
        <s-button
          flat
          :disabled="busy || editing"
          @click="getTable()?.revertChanges()"
          >Revert changes</s-button
        >
        <s-button flat :disabled="!busy" @click="cancelProxy"
          >Cancel request</s-button
        >
      </template>
    </s-table-grid>
    <p role="status">{{ message }}</p>
  </div>
</template>
