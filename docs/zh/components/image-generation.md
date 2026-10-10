---
description: "展示受控图像生成进度、取消、重试与结果。"
PROPS:
  - name: "status"
    type: "AgentStatus"
    description: "受控过程或审阅状态。"
    default: "pending"
    usage: "#default"
  - name: "progress"
    type: "Number"
    description: "受控进度，限制为 0–100；非有限值按 0 处理。"
    default: "0"
    usage: "#default"
  - name: "src"
    type: "String"
    description: "结果图片地址，仅在 complete 状态显示。"
    default: null
    usage: "#default"
  - name: "alt"
    type: "String"
    description: "生成图像的替代文本。"
    default: null
    usage: "#default"
  - name: "resolution"
    type: "String"
    description: "仅用于显示的分辨率标签，不修改图片来源。"
    default: "1024 × 768"
    usage: "#default"
  - name: "error"
    type: "String"
    description: "失败状态显示的错误文本。"
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
  - name: "cancel"
    type: "() => void"
    description: "请求取消生成。"
  - name: "retry"
    type: "() => void"
    description: "请求重新生成。"
  - name: "download"
    type: "(src: string) => void"
    description: "触发下载操作；图像结果提供地址。"
  - name: "load"
    type: "() => void"
    description: "结果图像已加载。"
  - name: "image-error"
    type: "() => void"
    description: "结果图像加载失败。"
SLOTS:
  - name: "placeholder"
    type: "{ status: AgentStatus; progress: number }"
    description: "自定义待生成、生成中或失败反馈。"
  - name: "actions"
    type: "{ status: AgentStatus }"
    description: "自定义操作栏。"
---

# Image Generation（图像生成）

<card>

## 基础用法

服务控制状态、进度和结果地址。取消与重试通过事件接入，完成图片使用内置预览。下载事件提供地址，由业务下载处理器接收。

<template #example><image-generation-default-zh /></template>

<template #template>

@[code{32-51}](../../.vuepress/components/image-generation/default-zh.vue)

</template>

<template #script>

@[code{1-30}](../../.vuepress/components/image-generation/default-zh.vue)

</template>

<template #style>

@[code{53-66}](../../.vuepress/components/image-generation/default-zh.vue)

</template>

</card>

<card>

## 形状

圆角与方角并排展示。两侧共用受控状态，便于比较相同内容与操作；省略 shape 时会遵循全局配置。

<template #example><image-generation-shape-zh /></template>

<template #template>

@[code{32-75}](../../.vuepress/components/image-generation/shape-zh.vue)

</template>

<template #script>

@[code{1-30}](../../.vuepress/components/image-generation/shape-zh.vue)

</template>

<template #style>

@[code{77-96}](../../.vuepress/components/image-generation/shape-zh.vue)

</template>

</card>
