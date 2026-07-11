---
PROPS:
  - name: accordion
    type: Boolean
    values: true, false
    description: Only one panel open at a time.
    default: false
    link: null
    usage: '#accordion'

  - name: type
    type: String
    values: default, border, margin, shadow
    description: Visual variant.
    default: default
    link: null
    usage: '#type'

  - name: open-hover
    type: Boolean
    values: true, false
    description: Open panel on hover.
    default: false
    link: null
    usage: '#open-hover'
EVENTS:
  - name: change
    params: null
    description: Emitted when open panels change.
EXPOSES: []
description: "Expand and collapse content panels with multiple visual styles."
NEWS:
  - default
  - accordion
  - type
  - open-hover
  - icon-arrow
---

# Collapse

<card>

## Default


Wrap sections in `vs-collapse-item` with a header slot.

<template #example>
<collapse-default />
</template>

<template #template>

@[code{1-12}](../.vuepress/components/collapse/default.vue)

</template>

</card>

<card>

## Accordion


Keep only one panel open at a time with `accordion`.

<template #example>
<collapse-accordion />
</template>

<template #template>

@[code{1-12}](../.vuepress/components/collapse/accordion.vue)

</template>

</card>

<card>

## Type


Switch container style using the `type` prop.

<template #example>
<collapse-type />
</template>

<template #template>

@[code{1-10}](../.vuepress/components/collapse/type.vue)

</template>

<template #style>

@[code{12-20}](../.vuepress/components/collapse/type.vue)

</template>

</card>

<card>

## Open Hover


Open panels on hover instead of click.

<template #example>
<collapse-open-hover />
</template>

<template #template>

@[code{1-5}](../.vuepress/components/collapse/open-hover.vue)

</template>

</card>

<card>

## Change Arrow Icon


Customize the expand arrow per panel.

<template #example>
<collapse-icon-arrow />
</template>

<template #template>

@[code{1-8}](../.vuepress/components/collapse/icon-arrow.vue)

</template>

</card>

<card>

## API

</card>
