---
description: "Inline source triggers with keyboard-accessible floating previews."
PROPS:
  - name: "sources"
    type: "AgentSource[]"
    description: "Citation sources. Only absolute HTTP and HTTPS links are enabled."
    default: "[]"
    usage: "#default"
  - name: "label"
    type: "String"
    description: "Accessible name, with a localized default."
    default: null
    usage: "#default"
  - name: "disabled"
    type: "Boolean"
    description: "Disable component actions."
    default: "false"
    usage: "#default"
  - name: "shape"
    type: "'rounded' | 'square'"
    description: "Geometry resolved from the component and SConfigProvider."
    default: null
    usage: "#shape"
EVENTS:
  - name: "open"
    type: "() => void"
    description: "Source preview opened."
  - name: "source-click"
    type: "(source: AgentSource) => void"
    description: "A safe source link selected."
SLOTS:
  - name: "trigger"
    type: "{ sources: AgentSource[] }"
    description: "Customize content inside the built-in accessible trigger."
  - name: "source"
    type: "{ source: AgentSource }"
    description: "Customize a source preview entry."
---

# Inline Citations

<card>

## Default

Click or press Enter on the source label to review the source list. The shared floating layer stays available outside scroll containers. Unsupported URL protocols render a source title without a link.

<template #example><inline-citations-default /></template>

<template #template>

@[code{19-26}](../.vuepress/components/inline-citations/default.vue)

</template>

<template #script>

@[code{1-17}](../.vuepress/components/inline-citations/default.vue)

</template>

<template #style>

@[code{28-41}](../.vuepress/components/inline-citations/default.vue)

</template>

</card>

<card>

## Shape

Compare rounded and square geometry side by side. Both previews share controlled state so the same content and actions can be compared. Omitting shape follows the global configuration.

<template #example><inline-citations-shape /></template>

<template #template>

@[code{19-36}](../.vuepress/components/inline-citations/shape.vue)

</template>

<template #script>

@[code{1-17}](../.vuepress/components/inline-citations/shape.vue)

</template>

<template #style>

@[code{38-57}](../.vuepress/components/inline-citations/shape.vue)

</template>

</card>
