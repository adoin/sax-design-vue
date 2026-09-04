<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import type {
  TableColumn,
  TableExposes,
  TableValidationResult,
} from 'sax-design-vue'

const table = ref<TableExposes>()
const virtual = shallowRef(true)
const message = shallowRef(
  'A group on page two contains a record with a missing name.',
)
const rows = [
  { id: 1, name: 'Workspace', owner: 'Alex' },
  {
    id: 2,
    name: 'Components',
    owner: 'Sam',
    children: [
      { id: 3, name: '', owner: 'Sam' },
      { id: 4, name: 'Icons', owner: 'Alex' },
    ],
  },
]
const columns: TableColumn[] = [
  {
    field: 'name',
    title: 'Name',
    width: 240,
    fixed: 'left',
    treeNode: true,
    rules: { required: true },
  },
  { field: 'owner', title: 'Owner', minWidth: 420 },
  { field: 'id', title: 'ID', width: 100, fixed: 'right' },
]
const report = (result: TableValidationResult) => {
  message.value = result.valid
    ? 'The selected scope passed validation.'
    : `Errors: ${result.errors.length}.`
}
const check = async (scope: 'all' | 'view') => {
  const result = await table.value?.validate({ scope })
  if (result) report(result)
}
</script>

<template>
  <div class="validation-navigation">
    <div class="validation-navigation__controls">
      <s-button size="small" @click="check('view')"
        >Check current page</s-button
      >
      <s-button size="small" @click="check('all')"
        >Check all and locate</s-button
      >
      <s-button size="small" flat @click="table?.scrollToValidationError()"
        >Return to first error</s-button
      >
      <s-button size="small" flat @click="table?.clearValidation()"
        >Clear errors</s-button
      >
      <s-checkbox v-model="virtual">Virtual scrolling</s-checkbox>
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
