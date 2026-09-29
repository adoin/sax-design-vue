<template>
  <div class="loading-demo">
    <s-switch v-model="loading">Loading</s-switch>
    <div class="loading-demo__fields">
      <s-table-select
        v-model="value"
        :data="data"
        :columns="columns"
        :loading="loading"
        label-key="name"
        clearable
        placeholder="Choose item"
      />
      <s-table-select
        v-model="treeValue"
        :data="treeData"
        :columns="treeColumns"
        :tree-config="{ children: 'children' }"
        :loading="loading"
        label-key="name"
        clearable
        placeholder="Choose tree node"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const loading = ref(true)
const value = ref('a')
const treeValue = ref('child')
const data = [{ id: 'a', name: 'Alpha' }]
const columns = [{ field: 'name', title: 'Name' }]
const treeData = [
  {
    id: 'root',
    name: 'Workspace',
    children: [{ id: 'child', name: 'Documentation' }],
  },
]
const treeColumns = [{ field: 'name', title: 'Name', treeNode: true }]
</script>

<style scoped>
.loading-demo {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
}
.loading-demo__fields {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 24px;
}
</style>
