---
description: "按问题顺序收集受控选项回答或自定义回答。"
PROPS:
  - name: "questions"
    type: "AgentQuestion[]"
    description: "有序问题，包含稳定 id、选项、自定义回答与可选标记。"
    default: "[]"
    usage: "#default"
  - name: "v-model"
    type: "AgentAnswer[]"
    description: "受控回答条目。"
    default: "[]"
    usage: "#default"
  - name: "model-value"
    type: "AgentAnswer[]"
    description: "受控回答条目。"
    default: "[]"
    usage: "#default"
  - name: "v-model:active-index"
    type: "Number"
    description: "从 0 开始的受控问题位置，限制为有效范围。"
    default: "0"
    usage: "#default"
  - name: "active-index"
    type: "Number"
    description: "从 0 开始的受控问题位置，限制为有效范围。"
    default: "0"
    usage: "#default"
  - name: "title"
    type: "String"
    description: "标题文本；过程列表默认使用本地化标题。"
    default: null
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
  - name: "update:modelValue"
    type: "(answers: AgentAnswer[]) => void"
    description: "请求更新受控模型。"
  - name: "update:activeIndex"
    type: "(index: number) => void"
    description: "请求切换问题。"
  - name: "submit"
    type: "(answers: AgentAnswer[]) => void"
    description: "提交有效内容。"
  - name: "skip"
    type: "(question: AgentQuestion) => void"
    description: "跳过可选问题。"
SLOTS:
  - name: "question"
    type: "{ question: AgentQuestion; answer: AgentAnswer | undefined; update: (value: string, custom?: boolean) => void }"
    description: "使用受控更新回调添加问题内容。"
---

# Question Card（问题卡片）

<card>

## 基础用法

同时绑定回答与 activeIndex。只有启用的选项或非空自定义回答才能继续。可选问题允许跳过。最后一题提交回答集合；Ctrl/Command+Enter 推进，并避开输入法组合过程。

<template #example><question-card-default-zh /></template>

<template #template>

@[code{34-44}](../../.vuepress/components/question-card/default-zh.vue)

</template>

<template #script>

@[code{1-32}](../../.vuepress/components/question-card/default-zh.vue)

</template>

<template #style>

@[code{46-59}](../../.vuepress/components/question-card/default-zh.vue)

</template>

</card>

<card>

## 形状

圆角与方角并排展示。两侧共用受控状态，便于比较相同内容与操作；省略 shape 时会遵循全局配置。

<template #example><question-card-shape-zh /></template>

<template #template>

@[code{34-59}](../../.vuepress/components/question-card/shape-zh.vue)

</template>

<template #script>

@[code{1-32}](../../.vuepress/components/question-card/shape-zh.vue)

</template>

<template #style>

@[code{61-80}](../../.vuepress/components/question-card/shape-zh.vue)

</template>

</card>
