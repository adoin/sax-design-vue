---
description: "在一组关联选项中选择唯一值。"
PROPS:
  - name: v-model / model-value
    type: String | Number | Boolean
    values: 已选单选值
    description: 绑定单选项或单选组的选中值。
    default: '-'
  - name: color
    type: String
    values: Theme colors, RGB, HEX
    description: 设置单选框颜色。
    default: primary
    link: null
    usage: '#color'
    code: null

  - name: disabled
    type: Boolean
    values: true,false
    description: 是否禁用组件。
    default: false
    link: null
    usage: '#default'
    code: null

  - name: loading
    type: Boolean
    values: true,false
    description: 是否显示加载动画并禁用组件。
    default: false
    link: null
    usage: '#loading'
    code: null

  - name: val
    type: String
    values: String
    description: 单选输入绑定值。
    default: null
    link: null
    usage: '#default'
    code: null

SLOTS:
  - name: default
    type: slot
    values: null
    description: 为组件添加标签。
    default: null
    link: null
    usage: '#label'
    code: null

  - name: icon
    type: slot
    values: null
    description: 在单选框内添加图标。
    default: null
    link: null
    usage: '#icon'
    code: null
---

# Radio（单选框）

<card>

## 默认

<docs-warn />

使用 `<s-radio />` 创建单选输入。

<template #example>
<radio-default />
</template>

<template #template>

@[code{1-8}](../../.vuepress/components/radio/default.vue)

</template>

<template #script>

@[code{10-14}](../../.vuepress/components/radio/default.vue)

</template>

</card>

<card>

## 颜色

<coloren />

<template #example>
<radio-color />
</template>

<template #template>

@[code{1-13} vue{4-9}](../../.vuepress/components/radio/color.vue)

</template>

<template #script>

@[code{15-19}](../../.vuepress/components/radio/color.vue)

</template>

</card>

<card>

## 标签 <Badge text="New"/>

通过默认插槽为单选框添加标签；需要将标签放到前侧时，可使用 `label-before` 属性。

<template #example>
<radio-label />
</template>

<template #template>

@[code{1-6} vue{4}](../../.vuepress/components/radio/label.vue)

</template>

<template #script>

@[code{8-12}](../../.vuepress/components/radio/label.vue)

</template>

</card>

<card>

## 加载 <Badge text="New"/>

为组件添加加载动画；启用后单选框行为等同于 `disabled`。

<template #example>
<radio-loading />
</template>

<template #template>

@[code{1-6} vue{3,4}](../../.vuepress/components/radio/loading.vue)

</template>

<template #script>

@[code{8-12}](../../.vuepress/components/radio/loading.vue)

</template>

</card>

<card>

## 图标 <Badge text="New"/>

通过 `icon` 插槽在单选框内部添加图标。

<template #example>
<radio-icons />
</template>

<template #template>

@[code{1-46} vue{5-7}](../../.vuepress/components/radio/icons.vue)

</template>

<template #script>

@[code{48-52}](../../.vuepress/components/radio/icons.vue)

</template>

</card>

<card>

## API

</card>
