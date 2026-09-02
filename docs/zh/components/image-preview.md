---
PROPS:
  - name: v-model
    type: Boolean
    values: 'true | false'
    description: 控制预览层是否显示。
    default: 'false'
  - name: url-list
    type: Array
    values: 'string[]'
    description: 预览器展示的图片地址列表。
    default: '[]'
  - name: alt-list
    type: Array
    values: 'string[]'
    description: 与 url-list 一一对应的无障碍图片描述。
    default: '[]'
  - name: initial-index
    type: Number
    values: 'number >= 0'
    description: 打开预览时首先展示的图片下标。
    default: '0'
  - name: infinite
    type: Boolean
    values: 'true | false'
    description: 切换到首尾图片时是否循环导航。
    default: 'true'
  - name: hide-on-click-modal
    type: Boolean
    values: 'true | false'
    description: 点击图片外的空白遮罩时是否关闭预览。
    default: 'true'
  - name: close-on-press-escape
    type: Boolean
    values: 'true | false'
    description: 按下 Esc 时是否关闭预览。
    default: 'true'
  - name: show-toolbar
    type: Boolean
    values: 'true | false'
    description: 是否显示缩放、旋转、尺寸切换和重置工具。
    default: 'true'
  - name: wheel-zoom
    type: Boolean
    values: 'true | false'
    description: 是否允许滚轮以指针位置为中心缩放图片。
    default: 'true'
  - name: draggable
    type: Boolean
    values: 'true | false'
    description: 放大后是否允许使用指针拖动图片。
    default: 'true'
  - name: zoom-rate
    type: Number
    values: 'number > 1'
    description: 每次缩放操作使用的倍率。
    default: '1.2'
  - name: min-scale
    type: Number
    values: 'number > 0'
    description: 手动缩放的最小倍率；超大图片在适应窗口模式下可以更小。
    default: '0.2'
  - name: max-scale
    type: Number
    values: 'number > 0'
    description: 最大缩放倍率。
    default: '7'
  - name: z-index
    type: Number
    values: '层级数值'
    description: 设置预览遮罩的层级。
    default: '3000'
EVENTS:
  - name: close
    description: 预览器请求关闭时触发。
  - name: switch
    description: 切换图片后触发，并返回当前图片下标。
  - name: transform
    description: 缩放、旋转、拖动、尺寸切换或重置后触发。
EXPOSES:
  - name: close
    description: 关闭预览。
  - name: next
    description: 在可用时展示下一张图片。
  - name: previous
    description: 在可用时展示上一张图片。
  - name: setIndex
    description: 按下标展示指定图片。
  - name: zoomIn
    description: 放大当前图片。
  - name: zoomOut
    description: 缩小当前图片。
  - name: rotateLeft
    description: 将当前图片逆时针旋转 90 度。
  - name: rotateRight
    description: 将当前图片顺时针旋转 90 度。
  - name: toggleFit
    description: 在适应窗口和原始尺寸之间切换。
  - name: fitToScreen
    description: 让当前图片适应预览窗口。
  - name: showOriginal
    description: 按原始尺寸展示当前图片。
  - name: reset
    description: 重置旋转、位置和缩放并恢复适应窗口。
description: '支持导航、变换与无障碍操作的全屏图片查看器。'
---

# 图片预览

<card>

## 完整图片查看器

点击任一缩略图，即可切换图片、缩放、旋转、适应窗口、重置，并在放大后拖动图片。预览器同时支持鼠标滚轮，以及 <kbd>←</kbd>、<kbd>→</kbd>、<kbd>+</kbd>、<kbd>-</kbd>、<kbd>R</kbd>、<kbd>Shift+R</kbd>、<kbd>F</kbd>、<kbd>0</kbd> 和 <kbd>Esc</kbd> 键。

缩略图使用原生图片按钮，因为图片本身就是具有明确语义的预览触发器，仓库现有按钮预设没有对应形态。

<template #example><image-preview-zh-default /></template>

<template #template>

@[code{19-39}](../../.vuepress/components/image-preview-zh/default.vue)

</template>

<template #script>

@[code{1-17}](../../.vuepress/components/image-preview-zh/default.vue)

</template>

<template #style>

@[code{41-76}](../../.vuepress/components/image-preview-zh/default.vue)

</template>

</card>
