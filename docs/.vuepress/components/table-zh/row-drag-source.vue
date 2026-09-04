<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import type {
  TableExposes,
  TableRowReorderRequest,
  TableVirtualSource,
} from 'sax-design-vue'
const table = ref<TableExposes>()
const order = new Map<number, number>()
const keyAt = (index: number) => order.get(index) ?? index
const count = 1_000_000
const createSource = (): TableVirtualSource => {
  return {
    rowCount: count,
    columnCount: 100_000,
    fixedLeftCount: 1,
    fixedRightCount: 1,
    rowKey: keyAt,
    row: (index) => ({ id: keyAt(index), name: `记录 ${keyAt(index)}` }),
    column: (index) => ({
      key: String(index),
      field: index === 0 ? 'name' : 'id',
      title: index === 0 ? '记录' : `列 ${index}`,
      width: index === 0 ? 220 : 140,
      dragSort: index === 0,
    }),
    columnWidth: (index) => (index === 0 ? 220 : 140),
  }
}
const source = shallowRef(createSource())
const message = ref('适配器仅记录变化的位置。拖至窗口边缘并停留可自动滚动。')
const apply = async ({
  oldIndex,
  newIndex,
  signal,
}: TableRowReorderRequest) => {
  // Build only the affected interval, yielding for long moves; commit atomically.
  const updates: [number, number][] = []
  const step = oldIndex < newIndex ? 1 : -1
  const key = keyAt(oldIndex)
  for (let index = oldIndex; index !== newIndex; index += step) {
    if (signal.aborted) return false
    updates.push([index, keyAt(index + step)])
    if (updates.length % 500 === 0)
      await new Promise((resolve) => setTimeout(resolve, 0))
  }
  if (signal.aborted) return false
  updates.push([newIndex, key])
  for (const [index, value] of updates) {
    if (index === value) order.delete(index)
    else order.set(index, value)
  }
  source.value = createSource()
  message.value = `已将记录 ${key} 从 ${oldIndex} 移至 ${newIndex}，缓存位置数：${order.size}。`
  return true
}
</script>

<template>
  <div class="row-drag-source-demo">
    <div class="row-drag-source-demo__controls">
      <s-button size="small" @click="table?.scrollToColumn(99998, 'end')"
        >末列</s-button
      >
      <s-button size="small" @click="table?.scrollToRow(0, 'start')"
        >首行</s-button
      >
      <s-button size="small" @click="table?.scrollToRow(count - 1, 'end')"
        >末行</s-button
      >
      <s-button size="small" flat @click="table?.cancelRowDrag()"
        >取消</s-button
      >
    </div>
    <s-table
      ref="table"
      :virtual-source="source"
      :virtual-config="{ height: 280, dynamic: true, horizontal: true }"
      :row-drag-config="{ apply }"
    />
    <p role="status">{{ message }}</p>
  </div>
</template>

<style scoped>
.row-drag-source-demo {
  width: 100%;
}
.row-drag-source-demo__controls {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}
.row-drag-source-demo > p {
  margin: 12px 0 0;
}
</style>
