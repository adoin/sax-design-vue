---
description: "受控任务状态、进度与可选任务操作。"
PROPS:
  - name: "tasks"
    type: "AgentTask[]"
    description: "任务条目，提供稳定 id、状态及可选进度。"
    default: "[]"
    usage: "#default"
  - name: "title"
    type: "String"
    description: "标题文本；过程列表默认使用本地化标题。"
    default: null
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
  - name: "interactive"
    type: "Boolean"
    description: "使任务标题成为支持键盘的操作入口，状态仍由消费方控制。"
    default: "false"
    usage: "#default"
  - name: "disabled"
    type: "Boolean"
    description: "禁用组件操作。"
    default: "false"
    usage: "#default"
  - name: "shape"
    type: "'rounded' | 'square'"
    description: "几何形态由组件属性与 SConfigProvider 共同解析。"
    default: null
    usage: "#shape"
EVENTS:
  - name: "update:expanded"
    type: "(value: boolean) => void"
    description: "请求切换展开状态。"
  - name: "task-click"
    type: "(task: AgentTask) => void"
    description: "选择可交互任务。"
SLOTS:
  - name: "default"
    description: "替换默认内容。"
  - name: "task"
    type: "{ task: AgentTask }"
    description: "自定义任务说明。"
---

# Task List（任务列表）

<card>

## 基础用法

通过工作流设置每项任务状态与可选进度。interactive 启用标题操作，但不会自动修改状态。使用 v-model:expanded 控制折叠。

<template #example><task-list-default-zh /></template>

<template #template>

@[code{23-32}](../../.vuepress/components/task-list/default-zh.vue)

</template>

<template #script>

@[code{1-21}](../../.vuepress/components/task-list/default-zh.vue)

</template>

<template #style>

@[code{34-47}](../../.vuepress/components/task-list/default-zh.vue)

</template>

</card>

<card>

## 形状

圆角与方角并排展示。两侧共用受控状态，便于比较相同内容与操作；省略 shape 时会遵循全局配置。

<template #example><task-list-shape-zh /></template>

<template #template>

@[code{23-46}](../../.vuepress/components/task-list/shape-zh.vue)

</template>

<template #script>

@[code{1-21}](../../.vuepress/components/task-list/shape-zh.vue)

</template>

<template #style>

@[code{48-67}](../../.vuepress/components/task-list/shape-zh.vue)

</template>

</card>
