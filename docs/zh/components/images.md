---
PROPS:
  - name: hover
    type: String
    values: default, blur, zoom, dark, scale, curtain
    description: 悬停动画样式。
    default: default
    link: null
    usage: '#hover'

  - name: alternating
    type: Boolean
    values: true, false
    description: 交替项偏移。
    default: false
    link: null
    usage: '#more'

  - name: not-border-radius
    type: Boolean
    values: true, false
    description: Disable rounded corners.
    default: false
    link: null
    usage: '#more'

  - name: not-margin
    type: Boolean
    values: true, false
    description: Remove item margins.
    default: false
    link: null
    usage: '#more'

  - name: src
    type: String
    values: URL
    description: Image source (vs-image).
    default: null
    link: null
    usage: '#default'
EVENTS: []
EXPOSES: []
description: "响应式图片网格，支持悬停动效与布局选项。"
NEWS:
  - default
  - hover
  - more
---

# 图片

<card>

## 默认


在 `vs-images` 内放置 `vs-image` 元素。

<template #example>
<images-default />
</template>

<template #template>

@[code{1-8}](../.vuepress/components/images/default.vue)

</template>

</card>

<card>

## 悬停


选择悬停动画：zoom、blur、dark、scale、curtain。

<template #example>
<images-hover />
</template>

<template #template>

@[code{1-12}](../.vuepress/components/images/hover.vue)

</template>

<template #style>

@[code{14-22}](../.vuepress/components/images/hover.vue)

</template>

</card>

<card>

## 更多


通过 `alternating` 与 margin 属性微调间距与圆角。

<template #example>
<images-more />
</template>

<template #template>

@[code{1-8}](../.vuepress/components/images/more.vue)

</template>

</card>

<card>

## API

</card>
