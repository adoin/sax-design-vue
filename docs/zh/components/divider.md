---
PROPS:
  - name: position
    type: String
    values: left, left-center, center, right-center, right
    description: 文本/图标在线条上的位置。
    default: center
    link: null
    usage: '#position'

  - name: color
    type: String
    values: primary, success, danger, warning, dark, RGB, HEX
    description: 线条与文本颜色（主题色、RGB、HEX）。
    default: rgba(0,0,0,.1)
    link: null
    usage: '#color'

  - name: background
    type: String
    values: primary, success, danger, warning, dark, RGB, HEX
    description: 分割线文本背后的背景色。
    default: transparent
    link: null
    usage: '#background'

  - name: icon
    type: String
    values: Material icon name
    description: 用图标替代插槽文本。
    default: null
    link: null
    usage: '#icons'

  - name: icon-pack
    type: String
    values: Icon pack class
    description: 图标字体类名（如 material-icons）。
    default: material-icons
    link: null
    usage: '#icons'

  - name: border-style
    type: String
    values: solid, dashed, dotted
    description: 线条的 CSS 边框样式。
    default: solid
    link: null
    usage: '#style'

  - name: border-height
    type: String
    values: CSS size
    description: 分割线边框宽度。
    default: 1px
    link: null
    usage: '#style'
EVENTS: []
EXPOSES: []
description: "在文本或区块之间添加分割线，支持颜色、图标与多种布局。"
NEWS:
  - default
  - text
  - position
  - color
  - background
  - icons
  - style
---

# 分割线

<card>

## 默认


使用 `vs-divider` 在内容块之间添加水平分割线。

<template #example>
<divider-default />
</template>

<template #template>

@[code{1-7}](../.vuepress/components/divider/default.vue)

</template>

<template #style>

@[code{9-17}](../.vuepress/components/divider/default.vue)

</template>

</card>

<card>

## 文本


在分割线内放置文本以标注区块分隔。

<template #example>
<divider-text />
</template>

<template #template>

@[code{1-5}](../.vuepress/components/divider/text.vue)

</template>

<template #style>

@[code{7-15}](../.vuepress/components/divider/text.vue)

</template>

</card>

<card>

## 文本位置


通过 `position` 控制文本对齐：left、left-center、center、right-center、right。

<template #example>
<divider-position />
</template>

<template #template>

@[code{1-9}](../.vuepress/components/divider/position.vue)

</template>

<template #style>

@[code{11-19}](../.vuepress/components/divider/position.vue)

</template>

</card>

<card>

## 颜色


使用 Vuesax 色板名、RGB 或 HEX 更改线条与标签颜色。

<template #example>
<divider-color />
</template>

<template #template>

@[code{1-12}](../.vuepress/components/divider/color.vue)

</template>

<template #style>

@[code{14-22}](../.vuepress/components/divider/color.vue)

</template>

</card>

<card>

## 背景


通过 `background` 高亮分割线文本背景。

<template #example>
<divider-background />
</template>

<template #template>

@[code{1-12}](../.vuepress/components/divider/background.vue)

</template>

<template #style>

@[code{14-22}](../.vuepress/components/divider/background.vue)

</template>

</card>

<card>

## 图标


通过 `icon` 在分割线内使用 Material Icons。

<template #example>
<divider-icons />
</template>

<template #template>

@[code{1-10}](../.vuepress/components/divider/icons.vue)

</template>

<template #style>

@[code{12-20}](../.vuepress/components/divider/icons.vue)

</template>

</card>

<card>

## 样式


使用 `border-style`（solid、dashed、dotted）切换线条样式。

<template #example>
<divider-style />
</template>

<template #template>

@[code{1-7}](../.vuepress/components/divider/style.vue)

</template>

<template #style>

@[code{9-17}](../.vuepress/components/divider/style.vue)

</template>

</card>

<card>

## API

</card>
