---
PROPS:
  - name: v-model
    type: Boolean, Array
    values: Boolean, Array
    description: Determine the value of the component and if it is an array add or remove the value.
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
    values: Vuesax main colors, RGB y HEX
    description: Change the color of the component when it is in active state.
    default: primary
    link: null
    usage: '#color'
    code: null

  - name: loading
    type: Boolean
    values: true, false
    description: Add a loading animation to the component.
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
    description: Determine if the component is in an undetermined state (being in this state is disabled).
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
    description: Change the style of the component from circular to square.
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
    description: Change the style of the circle by making it transparent (used when adding the slot = "circle").
    default: false
    link: null
    usage: '#icons'
    code: >
      <template>
        <s-switch color="#7d33ff" icon v-model="active6">
          <template #circle>
              <i v-if="active6" class='bx bxl-instagram-alt'></i>
              <i v-else class='bx bxl-instagram' ></i>
          </template>
        </s-switch>
      </template>

  - name: notValue
    type: String
    values: String
    description: Determine the return value of the component when inactive.
    default: null
    link: null
    usage: null
    code: null

SLOTS:
  - name: default
    type: slot
    values: null
    description: Add text within the component.
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
    description: Add text within the component when it is in active state.
    default: null
    link: null
    usage: '#icons'
    code: >
      <s-switch v-model="active1">
        <template #off>
            <i class='bx bxs-volume-mute' ></i>
        </template>
        <template #on>
            <i class='bx bxs-volume-full' ></i>
        </template>
      </s-switch>
  - name: off
    type: slot
    values: null
    description: Add text within the component when it is in idle state.
    default: null
    link: null
    usage: '#icons'
    code: >
      <s-switch v-model="active1">
        <template #off>
            <i class='bx bxs-volume-mute' ></i>
        </template>
        <template #on>
            <i class='bx bxs-volume-full' ></i>
        </template>
      </s-switch>
  - name: circle
    type: slot
    values: null
    description: Add an icon to the circle within the component.
    default: null
    link: null
    usage: '#icons'
    code: >
      <s-switch color="#7d33ff" icon v-model="active6">
        <template #circle>
            <i v-if="active6" class='bx bxl-instagram-alt'></i>
            <i v-else class='bx bxl-instagram' ></i>
        </template>
      </s-switch>
---

# Switch

<card>

## 默认

<docs-warn />

Generate a switch element easily with beautiful animations and functionality

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

Change the color of the component when it is in active state, the allowed values ​​are (main colors of vuesax, RGB, HEX)

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

Add a text to the switch with the default slot or if you need a different text for each state of the component you can use the `on` or `off` slots

:::tip Self-adjusting
The component conforms to the text to be displayed by the state in which it is located
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

Add icons to the component in the default slot or the `on` or `off` status slots, and in the `circle`

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

Add a loading animation to the component with the `loading` property, the property is a` boolean` so you can add it without any value.

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

Add an undetermined state to the compound with the `indeterminate` property, the property is a` boolean` so you can add it without any value.

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

Change the circular style to square with the `square` property, the property is a` boolean` so you can add it without any value.

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

A usual example when using the switch component

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

<card>

## API

</card>
