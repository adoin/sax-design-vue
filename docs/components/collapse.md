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

<template #example>
<collapse-default />
</template>

<template #template>

@[code vue](../.vuepress/components/collapse/default.vue)

</template>

</card>

<card>

## Accordion

<template #example>
<collapse-accordion />
</template>

<template #template>

@[code vue](../.vuepress/components/collapse/accordion.vue)

</template>

</card>

<card>

## Type

<template #example>
<collapse-type />
</template>

<template #template>

@[code vue](../.vuepress/components/collapse/type.vue)

</template>

</card>

<card>

## Open Hover

<template #example>
<collapse-open-hover />
</template>

<template #template>

@[code vue](../.vuepress/components/collapse/open-hover.vue)

</template>

</card>

<card>

## Change Arrow Icon

<template #example>
<collapse-icon-arrow />
</template>

<template #template>

@[code vue](../.vuepress/components/collapse/icon-arrow.vue)

</template>

</card>

<card>

## API

</card>
