---
description: "Collect controlled option or custom answers in a question sequence."
PROPS:
  - name: "questions"
    type: "AgentQuestion[]"
    description: "Ordered questions with stable ids, options, custom-answer and optional flags."
    default: "[]"
    usage: "#default"
  - name: "v-model"
    type: "AgentAnswer[]"
    description: "Controlled answer descriptors."
    default: "[]"
    usage: "#default"
  - name: "model-value"
    type: "AgentAnswer[]"
    description: "Controlled answer descriptors."
    default: "[]"
    usage: "#default"
  - name: "v-model:active-index"
    type: "Number"
    description: "Controlled zero-based question position, clamped to the available range."
    default: "0"
    usage: "#default"
  - name: "active-index"
    type: "Number"
    description: "Controlled zero-based question position, clamped to the available range."
    default: "0"
    usage: "#default"
  - name: "title"
    type: "String"
    description: "Heading text; process lists use a localized fallback."
    default: null
    usage: "#default"
  - name: "disabled"
    type: "Boolean"
    description: "Disable component actions."
    default: "false"
    usage: "#default"
  - name: "shape"
    type: "'rounded' | 'square'"
    description: "Geometry resolved from the component and SConfigProvider."
    default: null
    usage: "#shape"
EVENTS:
  - name: "update:modelValue"
    type: "(answers: AgentAnswer[]) => void"
    description: "Controlled model update requested."
  - name: "update:activeIndex"
    type: "(index: number) => void"
    description: "Question navigation requested."
  - name: "submit"
    type: "(answers: AgentAnswer[]) => void"
    description: "Validated content submitted."
  - name: "skip"
    type: "(question: AgentQuestion) => void"
    description: "An optional question was skipped."
SLOTS:
  - name: "question"
    type: "{ question: AgentQuestion; answer: AgentAnswer | undefined; update: (value: string, custom?: boolean) => void }"
    description: "Add supporting question content using the controlled update callback."
---

# Question Card

<card>

## Default

Bind answers and activeIndex together. Only an enabled option or nonempty custom answer can advance. Optional questions may be skipped. Submit emits the answer collection after the final question; Ctrl/Command+Enter advances without interfering with IME.

<template #example><question-card-default /></template>

<template #template>

@[code{34-44}](../.vuepress/components/question-card/default.vue)

</template>

<template #script>

@[code{1-32}](../.vuepress/components/question-card/default.vue)

</template>

<template #style>

@[code{46-59}](../.vuepress/components/question-card/default.vue)

</template>

</card>

<card>

## Shape

Compare rounded and square geometry side by side. Both previews share controlled state so the same content and actions can be compared. Omitting shape follows the global configuration.

<template #example><question-card-shape /></template>

<template #template>

@[code{34-59}](../.vuepress/components/question-card/shape.vue)

</template>

<template #script>

@[code{1-32}](../.vuepress/components/question-card/shape.vue)

</template>

<template #style>

@[code{61-80}](../.vuepress/components/question-card/shape.vue)

</template>

</card>
