---
description: "可折叠的推理步骤，支持受控过程状态与来源。"
PROPS:
  - name: "steps"
    type: "AgentTask[]"
    description: "有序步骤，提供稳定 id 与外部控制的状态。"
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
  - name: "title"
    type: "String"
    description: "标题文本；过程列表默认使用本地化标题。"
    default: null
    usage: "#default"
  - name: "sources"
    type: "AgentSource[]"
    description: "引用来源；仅允许绝对 HTTP 与 HTTPS 链接。"
    default: "[]"
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
  - name: "step-click"
    type: "(step: AgentTask) => void"
    description: "选择步骤。"
SLOTS:
  - name: "default"
    description: "替换默认内容。"
  - name: "step"
    type: "{ step: AgentTask }"
    description: "自定义步骤说明。"
---

# Reasoning Steps（推理步骤）

<card>

## 基础用法

随工作推进更新步骤状态。展开状态受控，选择步骤会发出对应条目；来源使用安全的绝对链接。

<template #example><reasoning-steps-default-zh /></template>

<template #template>

@[code{31-36}](../../.vuepress/components/reasoning-steps/default-zh.vue)

</template>

<template #script>

@[code{1-29}](../../.vuepress/components/reasoning-steps/default-zh.vue)

</template>

<template #style>

@[code{38-51}](../../.vuepress/components/reasoning-steps/default-zh.vue)

</template>

</card>

<card>

## 形状

圆角与方角并排展示。两侧共用受控状态，便于比较相同内容与操作；省略 shape 时会遵循全局配置。

<template #example><reasoning-steps-shape-zh /></template>

<template #template>

@[code{31-52}](../../.vuepress/components/reasoning-steps/shape-zh.vue)

</template>

<template #script>

@[code{1-29}](../../.vuepress/components/reasoning-steps/shape-zh.vue)

</template>

<template #style>

@[code{54-73}](../../.vuepress/components/reasoning-steps/shape-zh.vue)

</template>

</card>
