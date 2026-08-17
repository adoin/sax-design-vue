---
description: '使用无障碍按钮样式和状态触发操作。'
PROPS:
  - name: color
    type: String
    values: primary, success, danger, warning, dark, RGB, HEX
    description: 设置组件及其子组件的颜色。
    default: primary
    link: /api/color
    usage: '#color'
    code: >
      <s-button color="success"> Success </s-button>
  # _______________________________________
  - name: style button
    type: Prop
    values: flat, border, gradient, transparent, dashed, shadow, relief, floating
    description: 设置组件及其状态的展示样式。
    default: null
    link: null
    usage: '#flat'
    code: >
      <s-button type="flat"> Flat </s-button>
  # _______________________________________
  - name: active
    type: Boolean
    values: true, false
    description: 是否激活组件，并应用激活态样式。
    default: false
    link: null
    usage: '#default'
    code: >
      <s-button active> Default </s-button>
  # _______________________________________
  - name: loading
    type: Boolean
    values: true, false
    description: 保留按钮原内容，展示所选加载动效，保持尺寸稳定，并阻止交互。
    default: false
    link: null
    usage: '#loading'
    code: >
      <s-button loading> 保存更改 </s-button>
  - name: loading-type
    type: String
    values: pulse, ripple, shimmer
    description: 通过状态 class 选择加载动效，不改变按钮 DOM 结构。
    default: pulse
    link: null
    usage: '#加载'
    code: >
      <s-button loading loading-type="ripple"> 保存更改 </s-button>
  # _______________________________________
  - name: disabled
    type: Boolean
    values: true, false
    description: 禁用按钮并阻止用户交互。
    default: false
    link: null
    usage: '#default'
    code: >
      <s-button disabled> 已禁用 </s-button>
  # _______________________________________
  - name: debounce
    type: Number | false
    values: number, false
    description: 按毫秒防抖组件发出的点击事件。两个限制属性同时为数字时，仅防抖生效并输出错误。
    default: 50
    link: null
    usage: '#点击频率限制'
    code: >
      <s-button :debounce="400"> 防抖点击 </s-button>
  # _______________________________________
  - name: throttle
    type: Number | false
    values: number, false
    description: 按毫秒节流组件发出的点击事件。启用前需把 debounce 设为 false。
    default: false
    link: null
    usage: '#点击频率限制'
    code: >
      <s-button :debounce="false" :throttle="1000"> 节流点击 </s-button>
  # _______________________________________
  - name: upload
    type: Boolean
    values: true, false
    description: 是否启用上传状态；启用后会切换样式并显示动画。
    default: false
    link: null
    usage: '#upload'
    code: >
      <s-button upload >
        <s-icon  name="bxs:wallet" /> Wallet
      </s-button>
  # _______________________________________
  - name: to
    type: String
    values: url - vue-router
    description: 为按钮添加 vue-router 跳转能力，点击后跳转到指定路由。
    default: false
    link: null
    usage: '#to-href'
    code: >
      <s-button to="/">
        Example prop - to
      </s-button>
  # _______________________________________
  - name: href
    type: String
    values: href - link
    description: 为按钮设置外部链接地址。
    default: false
    link: null
    usage: '#to-href'
    code: >
      <s-button href="https://github.com/adoin/sax-design-vue/">
        Example prop - url
      </s-button>
  # _______________________________________
  - name: blank
    type: Boolean
    values: true, false
    description: 与 HTML `a` 元素一致，决定在新窗口打开还是替换当前窗口。
    default: false
    link: null
    usage: '#to-href'
    code: >
      <s-button blank href="https://github.com/adoin/sax-design-vue/">
        Example prop - url
      </s-button>
  # _______________________________________
  - name: icon
    type: Boolean
    values: true, false
    description: 是否为纯图标按钮；启用后按钮宽高相等。
    default: false
    link: null
    usage: '#icon'
    code: >
      <s-button icon>
        <s-icon  name="bx:home-alt" />
      </s-button>
  # _______________________________________
  - name: circle
    type: Boolean
    values: true, false
    description: 将圆角改为圆形样式。
    default: false
    link: null
    usage: '#circle'
    code: >
      <s-button icon shape="circle">
        <s-icon  name="bx:home-alt" />
      </s-button>
  # _______________________________________
  - name: square
    type: Boolean
    values: true, false
    description: 将圆角改为直角方形样式。
    default: false
    link: null
    usage: '#square'
    code: >
      <s-button icon shape="square"> // <------
        <s-icon  name="bx:home-alt" />
      </s-button>
  # _______________________________________
  - name: block
    type: Boolean
    values: true, false
    description: 使组件宽度占满父容器可用空间。
    default: false
    link: null
    usage: '#block'
    code: >
      <s-button block>
        <s-icon  name="bxs:paint-roll" /> Edit Theme
      </s-button>
  # _______________________________________
  - name: animationType
    type: Boolean
    values: true, false
    description: 设置动画类型；仅在提供 <code>animate</code> 插槽时生效。
    default: false
    link: null
    usage: '#animate'
    code: >
      <s-button type="flat" color="success" animation-type="vertical">
        Message
        <template #animate>
          <s-icon  name="bx:mail-send" /> Send
        </template>
      </s-button>
  # _______________________________________
  - name: animateInactive
    type: Boolean
    values: true, false
    description: 是否在用户悬浮时启用动画。
    default: false
    link: null
    usage: '#toggle'
    code: >
      <s-button :animate-inactive="successFace" @click="handleClickFace" :loading="loadingFace" color="facebook">
        <s-icon  name="bxl:facebook-square" />
        {{ successFace ? 'Logout' : 'Facebook' }}
        <template #animate >
          <s-icon  name="bx:user" /> Login
        </template>
      </s-button>
  # _______________________________________
  - name: Ripple
    type: String
    values: reverse, cut
    description: 通过 `ripple` 属性设置按钮的水波纹样式。
    default: undefined
    usage: '#ripple'
    code: >
      <template>
        <s-button ripple="reverse"> Reverse </s-button>
        <s-button ripple="cut"> Cut </s-button>
      </template>
SLOTS:
  - name: loading
    type: slot
    values: null
    description: 使用自定义加载内容替换所选预设动效。
    default: null
    link: null
    code: >
      <s-button loading>
        保存更改
        <template #loading>保存中...</template>
      </s-button>
    usage: '#loading'
  # _______________________________________
  - name: animate
    type: slot
    values: null
    description: 用于放置动画状态展示内容的插槽。
    default: null
    link: null
    code: >
      <s-button>
        Home
        <template #animate>
          <s-icon  name="bx:home-alt" />
        </template>
      </s-button>
    usage: '#animated'
  # _______________________________________
NEWS:
  - ripple
---

# Button（按钮）

<card codesandbox="https://codesandbox.io/embed/reverent-shape-pmyk2?fontsize=14&hidenavigation=1&module=%2Fsrc%2FApp.vue">

## 默认

<docs-warn />

按钮是项目的基础交互元素；使用 `s-button` 可以快速创建一致的按钮体验。

组件内置激活、聚焦和悬浮状态，便于直接接入业务界面。

<template #example>
<button-default />
</template>

<template #template>

@[code{1-7} vue](../../.vuepress/components/button/default.vue)

</template>

<template #script>

@[code{9-13} vue](../../.vuepress/components/button/default.vue)

</template>

</card>

<card codesandbox="https://codesandbox.io/embed/charming-maxwell-ms0xf?fontsize=14&hidenavigation=1&module=%2Fsrc%2FApp.vue&theme=dark">

## 扁平

添加布尔属性 `flat`，即可将按钮切换为扁平样式。

<template #example>
<button-flat />
</template>

<template #template>

@[code{1-11} vue{3,6,9}](../../.vuepress/components/button/flat.vue)

</template>

<template #script>

@[code{13-17} vue](../../.vuepress/components/button/flat.vue)

</template>

</card>

<card codesandbox="https://codesandbox.io/embed/vuesax-button-border-zc0td?fontsize=14&hidenavigation=1&theme=dark">

## 边框

添加布尔属性 `border`，即可将按钮切换为边框样式。

<template #example>
<button-border />
</template>

<template #template>

@[code{1-11} vue{3,6,9}](../../.vuepress/components/button/border.vue)

</template>

<template #script>

@[code{13-17} vue](../../.vuepress/components/button/border.vue)

</template>

</card>

<card codesandbox="https://codesandbox.io/embed/vuesax-button-gradient-7en0i?fontsize=14&hidenavigation=1&theme=dark">

## 渐变

添加布尔属性 `gradient`，即可将按钮切换为渐变样式。

:::tip 渐变自动配色
渐变色由 `color` 属性自动生成；此示例使用 `primary` 色。
:::

<template #example>
<button-gradient />
</template>

<template #template>

@[code{1-11} vue{3,6,9}](../../.vuepress/components/button/gradient.vue)

</template>

<template #script>

@[code{13-17} vue](../../.vuepress/components/button/gradient.vue)

</template>

</card>

<card codesandbox="https://codesandbox.io/embed/vuesax-button-relief-7dfh7?fontsize=14&hidenavigation=1&theme=dark">

## 浮雕

添加布尔属性 `relief`，即可将按钮切换为浮雕样式。

<template #example>
<button-relief />
</template>

<template #template>

@[code{1-11} vue{3,6,9}](../../.vuepress/components/button/relief.vue)

</template>

<template #script>

@[code{13-17} vue](../../.vuepress/components/button/relief.vue)

</template>

</card>

<card codesandbox="https://codesandbox.io/embed/vuesax-button-transparent-4t6d6?fontsize=14&hidenavigation=1&theme=dark">

## 透明

添加布尔属性 `transparent`，即可将按钮切换为透明样式。

<template #example>
<button-transparent />
</template>

<template #template>

@[code{1-11} vue{3,6,9}](../../.vuepress/components/button/transparent.vue)

</template>

<template #script>

@[code{13-17} vue](../../.vuepress/components/button/transparent.vue)

</template>

</card>

<card codesandbox="https://codesandbox.io/embed/vuesax-button-shadow-ufx6y?fontsize=14&hidenavigation=1&theme=dark">

## 阴影

添加布尔属性 `shadow`，即可将按钮切换为阴影样式。

<template #example>
<button-shadow />
</template>

<template #template>

@[code{1-11} vue{3,6,9}](../../.vuepress/components/button/shadow.vue)

</template>

<template #script>

@[code{13-17} vue](../../.vuepress/components/button/shadow.vue)

</template>

</card>

<card codesandbox="https://codesandbox.io/embed/vuesax-button-colors-gje98?fontsize=14&hidenavigation=1&theme=dark">

## 颜色

通过 `color` 设置按钮颜色，支持主题色、**#fff**、**rgba(100,10,5)** 等值；该属性支持动态更新。

<utils-color />

<template #example>
<button-color />
</template>

<template #template>

@[code{1-53} vue{5,13,21,29,37,45}](../../.vuepress/components/button/color.vue)

</template>

<template #script>

@[code{55-59} vue](../../.vuepress/components/button/color.vue)

</template>

</card>

<card>

## 图标

纯图标按钮可添加布尔属性 `icon`。

启用后按钮宽高相等；图标与文本同时存在时无需设置此属性。

<utils-icon />

<template #example>
<button-icon />
</template>

<template #template>

@[code{1-57} vue{3}](../../.vuepress/components/button/icon.vue)

</template>

<template #script>

@[code{59-63} vue](../../.vuepress/components/button/icon.vue)

</template>

</card>

<card>

## 图标与文本

需要同时展示文本和图标时，直接放入默认插槽即可。

<template #example>
<button-iconText />
</template>

<template #template>

@[code{1-52} vue{4}](../../.vuepress/components/button/iconText.vue)

</template>

<template #script>

@[code{54-58} vue](../../.vuepress/components/button/iconText.vue)

</template>

</card>

<card>

## 圆形

添加布尔属性 `circle`，即可将按钮圆角设为完整圆形。

<template #example>
<button-circle />
</template>

<template #template>

@[code{1-60} vue{3}](../../.vuepress/components/button/circle.vue)

</template>

<template #script>

@[code{62-66} vue](../../.vuepress/components/button/circle.vue)

</template>

</card>

<card>

## 方形

添加布尔属性 `square`，即可将按钮圆角设为直角。

<template #example>
<button-square />
</template>

<template #template>

@[code{1-58} vue{3}](../../.vuepress/components/button/square.vue)

</template>

<template #script>

@[code{60-64} vue](../../.vuepress/components/button/square.vue)

</template>

</card>

<card>

## 尺寸

通过 `size` 设置按钮整体尺寸，包括内边距、字号和边框。

可选值：

- xl
- l
- default
- small
- mini

<template #example>
<button-size />
</template>

<template #template>

@[code{1-17} vue{3,6,9,10,13}](../../.vuepress/components/button/size.vue)

</template>

<template #script>

@[code{19-23} vue](../../.vuepress/components/button/size.vue)

</template>

</card>

<card>

## 加载

操作执行期间可设置 `loading`，并用 `loading-type` 选择 `pulse`（呼吸光轨）、`ripple`（双层脉冲波）或 `shimmer`（流光扫描）。三种预设均保留原文字和图标、保持按钮尺寸并阻止点击；实现只切换根节点状态 class。需要完全自定义时使用 `#loading` 插槽。

<template #example>
<button-loading />
</template>

<template #template>

@[code vue](../../.vuepress/components/button/loading.vue)

</template>

</card>

<card>

## 点击频率限制

`debounce` 和 `throttle` 用于限制组件发出的点击事件，不改变按钮布局。`debounce` 使用尾触发，默认 `50ms`；`throttle` 首次点击立即触发，设置数字前需要把 `debounce` 设为 `false`。两者同时为数字时，组件会输出控制台错误，并且只执行 `debounce`。

<template #example>
<button-click-limit />
</template>

<template #template>

@[code{1-26} vue{4,12,13}](../../.vuepress/components/button/click-limit.vue)

</template>

<template #script>

@[code{28-41} vue](../../.vuepress/components/button/click-limit.vue)

</template>

</card>

<card>

## 上传

添加布尔属性 `upload`，即可展示向服务器发送或上传数据的状态。

<template #example>
<button-upload />
</template>

<template #template>

@[code{1-70} vue{3}](../../.vuepress/components/button/upload.vue)

</template>

<template #script>

@[code{72-76} vue](../../.vuepress/components/button/upload.vue)

</template>

</card>

<card>

## 块级

添加布尔属性 `block`，即可让按钮占满可用宽度。

<template #example>
<button-block />
</template>

<template #template>

@[code{1-8} vue{3}](../../.vuepress/components/button/block.vue)

</template>

</card>

<card>

## 动画

添加 `#animate` 模板即可定义按钮动画时展示的内容。

可通过 `animation-type` 设置动画类型：`vertical`、`scale`、`rotate`。

<template #example>
<button-animate />
</template>

<template #template>

@[code{1-32} vue{5-7,10,19,25}](../../.vuepress/components/button/animate.vue)

</template>

</card>

<card>

## 社交平台色

登录、分享等场景可直接使用社交平台色；传入平台名称即可切换组件整体样式。

支持颜色：`facebook`、`twitter`、`youtube`、`pinterest`、`linkedin`、`snapchat`、`whatsapp`、`tumblr`、`reddit`、`spotify`、`amazon`、`medium`、`vimeo`、`skype`、`dribbble`、`slack`、`yahoo`、`twitch`、`discord`、`telegram`、`google-plus`、`messenger`。

<template #example>
<button-social />
</template>

<template #template>

@[code{1-79} vue{3-5}](../../.vuepress/components/button/social.vue)

</template>

</card>

<card>

## 悬浮按钮

添加布尔属性 `floating`，即可创建悬浮样式按钮。

此类按钮通常用于重要操作，并固定在页面角落。

<template #example>
<button-floating />
</template>

<template #template>

@[code{1-19} vue{3}](../../.vuepress/components/button/floating.vue)

</template>

</card>

<card>

## 按钮组

需要组合多个按钮时，可使用子组件 `<s-button-group>`，并在默认插槽中放入按钮。

<template #example>
<button-group />
</template>

<template #template>

@[code{1-57} vue{3,12,29,44}](../../.vuepress/components/button/group.vue)

</template>

</card>

<card>

## 切换

此示例展示如何使用少量逻辑实现按钮切换效果。

<template #example>
<button-toggle />
</template>

<template #template>

@[code{1-28} vue](../../.vuepress/components/button/toggle.vue)

</template>

<template #script>

@[code{30-54} vue](../../.vuepress/components/button/toggle.vue)

</template>

<template #style>

@[code{56-66} vue](../../.vuepress/components/button/toggle.vue)

</template>

</card>

<card>

## 水波纹

通过 `ripple` 可设置按钮水波纹样式，可选值：

- `reverse`
- `cut`

<template #example>
<button-ripple />
</template>

<template #template>

@[code vue](../../.vuepress/components/button/ripple.vue)

</template>

</card>

<card>

## API

</card>
