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
const message = ref('双击项目，应用草稿后再保存到服务。')
let serviceRows: TableRow[] = [
  { id: 1, name: '工作区' },
  { id: 2, name: '组件库' },
  { id: 3, name: '文档' },
]
const columns: TableColumn[] = [
  { field: 'id', title: 'ID', width: 90, fixed: 'left' },
  {
    field: 'name',
    title: '项目',
    minWidth: 280,
    editor: true,
    rules: { required: true, message: '请输入项目名称。' },
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
        ? '已保存，但重新加载失败，可刷新重试。'
        : '服务已接受此次操作。'
      : result.status === 'dirty'
        ? '重新加载或删除前，请先保存或还原待提交变更。'
        : result.status === 'editing'
          ? '请先应用或放弃当前草稿。'
          : result.status === 'invalid'
            ? '请修正标记的字段后再保存。'
            : result.status === 'empty'
              ? '没有待保存的变更或选中的行。'
              : result.status === 'cancelled'
                ? '请求已取消，重试写入前请核对服务端状态。'
                : '操作未应用，本地数据已保留。'
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
          @click="getTable()?.insertRows([{ id: nextId++, name: '新项目' }])"
          >新增行</s-button
        >
        <s-button :disabled="busy || !editing" @click="getTable()?.commitEdit()"
          >应用草稿</s-button
        >
        <s-button
          flat
          :disabled="busy || !editing"
          @click="getTable()?.cancelEdit()"
          >放弃草稿</s-button
        >
        <s-button :disabled="busy || editing" @click="save">保存变更</s-button>
        <s-button
          color="danger"
          flat
          :disabled="busy || editing || !highlighted"
          @click="remove"
          >删除选中行</s-button
        >
        <s-button
          flat
          :disabled="busy || editing"
          @click="getTable()?.revertChanges()"
          >还原变更</s-button
        >
        <s-button flat :disabled="!busy" @click="cancelProxy"
          >取消请求</s-button
        >
      </template>
    </s-table-grid>
    <p role="status">{{ message }}</p>
  </div>
</template>
