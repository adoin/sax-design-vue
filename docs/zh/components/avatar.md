---
description: "使用图片、图标或首字母表示用户、团队或实体。"
PROPS:
  - name: badge-position
    type: String
    values: top-left | top-right | bottom-left | bottom-right
    description: 设置可选徽标在头像周围的位置。
    default: top-right
  - name: color
    type: String
    values: Theme colors, RGB, HEX
    description: 组件颜色。
    default: --sax-gray-2
    link: null
    usage: '#color'
    code: null

  - name: size
    type: Number
    values: Number
    description: 头像组件尺寸。
    default: 44
    link: null
    usage: '#size'
    code: null
  - name: badge
    type: Boolean
    values: true, false
    description: 是否启用徽标。
    default: false
    link: null
    usage: '#badge'
    code: null

  - name: badge-color
    type: String
    values: Theme colors,RGB,HEX
    description: 设置头像内徽标颜色。
    default: primary
    link: null
    usage: '#badge'
    code: null

  - name: shape
    type: String
    values: square, circle
    description: 设置头像为圆形或方形样式。
    default: false
    link: null
    usage: '#shape'
    code: null

  - name: writing
    type: Boolean
    values: true,false
    description: 为输入状态徽标添加动画。
    default: false
    link: null
    usage: '#badge'
    code: null

  - name: history
    type: Boolean
    values: true,false
    description: 为头像添加边框。
    default: gray-2
    link: null
    usage: '#history'
    code: null

  - name: history-gradient
    type: Boolean
    values: true,false
    description: 将边框颜色改为渐变。
    default: false
    link: null
    usage: '#history'
    code: null

  - name: loading
    type: Boolean
    values: true,false
    description: 为头像添加加载动画。
    default: false
    link: null
    usage: '#loading'
    code: null

  - name: max
    type: number
    values: number
    description: "`s-avatar-group` 中最多显示的头像数量。"
    default: null
    link: null
    usage: '#group'
    code: null
  - name: float
    type: Boolean
    values: true,false
    description: "`s-avatar-group` 中头像是否并排排列。"
    default: false
    link: null
    usage: '#group'
    code: null'

  - name: pointer
    type: Boolean
    values: true,false
    description: 是否显示指针光标。
    default: false
    link: null
    usage: null
    code: null

SLOTS:
  - name: text
    type: slot
    values: null
    description: 在头像组件内添加文本。
    default: null
    link: null
    usage: '#default'
    code: >
      <s-avatar>
        <template #text>
          Lily
        </template>
      </s-avatar>

  - name: badge
    type: slot
    values: null
    description: 徽标内容插槽，常用于数字或图标。
    default: null
    link: null
    usage: '#badge'
    code: >
      <s-avatar badge badge-color="success">
        <img src="/avatars/avatar-2.png" alt="">
        <template #badge>
          28
        </template>
      </s-avatar>

  - name: icons
    type: slot
    values: null
    description: 用于在头像旁放置图标的插槽。
    default: null
    link: null
    usage: '#icons'
    code: >
      <s-avatar>
        <img src="/avatars/avatar-1.png" alt="">
        <template #icons>
          <s-icon   name="bxl:facebook-square" />
          <s-icon   name="bxl:github" />
          <s-icon   name="bxl:twitter" />
        </template>
      </s-avatar>
---

# Avatar 头像

<card>

## 默认

<docs-warn />

使用 `<s-avatar>` 可快速创建功能完整的头像。

<template #example>
<avatar-default />
</template>

<template #template>

@[code{1-19}](../../.vuepress/components/avatar/default.vue)

</template>

<template #style>

@[code{21-27}](../../.vuepress/components/avatar/default.vue)

</template>

</card>

<card>

## 颜色

通过 `color` 设置组件颜色，支持主题色、`HEX` 与 `RGB`。

<template #example>
<avatar-color />
</template>

<template #template>

@[code{1-25}](../../.vuepress/components/avatar/color.vue)

</template>

<template #style>

@[code{26-32}](../../.vuepress/components/avatar/color.vue)

</template>

</card>

<card>

## 尺寸

通过数值设置组件尺寸；例如 `size="60"` 表示宽高均为 `60px`。

<template #example>
<avatar-size />
</template>

<template #template>

@[code{1-19}](../../.vuepress/components/avatar/size.vue)

</template>

<template #style>

@[code{20-26}](../../.vuepress/components/avatar/size.vue)

</template>

</card>

<card>

## 徽标

通过 `badge` 属性或插槽为组件添加徽标。

可用 `badge-color` 设置徽标颜色，以表示在线、离线等用户状态，例如 `success`、`danger`。

聊天场景可添加 `writing` 属性，展示输入中动画。

<template #example>
<avatar-badge />
</template>

<template #template>

@[code{1-30}](../../.vuepress/components/avatar/badge.vue)

</template>

<template #style>

@[code{31-37}](../../.vuepress/components/avatar/badge.vue)

</template>

</card>

<card>

## 自动字号与截断

短名称会原样展示；名称较长或包含多个空格时，组件会自动生成适合展示的文本。

::: tip
最大字符数为 **5**；超过限制时会自动调整显示文本。
:::

<template #example>
<avatar-auto-font />
</template>

<template #template>

@[code{1-22}](../../.vuepress/components/avatar/auto-font.vue)

</template>

<template #style>

@[code{23-29}](../../.vuepress/components/avatar/auto-font.vue)

</template>

</card>

<card>

## 形状

### 圆形

通过 `circle` 将组件的 `border-radius` 设为 `50%`，形成完整圆形。

<template #example>
<avatar-circle />
</template>

<template #template>

@[code{1-30}](../../.vuepress/components/avatar/circle.vue)

</template>

<template #style>

@[code{31-37}](../../.vuepress/components/avatar/circle.vue)

</template>

</card>

<card>

### 方形

通过 `square` 将组件的 `border-radius` 设为 `0%`，形成方形。

<template #example>
<avatar-square />
</template>

<template #template>

@[code{1-30}](../../.vuepress/components/avatar/square.vue)

</template>

<template #style>

@[code{31-37}](../../.vuepress/components/avatar/square.vue)

</template>

</card>

<card>

## 动态记录

该属性会在头像周围生成边框，常用于表示用户正在进行某项操作或有动态记录。

::: tip
可通过 `history-gradient` 将边框设为渐变色。
:::

<template #example>
<avatar-history />
</template>

<template #template>

@[code{1-19}](../../.vuepress/components/avatar/history.vue)

</template>

<template #style>

@[code{20-26}](../../.vuepress/components/avatar/history.vue)

</template>

</card>

<card>

## 图标

尚未上传头像或表示新用户时，可在默认插槽中放入图标。

<template #example>
<avatar-icon />
</template>

<template #template>

@[code{1-22}](../../.vuepress/components/avatar/icon.vue)

</template>

<template #style>

@[code{23-29}](../../.vuepress/components/avatar/icon.vue)

</template>

</card>

<card>

## 加载

添加布尔属性 `loading`，即可为组件显示加载动画。

<template #example>
<avatar-loading />
</template>

<template #template>

@[code{1-30}](../../.vuepress/components/avatar/square.vue)

</template>

<template #style>

@[code{31-37}](../../.vuepress/components/avatar/square.vue)

</template>

</card>

<card>

## 图标

通过 `icons` 插槽可在头像旁添加图标，用于用户相关操作。

<template #example>
<avatar-icons />
</template>

<template #template>

@[code{1-27}](../../.vuepress/components/avatar/icons.vue)

</template>

<template #style>

@[code{29-35}](../../.vuepress/components/avatar/icons.vue)

</template>

</card>

<card>

## 组合

通过 `s-avatar-group` 可组合多个头像，常用属性：

- **max**：设置最多展示的头像数量，其余数量会汇总显示在最后一个头像中。

- **float**：使头像并排展示，而非相互叠放。

<template #example>
<avatar-group />
</template>

<template #template>

@[code{1-69}](../../.vuepress/components/avatar/group.vue)

</template>

<template #style>

@[code{71-94}](../../.vuepress/components/avatar/group.vue)

</template>

</card>
