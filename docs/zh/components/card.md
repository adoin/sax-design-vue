---
description: '在具有层次感的容器中组织关联内容和操作。'
PROPS:
  - name: title
    type: String
    values: null
    description: 卡片标题；同时传入 title 插槽时优先渲染插槽。
    default: null
    link: null
    usage: '#default'
    code: null
  - name: text
    type: String
    values: null
    description: 卡片正文；同时传入 text 插槽时优先渲染插槽。
    default: null
    link: null
    usage: '#default'
    code: null
  - name: type
    type: String
    values: 1,2,3,4,5
    description: 设置文字样式和内部元素位置。
    default: null
    link: null
    usage: '#type-5'
    code: null

SLOTS:
  - name: text
    type: slot
    values: null
    description: 自定义卡片正文内容，优先级高于 text 属性。
    default: null
    link: null
    usage: '#default'
    code: null
  - name: title
    type: slot
    values: null
    description: 自定义卡片标题内容，优先级高于 title 属性。
    default: null
    link: null
    usage: '#default'
    code: null
  - name: buttons
    type: slot
    values: null
    description: 在卡片类型对应区域添加按钮。
    default: null
    link: null
    usage: '#default'
    code: null
  - name: interactions
    type: slot
    values: null
    description: 在卡片类型对应区域添加交互内容。
    default: null
    link: null
    usage: '#default'
    code: null
  - name: img
    type: slot
    values: null
    description: 在卡片类型对应区域添加图片或视频。
    default: null
    link: null
    usage: '#default'
    code: null

NEWS:
  - name
---

# Card（卡片）

<card>

<docs-warn />

## 默认

常规文字内容可直接传入 `title` 和 `text`；需要自定义标签时使用同名插槽，插槽优先于属性。

- title
- text
- buttons
- interactions
- img

<template #example>
<card-default />
</template>

<template #template>

@[code{1-24} html](../../.vuepress/components/card/default.vue)

</template>

</card>

<card>

## 类型 2

通过 `type="2"` 完全切换文字样式。

<template #example>
<card-type2 />
</template>

<template #template>

@[code{1-24} html{3}](../../.vuepress/components/card/type2.vue)

</template>

</card>

<card>

## 类型 3

通过 `type="3"` 完全切换文字样式。

<template #example>
<card-type3 />
</template>

<template #template>

@[code{1-24} html{3}](../../.vuepress/components/card/type3.vue)

</template>

</card>

<card>

## 类型 4

通过 `type="4"` 完全切换文字样式。

<template #example>
<card-type4 />
</template>

<template #template>

@[code{1-24} html{3}](../../.vuepress/components/card/type4.vue)

</template>

</card>

<card>

## 类型 5

通过 `type="5"` 完全切换文字样式。

<template #example>
<card-type5 />
</template>

<template #template>

@[code{1-24} html{3}](../../.vuepress/components/card/type5.vue)

</template>

</card>

<card>

## 组合

需要可滚动的卡片组时，可使用 `s-card-group` 组件。

<template #example>
<card-group />
</template>

<template #template>

@[code{1-26} html{3}](../../.vuepress/components/card/group.vue)

</template>

<template #script>

@[code{28-32}](../../.vuepress/components/card/group.vue)

</template>

</card>
