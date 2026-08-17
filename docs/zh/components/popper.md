---
description: '将浮层内容定位到触发元素附近。'
PROPS:
  - name: loading / process-before-open / process-before-close
    type: Boolean / Function / Function
    values: true | false / 生命周期守卫
    description: 显示加载反馈，并在打开或关闭前执行拦截。
    default: 'false / () => true / () => true'
  - name: v-model:visible / visible
    type: Boolean
    values: true | false
    description: 控制浮层内容是否显示。
    default: 'null'
  - name: trigger
    type: String | String[]
    values: hover | focus | click | contextmenu
    description: 打开 Popper 的触发事件。
    default: hover
  - name: placement / offset / strategy
    type: String / Number | Object / String
    values: floating-ui placement | pixels | absolute | fixed
    description: 配置浮层内容的位置。
    default: 'bottom / 12 / absolute'
  - name: disabled / show-arrow / teleported / persistent
    type: Boolean
    values: true | false
    description: 控制可用性、箭头、挂载位置和生命周期。
    default: 'false / true / true / false'
  - name: content / raw-content
    type: String / Boolean
    values: text or HTML
    description: 不使用 content 插槽时提供浮层内容。
    default: '- / false'
  - name: popper-class / popper-style / z-index
    type: String | Object | Array / String | Object | Array / Number
    values: CSS values
    description: 自定义浮层内容和层级。
    default: "'' / '' / -"
EVENTS:
  - name: before-show / show / before-hide / hide
    description: 在可见性生命周期内触发。
SLOTS:
  - name: default
    type: slot
    values: null
    description: Popper 触发与参考元素。
    default: null
    link: null
    usage: '#default'
    code: null

  - name: content
    type: slot
    values: null
    description: 自定义内容。
    default: null
    link: null
    usage: '#slot'
    code: >
---

# Popper（弹出层）

<card>

## 默认

<template #example>
<popper-default />
</template>

<template #template>

@[code{1-9}](../../.vuepress/components/popper/default.vue)

</template>

</card>
