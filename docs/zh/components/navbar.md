---
description: '构建带有分组操作和响应式状态的顶层导航。'
PROPS:
  - name: variant
    type: String
    values: surface, floating, transparent
    description: 导航外壳的表面风格。
    default: surface
  - name: position
    type: String
    values: static, sticky, fixed
    description: 导航栏的定位方式。
    default: static
  - name: size
    type: String
    values: compact, default, spacious
    description: 导航栏高度与内部密度。
    default: default
  - name: blurred
    type: Boolean
    values: true, false
    description: 使用背景模糊的玻璃效果。
    default: false
  - name: content-width
    type: Number, String
    values: CSS length
    description: 内层内容的最大宽度。
    default: 100%
  - name: gap
    type: Number, String
    values: CSS length
    description: 品牌、导航和操作区之间的间距。
    default: 12
  - name: collapse-at
    type: Number
    values: pixels
    description: 启用 collapsed 属性的区域开始折叠时的容器宽度。
    default: 560
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
  - name: item:disabled
    type: Boolean
    values: true, false
    description: 禁用选中与导航行为。
    default: false
  - name: item:icon
    type: String
    values: icon name
    description: 在文字前显示仓库图标。
    default: null
  - name: item:badge
    type: String, Number
    values: null
    description: 在文字后显示紧凑状态。
    default: null
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

EVENTS:
  - name: update:modelValue
    type: String
    description: 当前激活导航项变化时触发。
  - name: collapsed
    type: Boolean
    description: 响应式折叠状态变化时触发。
SLOTS:
  - name: brand
    type: slot
    values: collapsed, scrolled
    description: 品牌区域；优先于旧的 left 插槽。
    default: null
  - name: navigation
    type: slot
    values: collapsed, scrolled
    description: 主导航区域；优先于默认插槽。
    default: null
  - name: actions
    type: slot
    values: collapsed, scrolled
    description: 操作区域；优先于旧的 right 插槽。
    default: null
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
        <img src="/sax-logo-mark.svg" alt="">
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

## 交互配置

<docs-warn />

`s-navbar` 是可组合的顶部导航外壳。颜色、表面、尺寸、分组、滚动行为和细节样式都可以在同一个示例中实时调整。

<template #example>
<navbar-default />
</template>

<template #template>

@[code](../../.vuepress/components/navbar/default.vue)

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
