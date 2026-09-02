---
PROPS:
  - name: model-value
    type: SplitterModelValue
    values: "recursive layout tree"
    description: 整个分割布局的方向和尺寸树。
    default: "{ type: 'horizontal', size: ['rest', 'rest'] }"
  - name: v-model
    type: SplitterModelValue
    values: "recursive layout tree"
    description: 整个分割布局的方向和尺寸树。
    default: "{ type: 'horizontal', size: ['rest', 'rest'] }"
  - name: min-size
    type: Number
    values: "0 - 1"
    description: 所有区域默认允许缩小到的最小占比。
    default: '0.08'
  - name: keyboard-step
    type: Number
    values: "0 - 1"
    description: 使用方向键调整分隔条时的步长，未设置时跟随精度。
    default: precision step
  - name: precision
    type: Number
    values: "0 - 8"
    description: 尺寸的小数精度，拖拽会吸附到对应刻度。
    default: '2'
  - name: gap
    type: Number / String / [Size, Size]
    values: "single / [rowGap, columnGap]"
    description: 分隔按钮实际占用的纵向、横向布局间距。
    default: '12'
  - name: disabled
    type: Boolean
    values: "true / false"
    description: 禁止整个布局拖拽。
    default: 'false'
EVENTS:
  - name: update:modelValue
    description: 拖拽过程中返回完整的新布局树。
  - name: change
    description: 拖拽或键盘调整结束后返回完整布局树。
SLOTS:
  - name: default
    description: 放置任意数量、可递归嵌套的 SplitterItem。
description: '支持任意区域、双向分割与递归嵌套的可拖拽布局。'
---

# Splitter 分割面板

<card>

支持任意数量、双向分割与递归嵌套。

## 任意区域与嵌套

在对应的 `SplitterItem` 中继续嵌套 item 即可。

<template #example><splitter-default /></template>

<template #template>

@[code{16-33}](../../.vuepress/components/splitter/default.vue)

</template>

<template #script>

@[code{1-14}](../../.vuepress/components/splitter/default.vue)

</template>

<template #style>

@[code{35-110}](../../.vuepress/components/splitter/default.vue)

</template>

</card>

<card>

## Rest 与精度

`use-rest` 永久占用剩余空间；`precision` 默认吸附到 `0.01`。

<template #example><splitter-sizing /></template>

<template #template>

@[code{10-30}](../../.vuepress/components/splitter/sizing.vue)

</template>

<template #script>

@[code{1-8}](../../.vuepress/components/splitter/sizing.vue)

</template>

<template #style>

@[code{32-110}](../../.vuepress/components/splitter/sizing.vue)

</template>

</card>

<card>

## Gap

单值控制两个方向，数组顺序为 `[rowGap, columnGap]`；`0` 不占空间但仍可拖拽。

<template #example><splitter-gap /></template>

<template #template>

@[code{12-41}](../../.vuepress/components/splitter/gap.vue)

</template>

<template #script>

@[code{1-10}](../../.vuepress/components/splitter/gap.vue)

</template>

<template #style>

@[code{43-149}](../../.vuepress/components/splitter/gap.vue)

</template>

</card>

<card>

## 数据结构

```ts
type SplitterSize = number | 'rest'

interface SplitterGroupValue {
  type: 'horizontal' | 'vertical'
  size: Array<SplitterSize | SplitterGroupValue>
  value?: SplitterSize
}
```

`size` 数量不匹配时自动等分；对象项表示嵌套分组。

## SplitterItem

| 属性       | 类型      | 默认值          | 说明                                     |
| ---------- | --------- | --------------- | ---------------------------------------- |
| `min`      | `number`  | 继承 `min-size` | 当前区域的最小占比                       |
| `max`      | `number`  | `1`             | 当前区域的最大占比                       |
| `disabled` | `boolean` | `false`         | 禁止拖动当前区域右侧或下方的分隔条       |
| `use-rest` | `boolean` | `false`         | 永久占用本层剩余空间；同一层只能设置一个 |

支持鼠标、触摸、方向键、`Home` 和 `End`。

Splitter 不裁切 item 内容；需要滚动时，在 item 内部容器自行设置 `overflow: auto`。

</card>
