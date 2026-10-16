---
PROPS:
  - name: title
    type: String
    values: "文档标题"
    description: 打印窗口标题。
    default: document title
  - name: print-style
    type: String
    values: "CSS 文本"
    description: 注入打印窗口的额外 CSS。
    default: "''"
  - name: auto-close
    type: Boolean
    values: "true / false"
    description: 打印后关闭打印窗口。
    default: 'true'
METHODS:
  - name: print
    description: 打开仅包含默认插槽内容的打印窗口。
EVENTS:
  - name: before-print
    description: 打印生命周期事件。
  - name: after-print
    description: 打印生命周期事件。
  - name: error
    description: 打印生命周期事件。
description: "局部打印容器。"
---

# Print 打印

<card>

## 发票预览

屏幕预览跟随当前主题；打印使用白底深色文字，不会把夜间预览的深色底带到纸面。

<template #example><print-zh-default /></template>

<template #template>

@[code{6-17}](../../.vuepress/components/print-zh/default.vue)

</template>

<template #script>

@[code{1-4}](../../.vuepress/components/print-zh/default.vue)

</template>

<template #style>

@[code{19-61}](../../.vuepress/components/print-zh/default.vue)

</template>

</card>
