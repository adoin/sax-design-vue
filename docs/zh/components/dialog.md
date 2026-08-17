---
description: "展示聚焦的模态内容并要求用户作出决定。"
PROPS:
  - name: before-close / cancel-button-text / cancel-closable / confirm-button-text / confirm-closable
    type: Function / String / Boolean / String / Boolean
    values: 关闭守卫和操作按钮配置
    description: 在关闭前拦截操作，并配置确认、取消按钮文本和关闭行为。
    default: '-'
  - name: color / height / mask / mask-closable / min-height / min-width / show-close / show-header / top
    type: Color / String | Number / Boolean
    values: 外观、遮罩和尺寸配置
    description: 配置弹窗外观、遮罩、标题栏、关闭按钮和尺寸位置。
    default: '-'
  - name: v-model
    type: Boolean
    values: true,false
    description: 是否显示对话框。
    default: false
    link: null
    usage: '#default'
    code: null

  - name: not-center
    type: Boolean
    values: true, false
    description: 默认标题栏内容居中；启用后取消居中。
    default: false
    link: null
    usage: '#type'
    code: null

  - name: width
    type: String
    values: px
    description: 设置对话框宽度。
    default: null
    link: null
    usage: '#type'
    code: null

  - name: loading
    type: Boolean
    values: true, false
    description: 为对话框添加加载动画。
    default: false
    link: null
    usage: '#loading'
    code: null

  - name: not-close
    type: Boolean
    values: true, false
    description: 隐藏对话框关闭按钮。
    default: false
    link: null
    usage: '#not-close'
    code: null

  - name: scroll
    type: Boolean
    values: true, false
    description: 限制内容最大高度，溢出时显示滚动条。
    default: false
    link: null
    usage: '#scroll'
    code: null

  - name: lock-scroll
    type: Boolean
    values: true, false
    description: 打开对话框时锁定页面滚动。
    default: false
    link: null
    usage: '#lock-scroll'
    code: null

  - name: auto-width
    type: Boolean
    values: true, false
    description: 使对话框宽度自动适应内容。
    default: false
    link: null
    usage: '#scroll'
    code: null

  - name: not-padding
    type: Boolean
    values: true, false
    description: 移除对话框基础内容区域内边距。
    default: false
    link: null
    usage: '#not-padding'
    code: null

  - name: full-screen
    type: Boolean
    values: true, false
    description: 使对话框占满窗口。
    default: false
    link: null
    usage: '#full-screen'
    code: null

  - name: overlay-blur
    type: Boolean
    values: true, false
    description: 打开时使背景元素模糊。
    default: false
    link: null
    usage: '#overlay-blur'
    code: null

  - name: shape
    type: String
    values: square
    description: 移除对话框圆角。
    default: false
    link: null
    usage: '#shape'
    code: null

  - name: prevent-close
    type: Boolean
    values: true, false
    description: 禁止点击遮罩或按 Esc 关闭对话框。
    default: false
    link: null
    usage: null
    code: null

EVENTS:
  - name: close
    type: Function
    values: null
    description: 对话框关闭时触发。
    default: null
    link: null
    usage: null
    code: >
      <s-dialog @close="handleClose" v-model="active">
        ...
      </s-dialog>

SLOTS:
  - name: default
    type: slot
    values: null
    description: Dialog 默认内容插槽。
    default: null
    link: null
    usage: '#default'
    code: null

  - name: header
    type: slot
    values: null
    description: Dialog 标题插槽。
    default: null
    link: null
    usage: '#default'
    code: null

  - name: footer
    type: slot
    values: null
    description: Dialog 页脚插槽。
    default: null
    link: null
    usage: '#default'
    code: >
      <s-dialog>
        <template #footer>
          <h1>This is slot footer</h1>
        </template>
      </s-dialog>
---

# Dialog 对话框

**Dialog 是通用模态容器**，通过插槽自定义 header、内容与 footer。

若只是 **确认 / 警告** 类交互，且需要内置「确定 / 取消」按钮，请用 [Prompt（提示框）](/zh/components/prompt)。两者不重复：Prompt 面向“你确定吗？”式流程；Dialog 面向任意复杂界面（表单、向导、嵌套弹窗、全屏等）。

<card>

## 默认

<docs-warn />

使用 `s-dialog` 可创建高度可定制的对话框；通过插槽可组合任意业务界面。

<template #example>
<dialog-default />
</template>

<template #template>

@[code{1-35} vue{4-33}](../../.vuepress/components/dialog/default.vue)

</template>

<template #script>

@[code{36-43}](../../.vuepress/components/dialog/default.vue)

</template>

<template #style>

@[code{44-101}](../../.vuepress/components/dialog/default.vue)

</template>

</card>

<card>

## 类型

通过 `header`、默认和 `footer` 插槽，可快速创建 **提示**、**确认** 等常见对话框结构。

<template #example>
<dialog-type />
</template>

<template #template>

@[code{1-74} html{6}](../../.vuepress/components/dialog/type.vue)

</template>

<template #script>

@[code{75-82}](../../.vuepress/components/dialog/type.vue)

</template>

<template #style>

@[code{84-140}](../../.vuepress/components/dialog/type.vue)

</template>

</card>

<card>

## 加载

通过 `loading` 属性为对话框添加加载动画。

<template #example>
<dialog-loading />
</template>

<template #template>

@[code{1-35} vue{6}](../../.vuepress/components/dialog/loading.vue)

</template>

<template #script>

@[code{36-43}](../../.vuepress/components/dialog/loading.vue)

</template>

<template #style>

@[code{45-102}](../../.vuepress/components/dialog/loading.vue)

</template>

</card>

<card>

## 不可关闭

通过 `not-close` 属性隐藏关闭按钮。

<template #example>
<dialog-not-close />
</template>

<template #template>

@[code{1-35} vue{4}](../../.vuepress/components/dialog/not-close.vue)

</template>

<template #script>

@[code{36-43}](../../.vuepress/components/dialog/not-close.vue)

</template>

<template #style>

@[code{44-101}](../../.vuepress/components/dialog/not-close.vue)

</template>

</card>

<card>

## 滚动

对话框内容较多时，可使用 `scroll` 属性启用滚动。

<template #example>
<dialog-scroll />
</template>

<template #template>

@[code{1-79} vue{4}](../../.vuepress/components/dialog/scroll.vue)

</template>

<template #script>

@[code{81-85}](../../.vuepress/components/dialog/scroll.vue)

</template>

<template #style>

@[code{87-97}](../../.vuepress/components/dialog/scroll.vue)

</template>

</card>

<card>

## 锁定页面滚动

需要在打开对话框时锁定页面滚动，可使用 `lock-scroll` 属性。

<template #example>
<dialog-lock-scroll />
</template>

<template #template>

@[code{1-35} vue{4}](../../.vuepress/components/dialog/lock-scroll.vue)

</template>

<template #script>

@[code{36-43}](../../.vuepress/components/dialog/lock-scroll.vue)

</template>

<template #style>

@[code{44-101}](../../.vuepress/components/dialog/lock-scroll.vue)

</template>

</card>

<card>

## 无内边距

需要移除对话框内边距以构建自定义界面时，可使用 `not-padding` 属性。

<template #example>
<dialog-not-padding />
</template>

<template #template>

@[code{1-12}](../../.vuepress/components/dialog/not-padding.vue)

</template>

<template #script>

@[code{14-18}](../../.vuepress/components/dialog/not-padding.vue)

</template>

<template #style>

@[code{20-30}](../../.vuepress/components/dialog/not-padding.vue)

</template>

</card>

<card>

## 嵌套对话框

可按需嵌套多个 `s-dialog`。

<template #example>
<dialog-nested />
</template>

<template #template>

@[code{1-41}](../../.vuepress/components/dialog/nested.vue)

</template>

<template #script>

@[code{42-50}](../../.vuepress/components/dialog/nested.vue)

</template>

<template #style>

@[code{52-109}](../../.vuepress/components/dialog/nested.vue)

</template>

</card>

<card>

## 全屏

需要让对话框占满整个窗口时，可使用 `full-screen` 属性。

<template #example>
<dialog-full-screen />
</template>

<template #template>

@[code{1-35} vue{4}](../../.vuepress/components/dialog/full-screen.vue)

</template>

<template #script>

@[code{36-43}](../../.vuepress/components/dialog/full-screen.vue)

</template>

<template #style>

@[code{44-101}](../../.vuepress/components/dialog/full-screen.vue)

</template>

</card>

<card>

## 遮罩模糊

通过 `overlay-blur` 可为对话框后的元素添加模糊样式；该功能依赖 CSS 属性 [backdrop-filter](https://caniuse.com/#feat=css-backdrop-filter)。

<template #example>
<dialog-blur />
</template>

<template #template>

@[code{1-33} vue{4}](../../.vuepress/components/dialog/blur.vue)

</template>

<template #script>

@[code{35-42}](../../.vuepress/components/dialog/blur.vue)

</template>

<template #style>

@[code{44-101}](../../.vuepress/components/dialog/blur.vue)

</template>

</card>

<card>

## 形状

### 直角

移除对话框圆角，使其变为直角矩形。

<template #example>
<dialog-square />
</template>

<template #template>

@[code{1-40} vue{4}](../../.vuepress/components/dialog/square.vue)

</template>

<template #script>

@[code{42-49}](../../.vuepress/components/dialog/square.vue)

</template>

<template #style>

@[code{51-108}](../../.vuepress/components/dialog/square.vue)

</template>

</card>

<card>

## 禁止关闭

使用 `prevent-close` 后，点击遮罩或按 **Esc** 键不会关闭对话框。

<template #example>
<dialog-prevent-close />
</template>

<template #template>

@[code{1-35} vue{4}](../../.vuepress/components/dialog/prevent-close.vue)

</template>

<template #script>

@[code{37-44}](../../.vuepress/components/dialog/prevent-close.vue)

</template>

<template #style>

@[code{46-103}](../../.vuepress/components/dialog/prevent-close.vue)

</template>

</card>

<card>

## 高级能力

不需要复杂 slot 时，可用 title、content 和内置确认/取消按钮；slot 仍然优先。

<template #example>
<dialog-advanced />
</template>

<template #template>

@[code{1-13} html{3-11}](../../.vuepress/components/dialog/advanced.vue)

</template>

<template #script>

@[code{15-19}](../../.vuepress/components/dialog/advanced.vue)

</template>

## API

</card>
