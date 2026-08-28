---
description: "在悬停、聚焦或点击时显示简短的上下文帮助。"
PROPS:
  - name: append-to / effect / offset / shape / shift / show-arrow
    type: String | HTMLElement / String / Number / String / Boolean | Object / Boolean
    values: 定位和视觉配置
    description: 配置挂载位置、外观、偏移、碰撞调整和箭头显示。
    default: '-'
  - name: v-model
    type: Boolean
    values: true,false
    description: 组件是否激活（可见）。
    default: false
    link: null
    usage: '#content'
    code: null

  - name: color
    type: String
    values: Theme colors, RGB, HEX
    description: 提示框颜色。
    default: text
    link: null
    usage: '#color'
    code: >
      <s-tooltip primary>
        <s-button flat> Primary </s-button>
        <template #tooltip> This is a beautiful button </template>
      </s-tooltip>

  - name: left, right, bottom
    type: Boolean
    values: true,false
    description: 提示框位置。
    default: top
    link: null
    usage: '#position'
    code: >
      <s-tooltip left>
        <s-button border> left </s-button>
        <template #tooltip> This is a beautiful button </template>
      </s-tooltip>

  - name: border
    type: Boolean
    values: true,false
    description: 为提示框添加边框样式。
    default: primary
    link: null
    usage: '#border'
    code: >
      <s-tooltip border>
        <s-button transparent> Do hover here </s-button>
        <template #tooltip> This is a beautiful button </template>
      </s-tooltip>

  - name: border-thick
    type: Boolean
    values: true,false
    description: 仅在箭头位置添加粗边框。
    default: false
    link: null
    usage: '#border'
    code: >
      <s-tooltip color="#7d33ff" border-thick>
        <s-button color="#7d33ff" transparent> Do hover here </s-button>
        <template #tooltip> This is a beautiful button </template>
      </s-tooltip>

  - name: square
    type: Boolean
    values: trie,false
    description: 是否为无圆角矩形提示框。
    default: false
    link: null
    usage: '#square'
    code: >
      <s-tooltip square>
        <s-button square flat> Do hover here </s-button>
        <template #tooltip> This is a beautiful button </template>
      </s-tooltip>

  - name: circle
    type: Boolean
    values: true,false
    description: 将圆角设为 20px，单行文本时呈胶囊形。
    default: false
    link: null
    usage: '#circle'
    code: >
      <s-tooltip circle>
        <s-button circle flat> Do hover here </s-button>
        <template #tooltip> This is a beautiful button </template>
      </s-tooltip>

  - name: shadow
    type: Boolean
    values: true,false
    description: 为提示框添加阴影并调整背景样式。
    default: false
    link: null
    usage: '#shadow'
    code: >
      <s-tooltip shadow>
        <s-button flat> Do hover here</s-button>
        <template #tooltip> This is a beautiful button </template>
      </s-tooltip>

  - name: not-arrow
    type: Boolean
    values: true,false
    description: 隐藏提示框箭头。
    default: false
    link: null
    usage: '#not-arrow'
    code: >
      <s-tooltip not-arrow left>
        <s-button border> left not-arrow </s-button>
        <template #tooltip> This is a beautiful button </template>
      </s-tooltip>

  - name: not-hover
    type: Boolean
    values: true,false
    description: 取消默认的父元素悬浮触发行为，不再随悬浮显示或隐藏。
    default: false
    link: null
    usage: '#content'
    code: >
      <s-tooltip bottom shadow not-hover v-model="activeTooltip1">
        <s-button danger @click="activeTooltip1 = !activeTooltip1"> Click Delete User </s-button>
        <template #tooltip>
          <div class="content-tooltip">
            <h4 class="center"> Confirm </h4>
            <p> You are sure to delete this user, by doing so you cannot recover the data </p>
            <footer>
              <s-button @click="activeTooltip1=false" danger block> Delete </s-button>
              <s-button @click="activeTooltip1=false" transparent dark block> Cancel </s-button>
            </footer>
          </div>
        </template>
      </s-tooltip>

  - name: interactivity
    type: Boolean
    values: true,false
    description: 是否允许交互点击且不自动隐藏。
    default: false
    link: null
    usage: '#content'
    code: >
      <s-tooltip shadow interactivity>
        <s-avatar>
          <img src="/avatars/avatar-5.png" alt="">
        </s-avatar>
        <template #tooltip>
          <div class="content-tooltip">
            <div class="body">
              <div class="text">
                Cosed Tasks <span> 89 </span>
              </div>
              <s-avatar circle size="80" @click="activeTooltip1=!activeTooltip1">
                <img src="/avatars/avatar-5.png" alt="">
              </s-avatar>
              <div class="text">
                Open Tasks <span> 8 </span>
              </div>
            </div>
            <footer>
              <s-button circle icon border> <s-icon  name="bxs:share-alt" /> </s-button>
              <s-button circle> Message </s-button>
              <s-button circle icon border> <s-icon   name="bx:like" /> </s-button>
            </footer>
          </div>
        </template>
      </s-tooltip>

  - name: loading
    type: Boolean
    values: true,false
    description: 是否显示加载样式和动画。
    default: false
    link: null
    usage: '#loading'
    code: >
      <template>
        <div class="center">
          <s-tooltip loading>
            <s-button flat> Do hover here loading </s-button>
            <template #tooltip> This is a beautiful button </template>
          </s-tooltip>
          <s-tooltip loading>
            <s-button flat> Do hover here loading </s-button>
            <template #tooltip></template>
          </s-tooltip>
        </div>
      </template>

SLOTS:
  - name: default
    type: slot
    values: null
    description: 提示框触发元素插槽。
    default: null
    link: null
    usage: '#default'
    code: >
      <s-tooltip>
        <s-button flat> Do hover here </s-button>
        <template #tooltip> This is a beautiful button </template>
      </s-tooltip>
  - name: content
    type: slot
    values: null
    description: 提示框内容插槽。
    default: null
    link: null
    usage: '#default'
    code: >
      <s-tooltip>
        <s-button flat> Do hover here </s-button>
        <template #tooltip> This is a beautiful button </template>
      </s-tooltip>
---

# Tooltip 文字提示

<card>

## 默认

<docs-warn />

使用 `s-tooltip` 可快速添加文字提示；默认插槽内容为触发元素。

`tooltip` 插槽用于放置提示框内容。

<template #example>
<tooltip-default />
</template>

<template #template>

@[code{1-8}](../../.vuepress/components/tooltip/default.vue)

</template>

<template #style>

@[code{9-13}](../../.vuepress/components/tooltip/default.vue)

</template>

</card>

<card>

## 位置

通过以下属性设置提示框位置：

- top
- bottom <Badge text=默认 />
- left
- right

<template #example>
<tooltip-placement />
</template>

<template #template>

@[code{1-20}](../../.vuepress/components/tooltip/placement.vue)

</template>

<template #style>

@[code{22-26}](../../.vuepress/components/tooltip/placement.vue)

</template>

</card>

<card>

## 颜色

<coloren />

<template #example>
<tooltip-color />
</template>

<template #template>

@[code{1-36}](../../.vuepress/components/tooltip/color.vue)

</template>

<template #style>

@[code{38-42}](../../.vuepress/components/tooltip/color.vue)

</template>

</card>

<card>

## 边框

通过 `border` 或 `border-thick` 可添加边框并调整背景样式。

::: tip
此时 `color` 属性会控制边框颜色。
:::

<template #example>
<tooltip-border />
</template>

<template #template>

@[code{1-16}](../../.vuepress/components/tooltip/border.vue)

</template>

<template #style>

@[code{18-22}](../../.vuepress/components/tooltip/border.vue)

</template>

</card>

<card>

## 方形

调整提示框 `border-radius`，使其成为直角矩形。

<template #example>
<tooltip-square />
</template>

<template #template>

@[code{1-8}](../../.vuepress/components/tooltip/square.vue)

</template>

<template #style>

@[code{10-14}](../../.vuepress/components/tooltip/square.vue)

</template>

</card>

<card>

## 圆形

调整提示框 `border-radius`，使其更接近圆形。

::: tip
该属性仅在提示内容为单行时生效。
:::

<template #example>
<tooltip-circle />
</template>

<template #template>

@[code{1-8}](../../.vuepress/components/tooltip/circle.vue)

</template>

<template #style>

@[code{10-14}](../../.vuepress/components/tooltip/circle.vue)

</template>

</card>

<card>

## 阴影

调整提示框样式，添加阴影并设置背景颜色。

<template #example>
<tooltip-shadow />
</template>

<template #template>

@[code{1-8}](../../.vuepress/components/tooltip/shadow.vue)

</template>

<template #style>

@[code{10-14}](../../.vuepress/components/tooltip/shadow.vue)

</template>

</card>

<card>

## 隐藏箭头

某些场景需要移除提示框箭头，可使用 `not-arrow` 属性。

<template #example>
<tooltip-notArrow />
</template>

<template #template>

@[code{1-20}](../../.vuepress/components/tooltip/notArrow.vue)

</template>

<template #style>

@[code{21-25}](../../.vuepress/components/tooltip/notArrow.vue)

</template>

</card>

<card>

## 加载

为提示框添加加载样式和动画。

<template #example>
<tooltip-loading />
</template>

<template #template>

@[code{1-12}](../../.vuepress/components/tooltip/loading.vue)

</template>

<template #style>

@[code{13-17}](../../.vuepress/components/tooltip/loading.vue)

</template>

</card>

<card>

## 内容

提示框组件提供充足的组合空间，可在内部放入任意内容并构建多种界面。

<template #example>
<tooltip-content />
</template>

<template #template>

@[code{1-80}](../../.vuepress/components/tooltip/content.vue)

</template>

<template #script>

@[code{82-86}](../../.vuepress/components/tooltip/content.vue)

</template>

<template #style>

@[code{88-135}](../../.vuepress/components/tooltip/content.vue)

</template>

</card>
