---
description: "跟随新内容并保留历史阅读位置的对话滚动区。"
PROPS:
  - name: "v-model:items"
    type: "AgentHistoryMessage[]"
    description: "受控消息数据，稳定且唯一的 id 用于行高缓存与历史定位。"
    default: null
    usage: "#dynamic-virtual-scrolling"
  - name: "items"
    type: "AgentHistoryMessage[]"
    description: "消息数据。提供时启用组件内置列表，不提供时使用原有 default 插槽。"
    default: null
    usage: "#dynamic-virtual-scrolling"
  - name: "virtual"
    type: "Boolean"
    description: "使用动态行高虚拟列表；false 渲染全部数据。仅作用于 items 模式。"
    default: "true"
    usage: "#dynamic-virtual-scrolling"
  - name: "estimated-item-height"
    type: "Number"
    description: "尚未测量消息的预估行高，单位 px；实际行高自动测量。"
    default: "96"
    usage: "#dynamic-virtual-scrolling"
  - name: "overscan"
    type: "Number"
    description: "可见区域前后额外渲染的消息数。"
    default: "5"
    usage: "#dynamic-virtual-scrolling"
  - name: "load-more"
    type: "MessageScrollerLoadMore"
    description: "历史加载回调，接收 AbortSignal，返回按时间升序排列的更早消息。组件合并并去重后更新 items。"
    default: null
    usage: "#dynamic-virtual-scrolling"
  - name: "has-more"
    type: "Boolean"
    description: "是否还有历史记录；返回空数组也会停止自动加载。"
    default: "true"
    usage: "#dynamic-virtual-scrolling"
  - name: "load-threshold"
    type: "Number"
    description: "距离顶部多少像素内触发懒加载。"
    default: "64"
    usage: "#dynamic-virtual-scrolling"
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
  - name: "message-action"
    type: "(event: MessageScrollerAction) => void"
    description: "默认数据消息的操作事件，包含 item、index、action 及反馈或错误信息；自定义 message 插槽直接监听 SMessage 事件。"

  - name: "update:items"
    type: "(items: AgentHistoryMessage[]) => void"
    description: "请求更新去重后的完整消息集合。"
  - name: "load-error"
    type: "(error: unknown) => void"
    description: "历史加载失败；取消或卸载不会作为错误上报。"
  - name: "follow-change"
    type: "(following: boolean) => void"
    description: "自动跟随状态变化。"
  - name: "reach-top"
    type: "() => void"
    description: "滚动后视口到达起始位置。"
SLOTS:
  - name: "message"
    type: "Slot"
    scope: "{ item: AgentHistoryMessage; index: number; following: boolean }"
    description: "items 模式下自定义单条消息，默认渲染 SMessage。"
  - name: "default"
    type: "{ following: boolean; scrollToBottom: (smooth?: boolean) => void }"
    description: "替换默认内容。"
  - name: "controls"
    type: "{ following: boolean; unread: boolean; scrollToBottom: (smooth?: boolean) => void; scrollToTop: () => void }"
    description: "自定义边缘导航与未读反馈。"
EXPOSES:
  - name: "loadMore"
    type: "() => Promise<void>"
    description: "手动触发历史加载，复用并发保护与去重流程。"
  - name: "scrollToTop"
    type: "() => void"
    description: "组件提供的 scrollToTop 接口。"
  - name: "scrollToBottom"
    type: "(smooth?: boolean) => void"
    description: "滚到最新消息；虚拟模式直接定位，普通模式支持 smooth。"
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

在底部附近时，新内容跟随视口。向上阅读历史不会被拉回底部。向直接消息子项前面插入更早记录时会保留视口位置。悬浮向下箭头返回最新消息，圆点提示未读内容。

在消息上悬停或聚焦操作按钮显示操作栏。Agent 消息提供复制、赞、踩与重新生成；用户消息提供复制与编辑。触屏设备始终展示操作。示例支持修改提问、切换反馈和更新回答。

<template #example><message-scroller-default-zh /></template>

<template #template>

@[code{48-88}](../../.vuepress/components/message-scroller/default-zh.vue)

</template>

<template #script>

@[code{1-46}](../../.vuepress/components/message-scroller/default-zh.vue)

</template>

<template #style>

@[code{90-110}](../../.vuepress/components/message-scroller/default-zh.vue)

</template>

</card>

<card>

## 动态行高虚拟滚动

绑定 v-model:items 后自动启用动态行高虚拟滚动，内置列表仅渲染可见消息及 overscan 范围。数据使用 <doc-type type="AgentHistoryMessage[]" />，每条消息必须提供稳定、唯一的 id。换行、图片加载和流式内容增高会自动重新测量；加载更早消息时保留阅读位置，在底部时继续跟随，阅读历史时仅标记新内容。通过 <doc-type type="MessageScrollerLoadMore" /> 接入懒加载，回调返回历史消息即可，无需自行合并。组件提供并发保护、重复 id 去重、错误重试和卸载取消。此例包含用户与 Agent 对话、不同长度的回答和三页历史。virtual=false 可关闭虚拟化；不传 items 时继续使用基础示例的插槽布局。

<template #example><message-scroller-virtual-zh /></template>

<template #template>

@[code{75-120}](../../.vuepress/components/message-scroller/virtual-zh.vue)

</template>

<template #script>

@[code{1-74}](../../.vuepress/components/message-scroller/virtual-zh.vue)

</template>

<template #style>

@[code{121-141}](../../.vuepress/components/message-scroller/virtual-zh.vue)

</template>

</card>
