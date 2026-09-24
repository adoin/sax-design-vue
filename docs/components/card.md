---
description: 'Compose content, media, actions, and interaction states on a flexible surface.'
EXAMPLE_GROUPS:
  - title: Types
    items:
      [
        default,
        classic,
        overlay,
        split,
        frosted,
        reveal,
        profile,
        metric,
        article,
      ]
  - title: Textures
    items: [default-solid, liquid-glass, liquid-glass-2]
  - title: Effects
    items: [no-effect, spotlight, gradient-glow]
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
    usage: '#complete-configuration'
  - name: texture
    type: CardTexture
    values: default | liquid-glass | liquid-glass-2
    description: Surface material, independent from layout and decorative effects.
    default: default
    usage: '#default-solid'
  - name: effect
    type: CardEffect
    values: default | spotlight | gradient-glow
    description: Decorative interaction treatment, independent from layout and texture.
    default: default
    usage: '#no-effect'
  - name: orientation
    type: String
    values: vertical | horizontal
    description: Arrange media and content vertically or horizontally while retaining the selected type's presentation.
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
    type: CardType
    values: default | classic | overlay | split | frosted | reveal | profile | metric | article
    description: Select a complete, named card preset. Numeric values 1-5 remain compatibility aliases.
    default: default
    usage: '#default'
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

`default` is the implicit preset: a quiet title-and-body surface with optional header extras and footer actions.

<template #example>
<card-default />
</template>

<template #template>

@[code{1-16}](../.vuepress/components/card/default.vue)

</template>

<template #style>

@[code{18-24}](../.vuepress/components/card/default.vue)

</template>

</card>

<card>

## Classic

Set `type="classic"` for the established media-first layout with overlay interactions.

<template #example>
<card-classic />
</template>

<template #template>

@[code{1-22}](../.vuepress/components/card/classic.vue)

</template>

<template #style>

@[code{24-35}](../.vuepress/components/card/classic.vue)

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

## Default solid

Use `texture="default"` for the regular solid surface without an additional material layer.

<template #example>
<card-texture-default />
</template>

<template #template>

@[code{1-9}](../.vuepress/components/card/texture-default.vue)

</template>

<template #style>

@[code{11-20}](../.vuepress/components/card/texture-default.vue)

</template>

</card>

<card>

## Liquid glass

`texture="liquid-glass"` uses a per-instance SVG displacement map to bend the actual backdrop through the translucent surface. Browsers without URL backdrop-filter support receive a saturated blur fallback.

<template #example>
<card-texture-liquid-glass />
</template>

<template #template>

@[code{1-10}](../.vuepress/components/card/texture-liquid-glass.vue)

</template>

<template #style>

@[code{12-115}](../.vuepress/components/card/texture-liquid-glass.vue)

</template>

</card>

<card>

## Liquid glass 2

`texture="liquid-glass-2"` keeps the same Card surface, title, blur, shine, and animated backdrop, but swaps in the alternate component-transfer and specular SVG filter graph for direct comparison.

<template #example>
<card-texture-liquid-glass-2 />
</template>

<template #template>

@[code{1-10}](../.vuepress/components/card/texture-liquid-glass-2.vue)

</template>

<template #style>

@[code{12-115}](../.vuepress/components/card/texture-liquid-glass-2.vue)

</template>

</card>

<card>

## No effect

Use `effect="default"` when the Card should render without interactive decoration.

<template #example>
<card-effect-default />
</template>

<template #template>

@[code{1-7}](../.vuepress/components/card/effect-default.vue)

</template>

<template #style>

@[code{9-21}](../.vuepress/components/card/effect-default.vue)

</template>

</card>

<card>

## Spotlight

`spotlight` keeps the interior unchanged and reveals a local single-color border highlight near the pointer.

<template #example>
<card-effect-spotlight />
</template>

<template #template>

@[code{1-10}](../.vuepress/components/card/effect-spotlight.vue)

</template>

<template #style>

@[code{12-26}](../.vuepress/components/card/effect-spotlight.vue)

</template>

</card>

<card>

## Gradient glow

`gradient-glow` combines a pointer-directed multicolor edge arc, a blurred outer glow, and a restrained inner highlight.

<template #example>
<card-effect-gradient-glow />
</template>

<template #template>

@[code{1-10}](../.vuepress/components/card/effect-gradient-glow.vue)

</template>

<template #style>

@[code{12-26}](../.vuepress/components/card/effect-gradient-glow.vue)

</template>

</card>

<card>

## Hover effects

Cards stay static by default. Add `interactive` for keyboard semantics and choose `lift` or `glow` when the whole card performs an action.

<template #example>
<card-hover-effects />
</template>

<template #template>

@[code{1-26}](../.vuepress/components/card/hover-effects.vue)

</template>

<template #style>

@[code{28-36}](../.vuepress/components/card/hover-effects.vue)

</template>

</card>

<card>

## Orientation

Use `horizontal` to place media beside content while retaining the selected type's presentation. On narrow screens, the arrangement returns to vertical.

<template #example>
<card-orientation />
</template>

<template #template>

@[code{1-29}](../.vuepress/components/card/orientation.vue)

</template>

<template #style>

@[code{31-38}](../.vuepress/components/card/orientation.vue)

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

@[code{1-14}](../.vuepress/components/card/shape.vue)

</template>

<template #style>

@[code{16-24}](../.vuepress/components/card/shape.vue)

</template>

</card>

<card>

## Complete configuration

Adjust Card layout, orientation, texture, effect, geometry, color, and interaction states in one place.

<template #example>
<card-configurator />
</template>

<template #template>

@[code{65-148}](../.vuepress/components/card/configurator.vue)

</template>

<template #script>

@[code{1-63}](../.vuepress/components/card/configurator.vue)

</template>

<template #style>

@[code{150-211}](../.vuepress/components/card/configurator.vue)

</template>

</card>
