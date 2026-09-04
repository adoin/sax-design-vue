<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { TableGridQueryContext } from 'sax-design-vue'
const model = reactive({ term: '' })
const expanded = ref<number[]>([1])
const rows = [
  {
    id: 1,
    name: '工作区',
    note: '包含已加载子节点的分组。',
    children: [
      { id: 2, name: '组件库', note: '检查按钮、输入框与选择器。' },
      { id: 3, name: '文档', note: '保持示例与组件 API 同步。' },
    ],
  },
  { id: 4, name: '发布', note: '准备下个版本。' },
]
const message = ref('查询插槽复用相同的表单模型和校验。')
const search = (context: TableGridQueryContext) => {
  message.value = `提交的关键词： ${context.form.term || '（空）'}`
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
        items: [{ field: 'term', title: '关键词', slots: { default: 'term' } }],
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
          >应用条件</s-button
        ><s-button
          :debounce="false"
          flat
          :disabled="busy"
          @click.prevent="resetQuery"
          >重置条件</s-button
        ></template
      >
      <template #toolbar="{ refresh, busy }"
        ><s-button
          :disabled="busy"
          @click="expanded = expanded.length ? [] : [1]"
          >展开或收起分组</s-button
        ><s-button flat :disabled="busy" @click="refresh"
          >刷新</s-button
        ></template
      >
      <s-table-column
        field="name"
        title="项目"
        :width="220"
        fixed="left"
        tree-node
      />
      <s-table-column field="note" title="说明" :min-width="440"
        ><template #default="{ value }"
          ><span>{{ value }}</span></template
        ></s-table-column
      >
      <s-table-column field="id" title="ID" :width="80" fixed="right" />
      <template #footer
        ><s-tag>展开分组数： {{ expanded.length }}</s-tag></template
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
