---
PROPS:
  - name: node-key / label / children / placeholder
    type: String
    values: 树数据字段和输入提示
    description: 映射树数据字段并自定义空状态提示文字。
    default: 'id / label / children / -'
  - name: model-value/v-model
    type: String | Number
    values: node key
    description: 选中的树节点键值。
    default: null
  - name: data
    type: Array
    values: TreeNode[]
    description: 树节点定义。
    default: '[]'
  - name: check-strictly
    type: Boolean
    values: true / false
    description: 允许选择非叶子节点。
    default: 'false'
  - name: clearable
    type: Boolean
    values: true / false
    description: 选中后显示清空操作。
    default: 'false'
EVENTS:
  - name: change / clear
    description: 选择和清空事件。
description: "树形选择器。"
---

# Tree select 树形选择器

<card><template #example><tree-select-default /></template>

<template #template>

@[code{1-4}](../../.vuepress/components/tree-select/default.vue)

</template>

<template #script>

@[code{6-20}](../../.vuepress/components/tree-select/default.vue)

</template>

<template #style>

@[code{22-28}](../../.vuepress/components/tree-select/default.vue)

</template>

</card>
