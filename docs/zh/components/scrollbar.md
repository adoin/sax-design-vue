---
description: '提供可编程控制的自定义滚动区域。'
PROPS:
  - name: v-model:x
    type: Number
    values: 0–100
    description: 横向滚动百分比，范围 0–100。0 为行内起点（RTL 为右侧）；写入数值会滚动到对应位置。
    default: null
    usage: "#scroll-progress"

  - name: v-model:y
    type: Number
    values: 0–100
    description: 纵向滚动百分比，范围 0–100；写入数值会滚动到对应位置。
    default: null
    usage: "#scroll-progress"

  - name: placement
    type: String
    values: 'inside, outside'
    description: 自定义滚动轨道的位置。outside 在内容区外预留独立空间；native 模式不生效。
    default: inside
    usage: '#outside-scrollbars'

  - name: gap
    type: Number
    values: 'number'
    description: 外置轨道与内容区的间距，单位 px；负数按 0 处理。
    default: 6
    usage: '#outside-scrollbars'

  - name: height
    type: String, Number
    values: 'number'
    description: 滚动条高度。
    default:
    link: null
    usage: '#default'
    code: null

  - name: max-height
    type: String, Number
    values: 'number'
    description: 滚动条最大高度。
    default: null
    link: null
    usage: '#max-height'
    code: null

  - name: native
    type: Boolean
    values: 'true, false'
    description: 是否使用原生滚动条。
    default: false
    link: null
    usage: null
    code: null

  - name: fade
    type: ScrollbarFade
    values: 'false | true | y | x | top/t | bottom/b | left/l | right/r | start/s | end/e | number | ScrollbarFadeOptions'
    description: 随滚动状态变化的内容边缘渐隐。`true` 表示纵向两端，数字表示纵向渐隐像素尺寸，配置对象可指定方向与 CSS 尺寸。
    default: false
    usage: '#edge-fade'

  - name: wrap-style
    type: String, Object, Array
    values: 'CSSProperties, CSSProperties[], string[]'
    description: 外层容器样式。
    default: null
    link: null
    usage: null
    code: null

  - name: wrap-class
    type: String
    values: 'string'
    description: 外层容器类名。
    default: null
    link: null
    usage: null
    code: null

  - name: view-style
    type: String, Object, Array
    values: 'CSSProperties, CSSProperties[], string[]'
    description: 内容容器样式。
    default: null
    link: null
    usage: null
    code: null

  - name: view-class
    type: String
    values: 'string'
    description: 内容容器类名。
    default: null
    link: null
    usage: null
    code: null

  - name: noresize
    type: Boolean
    values: 'true, false'
    description: 不响应容器尺寸变化；容器尺寸固定时建议开启以优化性能。
    default: false
    link: null
    usage: null
    code: null

  - name: tag
    type: string
    values: 'HTML Tag'
    description: 内容区域元素标签。
    default: div
    link: null
    usage: null
    code: null

  - name: always
    type: Boolean
    values: 'true, false'
    description: 始终显示滚动条。
    default: true
    link: null
    usage: null
    code: null

  - name: min-size
    type: Number
    values: ''
    description: 滚动条最小尺寸。
    default: 20
    link: null
    usage: null
    code: null

  - name: thickness
    type: Number, String
    values: 'number'
    description: 滑块宽度。
    default: 6
    link: null
    usage: null
    code: null

EVENTS:
  - name: update:x
    type: function
    values: "(value: number) => void"
    description: 实际滚动百分比变化时触发，包含滚动与容器或内容尺寸变化。
    default: null
    usage: "#scroll-progress"

  - name: update:y
    type: function
    values: "(value: number) => void"
    description: 实际滚动百分比变化时触发，包含滚动与容器或内容尺寸变化。
    default: null
    usage: "#scroll-progress"

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
    values: ''
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

# Scrollbar 滚动条

<card>

## 滚动进度与动画

用 `v-model:x`、`v-model:y` 读写 0–100 的滚动百分比，按可滚动距离计算，而非内容总尺寸。可以只绑定一个轴；不需要反向控制时，使用 `@update:y` 等事件即可。直接将数值映射到位移、旋转、透明度或 CSS 变量，无需动画依赖。接入 [GSAP](https://gsap.com/docs/v3/GSAP/Timeline/progress()/) 时，将百分比除以 100 后传给已暂停时间线的 `progress()`；不要在每次滚动时重新创建时间线。

值保留小数，越界值限制到 0–100，非有限值忽略；没有溢出的轴为 0。容器或内容尺寸变化时保留实际像素位置并重新计算百分比，临时隐藏时保留最近进度，重新可见后恢复。设置 `noresize` 后，内容变化需手动调用 `update()`。程序化平滑滚动也会持续输出实际进度；读取事件不会启动新的滚动。

<template #example>
<scrollbar-zh-progress />
</template>

<template #template>

@[code{18-43}](../../.vuepress/components/scrollbar-zh/progress.vue)

</template>

<template #script>

@[code{1-16}](../../.vuepress/components/scrollbar-zh/progress.vue)

</template>

<template #style>

@[code{45-112}](../../.vuepress/components/scrollbar-zh/progress.vue)

</template>

</card>

<card>

## 边缘渐隐

设置 `fade`，提示滚动区域边缘之外仍有内容。`true` 与 `"y"` 表示纵向两端，`"x"` 表示横向两端；`top`、`bottom`、`left`、`right` 指定物理边，`start`、`end` 会跟随文字方向，也支持与 shadcn utility 一致的 `t`、`b`、`l`、`r`、`s`、`e` 缩写。数字表示纵向渐隐的像素尺寸，`{ direction, size }` 可以同时传入方向和 CSS 长度或百分比。

渐隐跟随实际溢出和滚动位置：内容没有溢出时不会遮罩，到达某一边缘时该侧渐隐自动消失。实现复用 Scrollbar 已有的测量，不增加第二个滚动容器。

<template #example>
<scrollbar-zh-fade />
</template>

<template #template>

@[code{21-33}](../../.vuepress/components/scrollbar-zh/fade.vue)

</template>

<template #script>

@[code{1-19}](../../.vuepress/components/scrollbar-zh/fade.vue)

</template>

<template #style>

@[code{35-61}](../../.vuepress/components/scrollbar-zh/fade.vue)

</template>

</card>

<card>

## 外置滚动条

设置 `placement="outside"`，将横向和纵向轨道放在内容区外侧，滑块不会遮挡内容。使用 `gap` 调整轨道间距，`thickness` 调整粗细；颜色沿用组件的 HSL 主色。

本例使用 `max-height`，减少条目后内容区会自动收缩，仅在溢出方向显示轨道。外侧轨道占用组件自身空间，不需要负偏移，也不必修改父容器的 overflow。

支持拖动滑块、点击轨道、滚轮和触控板；Tab 聚焦内容区后可使用方向键滚动。关闭 `always` 后，鼠标移出会隐藏轨道，但保留轨道空间，避免布局跳动。

<template #example>
<scrollbar-zh-outside />
</template>

<template #template>

@[code{9-33}](../../.vuepress/components/scrollbar-zh/outside.vue)

</template>

<template #script>

@[code{1-7}](../../.vuepress/components/scrollbar-zh/outside.vue)

</template>

<template #style>

@[code{35-66}](../../.vuepress/components/scrollbar-zh/outside.vue)

</template>

</card>

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
