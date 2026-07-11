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
    description: List header subtitle.
    default: null
    link: null
    usage: '#header'

  - name: icon
    type: String
    values: Material icon
    description: List item or header icon.
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
NEWS:
  - default
  - header
  - icon
  - content
  - avatar
---

# List

<card>

## Basic

<template #example>
<list-default />
</template>

<template #template>

@[code vue](../.vuepress/components/list/default.vue)

</template>

</card>

<card>

## Header

<template #example>
<list-header />
</template>

<template #template>

@[code vue](../.vuepress/components/list/header.vue)

</template>

</card>

<card>

## Icon

<template #example>
<list-icon />
</template>

<template #template>

@[code vue](../.vuepress/components/list/icon.vue)

</template>

</card>

<card>

## Content

<template #example>
<list-content />
</template>

<template #template>

@[code vue](../.vuepress/components/list/content.vue)

</template>

</card>

<card>

## Avatar

<template #example>
<list-avatar />
</template>

<template #template>

@[code vue](../.vuepress/components/list/avatar.vue)

</template>

</card>

<card>

## API

</card>
