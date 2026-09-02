---
PROPS:
  - name: status
    type: String
    values: "success | warning | error | info"
    description: Semantic result state.
    default: info
  - name: title
    type: String
    values: "text"
    description: Result heading.
    default: null
  - name: description
    type: String
    values: "text"
    description: Supporting result copy.
    default: null
  - name: content
    type: String
    values: "text"
    description: Supporting result copy.
    default: null
description: "Result feedback state."
---

# Result

<card><template #example><result-default /></template>

<template #template>

@[code{1-9}](../.vuepress/components/result/default.vue)

</template>

</card>
