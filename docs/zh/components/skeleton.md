---
description: "默认和按行声明的骨架屏，支持形状组合、嵌套布局与内容切换。"
PROPS:
  - name: loading
    type: boolean
    values: "true | false"
    description: "显示骨架；false 时显示实际内容。"
    default: true
    usage: '#loading-content'
  - name: rows
    type: SkeletonRow[]
    description: "按行声明布局，省略时使用默认文本骨架。"
    default: null
    usage: '#declarative-rows'
  - name: repeat
    type: number
    description: "重复整组布局的次数，正整数。"
    default: 1
    usage: '#declarative-rows'
  - name: gap
    type: SkeletonLength
    description: "行间与行内默认间距，数字为像素，字符串为 CSS 长度。"
    default: 16
    usage: '#declarative-rows'
  - name: animation
    type: SkeletonAnimation
    values: "shimmer | pulse | none"
    description: "占位动画类型。"
    default: shimmer
    usage: '#animation'
  - name: label
    type: string
    description: "辅助技术的加载提示，默认使用本地化文本。"
    default: null
    usage: '#loading-content'
SLOTS:
  - name: default
    type: Slot
    description: "加载结束后的实际内容。"
    default: null
    usage: '#loading-content'
  - name: placeholder
    type: Slot
    description: "自定义占位内容，替换 rows 布局。"
    default: null
    usage: '#loading-content'
---

# Skeleton（骨架屏）

<card>

## 默认

不传配置即可展示标题与三行文本占位，骨架自动占满可用宽度。

<template #example>
<skeleton-default-zh />
</template>

<template #template>

@[code{1-3}](../../.vuepress/components/skeleton/default-zh.vue)

</template>

</card>

<card>

## 声明行布局

`rows` 中每一项代表一行，数组是行的简写，字符串直接生成默认形状。对象可设置 `width`、`height`、`size` 和 `flex`。`group` 嵌套多行，适合头像旁放置多条文本；`repeat` 重复整组布局，可快速组成列表。 配置类型见 <doc-type type="SkeletonRow" />、<doc-type type="SkeletonElement" />、<doc-type type="SkeletonGroup" />。

<template #example>
<skeleton-rows-zh />
</template>

<template #template>

@[code{46-56}](../../.vuepress/components/skeleton/rows-zh.vue)

</template>

<template #script>

@[code{1-45}](../../.vuepress/components/skeleton/rows-zh.vue)

</template>

<template #style>

@[code{57-64}](../../.vuepress/components/skeleton/rows-zh.vue)

</template>

</card>

<card>

## 加载与内容

通过 `loading` 切换骨架与默认插槽中的实际内容。`placeholder` 插槽可替换声明布局。让占位尺寸与真实内容相近，可保持切换稳定；Skeleton 不负责请求数据。

<template #example>
<skeleton-loading-zh />
</template>

<template #template>

@[code{20-38}](../../.vuepress/components/skeleton/loading-zh.vue)

</template>

<template #script>

@[code{1-19}](../../.vuepress/components/skeleton/loading-zh.vue)

</template>

<template #style>

@[code{39-69}](../../.vuepress/components/skeleton/loading-zh.vue)

</template>

</card>

<card>

## 动画

可选择流光、呼吸或静态显示。系统开启减少动态效果时自动停用动画。占位颜色跟随主题，适配浅色与深色模式。

<template #example>
<skeleton-animation-zh />
</template>

<template #template>

@[code{1-16}](../../.vuepress/components/skeleton/animation-zh.vue)

</template>

<template #style>

@[code{17-27}](../../.vuepress/components/skeleton/animation-zh.vue)

</template>

</card>
