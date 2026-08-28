---
description: '为用户操作和系统状态展示上下文反馈消息。'
PROPS:
  - name: v-model
    type: boolean
    values: boolean
    description: 是否显示组件。
    default: true
    link: null
    code: >
      <template>
        <s-button type="flat" @click="active = !active">
          {{ active ? '关闭警告' : '打开警告' }}
        </s-button>

        <s-alert closable v-model="active">
          <template #title>
            Sax Design Vue
          </template>
          Sax Design Vue 是一个具有鲜明视觉风格、实用 API 和一致交互模式的
          <b>Vue 3 组件库</b>。
        </s-alert>
      </template>

      <script setup lang="ts">

      import { ref } from 'vue'

      const active = ref<boolean>(true)

      </script>
    usage: '#closable'
  - name: v-model:hidden-content
    type: boolean
    values: boolean
    description: 隐藏警告内容，可通过 v-model 绑定。
    default: false
    link: null
    usage: '#hidden-content'
    code: >
      <template>
        <s-alert hidden-content>
          <template #title>
            Sax Design Vue
          </template>
          Sax Design Vue 是一个具有鲜明视觉风格、实用 API 和一致交互模式的
          <b>Vue 3 组件库</b>。
        </s-alert>
      </template>
  - name: color
    type: String
    values: primary, success, danger, warning, dark, RGB, HEX
    description: 设置组件及其部分子组件颜色。
    default: primary
    link: null
    usage: '#color'
    code: >
      <s-alert color="success">
        <template #title>
          Sax Design Vue
        </template>
        Sax Design Vue 是一个具有鲜明视觉风格、实用 API 和一致交互模式的
        <b>Vue 3 组件库</b>。
      </s-alert>
  - name: type
    type: boolean
    values: solid, border, shadow, gradient, relief
    description: 设置警告框整体样式。
    default: default
    link: null
    usage: '#solid'
    code: >
      <s-alert solid>
        <template #title>
          Sax Design Vue
        </template>
        Sax Design Vue 是一个具有鲜明视觉风格、实用 API 和一致交互模式的
        <b>Vue 3 组件库</b>。
      </s-alert>
  - name: page
    type: Number
    values: Number
    description: 当前激活页码，与 `page-{n}` 插槽对应。
    default: null
    link: null
    usage: '#pagination'
    code: >
      <template>
        <s-alert :page="1" >
          <template #title>
            Sax Design Vue
          </template>
          <template #page-1>
            第 1 页：这里是插槽，可放置文本、HTML 元素或组件。
          </template>
        </s-alert>
      </template>
  - name: progress
    type: Number
    values: 0 - 100
    description: 为警告框添加进度条，值为宽度百分比。
    default: null
    link: null
    usage: '#progress-bar'
    code: >
      <s-alert progress="70">
        <template #title>
          Sax Design Vue
        </template>
        Sax Design Vue 是一个具有鲜明视觉风格、实用 API 和一致交互模式的
        <b>Vue 3 组件库</b>。
      </s-alert>
  - name: closable
    type: boolean
    values: boolean
    description: 添加关闭按钮，需要配合 v-model 使用。
    default: false
    link: null
    usage: '#closable'
    code: >
      <template>
        <s-button flat @click="active=!active">
          {{ active ? '关闭警告' : '打开警告' }}
        </s-button>

        <s-alert closable v-model="active">
          <template #title>
            Sax Design Vue
          </template>
          Sax Design Vue 是一个具有鲜明视觉风格、实用 API 和一致交互模式的
          <b>Vue 3 组件库</b>。
        </s-alert>
      </template>

      <script lang="ts" setup>
        import { ref } from 'vue';

        const active = ref<boolean>(true);
      </script>
EVENTS:
  - name: update:modelValue
    type: Boolean
    description: 警告提示的显示状态变化时触发。
  - name: update:page
    type: Number
    description: 分页提示内容切换页码时触发。
  - name: update:hiddenContent
    type: Boolean
    description: 可展开内容隐藏或显示时触发。
SLOTS:
  - name: icon
    type: slot
    values: null
    description: 为警告框添加图标。
    default: null
    link: null
    usage: '#icon'
    code: >
      <template>
        <s-alert>
          <template #icon>
            <s-icon  name="bxs:chat" />
          </template>
          <template #title>
            Sax Design 警告图标
          </template>
          Sax Design Vue 是一个具有鲜明视觉风格、实用 API 和一致交互模式的
          <b>Vue 3 组件库</b>。
        </s-alert>
      </template>
  - name: title
    type: slot
    values: null
    description: 为警告框添加标题。
    default: null
    link: null
    usage: '#title'
    code: >
      <template>
        <div class="center">
          <s-alert>
            <template #title>
              Sax Design 警告标题
            </template>
            Sax Design Vue 是一个具有鲜明视觉风格、实用 API 和一致交互模式的
            <b>Vue 3 组件库</b>。
          </s-alert>
        </div>
      </template>
  - name: page-{n}
    type: slot
    values: (page-1 - page-{n})
    description: 为警告框添加分页内容；第一页对应 `page-1` 插槽。
    default: null
    link: null
    usage: '#pagination'
    code: >
      <template>
        <s-alert v-model:page="page" >
          <template #title>
            Sax Design Vue
          </template>

          <template #page-1>
            第 1 页：这里是插槽，可放置文本、HTML 元素或组件。
          </template>
        </s-alert>
      </template>
  - name: footer
    type: slot
    values: null
    description: 为警告框添加页脚。
    default: null
    link: null
    usage: '#footer'
    code: >
      <s-alert>
        <template #title>
          Sax Design Vue
        </template>
        Sax Design Vue 是一个具有鲜明视觉风格、实用 API 和一致交互模式的
        <b>Vue 3 组件库</b>。
        <template #footer>
          <s-button flat>
            取消
          </s-button>
          <s-button>
            确认
          </s-button>
        </template>
      </s-alert>

UPDATES:
  - hidden-content
---

# Alert（警告提示）

<card>

## 默认

<docs-warn />

使用 Alert 可快速展示上下文反馈信息；支持隐藏内容、颜色切换和标题图标等能力。

<template #example>
<alert-default />
</template>

<template #template>

@[code{1-10}](../../.vuepress/components/alert/default.vue)

</template>

</card>

<card>

## 实心

添加布尔属性 `solid` 可切换为实心样式，无需传入具体值。

<template #example>
<alert-solid />
</template>

<template #template>

@[code{1-10}](../../.vuepress/components/alert/solid.vue)

</template>

</card>

<card>

## 边框

添加布尔属性 `border` 可切换为边框样式，无需传入具体值。

<template #example>
<alert-border />
</template>

<template #template>

@[code{1-10}](../../.vuepress/components/alert/border.vue)

</template>

</card>

<card>

## 阴影

添加布尔属性 `shadow` 可切换为阴影样式，无需传入具体值。

<template #example>
<alert-shadow />
</template>

<template #template>

@[code{1-10}](../../.vuepress/components/alert/shadow.vue)

</template>

</card>

<card>

## 渐变

添加布尔属性 `gradient` 可切换为渐变样式，无需传入具体值。

<template #example>
<alert-gradient />
</template>

<template #template>

@[code{1-10}](../../.vuepress/components/alert/gradient.vue)

</template>

</card>

<card>

## 浮雕

添加布尔属性 `relief` 可切换为浮雕样式，无需传入具体值。

<template #example>
<alert-relief />
</template>

<template #template>

@[code{1-10}](../../.vuepress/components/alert/relief.vue)

</template>

</card>

<card>

## 动画

通过简洁的动画展示或隐藏 Alert。

<template #example>
<alert-animate />
</template>

<template #template>

@[code{1-14}](../../.vuepress/components/alert/animate.vue)

</template>

<template #script>

@[code{16-20}](../../.vuepress/components/alert/animate.vue)

</template>

<template #style>

@[code{22-26}](../../.vuepress/components/alert/animate.vue)

</template>

</card>

<card>

## 颜色

使用 `color` 属性修改整个 Alert 的颜色。

本示例可点击按钮，动态切换 Alert 的颜色。

<template #example>
<alert-color />
</template>

<template #template>

@[code{1-66}](../../.vuepress/components/alert/color.vue)

</template>

<template #script>

@[code{68-72}](../../.vuepress/components/alert/color.vue)

</template>

<template #style>

@[code{74-81}](../../.vuepress/components/alert/color.vue)

</template>

</card>

<card>

## 图标

通过 **icon** 插槽可为 Alert 轻松添加图标。

<utils-icon />

<template #example>

<alert-icon />

</template>

<template #template>

@[code{1-13}](../../.vuepress/components/alert/icon.vue)

</template>

</card>

<card>

## 标题

通过 `title` 插槽可为 Alert 添加描述性标题。

<template #example>
<alert-title />
</template>

<template #template>

@[code{1-10}](../../.vuepress/components/alert/title.vue)

</template>

</card>

<card>

## 隐藏内容 <Badge text='Update' type="warn" />

可隐藏 Alert 的内容，仅保留标题并按需动态显示。

此属性可通过 `v-model:hidden-content` 双向绑定。

<template #example>
<alert-hidden-content />
</template>

<template #template>

@[code{1-10}](../../.vuepress/components/alert/hidden-content.vue)

</template>

<template #script>

@[code{11-15}](../../.vuepress/components/alert/hidden-content.vue)

</template>

</card>

<card>

## 分页

当需要展示较多内容、又不希望 Alert 过高时，可使用分页能力。

<template #example>
<alert-pagination />
</template>

<template #template>

@[code{1-21}](../../.vuepress/components/alert/pagination.vue)

</template>

<template #script>

@[code{22-26}](../../.vuepress/components/alert/pagination.vue)

</template>

</card>

<card>

## 页脚

使用 `footer` 插槽可为 Alert 添加页脚，例如放置按钮或复选框等交互内容。

<template #example>

<alert-footer />

</template>

<template #template>

@[code{1-14}](../../.vuepress/components/alert/footer.vue)

</template>

</card>

<card>

## 进度条

通过 `progress` 属性传入 `0 - 100` 的数值，可为 Alert 添加进度条。

<template #example>
<alert-progress />
</template>

<template #template>

@[code{1-10}](../../.vuepress/components/alert/progress.vue)

</template>

</card>

<card>

## 可关闭

添加布尔属性 `closable` 可显示关闭图标，无需传入具体值。

<template #example>
<alert-closable />
</template>

<template #template>

@[code{1-14}](../../.vuepress/components/alert/closable.vue)

</template>

<template #script>

@[code{15-19}](../../.vuepress/components/alert/closable.vue)

</template>

</card>

<card>

## 定时关闭

如需让 Alert 在一段时间后自动隐藏，可组合相关属性和少量代码实现。

<template #example>
<alert-time />
</template>

<template #template>

@[code{1-11}](../../.vuepress/components/alert/time.vue)

</template>

<template #script>

@[code{13-33}](../../.vuepress/components/alert/time.vue)

</template>

</card>
