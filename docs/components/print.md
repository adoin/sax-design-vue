---
PROPS:
  - name: title
    type: String
    values: "Document title"
    description: Print window title.
    default: document title
  - name: print-style
    type: String
    values: "CSS text"
    description: Extra CSS added to the print window.
    default: "''"
  - name: auto-close
    type: Boolean
    values: "true / false"
    description: Close the print window after printing.
    default: 'true'
METHODS:
  - name: print
    description: Open a print window containing default slot content.
EVENTS:
  - name: before-print
    description: Print lifecycle events.
  - name: after-print
    description: Print lifecycle events.
  - name: error
    description: Print lifecycle events.
description: "Scoped print container."
---

# Print

<card>

## Invoice preview

The screen preview follows the current theme. Printed output uses a white surface and dark text, keeping the night preview background off the page.

<template #example><print-default /></template>

<template #template>

@[code{6-17}](../.vuepress/components/print/default.vue)

</template>

<template #script>

@[code{1-4}](../.vuepress/components/print/default.vue)

</template>

<template #style>

@[code{19-61}](../.vuepress/components/print/default.vue)

</template>

</card>
