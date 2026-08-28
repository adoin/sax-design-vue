---
description: '在主内容流外展示短暂的程序化通知。'
PROPS:
  - name: dangerous-html-string / icon-size / offset / z-index
    type: Boolean / Number
    values: true | false / 像素 / 层级数值
    description: 配置 HTML 渲染、图标尺寸、视口偏移和层叠顺序。
    default: '-'
  - name: show-close / on-click-close
    type: Boolean / Function
    values: true | false / 关闭回调
    description: 控制关闭入口并处理关闭交互。
    default: 'true / -'
  - name: title
    type: String
    values: String
    description: 为通知添加标题。
    default: null
    link: null
    usage: '#default'
    code: >
      SNotification({
        title: 'Documentation Sax Design Vue',
        content: `Sax Design Vue notification example with configurable content,
        color, timing, and placement.`
      })
  - name: content
    type: String, Component
    values: String, VNode
    description: 为通知添加内容。
    default: null
    link: null
    usage: '#default'
    code: >
      SNotification({
        title: 'Documentation Sax Design Vue',
        content: `Sax Design Vue notification example with configurable content,
        color, timing, and placement.`
      })
  - name: position
    type: String
    values: bottom-right,top-right,top-center,top-left,bottom-left,bottom-center
    description: 修改通知显示位置。
    default: bottom-right
    link: null
    usage: '#position'
    code: >
      const { close } = SNotification({
        position: 'top-right',
        title: 'Documentation Sax Design Vue',
        content: `Sax Design Vue notification example with configurable content,
        color, timing, and placement.`
      })
  - name: color
    type: String
    values: Sax Design colors, rgb, hex
    description: 修改整个通知的基础颜色。
    default: null
    link: null
    usage: '#color'
    code: >
      const { close } = SNotification({
        color: 'primary',
        title: 'Documentation Sax Design Vue',
        content: 'Sax Design Vue notification example with configurable content,
        color, timing, and placement.'
      })
  - name: border
    type: String
    values: Sax Design colors, rgb, hex
    description: 为通知添加指定颜色的边框。
    default: null
    link: null
    usage: '#border'
    code: >
      const { close } = SNotification({
        border: 'success',
        title: 'Documentation Sax Design Vue',
        content: `Sax Design Vue notification example with configurable content,
        color, timing, and placement.`
      })
  - name: icon
    type: String
    values: String
    description: 为通知添加图标。
    default: null
    link: null
    usage: '#icons'
    code: >
      const { close } = SNotification({
        icon: `<s-icon  name="bxs:time" />`,
        title: 'Documentation Sax Design Vue',
        content: `Sax Design Vue notification example with configurable content,
        color, timing, and placement.`
      })
  - name: duration
    type: Number, StringNumber
    values: Number, none
    description: 设置通知自动隐藏的时间；none 表示不自动隐藏。
    default: 4500 (4.5s)
    link: null
    usage: '#duration'
    code: >
      const { close } = SNotification({
        duration: 10000,
        title: 'Documentation Sax Design Vue',
        content: `Sax Design Vue notification example with configurable content,
        color, timing, and placement.`
      })
  - name: onClick
    type: function
    values: function
    description: 点击通知时执行的函数。
    default: null
    link: null
    usage: null
    code: >
      const { close } = this.$notification({
        title: 'Documentation Sax Design Vue',
        content: `Sax Design Vue notification example with configurable content,
        color, timing, and placement.`,
        onClick: () => {
          console.log('click notification')
        }
      })
  - name: buttonClose
    type: Boolean
    values: true,false
    description: 是否显示通知关闭按钮。
    default: true
    link: null
    usage: null
    code: >
      const { close } = this.$notification({
        title: 'Documentation Sax Design Vue',
        content: `Sax Design Vue notification example with configurable content,
        color, timing, and placement.`,
        buttonClose: false
      })
  - name: flat
    type: Boolean
    values: true,false
    description: 将通知切换为扁平样式。
    default: false
    link: null
    usage: '#flat'
    code: >
      <script setup lang="ts">
        import { SNotification } from 'sax-design-vue'

        const { close } = SNotification({
          title: 'Documentation Sax Design Vue',
          content: `Sax Design Vue notification example with configurable content,
          color, timing, and placement.`,
          flat: true,
        })
      </script>
  - name: onDestroy
    type: () => void
    values: Function
    description: 通知销毁时执行的函数。
    default: null
    link: null
    usage: null
    code: >
      <script setup lang="ts">
        import { SNotification } from 'sax-design-vue'

        const { close } = SNotification({
          title: 'Documentation Sax Design Vue',
          content: `Sax Design Vue notification example with configurable content,
          color, timing, and placement.`,
          sticky: true
        })
      </script>
  - name: sticky
    type: boolean
    values: true,false
    description: 使通知固定在最近的视口角落。
    default: false
    link: null
    usage: '#sticky'
    code: >
      <script setup lang="ts">
        import { SNotification } from 'sax-design-vue'

        const { close } = SNotification({
          title: 'Documentation Sax Design Vue',
          content: `Sax Design Vue notification example with configurable content,
          color, timing, and placement.`,
          sticky: true
        })
      </script>
  - name: square
    type: boolean
    values: true,false
    description: 是否使用直角样式并移除圆角。
    default: false
    link: null
    usage: '#square'
    code: >
      <script setup lang="ts">
        import { SNotification } from 'sax-design-vue'

        const { close } = SNotification({
          title: 'Documentation Sax Design Vue',
          content: `Sax Design Vue notification example with configurable content,
          color, timing, and placement.`,
          shape: 'square',
        })
      </script>
  - name: width
    type: String
    values: 100%, auto
    description: 设置通知宽度。
    default: 340px
    link: null
    usage: '#width'
    code: >
      <script setup lang="ts">
        import { SNotification } from 'sax-design-vue'

        const { close } = SNotification({
          title: 'Documentation Sax Design Vue',
          content: `Sax Design Vue notification example with configurable content,
          color, timing, and placement.`,
          width: 'auto',
        })
      </script>
  - name: loading
    type: boolean
    values: true,false
    description: 是否显示通知加载动画。
    default: false
    link: null
    usage: '#loading'
    code: >
      <script setup lang="ts">
        import { SNotification } from 'sax-design-vue'

        const { close } = SNotification({
          title: 'Documentation Sax Design Vue',
          content: `Sax Design Vue notification example with configurable content,
          color, timing, and placement.`,
          loading: true
        })
      </script>
  - name: progressAuto
    type: Boolean
    values: true,false
    description: 为通知添加进度条。
    default: null
    link: null
    usage: '#progress'
    code: >
      <script setup lang="ts">
        import { SNotification } from 'sax-design-vue'

        const { close } = SNotification({
          title: 'Documentation Sax Design Vue',
          content: `Sax Design Vue notification example with configurable content,
          color, timing, and placement.`,
          progressAuto: true
        })
      </script>
  - name: notPadding
    type: Boolean
    values: true,false
    description: 移除通知内边距。
    default: 20px
    link: null
    usage: '#example'
    code: >
      <script setup lang="ts">
        import { SNotification } from 'sax-design-vue'

        const { close } = SNotification({
          title: 'Documentation Sax Design Vue',
          content: `Sax Design Vue notification example with configurable content,
          color, timing, and placement.`,
          notPadding: true
        })
      </script>
  - name: clickClose
    type: Boolean
    values: true,false
    description: 点击通知时是否关闭。
    default: false
    link: null
    usage: null
    code: >
      <script setup lang="ts">
        import { SNotification } from 'sax-design-vue'

        const { close } = SNotification({
          duration: 0,
          title: 'Documentation Sax Design Vue',
          content: `Sax Design Vue notification example with configurable content,
          color, timing, and placement.`,
        })
      </script>
  - name: content
    type: Vue Component
    values: Vnode,String,ComponentPublicInstance
    description: 使用传入内容替换通知正文，类似 Vue 插槽。
    default: null
    link: null
    usage: '#example'
    code: >
      <script setup lang="ts">
        import { SNotification } from 'sax-design-vue'

        const { close } = SNotification({
          duration: 0,
          width: 'auto',
          title: 'Documentation Sax Design Vue',
          content: `Sax Design Vue notification example with configurable content,
          color, timing, and placement.`,
        })
      </script>
  - name: instance.close()
    type: function
    values: null
    description: 关闭通知。
    default: null
    link: null
    usage: null
    code: >
      <script setup lang="ts">
        import { SNotification } from 'sax-design-vue'

        const { close } = SNotification({
          duration: 0,
          width: 'auto',
          title: 'Documentation Sax Design Vue',
          content: `Sax Design Vue notification example with configurable content,
          color, timing, and placement.`,
        })

        close()
      </script>

  - name: custom-class
    type: String
    values: String
    description: 为通知添加自定义类名。
    default: null
    link: null
    usage: null
    code: >
      <script setup lang="ts">
        import { SNotification } from 'sax-design-vue'

        const { close } = SNotification({
          duration: 0,
          width: 'auto',
          customClass: 'my-class'
          title: 'Documentation Sax Design Vue',
          content: `Sax Design Vue notification example with configurable content,
          color, timing, and placement.`,
        })
      </script>
EVENTS:
  - name: destroy
    description: 通知实例销毁时触发。
---

# Notification（通知）

<card>

## 默认

<docs-warn />

使用 `SNotification` 函数创建通知。需要手动关闭或调用实例能力时，请将返回的实例保存到变量中。

<command>

```js
import { SNotification } from 'sax-design-vue'

SNotification({ ...options })
```

</command>

::: tip
必填属性为 `title` 和 `content`。
:::

<template #example>
<notification-default />
</template>

<template #template>

@[code{1-5}](../../.vuepress/components/notification/default.vue)

</template>

<template #script>

@[code{7-17}](../../.vuepress/components/notification/default.vue)

</template>

</card>

<card>

## 位置

使用 `position` 属性修改通知位置。

支持的值：

- `bottom-right` <Badge type=warn text=默认 />
- `top-right`
- `top-center`
- `top-left`
- `bottom-left`
- `bottom-center`

<template #example>
<notification-position />
</template>

<template #template>

@[code{1-22}](../../.vuepress/components/notification/position.vue)

</template>

<template #script>

@[code{24-35}](../../.vuepress/components/notification/position.vue)

</template>

<template #style>

@[code{36-57}](../../.vuepress/components/notification/position.vue)

</template>

</card>

<card>

## 颜色

使用 `color` 属性修改组件及部分子元素的基础颜色。颜色和主题用法请查看[主题](/zh/theme/)。

可选值：

- primary
- success
- danger
- warning
- dark
- RGB
- HEX

<template #example>
<notification-color />
</template>

<template #template>

@[code{1-58}](../../.vuepress/components/notification/color.vue)

</template>

<template #script>

@[code{60-72}](../../.vuepress/components/notification/color.vue)

</template>

<template #style>

@[code{73-94}](../../.vuepress/components/notification/color.vue)

</template>

</card>

<card>

## 图标

将 `icon` 属性提供的图标添加到通知中。

<template #example>
<notification-icons />
</template>

<template #template>

@[code{1-100}](../../.vuepress/components/notification/icons.vue)

</template>

<template #script>

@[code{102-133}](../../.vuepress/components/notification/icons.vue)

</template>

<template #style>

@[code{135-156}](../../.vuepress/components/notification/icons.vue)

</template>

</card>

<card>

## 进度条

为通知添加进度条。`progress="auto"` 时会根据 `duration` 自动推进到 100%；也可传入 `0 - 100` 的数值，并通过实例的 `changeProgress` 方法手动更新。

<template #example>
<notification-progress />
</template>

<template #template>

@[code{1-52}](../../.vuepress/components/notification/progress.vue)

</template>

<template #script>

@[code{54-67}](../../.vuepress/components/notification/progress.vue)

</template>

<template #style>

@[code{69-90}](../../.vuepress/components/notification/progress.vue)

</template>

</card>

<card>

## 持续时间

使用 `duration` 属性设置通知显示时长，单位为毫秒；例如 **10 秒** 对应 **10000**。

如需通知始终显示，将 `duration` 设为 `0`。

<template #example>
<notification-duration />
</template>

<template #template>

@[code{1-16}](../../.vuepress/components/notification/duration.vue)

</template>

<template #script>

@[code{18-30}](../../.vuepress/components/notification/duration.vue)

</template>

<template #style>

@[code{31-52}](../../.vuepress/components/notification/duration.vue)

</template>

</card>

<card>

## 方形

使用 `square` 属性移除 `border-radius`，将通知改为直角矩形样式。

<template #example>
<notification-square />
</template>

<template #template>

@[code{1-74}](../../.vuepress/components/notification/square.vue)

</template>

<template #script>

@[code{75-88}](../../.vuepress/components/notification/square.vue)

</template>

<template #style>

@[code{89-110}](../../.vuepress/components/notification/square.vue)

</template>

</card>

<card>

## 边框

使用 `border` 属性为通知添加指定颜色的边框。

<template #example>
<notification-border />
</template>

<template #template>

@[code{1-55}](../../.vuepress/components/notification/border.vue)

</template>

<template #script>

@[code{57-69}](../../.vuepress/components/notification/border.vue)

</template>

<template #style>

@[code{71-92}](../../.vuepress/components/notification/border.vue)

</template>

</card>

<card>

## 扁平

使用布尔属性 `flat` 可切换为扁平样式，颜色会更浅，文字使用 `color` 属性对应的颜色。

<template #example>
<notification-flat />
</template>

<template #template>

@[code{1-55}](../../.vuepress/components/notification/flat.vue)

</template>

<template #script>

@[code{57-71}](../../.vuepress/components/notification/flat.vue)

</template>

<template #style>

@[code{73-94}](../../.vuepress/components/notification/flat.vue)

</template>

</card>

<card>

## 加载

添加加载动画后，只显示动画，通知内容会被隐藏。

<template #example>
<notification-loading />
</template>

<template #template>

@[code{1-58}](../../.vuepress/components/notification/loading.vue)

</template>

<template #script>

@[code{60-73}](../../.vuepress/components/notification/loading.vue)

</template>

<template #style>

@[code{75-96}](../../.vuepress/components/notification/loading.vue)

</template>

</card>

<card>

## 宽度

将 `width` 设为 `full` 可使通知占满屏幕宽度。

如需根据内容自动调整宽度，可设为 `auto`。

<template #example>
<notification-all-width />
</template>

<template #template>

@[code{1-14}](../../.vuepress/components/notification/all-width.vue)

</template>

<template #script>

@[code{16-29}](../../.vuepress/components/notification/all-width.vue)

</template>

<template #style>

@[code{30-41}](../../.vuepress/components/notification/all-width.vue)

</template>

</card>

<card>

## 吸附位置

使用布尔属性 `sticky` 可使通知吸附到最近的视口角落。

<template #example>
<notification-sticky />
</template>

<template #template>

@[code{1-58}](../../.vuepress/components/notification/sticky.vue)

</template>

<template #script>

@[code{60-74}](../../.vuepress/components/notification/sticky.vue)

</template>

<template #style>

@[code{76-97}](../../.vuepress/components/notification/sticky.vue)

</template>

</card>

<card>

## 示例

可通过 `content` 属性传入已导入的组件，在通知中渲染任意自定义内容。

<template #example>
<notification-example />
</template>

<template #template>

@[code{1-13}](../../.vuepress/components/notification/example.vue)

</template>

<template #script>

@[code{15-44}](../../.vuepress/components/notification/example.vue)

</template>

</card>
