---
description: '可移动、可缩放的非模态窗口，具有独立标题和键盘操作。'
PROPS:
  - name: 'rect'
    type: 'WindowRect'
    description: '位置和尺寸，支持 v-model:rect。'
    default: '{ x: 24, y: 24, width: 640, height: 480 }'
    usage: '#move-and-resize'
    values: '{ x, y, width, height }'
  - name: 'title'
    type: 'String'
    description: '窗口名称，支持 v-model:title。'
    default: ''
    usage: '#move-and-resize'
  - name: 'min-width'
    type: 'Number'
    description: '最小宽度（像素），优先于小工作区的边界。'
    default: 280
    usage: '#move-and-resize'
  - name: 'min-height'
    type: 'Number'
    description: '最小高度（像素），至少 48。'
    default: 180
    usage: '#move-and-resize'
  - name: 'draggable'
    type: 'Boolean'
    description: '允许拖动和键盘移动。'
    default: true
    usage: '#move-and-resize'
  - name: 'resizable'
    type: 'Boolean'
    description: '允许八方向缩放和键盘缩放。'
    default: true
    usage: '#move-and-resize'
  - name: 'boundary'
    type: 'Boolean'
    description: '以定位父容器约束窗口；小于最小尺寸时允许溢出。'
    default: true
    usage: '#move-and-resize'
  - name: 'active'
    type: 'Boolean'
    description: '显示激活反馈。'
    default: false
    usage: '#move-and-resize'
  - name: 'z-index'
    type: 'Number'
    description: '层级，由应用管理。'
    default: 1
    usage: '#move-and-resize'
  - name: 'title-editable'
    type: 'Boolean'
    description: '显示重命名按钮；空名称不保存。'
    default: false
    usage: '#move-and-resize'
  - name: 'keyboard-step'
    type: 'Number'
    description: '方向键步长；Shift 使用五倍步长。'
    default: 10
    usage: '#move-and-resize'
  - name: 'shape'
    type: 'ComponentShape'
    description: '遵循共享配置的外形。'
    default: 'rounded'
    usage: '#shape'
    values: 'rounded | square'
EVENTS:
  - name: 'update:rect'
    type: '(rect: WindowRect) => void'
    description: '位置或尺寸变化。'
    usage: '#move-and-resize'
  - name: 'update:title'
    type: '(title: string) => void'
    description: '确认重命名。'
    usage: '#move-and-resize'
  - name: 'activate'
    type: '() => void'
    description: '指针或键盘聚焦窗口。'
    usage: '#move-and-resize'
  - name: 'drag-start'
    type: '(rect: WindowRect) => void'
    description: '交互边界事件；结束时携带最终尺寸。'
    usage: '#move-and-resize'
  - name: 'drag-end'
    type: '(rect: WindowRect) => void'
    description: '交互边界事件；结束时携带最终尺寸。'
    usage: '#move-and-resize'
  - name: 'resize-start'
    type: '(rect: WindowRect) => void'
    description: '交互边界事件；结束时携带最终尺寸。'
    usage: '#move-and-resize'
  - name: 'resize-end'
    type: '(rect: WindowRect) => void'
    description: '交互边界事件；结束时携带最终尺寸。'
    usage: '#move-and-resize'
SLOTS:
  - name: 'default'
    type: '()'
    description: '窗口内容。'
    usage: '#move-and-resize'
  - name: 'title'
    type: '{ title: string }'
    description: '自定义标题。'
    usage: '#move-and-resize'
  - name: 'actions'
    type: '()'
    description: '窗口操作区。'
    usage: '#move-and-resize'
EXPOSES:
  - name: 'focus'
    type: '() => void'
    description: '聚焦标题移动按钮。'
    usage: '#move-and-resize'
  - name: 'rename'
    type: '() => void'
    description: '进入标题编辑。'
    usage: '#move-and-resize'
---

# Window

<card>

## 移动与缩放

拖动标题栏移动窗口，拖动四边或四角调整尺寸。两个窗口的输入互相独立；点击铅笔按钮重命名。

点击标题，或用 Tab 聚焦标题后，按方向键移动。点击缩放手柄，或用 Tab 聚焦右下角手柄后，按方向键调整大小。Shift 需要配合方向键使用，步长变为五倍（默认 50px）。

鼠标拖动或缩放期间，保持鼠标按下并按 Escape，可恢复本次操作开始前的位置和尺寸；松开鼠标后操作已提交。输入框中的方向键仍用于编辑文字。父容器必须具有定位和确定高度。

<template #example><window-zh-default /></template>

<template #template>

@[code{22-46}](../../.vuepress/components/window-zh/default.vue)

</template>

<template #script>

@[code{1-20}](../../.vuepress/components/window-zh/default.vue)

</template>

<template #style>

@[code{48-57}](../../.vuepress/components/window-zh/default.vue)

</template>

</card>

<card>

## 外形

对比圆角与方形，不改变交互。

<template #example><window-zh-shape /></template>

<template #template>

@[code{10-29}](../../.vuepress/components/window-zh/shape.vue)

</template>

<template #script>

@[code{1-8}](../../.vuepress/components/window-zh/shape.vue)

</template>

<template #style>

@[code{31-40}](../../.vuepress/components/window-zh/shape.vue)

</template>

</card>

<card>

## 内容生命周期

Window 不管理路由、缓存或刷新。应用控制内容的挂载与关闭；恢复页面的按钮可以通过 actions 插槽提供。移动已有页面时保持同一组件实例，并显式恢复滚动位置及焦点；尺寸敏感组件应监听实际容器。

</card>
