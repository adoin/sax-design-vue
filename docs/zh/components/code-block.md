---
description: "安全代码展示，提供基础词法高亮、复制、下载与折叠。"
PROPS:
  - name: "code"
    type: "String"
    description: "纯文本源码；HTML 按原始文本显示。"
    default: "''"
    usage: "#default"
  - name: "filename"
    type: "String"
    description: "标题中的文件名，也用于代码下载文件名。"
    default: null
    usage: "#default"
  - name: "language"
    type: "String"
    description: "js、jsx、ts、tsx、javascript、typescript、python 和 json 使用基础词法高亮；其他语言显示纯文本，可通过 line 插槽接入完整高亮器。"
    default: "text"
    usage: "#default"
  - name: "line-numbers"
    type: "Boolean"
    description: "显示行号，复制内容不包含行号。"
    default: "true"
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
  - name: "download"
    type: "Boolean"
    description: "显示本地文本文件下载操作。"
    default: "true"
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
  - name: "copy"
    type: "() => void"
    description: "成功写入剪贴板。"
  - name: "copy-error"
    type: "(error: unknown) => void"
    description: "写入剪贴板失败。"
  - name: "download"
    type: "() => void"
    description: "触发下载操作；图像结果提供地址。"
SLOTS:
  - name: "actions"
    type: "{ copy: () => Promise<void>; download: () => void }"
    description: "自定义操作栏。"
  - name: "line"
    type: "{ line: AgentCodeToken[]; index: number }"
    description: "自定义一行安全分词的源码。"
EXPOSES:
  - name: "copy"
    type: "() => Promise<void>"
    description: "组件提供的 copy 接口。"
  - name: "download"
    type: "() => void"
    description: "组件提供的 download 接口。"
---

# Code Block（代码块）

<card>

## 基础用法

复制保留完整源码和换行；下载创建本地文本文件。内置词法高亮保持轻量，可通过 line 插槽接入专用语言高亮器。剪贴板失败发出 copy-error。

<template #example><code-block-default-zh /></template>

<template #template>

@[code{8-17}](../../.vuepress/components/code-block/default-zh.vue)

</template>

<template #script>

@[code{1-6}](../../.vuepress/components/code-block/default-zh.vue)

</template>

<template #style>

@[code{19-32}](../../.vuepress/components/code-block/default-zh.vue)

</template>

</card>

<card>

## 形状

圆角与方角并排展示。两侧共用受控状态，便于比较相同内容与操作；省略 shape 时会遵循全局配置。

<template #example><code-block-shape-zh /></template>

<template #template>

@[code{8-31}](../../.vuepress/components/code-block/shape-zh.vue)

</template>

<template #script>

@[code{1-6}](../../.vuepress/components/code-block/shape-zh.vue)

</template>

<template #style>

@[code{33-52}](../../.vuepress/components/code-block/shape-zh.vue)

</template>

</card>
