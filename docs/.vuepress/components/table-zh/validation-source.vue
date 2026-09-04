<script setup lang="ts">
import { onBeforeUnmount, ref, shallowRef } from 'vue'
import type {
  TableExposes,
  TableValidationResult,
  TableVirtualSource,
} from 'sax-design-vue'

const table = ref<TableExposes>()
const busy = shallowRef(false)
const message = shallowRef('可直接定位末端错误，也可扫描指定列并随时取消。')
let controller: AbortController | undefined
const source: TableVirtualSource = {
  rowCount: 1_000_000,
  columnCount: 100_000,
  fixedLeftCount: 1,
  fixedRightCount: 1,
  columnWidth: (index) => (index === 0 ? 100 : 180),
  rowKey: (index) => index,
  row: (index) =>
    new Proxy(
      { id: index },
      {
        get(target, key, receiver) {
          if (typeof key === 'string' && key.startsWith('value_'))
            return index === 999_999 && key === 'value_99998'
              ? ''
              : `值 ${index}/${key.slice(6)}`
          return Reflect.get(target, key, receiver)
        },
      },
    ),
  column: (index) =>
    index === 0
      ? { field: 'id', title: '记录', width: 100 }
      : {
          key: String(index),
          field: `value_${index}`,
          title: `列 ${index}`,
          width: 180,
        },
}
const rules = { value_99998: { required: true, message: '此记录缺少必填值。' } }
const report = (result: TableValidationResult) => {
  message.value = result.cancelled
    ? '扫描已取消，先前的校验结果保留。'
    : `已检查 ${result.checked} 个单元格，发现 ${result.errors.length} 处错误。`
}
const check = async (scan: boolean) => {
  controller?.abort()
  const request = new AbortController()
  controller = request
  busy.value = true
  message.value = '正在校验…'
  try {
    const result = scan
      ? await table.value?.validate({
          columns: [99_998],
          signal: request.signal,
          maxErrors: 10,
        })
      : await table.value?.validateCell(999_999, 99_998, {
          signal: request.signal,
        })
    if (result && controller === request) report(result)
  } finally {
    if (controller === request) {
      busy.value = false
      controller = undefined
    }
  }
}
onBeforeUnmount(() => controller?.abort())
</script>

<template>
  <div class="validation-source">
    <div class="validation-source__controls">
      <s-button size="small" :disabled="busy" @click="check(false)"
        >校验末端单元格</s-button
      >
      <s-button size="small" flat :disabled="busy" @click="check(true)"
        >扫描指定列</s-button
      >
      <s-button size="small" flat :disabled="!busy" @click="controller?.abort()"
        >取消扫描</s-button
      >
      <s-button
        size="small"
        flat
        :disabled="busy"
        @click="table?.clearValidation()"
        >清除提示</s-button
      >
    </div>
    <s-table
      ref="table"
      :virtual-source="source"
      :validation-rules="rules"
      :virtual-config="{ height: 300, horizontal: true, dynamic: true }"
      resize-config
    />
    <p role="status">{{ message }}</p>
  </div>
</template>

<style scoped>
.validation-source {
  width: 100%;
}
.validation-source__controls {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
}
.validation-source > p {
  margin: 12px 0 0;
}
</style>
