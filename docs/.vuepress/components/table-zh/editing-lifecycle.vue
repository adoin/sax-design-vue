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
    name: `任务 ${index + 1}`,
    children: index === 0 ? [{ id: 101, name: '子任务' }] : undefined,
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
  { label: '提交', value: 'commit' },
  { label: '取消', value: 'cancel' },
]
const scrollActions = [{ label: '保留草稿', value: 'keep' }, ...actions]
const editConfig = computed(() => ({
  onSwitch: onSwitch.value,
  onContextChange: onContextChange.value,
  onScroll: onScroll.value,
}))
const columns: TableColumn[] = [
  { field: 'id', title: '编号', width: 90, fixed: 'left' },
  {
    field: 'name',
    title: '任务',
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
  switch: '切换单元格',
  query: '排序/筛选',
  page: '分页',
  columns: '列变更',
  scroll: '移出视口',
  data: '外部数据',
  view: '行已离开当前视图',
  disabled: '编辑已关闭',
  conflict: '外部字段冲突',
  unmount: '组件卸载',
}
const message = ref('双击任务开始编辑。')
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
  message.value = `已提交：${reasons[event.reason]}。`
}
const cancel = (event: TableEditEndParams) => {
  pending.value = false
  message.value = `已取消：${reasons[event.reason]}。`
}
const replaceActive = () => {
  const record = table.value?.getEditRecord()
  if (!record) return
  const replace = (items: Task[]) => {
    const index = items.findIndex((row) => row.id === record.rowKey)
    if (index >= 0) items[index] = { ...items[index], name: '外部更新' }
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
        label="切换单元格"
        :options="actions"
        block
      />
      <s-select
        v-model="onContextChange"
        label="切换视图"
        :options="actions"
        block
      />
      <s-select
        v-model="onScroll"
        label="离开视口"
        :options="scrollActions"
        block
      />
    </div>
    <div class="editing-lifecycle__controls">
      <s-checkbox v-model="paged">分页</s-checkbox>
      <s-checkbox v-model="virtual">虚拟滚动</s-checkbox>
      <s-button size="small" @click="table?.startEdit(0, 'name')"
        >编辑首行</s-button
      >
      <s-button
        size="small"
        flat
        :disabled="!pending"
        @click="table?.commitEdit()"
        >保存</s-button
      >
      <s-button
        size="small"
        flat
        :disabled="!pending"
        @click="table?.cancelEdit()"
        >取消</s-button
      >
      <s-button size="small" flat :disabled="!pending" @click="replaceActive"
        >替换编辑行</s-button
      >
      <s-button size="small" flat @click="rows = makeRows()">重新加载</s-button>
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
