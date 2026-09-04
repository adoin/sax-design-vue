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
const message = ref('Edits remain available after leaving the visible window.')
const column = (index: number): TableColumn =>
  index === 0
    ? { field: 'id', title: 'Record', width: 100 }
    : {
        key: String(index),
        field: `value_${index}`,
        title: `Column ${index}`,
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
              return `Value ${index}/${key.slice(6)}`
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
    // This fixed-size source accepts field updates only.
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
    ? 'Changes reverted to the confirmed baseline.'
    : 'The source rejected the proposal.'
}
const confirm = () => {
  const snapshot = table.value?.getChangeRecords()
  if (snapshot && table.value?.acceptChanges(snapshot.version))
    message.value = 'Current edits are the new confirmed baseline.'
}
</script>

<template>
  <div class="changes-source">
    <div class="changes-source__controls">
      <s-button size="small" @click="table?.startEdit(999_999, 99_998)"
        >Edit last record</s-button
      >
      <s-button size="small" :disabled="!editing" @click="table?.commitEdit()"
        >Apply draft</s-button
      >
      <s-button
        size="small"
        flat
        :disabled="!editing"
        @click="table?.cancelEdit()"
        >Discard draft</s-button
      >
      <s-button size="small" flat :disabled="editing" @click="revert"
        >Revert all</s-button
      >
      <s-button size="small" :disabled="editing" @click="confirm"
        >Confirm baseline</s-button
      >
      <s-tag>Changed rows: {{ changed }}</s-tag>
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
