---
description: '用轻量拼图纹理将相关表单控件拼接成连续输入区域。'
lastUpdated: false
PROPS:
  - name: block
    type: Boolean
    values: true | false
    description: 让组合占满容器，并由子控件共享可用宽度。
    default: false
CHILD_PROPS:
  - name: span
    type: Number
    values: 1–24
    description: 设置在直接子控件上，用于指定其在 24 栅格中占用的份数；未设置的子控件会均分 <code>24 - 已声明 span 总和</code>。
    default: 自动分配
SLOTS:
  - name: default
    type: Slot
    values: Input、Select、Cascader、DatePicker、TimePicker 或兼容的表单控件
    description: 按原有顺序连续渲染控件，并在相邻控件之间显示拼图接缝纹理。
    default: null
---

# Control Group 连续控件

<card>

Control Group 通过不占布局空间的轻量拼图接缝，将相关控件拼成连续输入区域，同时保留每个子控件自己的值、事件、校验和弹层行为。组合使用 24 栅格，直接子控件可通过 `span` 指定占用栅格；未声明 `span` 的控件会均分剩余空间。

</card>

<card>

## 选择与输入

需要先选择前缀、再输入内容时，可将 Select 与 Input 连续组合。下例 Select 使用 `span="8"`，未声明的 Input 自动占据剩余 16 栅格。

<template #example><control-group-basic /></template>

<template #template>

@[code{8-21}](../../.vuepress/components/control-group/basic.vue)

</template>

<template #script>

@[code{1-6}](../../.vuepress/components/control-group/basic.vue)

</template>

<template #style>

@[code{23-36}](../../.vuepress/components/control-group/basic.vue)

</template>

</card>

<card>

## 多段拼接与栅格

多个控件连续拼接时，可混合 Select、Input、Cascader、Date Picker 与 Time Picker，并为固定宽度的子控件设置 `span`。第一行已声明的栅格为 4、4、7、4，中间未声明的 Input 自动占用剩余 5 栅格；第二行展示日期、时间与普通输入的连续拼接。

<template #example><control-group-spans /></template>

<template #template>

@[code{37-84}](../../.vuepress/components/control-group/spans.vue)

</template>

<template #script>

@[code{1-35}](../../.vuepress/components/control-group/spans.vue)

</template>

<template #style>

@[code{86-99}](../../.vuepress/components/control-group/spans.vue)

</template>

</card>

<card>

## 占满宽度

使用 `block` 让连续控件占满容器。

<template #example><control-group-block /></template>

<template #template>

@[code{8-21}](../../.vuepress/components/control-group/block.vue)

</template>

<template #script>

@[code{1-6}](../../.vuepress/components/control-group/block.vue)

</template>

<template #style>

@[code{23-36}](../../.vuepress/components/control-group/block.vue)

</template>

</card>
