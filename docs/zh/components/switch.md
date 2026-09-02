---
description: '在两个状态之间切换布尔设置。'
PROPS:
  - name: variant
    type: String
    values: "classic | soft | text"
    description: 选择结构不同的无边框开关风格。
    default: classic
  - name: active-text
    type: String
    values: "String"
    description: 文本风格在开、关状态显示的文字。
    default: ON
  - name: inactive-text
    type: String
    values: "String"
    description: 文本风格在开、关状态显示的文字。
    default: OFF
  - name: active-value
    type: String | Number | Boolean
    values: "自定义绑定值"
    description: 激活状态对应的绑定值。
    default: 'true'
  - name: inactive-value
    type: String | Number | Boolean
    values: "自定义绑定值"
    description: 未激活状态对应的绑定值。
    default: 'false'
  - name: shape
    type: String
    values: "rounded | square"
    description: 为轨道和滑块选择圆角或方形外观。
    default: 'rounded'
    usage: '#外形'
  - name: v-model
    type: Boolean | String | Number
    values: "与 active-value、inactive-value 匹配的值"
    description: 设置当前开关值；不匹配开、关值时可表达为不确定状态。
    default: false
    link: null
    usage: '#default'
    code: >
      <template>
        <s-switch v-model="active" />
        <s-switch v-model="active2" />
        <s-switch v-model="active3" disabled />
      </template>

  - name: color
    type: String
    values: "Theme colors, RGB y HEX"
    description: 设置组件激活状态时的颜色。
    default: primary
    link: null
    usage: '#color'
    code: null

  - name: loading
    type: Boolean
    values: "true, false"
    description: 将滑块替换为同尺寸的加载指示器，并跟随设置的外观形状。
    default: false
    link: null
    usage: '#loading'
    code: >
      <template>
        <s-switch v-model="loading">Loading state</s-switch>
        <s-switch v-model="roundedValue" :loading="loading" />
        <s-switch v-model="squareValue" :loading="loading" shape="square" />
      </template>

      <script setup lang="ts">
        import { shallowRef } from "vue"

        const loading = shallowRef(true)
        const roundedValue = shallowRef(false)
        const squareValue = shallowRef(true)
      </script>

  - name: indeterminate
    type: Boolean
    values: "true, false"
    description: 当绑定值既不等于 active-value 也不等于 inactive-value 时，将滑块置于中间；选择后进入正常的确定状态。
    default: false
    link: null
    usage: '#indeterminate'
    code: >
      <template>
        <s-switch v-model="value" indeterminate />
      </template>

  - name: notValue
    type: String
    values: "String"
    description: 设置组件未激活时返回的值。
    default: null
    link: null
    usage: null
    code: null

EVENTS:
  - name: update:modelValue
    type: Boolean | String | Number
    description: 开关变化时携带配置的激活值或非激活值触发。
  - name: input
    type: Boolean | String | Number
    description: 开关变化时携带配置的激活值或非激活值触发。
  - name: change
    type: Boolean | String | Number
    description: 开关变化时携带配置的激活值或非激活值触发。
SLOTS:
  - name: default
    type: slot
    values: "null"
    description: 在组件内添加文本。
    default: null
    link: null
    usage: '#text'
    code: >
      <template>
        <s-switch v-model="active">
          Suscribe
        </s-switch>
        <s-switch v-model="active2">
          <template #off>
              Off
          </template>
          <template #on>
              On
          </template>
        </s-switch>
        <s-switch v-model="active3">
          <template #off>
              default
          </template>
          <template #on>
              Premium
          </template>
        </s-switch>
      </template>
  - name: on
    type: slot
    values: "null"
    description: 在激活状态下添加文本。
    default: null
    link: null
    usage: '#icons'
    code: >
      <s-switch v-model="active1">
        <template #off>
            <s-icon   name="bxs:volume-mute" />
        </template>
        <template #on>
            <s-icon   name="bxs:volume-full" />
        </template>
      </s-switch>
  - name: off
    type: slot
    values: "null"
    description: 在未激活状态下添加文本。
    default: null
    link: null
    usage: '#icons'
    code: >
      <s-switch v-model="active1">
        <template #off>
            <s-icon   name="bxs:volume-mute" />
        </template>
        <template #on>
            <s-icon   name="bxs:volume-full" />
        </template>
      </s-switch>
  - name: circle
    type: slot
    values: "null"
    description: 在组件圆形滑块内添加图标。
    default: null
    link: null
    usage: '#icons'
    code: >
      <s-switch color="#7d33ff" v-model="active6">
        <template #circle>
            <s-icon v-if="active6"  name="bxl:instagram-alt" />
            <s-icon v-else   name="bxl:instagram" />
        </template>
      </s-switch>
---

# Switch 开关

<card>

## 风格

通过 `variant` 选择经典滑块、柔和内嵌或文本风格。图标直接使用现有内容插槽，不再作为一种重复的结构风格。三种风格共用原生复选框语义，并用阴影与位移表达无边框焦点状态。

<template #example>
<switch-variants />
</template>

<template #template>

@[code{22-35}](../../.vuepress/components/switch/variants.vue)

</template>

<template #script>

@[code{1-20}](../../.vuepress/components/switch/variants.vue)

</template>

<template #style>

@[code{37-49}](../../.vuepress/components/switch/variants.vue)

</template>

</card>

<card>

## 默认

<docs-warn />

使用 `s-switch` 可快速创建带动画的开关控件。

<template #example>
<switch-default />
</template>

<template #template>

@[code{1-7}](../../.vuepress/components/switch/default.vue)

</template>

<template #script>

@[code{9-15}](../../.vuepress/components/switch/default.vue)

</template>

<template #style>

@[code{17-26}](../../.vuepress/components/switch/default.vue)

</template>

</card>

<card>

## 颜色

设置组件激活状态颜色，支持主题色、RGB、HEX。

<template #example>
<switch-color />
</template>

<template #template>

@[code{1-11}](../../.vuepress/components/switch/color.vue)

</template>

<template #script>

@[code{13-23}](../../.vuepress/components/switch/color.vue)

</template>

<template #style>

@[code{25-34}](../../.vuepress/components/switch/color.vue)

</template>

</card>

<card>

## 文本

通过默认插槽为开关添加文本；需要为两种状态设置不同文本时，可使用 `on`、`off` 插槽。轨道会按两种状态中较长的文案预留宽度，切换时不会跳动；存在圆形滑块时，当前文案会在扣除滑块占位后的剩余空间中居中，并保持完整可见。

<template #example>
<switch-text />
</template>

<template #template>

@[code{9-27}](../../.vuepress/components/switch/text.vue)

</template>

<template #script>

@[code{1-7}](../../.vuepress/components/switch/text.vue)

</template>

<template #style>

@[code{29-37}](../../.vuepress/components/switch/text.vue)

</template>

</card>

<card>

## 图标

可在默认、`on`、`off` 或 `circle` 插槽中为组件添加图标。`circle` 插槽直接定制经典风格的滑块，无需额外的图标风格。

<template #example>
<switch-icons />
</template>

<template #template>

@[code{1-41}](../../.vuepress/components/switch/icons.vue)

</template>

<template #script>

@[code{43-52}](../../.vuepress/components/switch/icons.vue)

</template>

<template #style>

@[code{54-63}](../../.vuepress/components/switch/icons.vue)

</template>

</card>

<card>

## 外形

设置 `shape="square"` 可使用方形轨道和滑块；加载与不确定状态也会保持相同的方形几何外观。

<template #example>
<switch-square />
</template>

<template #template>

@[code{1-7}](../../.vuepress/components/switch/square.vue)

</template>

<template #script>

@[code{9-15}](../../.vuepress/components/switch/square.vue)

</template>

<template #style>

@[code{17-26}](../../.vuepress/components/switch/square.vue)

</template>

</card>

<card>

## 加载

设置 `loading` 后，移动滑块本体会替换为同尺寸的加载环，并停留在当前状态对应的位置。使用 `shape="square"` 时，方形轮廓保持不动，由高亮边沿四边推进，避免整个方块旋转。

<template #example>
<switch-loading />
</template>

<template #template>

@[code{9-24}](../../.vuepress/components/switch/loading.vue)

</template>

<template #script>

@[code{1-7}](../../.vuepress/components/switch/loading.vue)

</template>

<template #style>

@[code{26-34}](../../.vuepress/components/switch/loading.vue)

</template>

</card>

<card>

## 不确定

当绑定值既不等于 `active-value` 也不等于 `inactive-value` 时，可通过 `indeterminate` 显示不确定状态。滑块初始位于中间；用户选择后，绑定值进入确定状态，滑块恢复正常的左右移动。

<template #example>
<switch-indeterminate />
</template>

<template #template>

@[code{9-29}](../../.vuepress/components/switch/indeterminate.vue)

</template>

<template #script>

@[code{1-7}](../../.vuepress/components/switch/indeterminate.vue)

</template>

<template #style>

@[code{31-39}](../../.vuepress/components/switch/indeterminate.vue)

</template>

</card>

<card>

## 示例

这是使用开关组件的常见示例。

<template #example>
<switch-example />
</template>

<template #template>

@[code{1-43}](../../.vuepress/components/switch/example.vue)

</template>

<template #script>

@[code{45-53}](../../.vuepress/components/switch/example.vue)

</template>

<template #style>

@[code{55-79}](../../.vuepress/components/switch/example.vue)

</template>

</card>
