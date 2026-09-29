<template>
  <div class="loading-demo">
    <s-switch v-model="loading">加载状态</s-switch>
    <div class="loading-demo__fields">
      <s-table-select
        v-model="value"
        :data="data"
        :columns="columns"
        :loading="loading"
        label-key="name"
        clearable
        placeholder="选择项目"
      />
      <s-table-select
        v-model="treeValue"
        :data="treeData"
        :columns="treeColumns"
        :tree-config="{ children: 'children' }"
        :loading="loading"
        label-key="name"
        clearable
        placeholder="选择树节点"
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
const columns = [{ field: 'name', title: '名称' }]
const treeData = [
  { id: 'root', name: '工作区', children: [{ id: 'child', name: '文档' }] },
]
const treeColumns = [{ field: 'name', title: '名称', treeNode: true }]
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
