---
PROPS:
  - name: direction
    type: String
    values: 'horizontal, vertical'
    description: 分割线方向；竖线用于行内内容之间。
    default: horizontal
    link: null
    usage: '#vertical'

  - name: position
    type: String
    values: 'left, left-center, center, right-center, right'
    description: 水平分割线标签的位置。
    default: center
    link: null
    usage: '#position'

  - name: variant
    type: String
    values: 'plain, soft, solid'
    description: 标签样式；plain 不铺底色，soft 使用浅色调，solid 使用强调色。
    default: plain
    link: null
    usage: '#variant'

  - name: color
    type: String
    values: 'default, primary, success, warning, danger, dark, RGB, HEX'
    description: 线条与标签的强调色；线条会弱化，保持标签易读。
    default: default
    link: null
    usage: '#color'

  - name: background
    type: String
    values: '主题色、RGB、HEX 或 CSS 颜色'
    description: 可选的标签表面实色；不透明 HEX/RGB/HSL 色自动选择黑字或白字，其他 CSS 颜色可用 label-color 指定。
    default: transparent
    link: null
    usage: '#background'

  - name: label-color
    type: String
    values: '主题色、RGB、HEX 或 CSS 颜色'
    description: 显式指定标签文字颜色，覆盖 variant 和 background 的自动颜色。
    default: null
    link: null
    usage: '#background'

  - name: gap
    type: String
    values: 'CSS 尺寸'
    description: 水平线段与标签之间的间距。
    default: 12px
    link: null
    usage: '#configurator'

  - name: icon
    type: String
    values: '图标名称'
    description: 用图标替代插槽文本；仅图标分割线应提供无障碍名称。
    default: null
    link: null
    usage: '#icons'

  - name: border-style
    type: String
    values: 'solid, dashed, dotted'
    description: 线条的 CSS 边框样式。
    default: solid
    link: null
    usage: '#style'

  - name: border-height
    type: String
    values: 'CSS size'
    description: 线条粗细，水平与竖线模式均生效。
    default: 1px
    link: null
    usage: '#style'
EVENTS: []
EXPOSES: []
description: '用克制的线条、融入线条的标签或可选强调样式分隔内容。'
NEWS:
  - default
  - vertical
  - text
  - position
  - variant
  - color
  - background
  - icons
  - style
  - configurator
---

# Divider 分割线

<card>

## 默认

使用 `s-divider` 在内容块之间添加水平分割线。

<template #example>
<divider-zh-default />
</template>

<template #template>

@[code{1-7}](../../.vuepress/components/divider-zh/default.vue)

</template>

<template #style>

@[code{9-17}](../../.vuepress/components/divider-zh/default.vue)

</template>

</card>

<card>

## 竖线

设置 `direction="vertical"` 在同一行的文字、链接或操作之间添加竖向分隔。竖线高度随当前字号缩放；竖线模式不渲染文本或图标内容。

<template #example>
<divider-zh-vertical />
</template>

<template #template>

@[code{1-23}](../../.vuepress/components/divider-zh/vertical.vue)

</template>

<template #style>

@[code{25-40}](../../.vuepress/components/divider-zh/vertical.vue)

</template>

</card>

<card>

## 文本

在分割线内放置简短标签。默认的朴素样式不铺底色，线条在标签两侧自然留白。

<template #example>
<divider-zh-text />
</template>

<template #template>

@[code{1-5}](../../.vuepress/components/divider-zh/text.vue)

</template>

<template #style>

@[code{7-15}](../../.vuepress/components/divider-zh/text.vue)

</template>

</card>

<card>

## 文本位置

通过 `position` 将标签放在起点、四分之一处、中心、四分之三处或终点；每种位置都保留线条与标签之间的间距。

<template #example>
<divider-zh-position />
</template>

<template #template>

@[code{1-9}](../../.vuepress/components/divider-zh/position.vue)

</template>

<template #style>

@[code{11-19}](../../.vuepress/components/divider-zh/position.vue)

</template>

</card>

<card>

## 标签样式

`plain` 适合安静的章节标签，`soft` 使用低对比度浅色表面，`solid` 则形成小面积强调标记。线条布局与标签位置不随样式改变。

<template #example>
<divider-zh-variant />
</template>

<template #template>

@[code{1-7}](../../.vuepress/components/divider-zh/variant.vue)

</template>

<template #style>

@[code{9-16}](../../.vuepress/components/divider-zh/variant.vue)

</template>

</card>

<card>

## 颜色

使用主题色或 CSS 颜色作为强调色。线条保持克制，标签仍有可读的对比度；省略 `color` 时使用中性色。

<template #example>
<divider-zh-color />
</template>

<template #template>

@[code{1-10}](../../.vuepress/components/divider-zh/color.vue)

</template>

<template #style>

@[code{12-20}](../../.vuepress/components/divider-zh/color.vue)

</template>

</card>

<card>

## 背景

仅在标签需要自定义表面时设置 `background`。标签仍保持圆润、紧凑；不透明 HEX/RGB/HSL 色会按对比度自动选择黑字或白字。需要覆盖自动结果或使用其他 CSS 颜色时，可设置 `label-color`。深色主题背景会自动使用浅色文字。

<template #example>
<divider-zh-background />
</template>

<template #template>

@[code{1-12}](../../.vuepress/components/divider-zh/background.vue)

</template>

<template #style>

@[code{14-22}](../../.vuepress/components/divider-zh/background.vue)

</template>

</card>

<card>

## 图标

使用 `icon` 放置紧凑的视觉标记。仅图标分割线应通过 `aria-label` 描述分隔的内容。

<template #example>
<divider-zh-icons />
</template>

<template #template>

@[code{1-12}](../../.vuepress/components/divider-zh/icons.vue)

</template>

<template #style>

@[code{14-22}](../../.vuepress/components/divider-zh/icons.vue)

</template>

</card>

<card>

## 样式

用 `border-style` 和 `border-height` 分别设置线型与粗细，不影响标签样式。

<template #example>
<divider-zh-style />
</template>

<template #template>

@[code{1-11}](../../.vuepress/components/divider-zh/style.vue)

</template>

<template #style>

@[code{13-21}](../../.vuepress/components/divider-zh/style.vue)

</template>

</card>

<card>

## 配置预览

组合方向、内容、位置、间距、标签样式、强调色、自定义背景、线型与粗细。竖线只使用线条配置；横线可显示文字或图标。

<template #example>
<divider-zh-configurator />
</template>

<template #template>

@[code{76-192}](../../.vuepress/components/divider-zh/configurator.vue)

</template>

<template #script>

@[code{1-74}](../../.vuepress/components/divider-zh/configurator.vue)

</template>

<template #style>

@[code{194-267}](../../.vuepress/components/divider-zh/configurator.vue)

</template>

</card>
