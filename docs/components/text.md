---
PROPS:
  - name: tag / status
    type: String / String
    values: semantic HTML tag / theme status
    description: Select the rendered element and semantic color state.
    default: 'span / -'
  - name: content
    type: String | Number
    values: text
    description: Text when no default slot is supplied.
    default: null
  - name: line-clamp
    type: false | Number
    values: false | positive integer
    description: Truncation lines. `false` disables truncation, `1` truncates one line, and `2+` clamps multiple lines.
    default: false
  - name: typing
    type: Boolean | Number
    values: false | true | milliseconds
    description: Types `content` character by character. `true` uses the default speed; a number sets the interval in milliseconds.
    default: false
description: 'Semantic text with truncation and typewriter effects.'
---

# Text

<card><template #example><text-default /></template>

<template #template>

@[code{1-31}](../.vuepress/components/text/default.vue)

</template>

<template #style>

@[code{33-60}](../.vuepress/components/text/default.vue)

</template>

</card>
