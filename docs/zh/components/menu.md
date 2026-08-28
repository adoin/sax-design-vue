---
PROPS:
  - name: v-model
    type: String | Number
    values: MenuKey
    description: 当前选中的菜单键。
    default: undefined
  - name: options
    type: MenuOption[]
    values: 菜单树
    description: 菜单项、分组与分隔线数据。
    default: '[]'
  - name: mode
    type: String
    values: vertical / horizontal
    description: 主菜单排列方向。
    default: vertical
  - name: submenu-mode
    type: String
    values: inline / popup
    description: 子菜单内联展开或逐级弹出；默认跟随 mode 与 collapse。
    default: 自动
  - name: trigger
    type: String
    values: hover / click
    description: 弹出子菜单的触发方式。
    default: 自动
  - name: variant
    type: String
    values: soft / floating / plain
    description: 菜单的视觉风格。
    default: soft
  - name: v-model:open-keys
    type: MenuKey[]
    values: 展开的菜单键
    description: 受控的展开分支。
    default: undefined
  - name: default-openeds
    type: MenuKey[]
    values: 初始菜单键
    description: 非受控模式的初始展开分支。
    default: '[]'
  - name: collapse
    type: Boolean
    values: true / false
    description: 收起为图标菜单，子级自动改为弹层。
    default: false
  - name: unique-open
    type: Boolean
    values: true / false
    description: 同一层只保留一个展开分支。
    default: false
  - name: selectable-parents
    type: Boolean
    values: true / false
    description: 允许含子项的节点同时被选中。
    default: false
  - name: close-on-select
    type: Boolean
    values: true / false
    description: 选择后关闭弹出菜单链。
    default: true
  - name: teleported
    type: Boolean
    values: true / false
    description: 一级弹层是否传送至浮层容器。
    default: true
  - name: show-delay
    type: Number
    values: 毫秒
    description: hover 打开的延迟。
    default: 120
  - name: hide-delay
    type: Number
    values: 毫秒
    description: hover 关闭的延迟。
    default: 180
  - name: popup-offset
    type: Number
    values: 像素
    description: 弹层和触发项的间距。
    default: 8
  - name: popup-class
    type: String
    values: 类名
    description: 弹层的附加类名。
    default: undefined
EVENTS:
  - name: update:modelValue / select
    description: 选中菜单项时触发。
  - name: update:openKeys / open / close
    description: 展开状态变化时触发。
description: '支持内联、逐级弹层与横向导航的多级菜单。'
---

# 菜单

<card>

## 内联层级

后台侧栏将收起入口放在底部；收起后保留图标轨道，子级自动变为弹层。

<template #example><menu-default /></template>

<template #template>

@[code{42-137}](../../.vuepress/components/menu/default.vue)

</template>

<template #script>

@[code{1-40}](../../.vuepress/components/menu/default.vue)

</template>

<template #style>

@[code{139-336}](../../.vuepress/components/menu/default.vue)

</template>

</card>

<card>

## 多级弹层

支持 hover / click 触发、二三级独立定位，以及 `floating` 风格。

<template #example><menu-popup /></template>

<template #template>

@[code{37-53}](../../.vuepress/components/menu/popup.vue)

</template>

<template #script>

@[code{1-35}](../../.vuepress/components/menu/popup.vue)

</template>

<template #style>

@[code{55-62}](../../.vuepress/components/menu/popup.vue)

</template>

</card>

<card>

## 横向导航

横向一级菜单使用向下展开的导航面板；更深层级才向右级联。方向键、Enter、Space 与 Escape 均可操作。

<template #example><menu-horizontal /></template>

<template #template>

@[code{43-51}](../../.vuepress/components/menu/horizontal.vue)

</template>

<template #script>

@[code{1-41}](../../.vuepress/components/menu/horizontal.vue)

</template>

</card>

<card>

## 数据结构

`MenuOption` 支持 `children`、`icon`、`description`、`badge`、`href`、`disabled`；`type` 可设为 `group` 或 `divider`。

</card>
