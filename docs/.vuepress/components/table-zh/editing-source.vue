<script setup lang="ts">
import { computed, ref, shallowRef } from 'vue'
import type {
  TableColumn,
  TableEditEndParams,
  TableExposes,
  TableVirtualSource,
} from 'sax-design-vue'

const table = ref<TableExposes>()
const saved = shallowRef(new Map<number, Record<string, unknown>>())
const pending = ref(false)
const count = computed(() =>
  [...saved.value.values()].reduce(
    (sum, fields) => sum + Object.keys(fields).length,
    0,
  ),
)
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
const source = computed<TableVirtualSource>(() => {
  const snapshot = saved.value
  return {
    rowCount: 1_000_000,
    columnCount: 100_000,
    fixedLeftCount: 1,
    fixedRightCount: 1,
    columnWidth: (index) => (index === 0 ? 100 : 160),
    column,
    rowKey: (index) => index,
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
const save = ({ rowKey, changes }: TableEditEndParams) => {
  const next = new Map(saved.value)
  const fields = { ...next.get(Number(rowKey)) }
  for (const { field, value } of changes) fields[field] = value
  if (changes.length) next.set(Number(rowKey), fields)
  saved.value = next
  pending.value = false
}
</script>

<template>
  <div class="editing-source">
    <div class="editing-source__controls">
      <s-button size="small" @click="table?.startEdit(999_999, 99_998)"
        >编辑最后一条</s-button
      >
      <s-button size="small" :disabled="!pending" @click="table?.commitEdit()"
        >保存</s-button
      >
      <s-button
        size="small"
        flat
        :disabled="!pending"
        @click="table?.cancelEdit()"
        >取消</s-button
      >
      <s-tag>已保存 {{ count }} 个单元格</s-tag>
    </div>
    <s-table
      ref="table"
      :virtual-source="source"
      :virtual-config="{ height: 300, horizontal: true }"
      edit-config
      resize-config
      @edit-start="pending = true"
      @edit-commit="save"
      @edit-cancel="pending = false"
    />
  </div>
</template>

<style scoped>
.editing-source {
  width: 100%;
}
.editing-source__controls {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
}
</style>
