---
description: "跟随新内容并保留历史阅读位置的对话滚动区。"
PROPS:
  - name: "height"
    type: "String | Number"
    description: "视口高度，数字按像素处理，也接受 CSS 长度。"
    default: "360"
    usage: "#default"
  - name: "auto-follow"
    type: "Boolean"
    description: "在底部附近跟随内容；阅读更早消息时暂停跟随。"
    default: "true"
    usage: "#default"
  - name: "threshold"
    type: "Number"
    description: "视为处于底部附近的像素距离。"
    default: "48"
    usage: "#default"
  - name: "label"
    type: "String"
    description: "无障碍名称，默认使用本地化文本。"
    default: null
    usage: "#default"
EVENTS:
  - name: "follow-change"
    type: "(following: boolean) => void"
    description: "自动跟随状态变化。"
  - name: "reach-top"
    type: "() => void"
    description: "滚动后视口到达起始位置。"
SLOTS:
  - name: "default"
    type: "{ following: boolean; scrollToBottom: (smooth?: boolean) => void }"
    description: "替换默认内容。"
  - name: "controls"
    type: "{ following: boolean; unread: boolean; scrollToBottom: (smooth?: boolean) => void; scrollToTop: () => void }"
    description: "自定义边缘导航与未读反馈。"
EXPOSES:
  - name: "scrollToTop"
    type: "() => void"
    description: "组件提供的 scrollToTop 接口。"
  - name: "scrollToBottom"
    type: "(smooth?: boolean) => void"
    description: "组件提供的 scrollToBottom 接口。"
  - name: "following"
    type: "Boolean"
    description: "组件提供的 following 接口。"
  - name: "viewport"
    type: "HTMLElement | null"
    description: "组件提供的 viewport 接口。"
---

# Message Scroller（消息滚动区）

<card>

## 基础用法

在底部附近时，新内容跟随视口。向上阅读历史不会被拉回底部。向直接消息子项前面插入更早记录时会保留视口位置。边缘操作可返回首条或最新消息。

<template #example><message-scroller-default-zh /></template>

<template #template>

@[code{21-35}](../../.vuepress/components/message-scroller/default-zh.vue)

</template>

<template #script>

@[code{1-19}](../../.vuepress/components/message-scroller/default-zh.vue)

</template>

<template #style>

@[code{37-50}](../../.vuepress/components/message-scroller/default-zh.vue)

</template>

</card>
