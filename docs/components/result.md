---
description: "Show operation outcomes, supporting information and next actions."
PROPS:
  - name: status
    type: String
    values: "success | warning | error | info"
    description: "Semantic state; the default illustration and color follow this value."
    default: "info"
    usage: '#success'
  - name: title
    type: String
    values: "text"
    description: "Result heading; the title slot takes precedence."
    default: null
    usage: '#custom-content'
  - name: description
    type: String
    values: "text"
    description: "Supporting copy; the default slot takes precedence over text props."
    default: null
    usage: '#success'
  - name: content
    type: String
    values: "text"
    description: "Compatibility alias for description; description takes precedence when both are provided."
    default: null
    usage: '#custom-content'
  - name: size
    type: ComponentSize
    values: "small | default | large"
    description: "Inherits global sizing when omitted; adjusts illustration, typography and spacing."
    default: null
    usage: '#sizes'
  - name: layout
    type: String
    values: "vertical | horizontal"
    description: "Centered vertical or inline horizontal layout; horizontal results stack on narrow screens."
    default: "vertical"
    usage: '#horizontal-layout'
  - name: animated
    type: Boolean
    values: "true | false"
    description: "Plays the default illustration entrance once when visible, then stays still. Reduced-motion preferences show the static artwork."
    default: true
    usage: '#animation'
SLOTS:
  - name: icon
    type: Slot
    scope: '{ status: "success" | "warning" | "error" | "info" }'
    description: "Replace the decorative artwork."
    usage: '#custom-content'
  - name: title
    type: Slot
    scope: '{ status: "success" | "warning" | "error" | "info" }'
    description: "Replace the heading."
    usage: '#custom-content'
  - name: default
    type: Slot
    scope: '{ status: "success" | "warning" | "error" | "info" }'
    description: "Replace supporting copy with rich or block content."
    usage: '#custom-content'
  - name: details
    type: Slot
    scope: '{ status: "success" | "warning" | "error" | "info" }'
    description: "Structured details below the description."
    usage: '#custom-content'
  - name: extra
    type: Slot
    scope: '{ status: "success" | "warning" | "error" | "info" }'
    description: "Next actions; multiple buttons wrap naturally."
    usage: '#custom-content'
---

# Result

<card>

## Success

Use success for a completed operation. Put next actions in extra; the caller owns each button handler.

<template #example><result-default /></template>

<template #template>

@[code{6-20}](../.vuepress/components/result/default.vue)

</template>

<template #script>

@[code{1-4}](../.vuepress/components/result/default.vue)

</template>

<template #style>

@[code{22-61}](../.vuepress/components/result/default.vue)

</template>

</card>

<card>

## Information

Use info for informational outcomes and let an action acknowledge the message.

<template #example><result-info /></template>

<template #template>

@[code{6-20}](../.vuepress/components/result/info.vue)

</template>

<template #script>

@[code{1-4}](../.vuepress/components/result/info.vue)

</template>

<template #style>

@[code{22-61}](../.vuepress/components/result/info.vue)

</template>

</card>

<card>

## Warning

Use warning to prompt a review before continuing. This example updates the result to success after acknowledgment.

<template #example><result-warning /></template>

<template #template>

@[code{6-20}](../.vuepress/components/result/warning.vue)

</template>

<template #script>

@[code{1-4}](../.vuepress/components/result/warning.vue)

</template>

<template #style>

@[code{22-61}](../.vuepress/components/result/warning.vue)

</template>

</card>

<card>

## Error

Use error for an incomplete operation with a next action such as retry. The example shows an informational state after acknowledging a retry.

<template #example><result-error /></template>

<template #template>

@[code{6-20}](../.vuepress/components/result/error.vue)

</template>

<template #script>

@[code{1-4}](../.vuepress/components/result/error.vue)

</template>

<template #style>

@[code{22-61}](../.vuepress/components/result/error.vue)

</template>

</card>

<card>

## Sizes

small, default and large adjust the illustration, heading and spacing together. Omit size to inherit global sizing.

<template #example><result-sizes /></template>

<template #template>

@[code{9-21}](../.vuepress/components/result/sizes.vue)

</template>

<template #script>

@[code{1-7}](../.vuepress/components/result/sizes.vue)

</template>

<template #style>

@[code{23-62}](../.vuepress/components/result/sizes.vue)

</template>

</card>

<card>

## Horizontal layout

layout="horizontal" places the artwork beside the content for inline feedback. Narrow screens use a vertical arrangement.

<template #example><result-horizontal /></template>

<template #template>

@[code{6-19}](../.vuepress/components/result/horizontal.vue)

</template>

<template #script>

@[code{1-4}](../.vuepress/components/result/horizontal.vue)

</template>

<template #style>

@[code{21-60}](../.vuepress/components/result/horizontal.vue)

</template>

</card>

<card>

## Custom content

Customize icon, title, default content, details and extra independently. details accepts structured information; actions wrap naturally.

<template #example><result-custom /></template>

<template #template>

@[code{6-33}](../.vuepress/components/result/custom.vue)

</template>

<template #script>

@[code{1-4}](../.vuepress/components/result/custom.vue)

</template>

<template #style>

@[code{35-74}](../.vuepress/components/result/custom.vue)

</template>

</card>

<card>

## Animation

animated controls the built-in one-time entrance. Remount to replay. Reduced-motion preferences keep the artwork static; custom icon animations are controlled by the caller.

<template #example><result-animation /></template>

<template #template>

@[code{7-22}](../.vuepress/components/result/animation.vue)

</template>

<template #script>

@[code{1-5}](../.vuepress/components/result/animation.vue)

</template>

<template #style>

@[code{24-63}](../.vuepress/components/result/animation.vue)

</template>

</card>
