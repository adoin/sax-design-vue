---
PROPS:
  - name: node-key / default-checked-keys / default-expanded-keys / empty-text / expand-on-click-node / highlight-current / indent
    type: String / Array / Boolean / Number
    values: 节点键、初始状态和树形交互配置
    description: 配置节点键、默认选择和展开、空状态、缩进及节点交互。
    default: '-'
  - name: model-value/v-model
    type: String | Number
    values: node key
    description: 当前节点键值。
    default: null
  - name: data
    type: Array
    values: TreeNode[]
    description: 树数据，节点支持 key、label、children、disabled。
    default: '[]'
  - name: show-checkbox
    type: Boolean
    values: true / false
    description: 显示复选框。
    default: 'false'
  - name: check-strictly
    type: Boolean
    values: true / false
    description: 禁用父子勾选联动。
    default: 'false'
  - name: default-expand-all
    type: Boolean
    values: true / false
    description: 初始化时展开全部节点。
    default: 'false'
EVENTS:
  - name: node-click / node-expand / node-collapse
    description: 节点交互事件。
  - name: update:checked-keys / check-change
    description: 勾选状态事件。
SLOTS:
  - name: node
    description: 自定义节点文本，接收 node 和 depth。
description: "树形控件。"
---

# Tree 树形控件

<card><template #example><tree-default /></template>

<template #template>

@[code{1-13}](../../.vuepress/components/tree/default.vue)

</template>

<template #script>

@[code{15-34}](../../.vuepress/components/tree/default.vue)

</template>

<template #style>

@[code{36-42}](../../.vuepress/components/tree/default.vue)

</template>

</card>
