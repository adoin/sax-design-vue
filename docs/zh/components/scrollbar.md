---
description: "提供可编程控制的自定义滚动区域。"
PROPS:
  - name: height
    type: String, Number
    values: number
    description: 滚动条高度。
    default:
    link: null
    usage: '#default'
    code: null

  - name: max-height
    type: String, Number
    values: number
    description: 滚动条最大高度。
    default: null
    link: null
    usage: '#max-height'
    code: null

  - name: native
    type: Boolean
    values: true, false
    description: 是否使用原生滚动条。
    default: false
    link: null
    usage: null
    code: null

  - name: wrap-style
    type: String, Object, Array
    values: CSSProperties, CSSProperties[], string[]
    description: 外层容器样式。
    default: null
    link: null
    usage: null
    code: null

  - name: wrap-class
    type: String
    values: string
    description: 外层容器类名。
    default: null
    link: null
    usage: null
    code: null

  - name: view-style
    type: String, Object, Array
    values: CSSProperties, CSSProperties[], string[]
    description: 内容容器样式。
    default: null
    link: null
    usage: null
    code: null

  - name: view-class
    type: String
    values: string
    description: 内容容器类名。
    default: null
    link: null
    usage: null
    code: null

  - name: noresize
    type: Boolean
    values: true, false
    description: 不响应容器尺寸变化；容器尺寸固定时建议开启以优化性能。
    default: false
    link: null
    usage: null
    code: null

  - name: tag
    type: string
    values: HTML Tag
    description: 内容区域元素标签。
    default: div
    link: null
    usage: null
    code: null

  - name: always
    type: Boolean
    values: true, false
    description: 始终显示滚动条。
    default: true
    link: null
    usage: null
    code: null

  - name: min-size
    type: Number
    values:
    description: 滚动条最小尺寸。
    default: 20
    link: null
    usage: null
    code: null

  - name: thickness
    type: Number, String
    values: number
    description: 滑块宽度。
    default: 6
    link: null
    usage: null
    code: null

EVENTS:
  - name: scroll
    type: function
    values: '({ scrollLeft: number, scrollTop: number }) => void'
    description: 滚动时触发，返回滚动距离。
    default: null
    link: null
    usage: null
    code: null

SLOTS:
  - name: default
    type: slot
    values:
    description: 自定义默认内容。
    default: null
    example: null
    link: null
    usage: null
    code: null

EXPOSES:
  - name: handleScroll
    type: function
    values: '() => void'
    description: 处理滚动事件。
    default: null
    example: null
    link: null
    usage: null
    code: null

  - name: scrollTo
    type: function
    values: '(options: ScrollToOptions | number, yCoord?: number) => void'
    description: 滚动到指定坐标。
    default: null
    example: null
    link: null
    usage: null
    code: null

  - name: setScrollTop
    type: function
    values: '(scrollTop: number) => void'
    description: 设置距顶部滚动距离。
    default: null
    example: null
    link: null
    usage: null
    code: null

  - name: setScrollLeft
    type: function
    values: '(scrollLeft: number) => void'
    description: 设置距左侧滚动距离。
    default: null
    example: null
    link: null
    usage: null
    code: null

  - name: update
    type: function
    values: '() => void'
    description: 手动更新滚动条状态。
    default: null
    example: null
    link: null
    usage: null
    code: null

  - name: wrapRef
    type: object
    values: 'Ref HTMLElement'
    description: 滚动条外层容器引用。
    default: null
    example: null
    link: null
    usage: null
    code: null
---

# Scrollbar（滚动条）

<card>

## 默认

<docs-warn />

用于替代浏览器原生滚动条。

使用 `height` 设置滚动条高度；未设置时会适应父容器高度。

<template #example>
<scrollbar-default />
</template>

<template #template>

@[code{1-5}](../../.vuepress/components/scrollbar/default.vue)

</template>
<template #style>

@[code{7-19}](../../.vuepress/components/scrollbar/default.vue)

</template>

</card>

<card>

## 水平滚动

元素宽度大于滚动区域宽度时，会显示水平滚动条。

<template #example>
<scrollbar-hirizontal />
</template>

<template #template>

@[code{1-9}](../../.vuepress/components/scrollbar/hirizontal.vue)
</template>

<template #style>

@[code{11-28}](../../.vuepress/components/scrollbar/hirizontal.vue)
</template>

</card>

<card>

## 最大高度

仅当元素高度超过最大高度时显示滚动条。

<template #example>
<scrollbar-max-height />
</template>

<template #template>

@[code{1-11}](../../.vuepress/components/scrollbar/max-height.vue)
</template>

<template #script>

@[code{13-25}](../../.vuepress/components/scrollbar/max-height.vue)
</template>

<template #style>

@[code{27-39}](../../.vuepress/components/scrollbar/max-height.vue)
</template>

</card>
