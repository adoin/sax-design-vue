<script lang="ts" setup>
import { computed, ref } from 'vue'

const options = [
  {
    label: '内容权限',
    value: 'content',
    columns: 2,
    options: [
      { label: '查看内容', value: 'content:read' },
      { label: '创建内容', value: 'content:create' },
      { label: '编辑内容', value: 'content:update' },
      { label: '删除内容', value: 'content:delete', disabled: true },
    ],
  },
  {
    label: '数据权限',
    value: 'data',
    columns: 2,
    options: [
      { label: '查看报表', value: 'data:read' },
      { label: '导出数据', value: 'data:export' },
    ],
  },
]

const value = ref(['content:read', 'content:create', 'data:read'])
const summary = computed(() => value.value.join('、'))
</script>

<template>
  <div class="checkbox-group-demo">
    <s-checkbox-group v-model="value" :options="options" :columns="2" />
    <p>已选：{{ summary || '无' }}</p>
  </div>
</template>

<style scoped>
.checkbox-group-demo {
  width: min(100%, 620px);
}

.checkbox-group-demo p {
  margin: 12px 4px 0;
  opacity: 0.62;
}
</style>
