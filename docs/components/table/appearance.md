---
description: 'Table appearance options and runnable examples.'
---

# Appearance guide

<card class="table-doc-section-start">

## Appearance

Use appearance options to adapt Table density and visual rhythm without changing its data, columns, or interaction model.

### Size

Switch among `small`, `default`, and `large` on one complete request-proxy table. The inherited size updates the query `$input` and `$select`, fixed query actions, toolbar renderers, body rows, `$buttons` row actions, filter controls, and pagination together.

<template #example><table-size /></template>

<template #template>

@[code{198-223}](../../.vuepress/components/table/size.vue)

</template>

<template #script>

@[code{1-196}](../../.vuepress/components/table/size.vue)

</template>

<template #style>

@[code{225-245}](../../.vuepress/components/table/size.vue)

</template>

</card>
