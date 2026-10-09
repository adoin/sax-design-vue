---
PROPS:
  - name: texture
    type: String
    values: 'default | bubbles | waves | sparkle'
    description: 已填充区域的装饰纹理；default 保持纯色填充，纹理不会覆盖未完成区域。
    default: default
    usage: '#textures'
  - name: texture-animated
    type: Boolean
    values: 'true | false'
    description: 是否播放纹理动画。减少动态效果、页面隐藏、离开视口、组件失活或进度完成时暂停；不影响不确定进度段自身的移动。
    default: true
    usage: '#textures'
  - name: texture-duration
    type: Number
    values: '非负毫秒数'
    description: 一轮纹理动画时长；零表示静态纹理。
    default: 2000
    usage: '#texture-controls'
  - name: texture-opacity
    type: Number
    values: '0 - 1'
    description: 纹理层透明度；零隐藏纹理，一按图案本身的强度完整显示。
    default: 0.6
    usage: '#texture-controls'
  - name: height
    type: Number | String
    values: "CSS height"
    description: 进度条高度；数字及数字字符串使用像素，其他字符串可使用 CSS 长度单位。
    default: 5
    link: null
    usage: '#height'

  - name: indeterminate
    type: Boolean
    values: "true, false"
    description: 不确定进度动画。
    default: false
    link: null
    usage: '#indeterminate'

  - name: percent
    type: Number
    values: "0 - 100"
    description: 确定进度百分比，限制在 0–100；非有限值显示为零。
    default: 0
    link: null
    usage: '#default'

  - name: color
    type: String
    values: "primary | success | danger | warn | warning | dark | light | text | secondary | info | HEX | RGB | HSL"
    description: 进度条颜色。
    default: primary
    link: null
    usage: '#colors'
EVENTS: []
EXPOSES: []
description: "展示确定或不确定的加载进度。"
NEWS:
  - default
  - color
  - indeterminate
  - height
  - textures
  - texture-controls
  - textured-indeterminate
---

# Progress 进度条

<card>

## 默认


绑定 0–100 的 `percent` 显示标准进度条。

<template #example>
<progress-default />
</template>

<template #template>

@[code{1-9}](../../.vuepress/components/progress/default.vue)

</template>

<template #style>

@[code{11-19}](../../.vuepress/components/progress/default.vue)

</template>

</card>

<card>

## 颜色


应用主题色以匹配界面上下文。悬停进度条可查看默认插槽文字 tooltip。

<template #example>
<progress-color />
</template>

<template #template>

@[code{1-8}](../../.vuepress/components/progress/color.vue)

</template>

<template #style>

@[code{10-18}](../../.vuepress/components/progress/color.vue)

</template>

</card>

<card>

## 不确定


对未知时长操作使用 `indeterminate`。

<template #example>
<progress-indeterminate />
</template>

<template #template>

@[code{1-5}](../../.vuepress/components/progress/indeterminate.vue)

</template>

<template #style>

@[code{7-15}](../../.vuepress/components/progress/indeterminate.vue)

</template>

</card>

<card>

## 高度


通过 `height` 调整进度条粗细。

<template #example>
<progress-height />
</template>

<template #template>

@[code{1-6}](../../.vuepress/components/progress/height.vue)

</template>

<template #style>

@[code{8-16}](../../.vuepress/components/progress/height.vue)

</template>

</card>

<card>

## 填充纹理

通过 `texture` 选择气泡、海浪或星光，`default` 保持纯色。纹理只覆盖已完成部分，并保留进度条底色。拖动滑块可以比较相同进度下的不同纹理；0% 或 100% 时纹理运动暂停。

<template #example><progress-zh-textures /></template>

<template #template>

@[code{15-46}](../../.vuepress/components/progress-zh/textures.vue)

</template>

<template #script>

@[code{1-13}](../../.vuepress/components/progress-zh/textures.vue)

</template>

<template #style>

@[code{48-89}](../../.vuepress/components/progress-zh/textures.vue)

</template>

</card>

<card>

## 纹理控制

`texture-duration` 以毫秒设置一轮动画时长，零表示静态纹理。`texture-opacity` 调整装饰强度。图案按实际进度条高度等比缩放，CSS 长度也适用；可在这里比较 5、8、16 和 32px。海浪连续抬升、卷起并下拍，相邻波峰错开；星光以错开的节奏改变亮度和光芒大小。

<template #example><progress-zh-texture-controls /></template>

<template #template>

@[code{21-79}](../../.vuepress/components/progress-zh/texture-controls.vue)

</template>

<template #script>

@[code{1-20}](../../.vuepress/components/progress-zh/texture-controls.vue)

</template>

<template #style>

@[code{80-121}](../../.vuepress/components/progress-zh/texture-controls.vue)

</template>

</card>

<card>

## 不确定进度纹理

纹理也可附着在移动的不确定进度段上。`texture-animated=false` 只冻结图案，加载段仍然移动。自动运动在离开视口或页面隐藏时暂停；系统减少动态效果时显示静止的加载段和纹理。

<template #example><progress-zh-textured-indeterminate /></template>

<template #template>

@[code{17-38}](../../.vuepress/components/progress-zh/textured-indeterminate.vue)

</template>

<template #script>

@[code{1-15}](../../.vuepress/components/progress-zh/textured-indeterminate.vue)

</template>

<template #style>

@[code{40-81}](../../.vuepress/components/progress-zh/textured-indeterminate.vue)

</template>

</card>
