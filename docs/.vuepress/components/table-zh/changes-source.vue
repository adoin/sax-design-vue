<script setup lang="ts">
import { computed, ref, shallowRef } from 'vue'
import type {
  TableChangeConfig,
  TableColumn,
  TableExposes,
  TableVirtualSource,
} from 'sax-design-vue'

const table = ref<TableExposes>()
const values = shallowRef(new Map<number, Record<string, unknown>>())
const editing = ref(false)
const changed = ref(0)
const message = ref('离开可见窗口后，已应用的变更仍然保留。')
const column = (index: number): TableColumn =>
  index === 0
    ? { field: 'id', title: '记录', width: 100 }
    : {
        key: String(index),
        field: `value_${index}`,
        title: `列 ${index}`,
        width: 160,
        editor: true,
      }
const rowKey = (index: number) => index
const columnWidth = (index: number) => (index === 0 ? 100 : 160)
const source = computed<TableVirtualSource>(() => {
  const snapshot = values.value
  return {
    rowCount: 1_000_000,
    columnCount: 100_000,
    fixedLeftCount: 1,
    fixedRightCount: 1,
    columnWidth,
    column,
    rowKey,
    row: (index) =>
      new Proxy(
        { id: index, ...snapshot.get(index) },
        {
          get(target, key, receiver) {
            if (
              typeof key === 'string' &&
              key.startsWith('value_') &&
              !Object.hasOwn(target, key)
            )
              return `值 ${index}/${key.slice(6)}`
            return Reflect.get(target, key, receiver)
          },
        },
      ),
  }
})
const changeConfig: TableChangeConfig = {
  indexOf: (key) =>
    typeof key === 'number' &&
    Number.isInteger(key) &&
    key >= 0 &&
    key < 1_000_000
      ? key
      : -1,
  apply: ({ operations, signal }) => {
    // 此固定行数的数据源仅接受字段更新。
    if (
      signal.aborted ||
      operations.some((operation) => operation.type !== 'update')
    )
      return false
    const next = new Map(values.value)
    for (const operation of operations) {
      const fields = { ...next.get(Number(operation.rowKey)) }
      for (const patch of operation.patches) {
        if (patch.exists) fields[patch.field] = patch.value
        else Reflect.deleteProperty(fields, patch.field)
      }
      next.set(Number(operation.rowKey), fields)
    }
    values.value = next
    return true
  },
}
const refresh = () => {
  changed.value = table.value?.getChangeRecords().updated.length ?? 0
}
const revert = async () => {
  const result = await table.value?.revertChanges()
  message.value = result?.applied
    ? '已还原到业务确认的基线。'
    : '数据源拒绝了此次变更。'
}
const confirm = () => {
  const snapshot = table.value?.getChangeRecords()
  if (snapshot && table.value?.acceptChanges(snapshot.version))
    message.value = '当前修改已确认为新基线。'
}
</script>

<template>
  <div class="changes-source">
    <div class="changes-source__controls">
      <s-button size="small" @click="table?.startEdit(999_999, 99_998)"
        >编辑末行末列</s-button
      >
      <s-button size="small" :disabled="!editing" @click="table?.commitEdit()"
        >应用草稿</s-button
      >
      <s-button
        size="small"
        flat
        :disabled="!editing"
        @click="table?.cancelEdit()"
        >放弃草稿</s-button
      >
      <s-button size="small" flat :disabled="editing" @click="revert"
        >还原全部</s-button
      >
      <s-button size="small" :disabled="editing" @click="confirm"
        >确认基线</s-button
      >
      <s-tag>变更行数: {{ changed }}</s-tag>
    </div>
    <s-table
      ref="table"
      :virtual-source="source"
      :virtual-config="{ height: 300, horizontal: true, dynamic: true }"
      :change-config="changeConfig"
      edit-config
      resize-config
      @changes-change="refresh"
      @edit-start="editing = true"
      @edit-commit="editing = false"
      @edit-cancel="editing = false"
    />
    <p role="status">{{ message }}</p>
  </div>
</template>

<style scoped>
.changes-source {
  width: 100%;
}
.changes-source__controls {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
}
</style>
