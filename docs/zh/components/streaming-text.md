---
description: "安全渐显累积文本，支持暂停、重播与减少动态效果偏好。"
PROPS:
  - name: "text"
    type: "String"
    description: "累积的纯文本回答；追加片段会继续展示，替换前缀会重新开始。"
    default: "''"
    usage: "#default"
  - name: "interval"
    type: "Number"
    description: "展示间隔，单位毫秒；0 立即显示全部，长文本最多使用 200 次推进。"
    default: "18"
    usage: "#default"
  - name: "paused"
    type: "Boolean"
    description: "暂停展示并保留当前位置。"
    default: "false"
    usage: "#default"
  - name: "animate"
    type: "Boolean"
    description: "启用渐显；减少动态效果偏好下会立即显示文本。"
    default: "true"
    usage: "#default"
  - name: "streaming"
    type: "Boolean"
    description: "生产方是否仍在输出，与本地渐显完成状态相互独立。"
    default: "false"
    usage: "#default"
EVENTS:
  - name: "finish"
    type: "() => void"
    description: "当前累积文本已展示完成，包含空文本；不表示生产方停止输出。"
SLOTS:
  - name: "default"
    type: "Slot"
    scope: "{ text: string; busy: boolean; chunks: { text: string; key: string }[]; paragraphs: { text: string; key: string }[][]; wordClass: string }"
    description: "使用安全文本块、分段数组和 wordClass 动画类渲染结构化内容。"
EXPOSES:
  - name: "finish"
    type: "() => void"
    description: "组件提供的 finish 接口。"
  - name: "replay"
    type: "() => void"
    description: "组件提供的 replay 接口。"
---

# Streaming Text（流式文本）

<card>

## 基础用法

新文字先以短暂的蓝紫粉渐变出现，再恢复正文颜色。完成后保留耗时状态栏与完整回答。示例组合 Code Block，展示 Terminal 面板渐入与命令逐步输出；命令只展示，不执行。

将新片段追加到 text。暂停保留展示位置；替换前缀会重新开始。finish 显示全部剩余文本，replay 重播当前回答；streaming 独立反映生产方状态，不由 finish 事件自动决定。

<template #example><streaming-text-default-zh /></template>

<template #template>

@[code{26-83}](../../.vuepress/components/streaming-text/default-zh.vue)

</template>

<template #script>

@[code{1-24}](../../.vuepress/components/streaming-text/default-zh.vue)

</template>

<template #style>

@[code{85-121}](../../.vuepress/components/streaming-text/default-zh.vue)

</template>

</card>
