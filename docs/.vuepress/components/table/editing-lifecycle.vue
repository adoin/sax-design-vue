<script setup lang="ts">
import { computed, ref } from 'vue'
import type {
  TableColumn,
  TableEditEndParams,
  TableEditReason,
  TableExposes,
} from 'sax-design-vue'

interface Task {
  [key: string]: unknown
  id: number
  name: string
  children?: Task[]
}
const makeRows = (): Task[] =>
  Array.from({ length: 30 }, (_, index) => ({
    id: index + 1,
    name: `Task ${index + 1}`,
    children: index === 0 ? [{ id: 101, name: 'Child task' }] : undefined,
  }))
const rows = ref(makeRows())
const table = ref<TableExposes>()
const pending = ref(false)
const onSwitch = ref<'commit' | 'cancel'>('commit')
const onContextChange = ref<'commit' | 'cancel'>('cancel')
const onScroll = ref<'keep' | 'commit' | 'cancel'>('keep')
const paged = ref(true)
const virtual = ref(false)
const actions = [
  { label: 'Commit', value: 'commit' },
  { label: 'Cancel', value: 'cancel' },
]
const scrollActions = [{ label: 'Keep draft', value: 'keep' }, ...actions]
const editConfig = computed(() => ({
  onSwitch: onSwitch.value,
  onContextChange: onContextChange.value,
  onScroll: onScroll.value,
}))
const columns: TableColumn[] = [
  { field: 'id', title: 'ID', width: 90, fixed: 'left' },
  {
    field: 'name',
    title: 'Task',
    minWidth: 300,
    treeNode: true,
    sortable: true,
    editor: true,
  },
]
const reasons: Record<TableEditReason, string> = {
  api: 'API',
  enter: 'Enter',
  escape: 'Escape',
  switch: 'another cell',
  query: 'sort/filter',
  page: 'page',
  columns: 'columns',
  scroll: 'viewport exit',
  data: 'external data',
  view: 'row no longer visible',
  disabled: 'editing disabled',
  conflict: 'external field conflict',
  unmount: 'unmount',
}
const message = ref('Double-click a task to edit.')
const update = (items: Task[], id: number, value: Task): Task[] =>
  items.map((row) =>
    row.id === id
      ? value
      : row.children
        ? { ...row, children: update(row.children, id, value) }
        : row,
  )
const save = (event: TableEditEndParams) => {
  rows.value = update(
    rows.value,
    Number(event.rowKey),
    event.updatedRow as Task,
  )
  pending.value = false
  message.value = `Committed: ${reasons[event.reason]}.`
}
const cancel = (event: TableEditEndParams) => {
  pending.value = false
  message.value = `Cancelled: ${reasons[event.reason]}.`
}
const replaceActive = () => {
  const record = table.value?.getEditRecord()
  if (!record) return
  const replace = (items: Task[]) => {
    const index = items.findIndex((row) => row.id === record.rowKey)
    if (index >= 0) items[index] = { ...items[index], name: 'External update' }
    else
      items.forEach((row) => {
        if (row.children) replace(row.children)
      })
  }
  replace(rows.value)
}
</script>

<template>
  <div class="editing-lifecycle">
    <div class="editing-lifecycle__policies">
      <s-select
        v-model="onSwitch"
        label="Switch cell"
        :options="actions"
        block
      />
      <s-select
        v-model="onContextChange"
        label="Change view"
        :options="actions"
        block
      />
      <s-select
        v-model="onScroll"
        label="Leave viewport"
        :options="scrollActions"
        block
      />
    </div>
    <div class="editing-lifecycle__controls">
      <s-checkbox v-model="paged">Pagination</s-checkbox>
      <s-checkbox v-model="virtual">Virtual scrolling</s-checkbox>
      <s-button size="small" @click="table?.startEdit(0, 'name')"
        >Edit first row</s-button
      >
      <s-button
        size="small"
        flat
        :disabled="!pending"
        @click="table?.commitEdit()"
        >Save</s-button
      >
      <s-button
        size="small"
        flat
        :disabled="!pending"
        @click="table?.cancelEdit()"
        >Cancel</s-button
      >
      <s-button size="small" flat :disabled="!pending" @click="replaceActive"
        >Replace edited row</s-button
      >
      <s-button size="small" flat @click="rows = makeRows()"
        >Reload data</s-button
      >
    </div>
    <s-table
      ref="table"
      :data="rows"
      :columns="columns"
      :edit-config="editConfig"
      :pager-config="paged ? { pageSize: 5 } : false"
      :virtual-config="
        virtual ? { height: 240, dynamic: true, horizontal: true } : false
      "
      :tree-config="{ defaultExpandedKeys: [1] }"
      row-key="id"
      @edit-start="pending = true"
      @edit-commit="save"
      @edit-cancel="cancel"
    />
    <p role="status">{{ message }}</p>
  </div>
</template>

<style scoped>
.editing-lifecycle {
  width: 100%;
}
.editing-lifecycle__policies {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}
.editing-lifecycle__controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}
.editing-lifecycle > p {
  margin: 12px 0 0;
}
</style>
