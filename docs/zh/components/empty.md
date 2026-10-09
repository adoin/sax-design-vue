---
description: 用于暂无内容或没有匹配结果的状态，提供可配置的动态 SVG 插画。
PROPS:
  - name: image
    type: String
    values: URL
    description: 自定义图片地址；传入后替换内置 SVG，不播放内置动画。
    default: null
    usage: '#custom-image'
  - name: image-size
    type: Number | String
    values: CSS size
    description: 设置插画容器宽高；数字单位为 px。未传时默认容器为 160 × 128px。
    default: null
    usage: '#image-size'
  - name: description
    type: String
    values: text
    description: 空状态提示文本。
    default: null
    usage: '#default'
  - name: animated
    type: Boolean
    values: true | false
    description: 是否启用内置开盒动画：播放一次，短暂出现星芒后停在打开状态。系统减少动态效果时显示静态插画；离开视口或页面隐藏时暂停。自定义图片和 image 插槽不受影响。
    default: true
    usage: '#animation'
SLOTS:
  - name: image
    description: 替换整个插画区域；优先于 image 属性和内置 SVG。
    usage: '#slots'
  - name: description
    description: 自定义空状态提示内容。
    usage: '#slots'
  - name: default
    description: 提示下方的操作区域。
    usage: '#default'
---

# Empty（空状态）

<card>

## 默认

默认插画以敞开的空盒表达暂无内容，空盒内部清晰可见。通过 description 提供原因，在默认插槽中添加下一步操作。

<template #example><empty-zh-default /></template>

<template #template>

@[code{1-5}](../../.vuepress/components/empty-zh/default.vue)

</template>

</card>

<card>

## 动画

通过 animated 控制内置插画的播放。三个长方形盒盖从半开状态同步打开，露出空盒内部；几颗亮光星芒短暂出现后淡出，盒子保持打开。示例提供重播按钮；在应用中，可重新挂载实例或重新启用 animated 来重播。系统减少动态效果时自动显示静态场景；离开视口或页面隐藏时暂停。

<template #example><empty-zh-animation /></template>

<template #template>

@[code{7-27}](../../.vuepress/components/empty-zh/animation.vue)

</template>

<template #script>

@[code{1-5}](../../.vuepress/components/empty-zh/animation.vue)

</template>

<template #style>

@[code{29-43}](../../.vuepress/components/empty-zh/animation.vue)

</template>

</card>

<card>

## 插画尺寸

image-size 同时设置插画容器的宽度和高度，SVG 保持长宽比。数字使用 px，也支持 CSS 长度；自定义图片同样使用这个尺寸。

<template #example><empty-zh-size /></template>

<template #template>

@[code{6-17}](../../.vuepress/components/empty-zh/size.vue)

</template>

<template #script>

@[code{1-4}](../../.vuepress/components/empty-zh/size.vue)

</template>

<template #style>

@[code{19-26}](../../.vuepress/components/empty-zh/size.vue)

</template>

</card>

<card>

## 自定义图片

传入 image 替换默认 SVG。自定义图片使用 object-fit: contain，不会附加内置动画。

<template #example><empty-zh-image /></template>

<template #template>

@[code{1-7}](../../.vuepress/components/empty-zh/image.vue)

</template>

</card>

<card>

## 插槽

image 插槽替换插画区域并优先于 image 属性；description 插槽用于自定义说明，默认插槽放置操作。

<template #example><empty-zh-slots /></template>

<template #template>

@[code{1-7}](../../.vuepress/components/empty-zh/slots.vue)

</template>

</card>
