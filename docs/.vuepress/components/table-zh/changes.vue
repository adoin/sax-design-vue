<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import type {
  TableChangeRecords,
  TableColumn,
  TableDataMutationResult,
  TableExposes,
  TableRow,
} from 'sax-design-vue'

const table = ref<TableExposes>()
const rows = ref<TableRow[]>([
  { id: 1, name: '工作台', seats: 4 },
  { id: 2, name: '组件库', seats: 8 },
  { id: 3, name: '文档', seats: 2 },
])
const highlighted = ref<TableRow | null>(null)
const editing = ref(false)
const busy = ref(false)
const message = ref('选中一行或双击单元格开始编辑。')
const records = shallowRef<TableChangeRecords>({
  version: 0,
  inserted: [],
  updated: [],
  removed: [],
})
let nextId = 4
const columns: TableColumn[] = [
  { field: 'id', title: '编号', width: 90, fixed: 'left' },
  {
    field: 'name',
    title: '项目',
    minWidth: 220,
    editor: true,
    rules: { required: true, message: '请输入项目名称。' },
  },
  {
    field: 'seats',
    title: '席位',
    width: 140,
    editor: { type: 'number' },
    rules: { type: 'integer', min: 1, message: '席位数必须是正整数。' },
  },
]
const refresh = () => {
  if (table.value) records.value = table.value.getChangeRecords()
}
const run = async (
  action: () => Promise<TableDataMutationResult> | undefined,
) => {
  busy.value = true
  try {
    const result = await action()
    message.value = result?.applied
      ? '已应用到本地数据，尚未业务确认。'
      : '此次变更未被接受。'
    if (result?.applied) highlighted.value = null
  } finally {
    busy.value = false
  }
}
const insert = () =>
  run(() =>
    table.value?.insertRows([{ id: nextId++, name: '新项目', seats: 1 }], {
      index: 0,
    }),
  )
const remove = () => {
  const key = highlighted.value?.id
  if (typeof key === 'number') return run(() => table.value?.removeRows([key]))
}
const revert = () => {
  const key = highlighted.value?.id
  if (typeof key === 'number')
    return run(() => table.value?.revertChanges([key]))
}
const commit = async () => {
  busy.value = true
  try {
    message.value = (await table.value?.commitEdit())
      ? '已应用到本地数据，尚未业务确认。'
      : '请先修正校验错误。'
  } finally {
    busy.value = false
  }
}
const confirm = async () => {
  if (!table.value) return
  busy.value = true
  try {
    if (!(await table.value.commitEdit())) return
    const result = await table.value.validate()
    if (!result.valid) {
      message.value = '请先修正校验错误。'
      return
    }
    const snapshot = table.value.getChangeRecords()
    // 实际业务中应先等待保存请求成功，再确认此版本。
    message.value = table.value.acceptChanges(snapshot.version)
      ? '当前变更已确认为新的基线。'
      : '数据已变化，请重新检查变更再确认。'
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <div class="changes-demo">
    <div class="changes-demo__controls">
      <s-button size="small" :disabled="busy || editing" @click="insert"
        >插入行</s-button
      >
      <s-button
        size="small"
        :disabled="busy || editing || !highlighted"
        @click="table?.startEdit(highlighted!, 'name')"
        >编辑选中行</s-button
      >
      <s-button size="small" :disabled="busy || !editing" @click="commit"
        >应用草稿</s-button
      >
      <s-button
        size="small"
        flat
        :disabled="busy || !editing"
        @click="table?.cancelEdit()"
        >放弃草稿</s-button
      >
      <s-button
        size="small"
        flat
        :disabled="busy || editing || !highlighted"
        @click="remove"
        >删除选中行</s-button
      >
      <s-button
        size="small"
        flat
        :disabled="busy || editing || !highlighted"
        @click="revert"
        >还原选中行</s-button
      >
      <s-button
        size="small"
        flat
        :disabled="busy || editing"
        @click="run(() => table?.revertChanges())"
        >还原全部</s-button
      >
      <s-button size="small" :loading="busy" @click="confirm"
        >确认基线</s-button
      >
    </div>
    <s-table
      ref="table"
      v-model:data="rows"
      v-model:highlight="highlighted"
      :columns="columns"
      :edit-config="{ mode: 'row' }"
      change-config
      validation-config
      :pager-config="{ pageSize: 3 }"
      @changes-change="refresh"
      @edit-start="editing = true"
      @edit-commit="editing = false"
      @edit-cancel="editing = false"
    />
    <p role="status">{{ message }}</p>
    <div class="changes-demo__controls">
      <s-tag>新增: {{ records.inserted.length }}</s-tag>
      <s-tag>修改: {{ records.updated.length }}</s-tag>
      <s-tag>删除: {{ records.removed.length }}</s-tag>
    </div>
  </div>
</template>

<style scoped>
.changes-demo {
  width: 100%;
}
.changes-demo__controls {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin: 12px 0;
}
</style>
