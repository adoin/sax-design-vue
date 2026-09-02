<script setup lang="ts">
import { shallowRef } from 'vue'
import type { TableColumn, TableRow } from 'sax-design-vue'

const roundedValue = shallowRef<string>()
const squareValue = shallowRef<string>()
const columns: TableColumn[] = [
  { field: 'name', title: 'Workspace' },
  { field: 'status', title: 'Status' },
]
const data: TableRow[] = [
  { id: 'design', name: 'Design', status: 'Active' },
  { id: 'develop', name: 'Develop', status: 'Ready' },
  { id: 'release', name: 'Release', status: 'Pending' },
]
const popupConfig = { width: 320, maxHeight: 240 }
</script>

<template>
  <div class="shape-demo">
    <div class="shape-demo__item">
      <s-text>Rounded</s-text>
      <s-table-select
        v-model="roundedValue"
        :data="data"
        :columns="columns"
        :popup-config="popupConfig"
        label-key="name"
        placeholder="Rounded table select"
      />
    </div>
    <div class="shape-demo__item">
      <s-text>Square</s-text>
      <s-table-select
        v-model="squareValue"
        :data="data"
        :columns="columns"
        :popup-config="popupConfig"
        label-key="name"
        shape="square"
        placeholder="Square table select"
      />
    </div>
  </div>
</template>

<style scoped>
.shape-demo {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  width: 100%;
}

.shape-demo__item {
  display: grid;
  gap: 8px;
}
</style>
