---
description: 'Attach status, count, or short metadata to nearby content.'
PROPS:
  #__________________________________
  - name: value
    type: Number/String
    values: 'Number,String'
    description: display value.
    default: "' '"
    link: null
    usage: '#default'
    code: >
      <s-badge :value="7">
        <s-button>Badge</s-button>
      </s-badge>
    #__________________________________
  - name: max
    type: Number
    values: 'Number'
    description: maximum value, shows <code>{max}+</code> when exceeded. Only works if value is a number.
    default: null
    link: null
    usage: '#max-value'
    code: >
      <s-badge :value="100" :max="19" type="primary" >
        <s-button >comment</s-button>
      </s-badge>
    #__________________________________
  - name: is-dot
    type: Boolean
    values: 'true,false'
    description: Show with little dots level.
    default: false
    link: null
    usage: '#red-dot'
    code: >
      <s-badge :value="100" :max="19" is-dot type="primary" >
        <s-button >comment</s-button>
      </s-badge>
    #__________________________________
  - name: hidden
    type: Boolean
    values: 'true,false'
    description: hidden badge.
    default: false
    link: null
    usage: '#controlled-visibility'
    code: >
      <s-badge :value="3"  :hidden="hidden">
        <s-avatar shape="square" color="#ccc"> </s-avatar>
      </s-badge>
    #__________________________________
  - name: type
    type: String
    values: 'primary, success, warn, info, danger'
    description: badge type.
    default: danger
    link: null
    usage: '#default'
    code: >
      <s-badge :value="2" type="warn">
        <s-button shape="square">square</s-button>
      </s-badge>
    #__________________________________
  - name: show-zero
    type: Boolean
    values: 'true,false'
    description: Whether to show badge when value is zero.
    default: true
    link: null
    usage: '#show-zero'
    code: >
      <s-badge :value="0" type="warn" :show-zero="false">
        <s-button shape="square">square</s-button>
      </s-badge>
    #__________________________________
  - name: color
    type: String
    values: 'String'
    description: background color of the dot.
    default: null
    link: null
    usage: '#default'
    code: >
      <s-badge :value="2" class="item" color="#ccc"> text </s-badge>
    #__________________________________
  - name: offset
    type: Array
    values: 'Record< number, number>'
    description: Adjusting the position of the badge
    default: null
    link: null
    usage: '#offset'
    code: >
      <s-badge :value="3" :offset=[-20,20] class="item" >
        <s-avatar shape="square" color="#ccc"> </s-avatar>
      </s-badge>
    #__________________________________
  - name: processing
    type: Boolean
    values: 'true,false'
    description: Set processing prop to indicate it is processing.
    default: false
    link: null
    usage: '#processing'
    code: >
      <s-badge :value="2" processing  >
        <s-button shape="square">square</s-button>
      </s-badge>
    #__________________________________
  - name: badge-style
    type: object
    values: 'CSSProperties'
    description: custom style of badge.
    default: ''
    link: null
    usage: null
    code: null
    #__________________________________
  - name: badge-class
    type: String
    values: 'String'
    description: custom class of badge.
    default: ''
    link: null
    usage: null
    code: null
    #__________________________________

SLOTS:
  - name: default
    type: slot
    values: ''
    description: customize default content
    default: null
    example: null
    link: null
    usage: '#default'
    code: >
      <s-badge :value="2">
        <s-button shape="square">square</s-button>
      </s-badge>

UPDATES:
  - type
---

# Badge

<card>

## Default

**Typically displaying unread messages count.**
You can use it on buttons,text,avatars,etc.

<template #example>
<badge-default />
</template>

<template #template>

@[code{1-19}](../.vuepress/components/badge/default.vue)

</template>

<template #style>

@[code{21-25}](../.vuepress/components/badge/default.vue)

</template>

</card>

<card>

## Max Value

Set `max` prop to handle overflow situation.

::: tip
The max value is defined by property max which is a `Number`. Note that it only works when value is also a `Number`.
:::

<template #example>
<badge-max />
</template>

<template #template>

@[code{1-13}](../.vuepress/components/badge/max.vue)

</template>

<template #style>

@[code{15-19}](../.vuepress/components/badge/max.vue)

</template>

</card>

<card>

## Customizing content

Displays text content other than numbers.

When value is a String, it can display customized text.

<template #example>
<badge-customizations />
</template>

<template #template>

@[code{1-10}](../.vuepress/components/badge/customizations.vue)

</template>

<template #style>

@[code{12-16}](../.vuepress/components/badge/customizations.vue)

</template>

</card>

<card>

## Red Dot

Use a red dot to mark content that needs to be noticed.

Use the attribute `is-dot`. It is a Boolean.

<template #example>
<badge-red-dot />
</template>

<template #template>

@[code{1-16}](../.vuepress/components/badge/red-dot.vue)

</template>

<template #style>

@[code{18-22}](../.vuepress/components/badge/red-dot.vue)

</template>

</card>

<card>

## Offset

Set offset of the badge dot, the format is [left, top], which represents the offset of the status dot from the left and top of the default position.

<template #example>
<badge-offset />
</template>

<template #template>

@[code{1-15}](../.vuepress/components/badge/offset.vue)

</template>

<template #style>

@[code{17-21}](../.vuepress/components/badge/offset.vue)

</template>

</card>

<card>

## Processing

Use `processing` for live or updating states. It adds a repeating pulse around the badge; compare it with the normal state below.

<template #example>
<badge-processing />
</template>

<template #template>

@[code{1-31}](../.vuepress/components/badge/processing.vue)

</template>

<template #script>

@[code{33-43}](../.vuepress/components/badge/processing.vue)

</template>

<template #style>

@[code{45-89}](../.vuepress/components/badge/processing.vue)

</template>

</card>

<card>

## Controlled visibility

Set `hidden` prop to control the visibility of the badge.

<template #example>
<badge-controlled-visibility />
</template>

<template #template>

@[code{1-9}](../.vuepress/components/badge/controlled-visibility.vue)

</template>

<template #script>

@[code{11-15}](../.vuepress/components/badge/controlled-visibility.vue)

</template>

<template #style>

@[code{17-21}](../.vuepress/components/badge/controlled-visibility.vue)

</template>

</card>

<card>

## Show Zero

Zero values are shown by default. Set `show-zero="false"` to hide the badge
while keeping its child content.

<template #example>
<badge-show-zero />
</template>

<template #template>

@[code{1-10}](../.vuepress/components/badge/show-zero.vue)

</template>

<template #style>

@[code{12-16}](../.vuepress/components/badge/show-zero.vue)

</template>

</card>
