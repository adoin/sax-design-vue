---
description: "审阅结构化计划并明确批准或拒绝。"
PROPS:
  - name: "title"
    type: "String"
    description: "标题文本；过程列表默认使用本地化标题。"
    default: "''"
    usage: "#default"
  - name: "description"
    type: "String"
    description: "计划说明文本。"
    default: null
    usage: "#default"
  - name: "tasks"
    type: "AgentTask[]"
    description: "任务条目，提供稳定 id、状态及可选进度。"
    default: "[]"
    usage: "#default"
  - name: "content"
    type: "String"
    description: "纯文本内容，可通过默认插槽替换。"
    default: null
    usage: "#default"
  - name: "v-model:expanded"
    type: "Boolean"
    description: "受控展开状态，使用 v-model:expanded 接收切换。"
    default: "false"
    usage: "#default"
  - name: "expanded"
    type: "Boolean"
    description: "受控展开状态，使用 v-model:expanded 接收切换。"
    default: "false"
    usage: "#default"
  - name: "status"
    type: "'pending' | 'approved' | 'rejected'"
    description: "受控过程或审阅状态。"
    default: "pending"
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
  - name: "approve"
    type: "() => void"
    description: "请求批准待确认计划。"
  - name: "reject"
    type: "() => void"
    description: "请求拒绝修改或计划。"
  - name: "download"
    type: "() => void"
    description: "触发下载操作；图像结果提供地址。"
SLOTS:
  - name: "default"
    description: "替换默认内容。"
  - name: "actions"
    type: "{ status: 'pending' | 'approved' | 'rejected' }"
    description: "自定义操作栏。"
---

# Plan Card（计划卡片）

<card>

## 基础用法

计划保持待确认状态，直到消费方更新 status。展开详情，使用 approve 或 reject 接入执行流程。下载导出当前计划文本；批准事件不会在组件内部请求服务。

<template #example><plan-card-default-zh /></template>

<template #template>

@[code{15-28}](../../.vuepress/components/plan-card/default-zh.vue)

</template>

<template #script>

@[code{1-13}](../../.vuepress/components/plan-card/default-zh.vue)

</template>

<template #style>

@[code{30-43}](../../.vuepress/components/plan-card/default-zh.vue)

</template>

</card>
