---
description: "行内引用入口与支持键盘的浮层来源预览。"
PROPS:
  - name: "sources"
    type: "AgentSource[]"
    description: "引用来源；仅允许绝对 HTTP 与 HTTPS 链接。"
    default: "[]"
    usage: "#default"
  - name: "label"
    type: "String"
    description: "无障碍名称，默认使用本地化文本。"
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
  - name: "open"
    type: "() => void"
    description: "来源预览已打开。"
  - name: "source-click"
    type: "(source: AgentSource) => void"
    description: "选择安全的来源链接。"
SLOTS:
  - name: "trigger"
    type: "{ sources: AgentSource[] }"
    description: "自定义内置可访问触发器中的内容。"
  - name: "source"
    type: "{ source: AgentSource }"
    description: "自定义来源预览条目。"
---

# Inline Citations（行内引用）

<card>

## 基础用法

点击或按 Enter 展开引用来源列表。共享浮层可显示在滚动容器之外。不受支持的链接协议仅显示来源标题。

<template #example><inline-citations-default-zh /></template>

<template #template>

@[code{19-26}](../../.vuepress/components/inline-citations/default-zh.vue)

</template>

<template #script>

@[code{1-17}](../../.vuepress/components/inline-citations/default-zh.vue)

</template>

<template #style>

@[code{28-41}](../../.vuepress/components/inline-citations/default-zh.vue)

</template>

</card>

<card>

## 形状

圆角与方角并排展示。两侧共用受控状态，便于比较相同内容与操作；省略 shape 时会遵循全局配置。

<template #example><inline-citations-shape-zh /></template>

<template #template>

@[code{19-36}](../../.vuepress/components/inline-citations/shape-zh.vue)

</template>

<template #script>

@[code{1-17}](../../.vuepress/components/inline-citations/shape-zh.vue)

</template>

<template #style>

@[code{38-57}](../../.vuepress/components/inline-citations/shape-zh.vue)

</template>

</card>
