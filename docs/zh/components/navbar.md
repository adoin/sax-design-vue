---
description: "构建带有分组操作和响应式状态的顶层导航。"
PROPS:
  - name: fixed
    type: Boolean
    values: true, false
    description: 是否将组件固定在屏幕上。
    default: false
    link: null
    usage: null
    code: >
      <s-navbar fixed>
        ...
      </s-navbar>
  - name: shadow
    type: Boolean
    values: true, false
    description: 为组件添加阴影。
    default: primary
    link: null
    usage: null
    code: >
      <s-navbar shadow>
        ...
      </s-navbar>
  - name: shadow-scroll
    type: Boolean
    values: true, false
    description: 滚动位置大于 0 时为组件添加阴影。
    default: false
    link: null
    usage: null
    code: >
      <s-navbar shadow-scroll>
        ...
      </s-navbar>
  - name: hide-scroll
    type: Boolean
    values: true, false
    description: 根据向下或向上滚动隐藏、显示组件。
    default: false
    link: null
    usage: '#hide-scroll'
    code: >
      <s-navbar hide-scroll>
        ...
      </s-navbar>
  - name: textWhite
    type: Boolean
    values: true, false
    description: 将项目文本颜色改为白色。
    default: false
    link: null
    usage: '#color'
    code: >
      <s-navbar text-white>
        ...
      </s-navbar>
  - name: square
    type: Boolean
    values: true, false
    description: 将组件圆角设为 0，形成方形样式。
    default: false
    link: null
    usage: '#square'
    code: >
      <s-navbar square>
        ...
      </s-navbar>
  - name: padding-scroll
    type: Boolean
    values: true, false
    description: 控制组件内边距，并在滚动时移除以形成视觉效果。
    default: false
    link: null
    usage: '#padding-scroll'
    code: >
      <s-navbar padding-scroll>
        ...
      </s-navbar>
  - name: not-line
    type: Boolean
    values: true, false
    description: 移除组件激活指示线。
    default: false
    link: null
    usage: '#not-line'
    code: >
      <s-navbar not-line>
        ...
      </s-navbar>
  - name: left-collapsed
    type: Boolean
    values: true, false
    description: 该插槽空间不足时自动折叠其元素。
    default: false
    link: null
    usage: '#default'
    code: >
      <s-navbar left-collapsed>
        ...
      </s-navbar>
  - name: center-collapsed
    type: Boolean
    values: true, false
    description: 该插槽空间不足时自动折叠其元素。
    default: false
    link: null
    usage: '#default'
    code: >
      <s-navbar center-collapsed>
        ...
      </s-navbar>
  - name: right-collapsed
    type: Boolean
    values: true, false
    description: 该插槽空间不足时自动折叠其元素。
    default: false
    link: null
    usage: '#default'
    code: >
      <s-navbar right-collapsed>
        ...
      </s-navbar>
  - name: target-scroll
    type: Boolean
    values: true, false
    description: 指定监听滚动事件的元素。
    default: document
    link: null
    usage: '#target-scroll'
    code: >
      <s-navbar target-scroll="#my-element">
        ...
      </s-navbar>
  - name: item:active
    type: Boolean
    values: true, false
    description: 是否处于激活状态。
    default: false
    link: null
    usage: '#default'
    code: >
      <s-navbar-item active>
        ...
      </s-navbar-item>
  - name: item:to
    type: String, Object
    values: vue-router RouteLocationRaw
    description: 使用 vue-router 根据传入值跳转到新视图。
    default: false
    link: null
    usage: null
    code: >
      <s-navbar-item to="/">
        ...
      </s-navbar-item>
  - name: item:to
    type: String, Object
    values: vue-router RouteLocationRaw
    description: 使用 vue-router 根据传入值跳转到新视图。
    default: false
    link: null
    usage: null
    code: >
      <s-navbar-item to="/">
        ...
      </s-navbar-item>
  - name: item:link
    type: Object
    values: NavLink
    description: 用于站点导航。
    default: false
    link: null
    usage: null
    code: >
      <s-navbar-item :link="{ path: '/docs', text: 'Documents' }">
        ...
      </s-navbar-item>

SLOTS:
  - name: default
    type: slot
    values: null
    description: 在组件中部添加元素。
    default: null
    link: null
    usage: '#default'
    code: >
      <s-navbar v-model="active">
        <s-navbar-item :active="active == 'guide'" id="guide">
          Guide
        </s-navbar-item>
      </s-navbar>
  - name: left
    type: slot
    values: null
    description: 在组件左侧添加元素。
    default: null
    link: null
    usage: '#default'
    code: >
      <template #left>
        <img src="/logo2.png" alt="">
      </template>
  - name: right
    type: slot
    values: null
    description: 在组件右侧添加元素。
    default: null
    link: null
    usage: '#default'
    code: >
      <template #right>
        <s-button flat> Login </s-button>
        <s-button> Get Started </s-button>
      </template>
---

# Navbar 导航栏

<card>

## 默认

<docs-warn />

使用 `s-navbar` 可快速创建菜单。组件提供 **left**、**center**（默认）、**right** 三个插槽决定元素位置，并包含 `s-navbar-item`、`s-navbar-group` 子组件。

<template #example>
<navbar-default />
</template>

<template #template>

@[code{1-22}](../../.vuepress/components/navbar/default.vue)

</template>

<template #script>

@[code{24-28}](../../.vuepress/components/navbar/default.vue)

</template>

<template #style>

@[code{30-52}](../../.vuepress/components/navbar/default.vue)

</template>

</card>

<card>

## 颜色

通过 `color` 或主题色设置组件颜色。

需要将文本设为白色时，使用 `text-white` 属性。

<template #example>
<navbar-color />
</template>

<template #template>

@[code{1-23}](../../.vuepress/components/navbar/color.vue)

</template>

<template #script>

@[code{24-29}](../../.vuepress/components/navbar/color.vue)

</template>

<template #style>

@[code{30-52}](../../.vuepress/components/navbar/color.vue)

</template>

</card>

<card>

## 滚动隐藏

用户向下滚动时隐藏导航栏，向上滚动时显示。

<template #example>
<navbar-hide-scroll />
</template>

<template #template>

@[code{1-35}](../../.vuepress/components/navbar/hide-scroll.vue)

</template>

<template #script>

@[code{37-41}](../../.vuepress/components/navbar/hide-scroll.vue)

</template>

<template #style>

@[code{43-65}](../../.vuepress/components/navbar/hide-scroll.vue)

</template>

</card>

<card>

## 分组

通过 `s-navbar-group` 可在一个项目中添加元素列表，内部放入 `s-navbar-item` 组件。

<template #example>
<navbar-group />
</template>

<template #template>

@[code{1-58}](../../.vuepress/components/navbar/group.vue)

</template>

<template #script>

@[code{60-64}](../../.vuepress/components/navbar/group.vue)

</template>

<template #style>

@[code{66-94}](../../.vuepress/components/navbar/group.vue)

</template>

</card>

<card>

## 滚动内边距

为组件添加上下内边距，并在滚动时移除，形成平滑视觉效果。

<template #example>
<navbar-padding-scroll />
</template>

<template #template>

@[code{1-35}](../../.vuepress/components/navbar/padding-scroll.vue)

</template>

<template #script>

@[code{37-41}](../../.vuepress/components/navbar/padding-scroll.vue)

</template>

<template #style>

@[code{43-65}](../../.vuepress/components/navbar/padding-scroll.vue)

</template>

</card>

<card>

## 方形

移除 `border-radius`，使组件呈方形。

<template #example>
<navbar-square />
</template>

<template #template>

@[code{1-30}](../../.vuepress/components/navbar/square.vue)

</template>

<template #script>

@[code{32-36}](../../.vuepress/components/navbar/square.vue)

</template>

<template #style>

@[code{38-60}](../../.vuepress/components/navbar/square.vue)

</template>

</card>

<card>

## 隐藏指示线

移除组件的激活效果线。

<template #example>
<navbar-not-line />
</template>

<template #template>

@[code{1-30}](../../.vuepress/components/navbar/not-line.vue)

</template>

<template #script>

@[code{32-36}](../../.vuepress/components/navbar/not-line.vue)

</template>

</card>

<card>

## 类型定义

```ts
interface NavItem {
  text?: string
  ariaLabel?: string
}

interface NavLink extends NavItem {
  path: string
  target?: string
}

type NavbarItem = NavLink
```

</card>

<card>

## API

</card>
