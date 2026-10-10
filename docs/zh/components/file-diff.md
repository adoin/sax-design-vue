---
description: "展示文件修改建议并提供明确的审阅操作。"
PROPS:
  - name: "filename"
    type: "String"
    description: "标题中的文件名，也用于代码下载文件名。"
    default: "''"
    usage: "#default"
  - name: "lines"
    type: "FileDiffLine[]"
    description: "已计算的差异行，可携带旧、新行号。"
    default: "[]"
    usage: "#default"
  - name: "v-model:expanded"
    type: "Boolean"
    description: "受控展开状态，使用 v-model:expanded 接收切换。"
    default: "true"
    usage: "#default"
  - name: "expanded"
    type: "Boolean"
    description: "受控展开状态，使用 v-model:expanded 接收切换。"
    default: "true"
    usage: "#default"
  - name: "disabled"
    type: "Boolean"
    description: "禁用组件操作。"
    default: "false"
    usage: "#default"
EVENTS:
  - name: "update:expanded"
    type: "(value: boolean) => void"
    description: "请求切换展开状态。"
  - name: "apply"
    type: "() => void"
    description: "请求应用修改。"
  - name: "reject"
    type: "() => void"
    description: "请求拒绝修改或计划。"
SLOTS:
  - name: "actions"
    description: "自定义操作栏。"
---

# File Diff（文件差异）

<card>

## 基础用法

提供 context、add、remove 差异行及原始行号。应用与拒绝只发出决定，文件修改由消费方执行。

<template #example><file-diff-default-zh /></template>

<template #template>

@[code{19-30}](../../.vuepress/components/file-diff/default-zh.vue)

</template>

<template #script>

@[code{1-17}](../../.vuepress/components/file-diff/default-zh.vue)

</template>

<template #style>

@[code{32-45}](../../.vuepress/components/file-diff/default-zh.vue)

</template>

</card>
