---
PROPS:
  - name: auto-start
    type: Boolean
    values: true | false
    description: 挂载后自动开始倒计时。
    default: true
  - name: speed
    type: Number
    values: number >= 0
    description: 倒计时流速倍数；设为 0 时冻结剩余时间。
    default: 1
  - name: value
    type: Number
    values: timestamp
    description: 毫秒级目标时间戳。
    default: null
  - name: format
    type: String
    values: DD HH mm ss
    description: 展示格式标记；最高显示单位会吸收被省略的更大单位。
    default: HH:mm:ss
  - name: formatter
    type: Function
    values: (time) => string
    description: 根据剩余时间格式化自定义文本；传入后优先于 format，返回文本中的数字仍会保留所选动效。
    default: null
  - name: effect
    type: String
    values: default | flip | fade | particle | slide
    description: 数字变化时使用的动效风格；分隔符不会参与动画。
    default: default
EVENTS:
  - name: finish
    description: 归零时触发。
  - name: change
    description: 剩余毫秒变化时触发。
EXPOSES:
  - name: start / stop
    description: 通过实例方法继续或暂停倒计时。
description: '倒计时展示。'
---

# Countdown 倒计时

<card>

## 基础

默认使用原有的静态数字展示方式。

<template #example><countdown-default /></template>

<template #template>

@[code{8-11}](../../.vuepress/components/countdown/default.vue)

</template>

<template #script>

@[code{1-6}](../../.vuepress/components/countdown/default.vue)

</template>

</card>

<card>

## 动效、格式、流速与自定义显示

通过单选控件为所有示例统一切换数字动效。翻牌、渐隐渐显、粒子消散聚合和纵向滑动只处理发生变化的数字，并在系统启用“减少动态效果”时自动退化为直接更新。

`format` 中的最高单位会吸收被省略的更大单位：`ss` 显示总秒数（可以大于 60），`mm:ss` 的分钟可以大于 59，`HH:mm:ss` 的小时可以大于 23；需要拆出天数时再加入 `DD`。

使用 `speed` 调整流速：`0` 表示冻结，`1` 表示正常流速，`2` 表示两倍速。基于标记的显示使用 `format`，自定义文本使用 `formatter(time)`；传入 `formatter` 后会忽略 `format`。Formatter 返回文本中的数字仍由内置数字渲染器处理，因此所选 `effect` 会继续生效。

<template #example><countdown-formats /></template>

<template #template>

@[code{44-105}](../../.vuepress/components/countdown/formats.vue)

</template>

<template #script>

@[code{1-42}](../../.vuepress/components/countdown/formats.vue)

</template>

<template #style>

@[code{107-144}](../../.vuepress/components/countdown/formats.vue)

</template>

</card>
