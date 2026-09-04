<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import type {
  TableColumn,
  TableExposes,
  TableValidationResult,
} from 'sax-design-vue'

const table = ref<TableExposes>()
const virtual = shallowRef(true)
const message = shallowRef('第二页的分组中有一条未填写名称的记录。')
const rows = [
  { id: 1, name: '工作区', owner: 'Alex' },
  {
    id: 2,
    name: '组件库',
    owner: 'Sam',
    children: [
      { id: 3, name: '', owner: 'Sam' },
      { id: 4, name: '图标', owner: 'Alex' },
    ],
  },
]
const columns: TableColumn[] = [
  {
    field: 'name',
    title: '名称',
    width: 240,
    fixed: 'left',
    treeNode: true,
    rules: { required: true },
  },
  { field: 'owner', title: '负责人', minWidth: 420 },
  { field: 'id', title: '编号', width: 100, fixed: 'right' },
]
const report = (result: TableValidationResult) => {
  message.value = result.valid
    ? '当前范围校验通过。'
    : `发现 ${result.errors.length} 处错误。`
}
const check = async (scope: 'all' | 'view') => {
  const result = await table.value?.validate({ scope })
  if (result) report(result)
}
</script>

<template>
  <div class="validation-navigation">
    <div class="validation-navigation__controls">
      <s-button size="small" @click="check('view')">校验当前页</s-button>
      <s-button size="small" @click="check('all')">校验全部并定位</s-button>
      <s-button size="small" flat @click="table?.scrollToValidationError()"
        >返回首个错误</s-button
      >
      <s-button size="small" flat @click="table?.clearValidation()"
        >清除提示</s-button
      >
      <s-checkbox v-model="virtual">虚拟滚动</s-checkbox>
    </div>
    <s-table
      ref="table"
      :data="rows"
      :columns="columns"
      :tree-config="{}"
      :pager-config="{ pageSize: 1 }"
      :virtual-config="
        virtual ? { height: 200, horizontal: true, dynamic: true } : false
      "
    />
    <p role="status">{{ message }}</p>
  </div>
</template>

<style scoped>
.validation-navigation {
  width: 100%;
}
.validation-navigation__controls {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
}
.validation-navigation > p {
  margin: 12px 0 0;
}
</style>
