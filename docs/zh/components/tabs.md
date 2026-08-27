---
description: '支持溢出收纳、动态增删、右键菜单与多种无边框外观的标签页。'
PROPS:
  - name: v-model / model-value
    type: String | Number
    values: s-tab 的 name；未设置 name 时为索引
    description: 当前激活标签。
    default: '0'
  - name: type
    type: String
    values: line / pill / card / connected-card / editable-card
    description: 标签栏外观；connected-card 将激活标签与内容面板连接为同一表面，editable-card 是兼容旧用法的可编辑卡片预设。
    default: line
  - name: overflow
    type: String
    values: collapse / scroll / wrap
    description: 横向空间不足时收进更多菜单、滚动或换行。
    default: collapse
  - name: alignment
    type: String
    values: left / center / right / fixed
    description: 标签对齐与均分方式。
    default: left
  - name: position
    type: String
    values: top / bottom / left / right
    description: 标签栏位置。
    default: top
  - name: size
    type: String
    values: small / default / large
    description: 标签尺寸。
    default: default
  - name: animated
    type: Boolean
    values: true / false
    description: 是否启用面板与列表切换动效。
    default: 'true'
  - name: destroy-on-hide
    type: Boolean
    values: true / false
    description: 隐藏后是否卸载面板内容。
    default: 'false'
  - name: lazy
    type: Boolean
    values: true / false
    description: 面板首次激活时才挂载，访问后继续保留。
    default: 'false'
  - name: editable
    type: Boolean
    values: true / false
    description: 不依赖展示风格，独立开启新增与关闭操作。
    default: 'false'
  - name: hide-add
    type: Boolean
    values: true / false
    description: 开启编辑操作时隐藏添加按钮。
    default: 'false'
  - name: color
    type: String
    values: 主题色 / RGB / HEX
    description: 激活色。
    default: primary
  - name: aria-label
    type: String
    values: 文本
    description: 标签导航的无障碍名称；默认读取组件语言包。
    default: 标签页
CHILD_PROPS:
  - name: name
    type: String | Number
    values: 唯一值
    description: s-tab 的稳定标识，也是 v-model 返回值。
    default: 当前索引
  - name: label
    type: String
    values: 文本
    description: 标签名称与溢出菜单回退文本。
    default: Label
  - name: icon / badge
    type: String / String | Number
    values: 图标名 / 徽标内容
    description: 标签图标与徽标。
    default: —
  - name: disabled / closable
    type: Boolean
    values: true / false
    description: 禁用标签，或控制开启编辑操作时是否允许关闭。
    default: false / true
  - name: force-render
    type: Boolean
    values: true / false
    description: 即使 destroy-on-hide 开启也保留该面板。
    default: 'false'
EVENTS:
  - name: change
    description: 激活项变化时返回 value 与 pane。
  - name: tab-click
    description: 点击或键盘激活标签时返回 value、事件与 pane。
  - name: add / remove / edit
    description: 请求添加或删除标签；数据仍由父级维护。
  - name: tab-contextmenu
    description: 标签发生右键事件时返回 value、事件与 pane。
SLOTS:
  - name: label
    description: 自定义全部标签标题，参数为 pane、active、value。
  - name: s-tab#label
    description: 自定义单个标签标题，可组合 ContextMenu。
  - name: extra
    description: 标签栏尾部操作区。
  - name: add-icon / close-icon / more-icon
    description: 替换添加、关闭和更多图标。
---

# Tabs（标签页）

<card>

Tabs 使用语义化 `tablist / tab / tabpanel`，支持方向键、Home 与 End。所有形态均不依赖可见边框，通过间距、背景层次和阴影组织结构。

`lazy` 会在面板首次激活时挂载并在后续切换中保留；`destroy-on-hide` 则会持续卸载非活动面板。

</card>

<card>

## 延迟挂载

面板内容开销较大时可添加 `lazy`。初始只挂载当前面板；每个访问过的面板只挂载一次，并在后续切换中保留。

<template #example><tabs-lazy /></template>

<template #template>

@[code](../../.vuepress/components/tabs/lazy.vue)

</template>

</card>

<card>

## 外观与布局

在一个示例中切换轨道、胶囊、卡片、位置、尺寸与内容动效。

<template #example><tabs-default /></template>

<template #template>

@[code](../../.vuepress/components/tabs/default.vue)

</template>

</card>

<card>

## 超出收纳

默认 `overflow="collapse"`。空间不足时保留当前标签，并把其余标签收进“更多”浮层。

<template #example><tabs-overflow /></template>

<template #template>

@[code](../../.vuepress/components/tabs/overflow.vue)

</template>

</card>

<card>

## 动态添加与删除

`editable` 可以为任意展示风格开启添加、删除请求，标签数组仍由业务层单一维护；`editable-card` 保留原有可编辑卡片行为以兼容旧用法。

<template #example><tabs-editable /></template>

<template #template>

@[code](../../.vuepress/components/tabs/editable.vue)

</template>

</card>

<card>

## 右键菜单

使用 `s-tab` 的 `label` 插槽组合仓库已有的 `SContextMenu`，无需在 Tabs 内重复实现菜单系统。

<template #example><tabs-context-menu /></template>

<template #template>

@[code](../../.vuepress/components/tabs/context-menu.vue)

</template>

</card>
