---
description: 'Compose content, media, actions, and interaction states on a flexible surface.'
PROPS:
  - name: title
    type: String
    values: String
    description: Card title. The title slot takes precedence.
    default: null
    usage: '#default'
  - name: subtitle
    type: String
    values: String
    description: Secondary text below the title.
    default: null
    usage: '#default'
  - name: text
    type: String
    values: String
    description: Card description. The text slot takes precedence.
    default: null
    usage: '#default'
  - name: color
    type: String
    values: Sax Design colors | RGB | HEX
    description: Semantic accent used by colored surfaces and effects.
    default: primary
    usage: '#extended-surface-variants'
  - name: variant
    type: String
    values: elevated | outlined | soft | solid | plain | glass
    description: Surface treatment, independent from layout and behavior.
    default: null
    usage: '#extended-surface-variants'
  - name: orientation
    type: String
    values: vertical | horizontal
    description: Arrange media and content vertically or horizontally.
    default: null
    usage: '#orientation'
  - name: hover-effect
    type: String
    values: none | lift | glow
    description: Visual hover and keyboard-focus feedback.
    default: null
    usage: '#hover-effects'
  - name: shape
    type: String
    values: rounded | square
    description: Card corner geometry. Inherits ConfigProvider shape.
    default: rounded
    usage: '#shape'
  - name: interactive
    type: Boolean
    values: true | false
    description: Adds button semantics and keyboard focus to a clickable card.
    default: 'false'
    usage: '#hover-effects'
  - name: selectable
    type: Boolean
    values: true | false
    description: Makes the card a toggleable selection surface.
    default: 'false'
    usage: '#selection-and-loading'
  - name: selected
    type: Boolean
    values: true | false
    description: Controlled selected state. Supports v-model:selected.
    default: 'false'
    usage: '#selection-and-loading'
  - name: loading
    type: Boolean
    values: true | false
    description: Shows a stable skeleton and disables interaction.
    default: 'false'
    usage: '#selection-and-loading'
  - name: type
    type: String
    values: classic | overlay | split | frosted | reveal | profile | metric | article
    description: Select a complete, named card preset. Numeric values 1-5 remain compatibility aliases.
    default: classic
    usage: '#article'
EVENTS:
  - name: update:selected
    type: Boolean
    description: Emitted when a selectable card requests a selected-state change.
  - name: select
    type: Boolean, MouseEvent
    description: Emitted with the next state and triggering event after selection.
SLOTS:
  - name: default
    type: slot
    values: 'null'
    description: Add custom body content.
    default: null
  - name: header
    type: slot
    values: 'null'
    description: Add card header content.
    default: null
  - name: extra
    type: slot
    values: 'null'
    description: Add content at the end of the header.
    default: null
  - name: media
    type: slot
    values: 'null'
    description: Add image or video media to a structured card layout.
    default: null
  - name: title
    type: slot
    values: 'null'
    description: Customize the title.
    default: null
  - name: subtitle
    type: slot
    values: 'null'
    description: Customize the subtitle.
    default: null
  - name: text
    type: slot
    values: 'null'
    description: Customize the description.
    default: null
  - name: footer
    type: slot
    values: 'null'
    description: Replace the complete footer.
    default: null
  - name: actions
    type: slot
    values: 'null'
    description: Add footer actions to a structured card layout.
    default: null
  - name: interactions
    type: slot
    values: 'null'
    description: Add controls over the media area.
    default: null
  - name: img
    type: slot
    values: 'null'
    description: Add image or video content to a preset card.
    default: null
  - name: buttons
    type: slot
    values: 'null'
    description: Add buttons to a preset card.
    default: null
---

# Card

<card>

## Default

`classic` is the default preset for a familiar media, text, and actions layout.

<template #example>
<card-default />
</template>

<template #template>

@[code{1-22}](../.vuepress/components/card/default.vue)

</template>

<template #style>

@[code{24-35}](../.vuepress/components/card/default.vue)

</template>

</card>

<card>

## Overlay

Set `type="overlay"` to reveal text over an image.

<template #example>
<card-type2 />
</template>

<template #template>

@[code{1-24}](../.vuepress/components/card/type2.vue)

</template>

<template #style>

@[code{27-37}](../.vuepress/components/card/type2.vue)

</template>

</card>

<card>

## Split

Set `type="split"` for a compact side-by-side media layout.

<template #example>
<card-type3 />
</template>

<template #template>

@[code{1-24}](../.vuepress/components/card/type3.vue)

</template>

<template #style>

@[code{27-37}](../.vuepress/components/card/type3.vue)

</template>

</card>

<card>

## Frosted

Set `type="frosted"` for a translucent caption over immersive media.

<template #example>
<card-type4 />
</template>

<template #template>

@[code{1-24}](../.vuepress/components/card/type4.vue)

</template>

<template #style>

@[code{27-37}](../.vuepress/components/card/type4.vue)

</template>

</card>

<card>

## Reveal

Set `type="reveal"` for a centered caption that emerges below the media.

<template #example>
<card-type5 />
</template>

<template #template>

@[code{1-24}](../.vuepress/components/card/type5.vue)

</template>

<template #style>

@[code{27-37}](../.vuepress/components/card/type5.vue)

</template>

</card>

<card>

## Profile

`profile` creates a complete identity card with portrait, supporting details, statistics, and actions.

<template #example>
<card-profile />
</template>

<template #template>

@[code{1-25}](../.vuepress/components/card/profile.vue)

</template>

<template #style>

@[code{27-45}](../.vuepress/components/card/profile.vue)

</template>

</card>

<card>

## Metric

`metric` gives one primary value, its change, a compact visualization, and context a clear dashboard hierarchy.

<template #example>
<card-metric />
</template>

<template #template>

@[code{1-32}](../.vuepress/components/card/metric.vue)

</template>

<template #script>

@[code{34-36}](../.vuepress/components/card/metric.vue)

</template>

<template #style>

@[code{38-70}](../.vuepress/components/card/metric.vue)

</template>

</card>

<card>

## Article

`article` combines responsive editorial media, metadata, author context, and a clear reading action.

<template #example>
<card-article />
</template>

<template #template>

@[code{1-25}](../.vuepress/components/card/article.vue)

</template>

<template #style>

@[code{27-44}](../.vuepress/components/card/article.vue)

</template>

</card>

<card>

## Extended surface variants

The eight named `type` presets remain the primary Card styles. Use `variant` only when an application needs an explicit composable surface treatment.

<template #example>
<card-variants />
</template>

<template #template>

@[code{12-23}](../.vuepress/components/card/variants.vue)

</template>

<template #script>

@[code{1-10}](../.vuepress/components/card/variants.vue)

</template>

<template #style>

@[code{25-46}](../.vuepress/components/card/variants.vue)

</template>

</card>

<card>

## Hover effects

Cards stay static by default. Add `interactive` for keyboard semantics and choose `lift` or `glow` when the whole card performs an action.

<template #example>
<card-hover-effects />
</template>

<template #template>

@[code{1-28}](../.vuepress/components/card/hover-effects.vue)

</template>

<template #style>

@[code{30-38}](../.vuepress/components/card/hover-effects.vue)

</template>

</card>

<card>

## Orientation

Use `horizontal` for media beside content. It automatically returns to a vertical layout on narrow screens.

<template #example>
<card-orientation />
</template>

<template #template>

@[code{1-31}](../.vuepress/components/card/orientation.vue)

</template>

<template #style>

@[code{33-40}](../.vuepress/components/card/orientation.vue)

</template>

</card>

<card>

## Selection and loading

`selectable` supports controlled selection through `v-model:selected`. Loading cards keep their footprint while blocking interaction.

<template #example>
<card-states />
</template>

<template #template>

@[code{7-23}](../.vuepress/components/card/states.vue)

</template>

<template #script>

@[code{1-5}](../.vuepress/components/card/states.vue)

</template>

<template #style>

@[code{25-33}](../.vuepress/components/card/states.vue)

</template>

</card>

<card>

## Shape

Set `shape="square"` locally or inherit it from `s-config-provider`.

<template #example>
<card-shape />
</template>

<template #template>

@[code{1-16}](../.vuepress/components/card/shape.vue)

</template>

<template #style>

@[code{18-26}](../.vuepress/components/card/shape.vue)

</template>

</card>

<card>

## Group

Use `s-card-group` when cards need a horizontal scrolling layout. It does not change individual card styling.

<template #example>
<card-group />
</template>

<template #template>

@[code{1-26}](../.vuepress/components/card/group.vue)

</template>

<template #script>

@[code{28-33}](../.vuepress/components/card/group.vue)

</template>

<template #style>

@[code{34-44}](../.vuepress/components/card/group.vue)

</template>

</card>
