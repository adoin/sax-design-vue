---
PROPS:
  - name: title
    type: String
    values: String
    description: List header title (vs-list-header).
    default: null
    link: null
    usage: '#header'

  - name: subtitle
    type: String
    values: String
    description: 列表副标题。
    default: null
    link: null
    usage: '#header'

  - name: icon
    type: String
    values: Material icon
    description: 列表项或标题图标。
    default: null
    link: null
    usage: '#icon'

  - name: color
    type: String
    values: primary, success, danger
    description: Header color.
    default: primary
    link: null
    usage: '#header'
EVENTS: []
EXPOSES: []
description: "结构化列表，支持标题、图标、头像与自定义插槽。"
NEWS:
  - default
  - header
  - icon
  - content
  - avatar
---

# 列表

<card>

## 默认


使用 `vs-list-item` 显示标题与副标题行。

<template #example>
<list-default />
</template>

<template #template>

@[code{1-6}](../.vuepress/components/list/default.vue)

</template>

</card>

<card>

## 标题行


在 `vs-list-header` 下分组列表项。

<template #example>
<list-header />
</template>

<template #template>

@[code{1-7}](../.vuepress/components/list/header.vue)

</template>

</card>

<card>

## 图标


为列表行添加前置图标。

<template #example>
<list-icon />
</template>

<template #template>

@[code{1-6}](../.vuepress/components/list/icon.vue)

</template>

</card>

<card>

## 内容


在 item 插槽中放置操作或自定义内容。

<template #example>
<list-content />
</template>

<template #template>

@[code{1-7}](../.vuepress/components/list/content.vue)

</template>

</card>

<card>

## 头像


使用 `avatar` 插槽放置头像或首字母。

<template #example>
<list-avatar />
</template>

<template #template>

@[code{1-6}](../.vuepress/components/list/avatar.vue)

</template>

</card>

<card>

## API

</card>
