---
description: "带范围、步长、小数精度与加减按钮的数字输入框。"
PROPS:
  - name: v-model
    type: Number
    values: "number | null"
    default: null
    description: "绑定数字；清空时可以返回 null。"
    usage: '#default'
  - name: min
    type: Number
    values: "Number"
    default: -Infinity
    description: "允许的最小值。"
    usage: '#range-and-step'
  - name: max
    type: Number
    values: "Number"
    default: Infinity
    description: "允许的最大值。"
    usage: '#range-and-step'
  - name: step
    type: Number
    values: "Number"
    default: 1
    description: "每次增减的步长。"
    usage: '#range-and-step'
  - name: step-strictly
    type: Boolean
    values: "true | false"
    default: false
    description: "提交值限制为步长的整数倍。"
    usage: '#range-and-step'
  - name: precision
    type: Number
    values: "非负整数"
    default: null
    description: "小数位数，不应小于步长的小数位数。"
    usage: '#range-and-step'
  - name: value-on-clear
    type: String | Number | null
    values: "min | max | number | null"
    default: null
    description: "清空后使用的值：数字、min、max 或 null。"
    usage: '#range-and-step'
  - name: disabled
    type: Boolean
    values: "true | false"
    default: false
    description: "禁用编辑和步进。"
    usage: '#states'
  - name: readonly
    type: Boolean
    values: "true | false"
    default: false
    description: "只读展示，不允许编辑或步进。"
    usage: '#states'
  - name: controls
    type: Boolean
    values: "true | false"
    default: true
    description: "显示减少和增加按钮。"
    usage: '#states'
  - name: color
    type: String
    values: "主题色 | CSS 颜色"
    default: light（浅色模式）、dark（深色模式）
    description: "数字与按钮的文字色，支持主题色或 CSS 颜色。"
    usage: '#colors'
  - name: background
    type: String
    values: "主题色 | CSS 颜色"
    default: primary
    description: "控件底色，悬停与聚焦时保持该配色。"
    usage: '#colors'
  - name: shape
    type: String
    values: "rounded | square"
    default: rounded
    description: "rounded 或 square 几何形状，可继承全局配置。"
    usage: '#shape'
  - name: id
    type: String
    values: "String"
    default: null
    description: "原生输入框 id。"
    usage: '#default'
  - name: name
    type: String
    values: "String"
    default: null
    description: "原生输入框 name。"
    usage: '#default'
  - name: label
    type: String
    values: "String"
    default: null
    description: "输入框标签。"
    usage: '#default'
  - name: placeholder
    type: String
    values: "String"
    default: null
    description: "值为空时的占位文字。"
    usage: '#default'
EVENTS:
  - name: update:modelValue
    type: '(value: number | null | undefined) => void'
    description: "更新受控值。"
  - name: input
    type: '(value: number | null | undefined) => void'
    description: "输入或步进时触发。"
  - name: change
    type: '(value: number | null | undefined, oldValue: number | null | undefined) => void'
    description: "改变的值被提交时触发。"
  - name: focus
    type: '(event: FocusEvent) => void'
    description: "原生输入框聚焦事件。"
  - name: blur
    type: '(event: FocusEvent) => void'
    description: "原生输入框失焦事件。"
EXPOSES:
  - name: focus
    type: '() => void'
    description: "聚焦内部输入框。"
  - name: blur
    type: '() => void'
    description: "使内部输入框失焦。"
---

# Input Number 数字输入框

<card>

## 默认

通过 v-model 绑定数字。点击或按住加减按钮步进，也可以直接输入；聚焦输入框后使用方向键 ↑ / ↓。

<template #example><input-number-zh-default /></template>

<template #template>

@[code{5-9}](../../.vuepress/components/input-number-zh/default.vue)

</template>

<template #script>

@[code{1-4}](../../.vuepress/components/input-number-zh/default.vue)

</template>

<template #style>

@[code{10-18}](../../.vuepress/components/input-number-zh/default.vue)

</template>

</card>

<card>

## 范围与步长

分别演示范围限制、整数倍步进、小数精度和清空后的回退值。precision 应不小于 step 的小数位数。

<template #example><input-number-zh-range /></template>

<template #template>

@[code{7-27}](../../.vuepress/components/input-number-zh/range.vue)

</template>

<template #script>

@[code{1-6}](../../.vuepress/components/input-number-zh/range.vue)

</template>

<template #style>

@[code{28-36}](../../.vuepress/components/input-number-zh/range.vue)

</template>

</card>

<card>

## 状态与控制按钮

disabled 禁用控件，readonly 只读展示；controls=false 隐藏加减按钮，但仍允许输入和方向键步进。

<template #example><input-number-zh-states /></template>

<template #template>

@[code{7-13}](../../.vuepress/components/input-number-zh/states.vue)

</template>

<template #script>

@[code{1-6}](../../.vuepress/components/input-number-zh/states.vue)

</template>

<template #style>

@[code{14-22}](../../.vuepress/components/input-number-zh/states.vue)

</template>

</card>

<card>

## 配色

color 控制文字与加减图标，background 控制底色。悬停与聚焦保留配色，以柔和内凹阴影提供反馈。自定义配色时请保证文字与底色的对比度。

<template #example><input-number-zh-colors /></template>

<template #template>

@[code{7-23}](../../.vuepress/components/input-number-zh/colors.vue)

</template>

<template #script>

@[code{1-6}](../../.vuepress/components/input-number-zh/colors.vue)

</template>

<template #style>

@[code{24-32}](../../.vuepress/components/input-number-zh/colors.vue)

</template>

</card>

<card>

## 形状

并排比较 rounded 与 square。shape 同时应用于外壳和内部输入框；显式值优先于全局配置。

<template #example><input-number-zh-shape /></template>

<template #template>

@[code{6-11}](../../.vuepress/components/input-number-zh/shape.vue)

</template>

<template #script>

@[code{1-5}](../../.vuepress/components/input-number-zh/shape.vue)

</template>

<template #style>

@[code{12-20}](../../.vuepress/components/input-number-zh/shape.vue)

</template>

</card>

