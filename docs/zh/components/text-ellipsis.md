---
PROPS:
  - name: expand-text
    type: String
    values: "操作文案"
    description: 自定义文本收起时的展开文案。
    default: '展开全文'
    usage: '#default'
  - name: collapse-text
    type: String
    values: "操作文案"
    description: 自定义文本展开时的收起文案。
    default: '收起全文'
    usage: '#default'
  - name: content
    type: String
    values: "text"
    description: 未提供默认插槽时的截断文本。
    default: "''"
  - name: line-clamp
    type: Number
    values: "lines"
    description: 收起时显示的行数。
    default: '1'
  - name: expandable
    type: Boolean
    values: "true / false"
    description: 显示展开和收起操作。
    default: 'false'
description: '可展开文本省略。'
EVENTS:
  - name: update:expanded
    type: Boolean
    description: 展开状态变化时触发。
  - name: change
    type: Boolean
    description: 展开状态变化时触发。
---

# Text Ellipsis 文本省略

<card>

## 默认

设置 `line-clamp` 和 `expandable` 省略较长的文本。展开操作紧贴末行文字；容器过窄时，操作会移到文字下方。

<template #example><text-ellipsis-zh-default /></template>

<template #template>

@[code{9-16}](../../.vuepress/components/text-ellipsis-zh/default.vue)

</template>

<template #script>

@[code{1-7}](../../.vuepress/components/text-ellipsis-zh/default.vue)

</template>

</card>
