---
API_TITLES:
  GROUP_PROPS: "TagGroup 属性"
PROPS:
  - name: v-model
    type: Boolean
    values: 'true, false'
    description: 可关闭时的可见性。
    default: true
    link: null
    usage: '#closable'

  - name: text
    type: String
    values: 'String'
    description: 标签文本。
    default: null
    link: null
    usage: '#default'

  - name: editable
    type: Boolean
    values: 'true, false'
    description: 在标签内部渲染无边框的内联编辑器。
    default: 'false'
    link: null
    usage: '#add-and-remove-items'

  - name: edit-placeholder
    type: String
    values: 'String'
    description: 内联编辑器的占位文本。
    default: "''"
    link: null
    usage: '#add-and-remove-items'

  - name: edit-autofocus
    type: Boolean
    values: 'true, false'
    description: 可编辑标签挂载后自动聚焦。
    default: 'false'
    link: null
    usage: '#add-and-remove-items'

  - name: closable
    type: Boolean, String
    values: 'true, false'
    description: 显示关闭按钮。
    default: 'false'
    link: null
    usage: '#closable'

  - name: color
    type: String
    values: 'primary, success, danger, warning, dark, RGB, HEX'
    description: 标签颜色。
    default: null
    link: null
    usage: '#color'

  - name: status
    type: String
    values: 'primary, success, warning, warn, danger, info, dark'
    description: 使用语义状态色，自定义 `color` 的优先级更高。
    default: null
    link: null
    usage: '#default'

  - name: type
    type: String
    values: 'primary, success, warning, warn, danger, info, dark'
    description: '`status` 的兼容别名。'
    default: null
    link: null
    usage: '#default'

  - name: disabled
    type: Boolean
    values: 'true, false'
    description: 禁用标签的点击与关闭交互。
    default: 'false'
    link: null
    usage: '#default'

  - name: border
    type: Boolean
    values: 'true, false'
    description: '`variant="outline"` 的兼容别名。'
    default: 'false'
    link: null
    usage: '#variants'

  - name: transparent
    type: Boolean
    values: 'true, false'
    description: 透明背景样式。
    default: 'false'
    link: null
    usage: '#transparent'

  - name: variant
    type: String
    values: 'default, outline, dashed, mark, arrow, flag'
    description: 选择标签的视觉风格，与外形几何相互独立。
    default: default
    link: null
    usage: '#variants'

  - name: tag-style
    type: String
    values: 'default, outline, dashed, mark, arrow, flag'
    description: '`variant` 的兼容别名。'
    default: default
    link: null
    usage: '#variants'

  - name: shape
    type: String
    values: 'rounded, square, pill'
    description: 选择圆角、方形或胶囊外形；mark 与 arrow 会使用兼容对应外形的处理。
    default: rounded
    link: null
    usage: '#shape'

  - name: round
    type: Boolean
    values: 'true, false'
    description: '`shape="pill"` 的兼容别名。'
    default: 'false'
    link: null
    usage: '#shape'

  - name: size
    type: String
    values: 'small, default, large'
    description: 标签尺寸。
    default: default
    link: null
    usage: '#variants'

  - name: icon
    type: String
    values: 'Material icon name'
    description: 标签内前置图标。
    default: null
    link: null
    usage: '#icon'

  - name: close-icon
    type: String
    values: 'Material icon name'
    description: 关闭按钮图标。
    default: cb:close
    link: null
    usage: '#closable'
GROUP_PROPS:
  - name: "v-model"
    type: "TagGroupItem[]"
    description: "直接绑定字符串、数字或对象组成的标签数据，无需手写 STag 子组件。"
    default: "[]"
    usage: "#add-and-remove-items"
  - name: "label-key"
    type: "string"
    description: "对象项中用于显示标签文本的字段。"
    default: "label"
    usage: "#add-and-remove-items"
  - name: "value-key"
    type: "string"
    description: "对象项中用于生成稳定节点键的字段。"
    default: "value"
    usage: "#add-and-remove-items"
  - name: "create-item"
    type: "(label: string) => TagGroupItem"
    description: "将新增文本转换为业务对象；未传时新增字符串。"
    default: null
    usage: "#add-and-remove-items"
  - name: "color"
    type: "string"
    description: "组内标签和新增按钮使用的颜色。"
    default: "primary"
    usage: "#add-and-remove-items"
  - name: "placeholder"
    type: "string"
    description: "新建可编辑标签的占位文本。"
    default: "''"
    usage: "#add-and-remove-items"
  - name: "addable"
    type: "boolean"
    description: "是否显示无边框新增按钮。"
    default: "true"
    usage: "#add-and-remove-items"
  - name: "closable"
    type: "boolean"
    description: "是否显示每个标签自己的关闭按钮。"
    default: "true"
    usage: "#add-and-remove-items"
  - name: "add-icon"
    type: "string"
    description: "新增按钮图标。"
    default: "cb:add"
    usage: "#add-and-remove-items"
  - name: "remove-icon"
    type: "string"
    description: "每个标签的关闭图标。"
    default: "cb:close"
    usage: "#add-and-remove-items"
  - name: "add-aria-label"
    type: "string"
    description: "新增按钮的无障碍名称。"
    default: "Add tag"
    usage: "#add-and-remove-items"
EVENTS:
  - name: TagGroup.update:modelValue
    type: 'TagGroupItem[]'
    description: 可编辑标签集合更新时触发。
    default: null
    usage: '#add-and-remove-items'
  - name: TagGroup.add
    type: TagGroupItem
    description: 新增操作创建标签后触发，参数为新增项。
    default: null
    usage: '#add-and-remove-items'
  - name: TagGroup.remove
    type: '(item: TagGroupItem, index: number)'
    description: 移除标签后触发，参数为移除项及其原索引。
    default: null
    usage: '#add-and-remove-items'
  - name: update:modelValue
    params: boolean
    description: 可见性变化时触发（可关闭）。

  - name: update:text
    params: string
    description: 编辑文本变化或确认时触发。

  - name: edit-confirm
    params: string
    description: 回车或失焦确认编辑时触发。

  - name: edit-cancel
    params: null
    description: 按 Escape 或空值失焦取消编辑时触发。

  - name: click
    params: null
    description: 点击标签时触发。

  - name: close
    params: null
    description: 关闭标签时触发。

  - name: s-remove
    params: boolean
    description: 从 TagGroup 中移除标签时触发。
EXPOSES: []
description: '标签是表示输入、属性或操作的紧凑元素。'
NEWS:
  - default
  - color
  - transparent
  - variants
  - shape
  - icon
  - closable
  - group
---

# Tag 标签

<card>

## 默认

渲染简单标签，可选关闭行为。

<template #example>
<tag-default />
</template>

<template #template>

@[code{1-25}](../../.vuepress/components/tag/default.vue)

</template>

<template #script>

@[code{27-31}](../../.vuepress/components/tag/default.vue)

</template>

<template #style>

@[code{33-39}](../../.vuepress/components/tag/default.vue)

</template>

</card>

<card>

## 风格

使用 `variant` 选择 outline、dashed、mark、arrow、flag 等视觉风格；它不控制圆角几何。

<template #example>
<tag-styles />
</template>

<template #template>

@[code{1-10}](../../.vuepress/components/tag/styles.vue)

</template>

<template #style>

@[code{12-20}](../../.vuepress/components/tag/styles.vue)

</template>

</card>

<card>

## 外形

使用 `shape` 选择圆角、方形或胶囊外形。胶囊外形下 Arrow 仍保持左圆、右尖。

<template #example>
<tag-shape />
</template>

<template #template>

@[code{1-8}](../../.vuepress/components/tag/shape.vue)

</template>

<template #style>

@[code{10-16}](../../.vuepress/components/tag/shape.vue)

</template>

</card>

<card>

## 尺寸

使用 `size` 适配紧凑控件或更强调的状态标签。

<template #example>
<tag-sizes />
</template>

<template #template>

@[code{1-7}](../../.vuepress/components/tag/sizes.vue)

</template>

<template #style>

@[code{9-16}](../../.vuepress/components/tag/sizes.vue)

</template>

</card>

<card>

## 组合用法

先了解各个属性，再组合颜色、展示形态、圆角、尺寸和图标。

<template #example>
<tag-combinations />
</template>

<template #template>

@[code{1-24}](../../.vuepress/components/tag/combinations.vue)

</template>

<template #style>

@[code{26-33}](../../.vuepress/components/tag/combinations.vue)

</template>

</card>

<card>

## 颜色

使用 Sax Design 色板或自定义值为标签着色。

<template #example>
<tag-color />
</template>

<template #template>

@[code{1-33}](../../.vuepress/components/tag/color.vue)

</template>

<template #script>

@[code{35-40}](../../.vuepress/components/tag/color.vue)

</template>

<template #style>

@[code{42-48}](../../.vuepress/components/tag/color.vue)

</template>

</card>

<card>

## 透明

使用 `transparent` 获得更轻的描边外观。

<template #example>
<tag-transparent />
</template>

<template #template>

@[code{1-36}](../../.vuepress/components/tag/transparent.vue)

</template>

<template #script>

@[code{38-43}](../../.vuepress/components/tag/transparent.vue)

</template>

<template #style>

@[code{45-51}](../../.vuepress/components/tag/transparent.vue)

</template>

</card>

<card>

## 图标

通过 `icon` 添加前置图标。

<template #example>
<tag-icon />
</template>

<template #template>

@[code{1-40}](../../.vuepress/components/tag/icon.vue)

</template>

<template #style>

@[code{42-48}](../../.vuepress/components/tag/icon.vue)

</template>

</card>

<card>

## 可关闭

启用 `closable` 后，监听 `close` 事件从数据中移除标签。

<template #example>
<tag-closable />
</template>

<template #template>

@[code{1-10}](../../.vuepress/components/tag/closable.vue)

</template>

<template #script>

@[code{12-25}](../../.vuepress/components/tag/closable.vue)

</template>

<template #style>

@[code{27-34}](../../.vuepress/components/tag/closable.vue)

</template>

</card>

<card>

## 增删条目

`s-tag-group` 直接通过 `v-model` 管理标签数据。点击加号会生成一个无边框的可编辑标签；回车或失焦确认，Escape 取消，每个已有标签仍可单独删除。对象数组可通过 `label-key`、`value-key` 和 `create-item` 映射。

<template #example>
<tag-group />
</template>

<template #template>

@[code{1-11}](../../.vuepress/components/tag/group.vue)

</template>

<template #script>

@[code{13-29}](../../.vuepress/components/tag/group.vue)

</template>

<template #style>

@[code{31-36}](../../.vuepress/components/tag/group.vue)

</template>

</card>
