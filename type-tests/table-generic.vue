<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import { STable } from 'sax-design-vue'
import type { SaxGridSetting, TableInstance } from 'sax-design-vue'

interface User {
  id: number
  name: string
  status: 'active' | 'paused'
}

interface UserQueryForm {
  keyword: string
}

const options = computed<SaxGridSetting<User, UserQueryForm>>(() => ({
  data: [{ id: 1, name: 'Ada', status: 'active' }],
  columns: [{ field: 'name', title: 'Name' }],
  queryConfig: { model: { keyword: '' } },
}))
const table = useTemplateRef<TableInstance<User, UserQueryForm>>('table')

const inspectTable = () => {
  table.value?.getSelectedRows()[0]?.name.toUpperCase()
  table.value?.getQueryContext().form.keyword.toUpperCase()
}

inspectTable()
</script>

<template>
  <STable ref="table" v-bind="options">
    <template #cell="{ row }">{{ row.name.toUpperCase() }}</template>
    <template #edit-cell="{ draftRow }">
      {{ draftRow.status }}
    </template>
    <template #query="{ model }">{{ model.keyword.toUpperCase() }}</template>
    <template #toolbar_left="{ getSelectedRows }">
      {{ getSelectedRows()[0]?.name }}
    </template>
  </STable>
</template>
