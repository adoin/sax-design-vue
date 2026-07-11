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
description: "Structured lists with headers, icons, avatars, and custom slots."
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


Display title and subtitle rows with `vs-list-item`.

<template #example>
<list-default />
</template>

<template #template>

@[code{1-6}](../.vuepress/components/list/default.vue)

</template>

</card>

<card>

## Header


Group items under `vs-list-header`.

<template #example>
<list-header />
</template>

<template #template>

@[code{1-7}](../.vuepress/components/list/header.vue)

</template>

</card>

<card>

## Icon


Add leading icons to list rows.

<template #example>
<list-icon />
</template>

<template #template>

@[code{1-6}](../.vuepress/components/list/icon.vue)

</template>

</card>

<card>

## Content


Place actions or custom content in the item slot.

<template #example>
<list-content />
</template>

<template #template>

@[code{1-7}](../.vuepress/components/list/content.vue)

</template>

</card>

<card>

## Avatar


Use the `avatar` slot for profile images or initials.

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
