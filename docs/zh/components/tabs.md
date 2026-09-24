---
description: '支持溢出收纳、动态增删、右键菜单与多种无边框外观的标签页。'
PROPS:
  - name: v-model
    type: String | Number
    values: "s-tab 的 name；未设置 name 时为索引"
    description: 当前激活标签。
    default: '0'
  - name: model-value
    type: String | Number
    values: "s-tab 的 name；未设置 name 时为索引"
    description: 当前激活标签。
    default: '0'
  - name: type
    type: String
    values: "line / pill / card / connected-card / editable-card"
    description: 标签栏外观；connected-card 将激活标签与内容面板连接为同一表面，editable-card 是兼容旧用法的可编辑卡片预设。
    default: line
  - name: overflow
    type: String
    values: "collapse / scroll / wrap"
    description: 横向空间不足时收进更多菜单、滚动或换行。
    default: collapse
  - name: alignment
    type: String
    values: "left / center / right / fixed"
    description: 标签对齐与均分方式。
    default: left
  - name: position
    type: String
    values: "top / bottom / left / right"
    description: 标签栏位置。
    default: top
  - name: size
    type: String
    values: "small / default / large"
    description: 标签尺寸。
    default: default
  - name: animated
    type: Boolean
    values: "true / false"
    description: 是否启用面板与列表切换动效。
    default: 'true'
  - name: render-mode
    type: "'all' | 'lazy' | 'active-only'"
    values: "all | lazy | active-only"
    description: 分别选择全部挂载、访问后保留，或仅挂载当前面板。
    default: all
    usage: '#render-modes'
  - name: destroy-on-hide
    type: Boolean
    values: "true / false"
    description: 兼容旧用法，等同 render-mode="active-only"；显式 render-mode 优先。
    default: 'false'
    usage: '#render-modes'
  - name: lazy
    type: Boolean
    values: "true / false"
    description: 兼容旧用法，等同 render-mode="lazy"；显式 render-mode 优先。
    default: 'false'
    usage: '#render-modes'
  - name: editable
    type: Boolean
    values: "true / false"
    description: 不依赖展示风格，独立开启新增与关闭操作。
    default: 'false'
  - name: hide-add
    type: Boolean
    values: "true / false"
    description: 开启编辑操作时隐藏添加按钮。
    default: 'false'
  - name: color
    type: String
    values: "主题色 / RGB / HEX"
    description: 激活色。
    default: primary
  - name: aria-label
    type: String
    values: "文本"
    description: 标签导航的无障碍名称；默认读取组件语言包。
    default: 标签页
CHILD_PROPS:
  - name: name
    type: String | Number
    values: "唯一值"
    description: s-tab 的稳定标识，也是 v-model 返回值。
    default: 当前索引
  - name: label
    type: String
    values: "文本"
    description: 标签名称与溢出菜单回退文本。
    default: Label
  - name: icon
    type: String
    values: "图标名"
    description: 标签图标与徽标。
    default: null
  - name: badge
    type: String | Number
    values: "徽标内容"
    description: 标签图标与徽标。
    default: null
  - name: disabled
    type: Boolean
    values: "true"
    description: 禁用标签，或控制开启编辑操作时是否允许关闭。
    default: false
  - name: closable
    type: Boolean
    values: "false"
    description: 禁用标签，或控制开启编辑操作时是否允许关闭。
    default: true
  - name: render-mode
    type: "'all' | 'lazy' | 'active-only'"
    values: "all | lazy | active-only"
    description: 为当前面板覆盖父级挂载策略。
    default: null
    usage: '#pane-override'
  - name: force-render
    type: Boolean
    values: "true / false"
    description: 兼容旧用法，等同当前面板的 render-mode="all"；面板显式 render-mode 优先。
    default: 'false'
    usage: '#pane-override'
EVENTS:
  - name: change
    description: 激活项变化时返回 value 与 pane。
  - name: tab-click
    description: 点击或键盘激活标签时返回 value、事件与 pane。
  - name: add
    description: 请求添加或删除标签；数据仍由父级维护。
  - name: remove
    description: 请求添加或删除标签；数据仍由父级维护。
  - name: edit
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
  - name: add-icon
    description: 替换添加、关闭和更多图标。
  - name: close-icon
    description: 替换添加、关闭和更多图标。
  - name: more-icon
    description: 替换添加、关闭和更多图标。
---

# Tabs 标签页

<card>

Tabs 使用语义化 `tablist / tab / tabpanel`，支持方向键、Home 与 End。所有形态均不依赖可见边框，通过间距、背景层次和阴影组织结构。

用一个 `render-mode` 选择挂载策略：`all` 立即挂载全部面板，`lazy` 首次访问后保留，`active-only` 在面板离开时卸载内容。大量重型面板不宜保留所有已访问的子树，可用 `active-only`；需要跨切换保留的数据应放在面板外维护。

旧的 `lazy`、`destroy-on-hide` 和 `force-render` 暂作兼容别名。显式 `render-mode` 优先；父级两个旧属性同时为 true 时，仍以 `destroy-on-hide` 为准。

</card>

<card>

## 渲染策略

切换策略和标签，直接比较当前挂载的面板数。`all` 始终保留全部面板，`lazy` 随访问逐步增加，`active-only` 只保留当前面板。示例关闭了动效，因此退场面板不会在动画期间短暂重叠。

<template #example><tabs-zh-render-mode /></template>

<template #template>

@[code{32-52}](../../.vuepress/components/tabs-zh/render-mode.vue)

</template>

<template #script>

@[code{1-30}](../../.vuepress/components/tabs-zh/render-mode.vue)

</template>

<template #style>

@[code{54-66}](../../.vuepress/components/tabs-zh/render-mode.vue)

</template>

</card>

<card>

## 面板级覆盖

父级使用 `active-only` 时，可在需要保留状态的单个 `s-tab` 上设置 `render-mode`。挂载计数会显示草稿面板始终留在 DOM 中，而当前面板随切换变化。

<template #example><tabs-zh-pane-render-mode /></template>

<template #template>

@[code{23-41}](../../.vuepress/components/tabs-zh/pane-render-mode.vue)

</template>

<template #script>

@[code{1-21}](../../.vuepress/components/tabs-zh/pane-render-mode.vue)

</template>

<template #style>

@[code{43-55}](../../.vuepress/components/tabs-zh/pane-render-mode.vue)

</template>

</card>

<card>

## 外观与布局

在一个示例中切换轨道、胶囊、卡片、位置、尺寸与内容动效。

<template #example><tabs-default /></template>

<template #template>

@[code{116-177}](../../.vuepress/components/tabs/default.vue)

</template>

<template #script>

@[code{1-114}](../../.vuepress/components/tabs/default.vue)

</template>

<template #style>

@[code{179-277}](../../.vuepress/components/tabs/default.vue)

</template>

</card>

<card>

## 超出收纳

默认 `overflow="collapse"`。空间不足时保留当前标签，并把放不下的标签收进“更多”浮层。示例使用窄容器展示收纳效果。

<template #example><tabs-overflow /></template>

<template #template>

@[code{50-67}](../../.vuepress/components/tabs/overflow.vue)

</template>

<template #script>

@[code{1-48}](../../.vuepress/components/tabs/overflow.vue)

</template>

<template #style>

@[code{69-88}](../../.vuepress/components/tabs/overflow.vue)

</template>

</card>

<card>

## 动态添加与删除

`editable` 可以为任意展示风格开启添加、删除请求，标签数组仍由业务层单一维护；`editable-card` 保留原有可编辑卡片行为以兼容旧用法。

<template #example><tabs-editable /></template>

<template #template>

@[code{45-66}](../../.vuepress/components/tabs/editable.vue)

</template>

<template #script>

@[code{1-43}](../../.vuepress/components/tabs/editable.vue)

</template>

<template #style>

@[code{68-77}](../../.vuepress/components/tabs/editable.vue)

</template>

</card>

<card>

## 右键菜单

使用 `s-tab` 的 `label` 插槽组合 `SContextMenu`，可为标签添加右键操作。

<template #example><tabs-context-menu /></template>

<template #template>

@[code{83-107}](../../.vuepress/components/tabs/context-menu.vue)

</template>

<template #script>

@[code{1-81}](../../.vuepress/components/tabs/context-menu.vue)

</template>

<template #style>

@[code{109-126}](../../.vuepress/components/tabs/context-menu.vue)

</template>

</card>
