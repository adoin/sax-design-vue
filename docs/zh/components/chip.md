---
PROPS:
  - name: v-model
    type: Boolean
    values: true, false
    description: 可关闭时的可见性。
    default: true
    link: null
    usage: '#closable'

  - name: text
    type: String
    values: String
    description: 标签文本。
    default: null
    link: null
    usage: '#default'

  - name: closable
    type: Boolean, String
    values: true, false
    description: 显示关闭按钮。
    default: false
    link: null
    usage: '#closable'

  - name: color
    type: String
    values: primary, success, danger, warning, dark, RGB, HEX
    description: 标签颜色。
    default: null
    link: null
    usage: '#color'

  - name: transparent
    type: Boolean
    values: true, false
    description: 透明背景样式。
    default: false
    link: null
    usage: '#transparent'

  - name: icon
    type: String
    values: Material icon name
    description: 标签内前置图标。
    default: null
    link: null
    usage: '#icon'

  - name: icon-pack
    type: String
    values: Icon pack class
    description: 图标字体类名。
    default: material-icons
    link: null
    usage: '#icon'

  - name: close-icon
    type: String
    values: Material icon name
    description: 关闭按钮图标。
    default: clear
    link: null
    usage: '#closable'
EVENTS:
  - name: update:modelValue
    params: boolean
    description: 可见性变化时触发（可关闭）。

  - name: click
    params: null
    description: 点击标签时触发。

  - name: close
    params: null
    description: 关闭标签时触发。

  - name: vs-remove
    params: boolean
    description: 在标签组中移除时触发。
EXPOSES: []
description: "标签是表示输入、属性或操作的紧凑元素。"
NEWS:
  - default
  - color
  - transparent
  - icon
  - closable
  - chips
---

# 标签

<card>

## 默认


渲染简单标签，可选关闭行为。

<template #example>
<chip-default />
</template>

<template #template>

@[code{1-6}](../.vuepress/components/chip/default.vue)

</template>

</card>

<card>

## 颜色


使用 Vuesax 色板或自定义值为标签着色。

<template #example>
<chip-color />
</template>

<template #template>

@[code{1-8}](../.vuepress/components/chip/color.vue)

</template>

</card>

<card>

## 透明


使用 `transparent` 获得更轻的描边外观。

<template #example>
<chip-transparent />
</template>

<template #template>

@[code{1-6}](../.vuepress/components/chip/transparent.vue)

</template>

</card>

<card>

## 图标


通过 `icon` 添加前置图标。

<template #example>
<chip-icon />
</template>

<template #template>

@[code{1-6}](../.vuepress/components/chip/icon.vue)

</template>

</card>

<card>

## 可关闭


启用 `closable` 后可交互移除标签。

<template #example>
<chip-closable />
</template>

<template #template>

@[code{1-5}](../.vuepress/components/chip/closable.vue)

</template>

<template #script>

@[code{7-13}](../.vuepress/components/chip/closable.vue)

</template>

</card>

<card>

## 增删条目


组合 `vs-chips` 与多个 `vs-chip` 子项以增删标签。

<template #example>
<chip-chips />
</template>

<template #template>

@[code{1-8}](../.vuepress/components/chip/chips.vue)

</template>

<template #script>

@[code{10-13}](../.vuepress/components/chip/chips.vue)

</template>

<template #style>

@[code{15-23}](../.vuepress/components/chip/chips.vue)

</template>

</card>

<card>

## API

</card>
