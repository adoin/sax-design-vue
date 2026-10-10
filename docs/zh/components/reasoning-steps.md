---
description: "可折叠的推理步骤，支持受控过程状态与来源。"
PROPS:
  - name: reasoning
    type: "string[]"
    description: "逐段追加的推理正文。运行时自动显示并替代来源标签，完成后通过摘要展开。"
    default: "[]"
    usage: '#default'
  - name: duration
    type: "Number"
    description: "完成摘要的耗时（秒）。不设置时测量组件本轮运行的时间。"
    default: null
    usage: '#default'
  - name: "steps"
    type: "AgentTask[]"
    description: "有序步骤，提供稳定 id 与外部控制的状态。"
    default: "[]"
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
  - name: "title"
    type: "String"
    description: "覆盖摘要文字；默认显示当前运行步骤，完成后显示耗时。"
    default: null
    usage: "#default"
  - name: "sources"
    type: "AgentSource[]"
    description: "来源标签；icon 为 SIcon 名称，iconSrc 为 PNG/SVG 地址且优先。仅允许绝对 HTTP 与 HTTPS 链接。"
    default: "[]"
    usage: "#default"
EVENTS:
  - name: "update:expanded"
    type: "(value: boolean) => void"
    description: "请求切换展开状态。"
  - name: "step-click"
    type: "(step: AgentTask) => void"
    description: "选择步骤。"
SLOTS:
  - name: source-icon
    type: Slot
    scope: '{ source: AgentSource }'
    description: '自定义来源图标，优先于来源的 iconSrc 和 icon。'
  - name: "default"
    description: "替换默认内容。"
  - name: "step"
    type: "{ step: AgentTask }"
    description: "自定义步骤说明。"
---

# Reasoning Steps（推理步骤）

<card>

## 基础用法

先展示当前阶段和来源标签，再随 reasoning 逐段追加显示推理正文。所有步骤完成后收起正文，显示耗时摘要；点击摘要重新展开。此本地示例可重复播放，实际应用由服务响应更新步骤与正文。

<template #example><reasoning-steps-default-zh /></template>

<template #template>

@[code{73-83}](../../.vuepress/components/reasoning-steps/default-zh.vue)

</template>

<template #script>

@[code{1-71}](../../.vuepress/components/reasoning-steps/default-zh.vue)

</template>

<template #style>

@[code{85-95}](../../.vuepress/components/reasoning-steps/default-zh.vue)

</template>

</card>
