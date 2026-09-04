<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import type {
  TableColumn,
  TableEditEndParams,
  TableExposes,
  TableValidationContext,
  TableValidationResult,
} from 'sax-design-vue'

const table = ref<TableExposes>()
const editing = shallowRef(false)
const busy = shallowRef(false)
const message = shallowRef('选择编辑首行，或先检查现有数据。')
const rows = ref([
  { id: 1, name: '', seats: 0, code: 'A-100' },
  { id: 2, name: 'admin', seats: 4, code: 'B-200' },
  { id: 3, name: 'Alex', seats: 8, code: 'C-300' },
])
const checkName = async ({ value, signal }: TableValidationContext) => {
  await new Promise<void>((resolve) => {
    const done = () => {
      clearTimeout(timer)
      signal.removeEventListener('abort', done)
      resolve()
    }
    const timer = setTimeout(done, 500)
    signal.addEventListener('abort', done, { once: true })
    if (signal.aborted) done()
  })
  if (signal.aborted) return
  return (
    String(value).toLowerCase() !== 'admin' || '该名称已被占用，请换一个名称。'
  )
}
const columns: TableColumn[] = [
  {
    field: 'name',
    title: '名称',
    width: 230,
    fixed: 'left',
    editor: true,
    rules: [{ required: true }, { validator: checkName }],
  },
  {
    field: 'seats',
    title: '席位',
    width: 180,
    editor: { type: 'number' },
    rules: {
      required: true,
      type: 'integer',
      min: 1,
      max: 20,
      message: '席位必须为 1–20 之间的整数。',
    },
  },
  {
    field: 'code',
    title: '项目编码',
    minWidth: 220,
    editor: true,
    rules: {
      validator: ({ value }) =>
        /^[A-Z]-\d{3}$/.test(String(value)) ||
        '使用一个大写字母、连字符和三位数字。',
    },
  },
]
const report = (result: TableValidationResult) => {
  message.value = result.cancelled
    ? '已取消校验。'
    : result.valid
      ? '校验通过。'
      : `发现 ${result.errors.length} 处错误，请修正后保存。`
}
const check = async (scope: 'cell' | 'row' | 'all') => {
  busy.value = true
  try {
    const result =
      scope === 'cell'
        ? await table.value?.validateCell(0, 'name')
        : scope === 'row'
          ? await table.value?.validateRow(0)
          : await table.value?.validate()
    if (result) report(result)
  } finally {
    busy.value = false
  }
}
const commit = async () => {
  busy.value = true
  try {
    await table.value?.commitEdit()
  } finally {
    busy.value = false
  }
}
const save = ({ rowKey, updatedRow }: TableEditEndParams) => {
  rows.value = rows.value.map((row) =>
    row.id === rowKey ? (updatedRow as typeof row) : row,
  )
  editing.value = false
  message.value = '已保存通过校验的记录。'
}
</script>

<template>
  <div class="validation-demo">
    <div class="validation-demo__controls">
      <s-button
        size="small"
        :disabled="busy"
        @click="table?.startEdit(0, 'name')"
        >编辑首行</s-button
      >
      <s-button
        size="small"
        :loading="busy"
        :disabled="!editing"
        @click="commit"
        >保存</s-button
      >
      <s-button
        size="small"
        flat
        :disabled="!editing"
        @click="table?.cancelEdit()"
        >放弃草稿</s-button
      >
      <s-button size="small" flat :disabled="busy" @click="check('cell')"
        >校验首格</s-button
      >
      <s-button size="small" flat :disabled="busy" @click="check('row')"
        >校验首行</s-button
      >
      <s-button size="small" flat :disabled="busy" @click="check('all')"
        >校验全部</s-button
      >
      <s-button
        size="small"
        flat
        :disabled="!busy"
        @click="table?.cancelValidation()"
        >取消校验</s-button
      >
    </div>
    <s-table
      ref="table"
      :data="rows"
      :columns="columns"
      :edit-config="{ mode: 'row' }"
      validation-config
      resize-config
      @edit-start="editing = true"
      @edit-cancel="editing = false"
      @edit-commit="save"
      @validation="report"
    />
    <p role="status">{{ message }}</p>
  </div>
</template>

<style scoped>
.validation-demo {
  width: 100%;
}
.validation-demo__controls {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
}
.validation-demo > p {
  margin: 12px 0 0;
}
</style>
