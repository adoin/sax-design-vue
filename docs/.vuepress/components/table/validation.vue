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
const message = shallowRef('Edit the first row, or check the existing data.')
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
    String(value).toLowerCase() !== 'admin' ||
    'This name is already taken. Choose another name.'
  )
}
const columns: TableColumn[] = [
  {
    field: 'name',
    title: 'Name',
    width: 230,
    fixed: 'left',
    editor: true,
    rules: [{ required: true }, { validator: checkName }],
  },
  {
    field: 'seats',
    title: 'Seats',
    width: 180,
    editor: { type: 'number' },
    rules: {
      required: true,
      type: 'integer',
      min: 1,
      max: 20,
      message: 'Seats must be an integer from 1 to 20.',
    },
  },
  {
    field: 'code',
    title: 'Project code',
    minWidth: 220,
    editor: true,
    rules: {
      validator: ({ value }) =>
        /^[A-Z]-\d{3}$/.test(String(value)) ||
        'Use one capital letter, a hyphen, and three digits.',
    },
  },
]
const report = (result: TableValidationResult) => {
  message.value = result.cancelled
    ? 'Validation cancelled.'
    : result.valid
      ? 'Validation passed.'
      : `Errors: ${result.errors.length}. Correct invalid fields before saving.`
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
  message.value = 'Saved the validated record.'
}
</script>

<template>
  <div class="validation-demo">
    <div class="validation-demo__controls">
      <s-button
        size="small"
        :disabled="busy"
        @click="table?.startEdit(0, 'name')"
        >Edit first row</s-button
      >
      <s-button
        size="small"
        :loading="busy"
        :disabled="!editing"
        @click="commit"
        >Save</s-button
      >
      <s-button
        size="small"
        flat
        :disabled="!editing"
        @click="table?.cancelEdit()"
        >Discard draft</s-button
      >
      <s-button size="small" flat :disabled="busy" @click="check('cell')"
        >Check first cell</s-button
      >
      <s-button size="small" flat :disabled="busy" @click="check('row')"
        >Check first row</s-button
      >
      <s-button size="small" flat :disabled="busy" @click="check('all')"
        >Check all</s-button
      >
      <s-button
        size="small"
        flat
        :disabled="!busy"
        @click="table?.cancelValidation()"
        >Cancel validation</s-button
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
