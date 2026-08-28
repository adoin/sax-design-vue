---
description: '在两个状态之间切换布尔设置。'
PROPS:
  - name: variant
    type: String
    values: classic | soft | icon | text
    description: 选择结构不同的无边框开关风格。
    default: classic
  - name: active-text / inactive-text
    type: String
    values: String
    description: 文本风格在开、关状态显示的文字。
    default: ON / OFF
  - name: active-value / inactive-value / shape
    type: String | Number | Boolean / String
    values: 自定义绑定值 / rounded | square
    description: 将开关状态映射为自定义值并选择外观形状。
    default: 'true / false / rounded'
  - name: v-model
    type: Boolean, Array
    values: Boolean, Array
    description: 组件绑定值；数组类型时会添加或移除对应值。
    default: null
    link: null
    usage: '#dafault'
    code: >
      <template>
        <s-switch v-model="active" />
        <s-switch v-model="active2" />
        <s-switch v-model="active3" disabled />
      </template>

  - name: color
    type: String
    values: Theme colors, RGB y HEX
    description: 设置组件激活状态时的颜色。
    default: primary
    link: null
    usage: '#color'
    code: null

  - name: loading
    type: Boolean
    values: true, false
    description: 为组件添加加载动画。
    default: false
    link: null
    usage: '#loading'
    code: >
      <template>
        <s-switch v-model="activeLoading">
          Active Loading
        </s-switch>
        <s-switch :loading="activeLoading" v-model="active2" />
      </template>

      <script lang="ts" setup>
        import { ref } from "vue"

        const active2       = ref<boolean>()
        const activeLoading = ref<boolean>()
      </script>

  - name: indeterminate
    type: Boolean
    values: true, false
    description: 是否为不确定状态；该状态下组件不可用。
    default: false
    link: null
    usage: '#indeterminate'
    code: >
      <template>
        <s-switch indeterminate v-model="active" />
        <s-switch indeterminate v-model="active2" />
        <s-switch indeterminate v-model="active3" disabled />
      </template>

  - name: Square
    type: Boolean
    values: true, false
    description: 将组件样式从圆形改为方形。
    default: false
    link: null
    usage: '#square'
    code: >
      <template>
        <s-switch square v-model="active" />
        <s-switch square v-model="active2" />
        <s-switch square v-model="active3" disabled />
      </template>

  - name: icon
    type: Boolean
    values: true, false
    description: 将圆形滑块设为透明，通常配合 `circle` 插槽使用。
    default: false
    link: null
    usage: '#icons'
    code: >
      <template>
        <s-switch color="#7d33ff" icon v-model="active6">
          <template #circle>
              <s-icon v-if="active6"  name="bxl:instagram-alt" />
              <s-icon v-else   name="bxl:instagram" />
          </template>
        </s-switch>
      </template>

  - name: notValue
    type: String
    values: String
    description: 设置组件未激活时返回的值。
    default: null
    link: null
    usage: null
    code: null

EVENTS:
  - name: update:modelValue / input / change
    type: Boolean | String | Number
    description: 开关变化时携带配置的激活值或非激活值触发。
SLOTS:
  - name: default
    type: slot
    values: null
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
    values: null
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
    values: null
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
    values: null
    description: 在组件圆形滑块内添加图标。
    default: null
    link: null
    usage: '#icons'
    code: >
      <s-switch color="#7d33ff" icon v-model="active6">
        <template #circle>
            <s-icon v-if="active6"  name="bxl:instagram-alt" />
            <s-icon v-else   name="bxl:instagram" />
        </template>
      </s-switch>
---

# Switch 开关

<card>

## 风格

通过 `variant` 选择经典滑块、柔和内嵌、图标状态或紧凑文本风格。四种风格共用原生复选框语义，并用阴影与位移表达无边框焦点状态。

<template #example>
<switch-variants />
</template>

<template #template>

@[code{12-23}](../../.vuepress/components/switch/variants.vue)

</template>

<template #script>

@[code{1-10}](../../.vuepress/components/switch/variants.vue)

</template>

<template #style>

@[code{25-38}](../../.vuepress/components/switch/variants.vue)

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

@[code{1-7} html{3}](../../.vuepress/components/switch/default.vue)

</template>

<template #script>

@[code{9-15}](../../.vuepress/components/switch/default.vue)

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

</card>

<card>

## 文本

通过默认插槽为开关添加文本；需要为两种状态设置不同文本时，可使用 `on`、`off` 插槽。

:::tip 自动适应
组件会根据当前状态适应展示文本。
:::

<template #example>
<switch-text />
</template>

<template #template>

@[code{1-13} html{5,6,9,10}](../../.vuepress/components/switch/text.vue)

</template>

<template #script>

@[code{15-21}](../../.vuepress/components/switch/text.vue)

</template>

</card>

<card>

## 图标

可在默认、`on`、`off` 或 `circle` 插槽中为组件添加图标。

<template #example>
<switch-icons />
</template>

<template #template>

@[code{1-41} html{4-9,29-32,35-38}](../../.vuepress/components/switch/icons.vue)

</template>

<template #script>

@[code{43-52}](../../.vuepress/components/switch/icons.vue)

</template>

</card>

<card>

## 加载 <Badge text="New"/>

添加布尔属性 `loading`，即可为组件显示加载动画。

<template #example>
<switch-loading />
</template>

<template #template>

@[code{1-6} html{4}](../../.vuepress/components/switch/loading.vue)

</template>

<template #script>

@[code{8-13}](../../.vuepress/components/switch/loading.vue)

</template>

</card>

<card>

## 不确定 <Badge text="New"/>

添加布尔属性 `indeterminate`，即可将组件设为不确定状态。

<template #example>
<switch-indeterminate />
</template>

<template #template>

@[code{1-7} html{3}](../../.vuepress/components/switch/indeterminate.vue)

</template>

<template #script>

@[code{9-15}](../../.vuepress/components/switch/indeterminate.vue)

</template>

</card>

<card>

## 方形 <Badge text="New"/>

添加布尔属性 `square`，即可将圆形样式改为方形。

<template #example>
<switch-square />
</template>

<template #template>

@[code{1-7} html{3}](../../.vuepress/components/switch/square.vue)

</template>

<template #script>

@[code{9-15}](../../.vuepress/components/switch/square.vue)

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
