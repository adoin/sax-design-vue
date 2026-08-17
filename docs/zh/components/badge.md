---
description: "为相邻内容附加状态、数量或简短元数据。"
PROPS:
  #__________________________________
  - name: value
    type: Number/String
    values: Number,String
    description: 展示值。
    default: "' '"
    link: null
    usage: '#default'
    code: >
      <s-badge :value="7">
        <s-button>Badge</s-button>
      </s-badge>
    #__________________________________
  - name: max
    type: Number
    values: Number
    description: 最大值，超出时显示 <code>{max}+</code>；仅 value 为数字时生效。
    default: null
    link: null
    usage: '#max-value'
    code: >
      <s-badge :value="100" :max="19" type="primary" >
        <s-button >comment</s-button>
      </s-badge>
    #__________________________________
  - name: is-dot
    type: Boolean
    values: true,false
    description: 以小圆点形式展示。
    default: false
    link: null
    usage: '#red-dot'
    code: >
      <s-badge :value="100" :max="19" is-dot type="primary" >
        <s-button >comment</s-button>
      </s-badge>
    #__________________________________
  - name: hidden
    type: Boolean
    values: true,false
    description: 是否隐藏徽标。
    default: false
    link: null
    usage: '#controlled-visibility'
    code: >
      <s-badge :value="3"  :hidden="hidden">
        <s-avatar shape="square" color="#ccc"> </s-avatar>
      </s-badge>
    #__________________________________
  - name: type
    type: String
    values: 'primary, success, warn, info, danger'
    description: 徽标类型。
    default: danger
    link: null
    usage: '#default'
    code: >
      <s-badge :value="2" type="warn">
        <s-button shape="square">square</s-button>
      </s-badge>
    #__________________________________
  - name: show-zero
    type: Boolean
    values: true,false
    description: value 为零时是否显示徽标。
    default: true
    link: null
    usage: '#show-zero'
    code: >
      <s-badge :value="2" type="warn" show-zero >
        <s-button shape="square">square</s-button>
      </s-badge>
    #__________________________________
  - name: color
    type: String
    values: String
    description: 小圆点背景颜色。
    default: null
    link: null
    usage: '#default'
    code: >
      <s-badge :value="2" class="item" color="#ccc"> text </s-badge>
    #__________________________________
  - name: offset
    type: Array
    values: 'Record< number, number>'
    description: 调整徽标位置。
    default: null
    link: null
    usage: '#offset'
    code: >
      <s-badge :value="3" :offset=[-20,20] class="item" >
        <s-avatar shape="square" color="#ccc"> </s-avatar>
      </s-badge>
    #__________________________________
  - name: processing
    type: Boolean
    values: true,false
    description: 设置 processing 表示处理中。
    default: false
    link: null
    usage: '#processing'
    code: >
      <s-badge :value="2" processing  >
        <s-button shape="square">square</s-button>
      </s-badge>
    #__________________________________
  - name: badge-style
    type: object
    values: 'CSSProperties'
    description: 自定义徽标样式。
    default: ''
    link: null
    usage: null
    code: null
    #__________________________________
  - name: badge-class
    type: String
    values: 'String'
    description: 自定义徽标类名。
    default: ''
    link: null
    usage: null
    code: null
    #__________________________________

SLOTS:
  - name: default
    type: slot
    values:
    description: 自定义默认内容。
    default: null
    example: null
    link: null
    usage: '#default'
    code: >
      <s-badge :value="2">
        <s-button shape="square">square</s-button>
      </s-badge>

UPDATES:
  - type
---

# Badge 徽标

<card>

## 默认

**通常用于显示未读消息数。**
可用于按钮、文本、头像等内容。

<template #example>
<badge-default />
</template>

<template #template>

@[code{1-19} vue{3-5}](../../.vuepress/components/badge/default.vue)

</template>

<template #style>

@[code{21-25}](../../.vuepress/components/badge/default.vue)

</template>

</card>

<card>

## 最大值

通过 `max` 处理数值溢出。

::: tip
`max` 为数字类型，仅当 `value` 也是数字时生效。
:::

<template #example>
<badge-max />
</template>

<template #template>

@[code{1-13} vue{3-5}](../../.vuepress/components/badge/max.vue)

</template>

<template #style>

@[code{15-19}](../../.vuepress/components/badge/max.vue)

</template>

</card>

<card>

## 自定义内容

可显示数字以外的文本内容。

当 `value` 为 String 时，可展示自定义文本。

<template #example>
<badge-customizations />
</template>

<template #template>

@[code{1-10} vue{3-5}](../../.vuepress/components/badge/customizations.vue)

</template>

<template #style>

@[code{12-16}](../../.vuepress/components/badge/customizations.vue)

</template>

</card>

<card>

## 红点

使用红点标记需要关注的内容。

使用布尔属性 `is-dot`。

<template #example>
<badge-red-dot />
</template>

<template #template>

@[code{1-16} vue{3-5}](../../.vuepress/components/badge/red-dot.vue)

</template>

<template #style>

@[code{18-22}](../../.vuepress/components/badge/red-dot.vue)

</template>

</card>

<card>

## 偏移量

设置徽标圆点偏移量，格式为 `[left, top]`，表示相对默认位置左侧和顶部的偏移。

<template #example>
<badge-offset />
</template>

<template #template>

@[code{1-15} vue{3}](../../.vuepress/components/badge/offset.vue)

</template>

<template #style>

@[code{17-21}](../../.vuepress/components/badge/offset.vue)

</template>

</card>

<card>

## 处理中

使用 `processing` 表示实时更新或处理中。它会在徽标外持续显示脉冲波纹，可在下方与普通状态直接对比。

<template #example>
<badge-processing />
</template>

<template #template>

@[code{1-43} vue{3}](../../.vuepress/components/badge/processing.vue)

</template>

<template #style>

@[code{45-89}](../../.vuepress/components/badge/processing.vue)

</template>

</card>

<card>

## 受控显示

通过 `hidden` 控制徽标可见性。

<template #example>
<badge-controlled-visibility />
</template>

<template #template>

@[code{1-9} vue{3}](../../.vuepress/components/badge/controlled-visibility.vue)

</template>

<template #script>

@[code{11-15}](../../.vuepress/components/badge/controlled-visibility.vue)

</template>

<template #style>

@[code{17-21}](../../.vuepress/components/badge/controlled-visibility.vue)

</template>

</card>

<card>

## 显示零值

通过 `show-zero` 控制是否显示零值；默认隐藏。

<template #example>
<badge-show-zero />
</template>

<template #template>

@[code{1-11} vue{6}](../../.vuepress/components/badge/show-zero.vue)

</template>

<template #script>

@[code{13-17}](../../.vuepress/components/badge/show-zero.vue)

</template>

<template #style>

@[code{19-23}](../../.vuepress/components/badge/show-zero.vue)

</template>

</card>

<card>

## API

</card>
