<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { TableGridQueryContext } from 'sax-design-vue'
const model = reactive({ term: '' })
const expanded = ref<number[]>([1])
const rows = [
  {
    id: 1,
    name: 'Workspace',
    note: 'A group with loaded children.',
    children: [
      {
        id: 2,
        name: 'Components',
        note: 'Review buttons, inputs and selectors.',
      },
      {
        id: 3,
        name: 'Documentation',
        note: 'Keep examples synchronized with the component APIs.',
      },
    ],
  },
  { id: 4, name: 'Release', note: 'Prepare the next version.' },
]
const message = ref('The query slot uses the same form model and validation.')
const search = (context: TableGridQueryContext) => {
  message.value = `Submitted term: ${context.form.term || '(empty)'}`
}
</script>

<template>
  <div class="grid-slots-demo">
    <s-table-grid
      v-model:expanded-keys="expanded"
      :data="rows"
      :query-config="{
        model,
        labelPosition: 'top',
        items: [
          { field: 'term', title: 'Keyword', slots: { default: 'term' } },
        ],
      }"
      :virtual-config="{ height: 220, dynamic: true, horizontal: true }"
      @query="search"
    >
      <template #query-term="{ value, setValue, id }"
        ><s-input
          :id="id"
          block
          :model-value="String(value ?? '')"
          @update:model-value="setValue"
      /></template>
      <template #query-actions="{ query, resetQuery, busy }"
        ><s-button :debounce="false" :disabled="busy" @click.prevent="query"
          >Apply conditions</s-button
        ><s-button
          :debounce="false"
          flat
          :disabled="busy"
          @click.prevent="resetQuery"
          >Reset conditions</s-button
        ></template
      >
      <template #toolbar="{ refresh, busy }"
        ><s-button
          :disabled="busy"
          @click="expanded = expanded.length ? [] : [1]"
          >Toggle group</s-button
        ><s-button flat :disabled="busy" @click="refresh"
          >Refresh</s-button
        ></template
      >
      <s-table-column
        field="name"
        title="Project"
        :width="220"
        fixed="left"
        tree-node
      />
      <s-table-column field="note" title="Notes" :min-width="440"
        ><template #default="{ value }"
          ><span>{{ value }}</span></template
        ></s-table-column
      >
      <s-table-column field="id" title="ID" :width="80" fixed="right" />
      <template #footer
        ><s-tag>Expanded groups: {{ expanded.length }}</s-tag></template
      >
    </s-table-grid>
    <p role="status">{{ message }}</p>
  </div>
</template>

<style scoped>
.grid-slots-demo {
  width: 100%;
}
</style>
