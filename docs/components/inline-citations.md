---
description: "Inline source triggers with keyboard-accessible floating previews."
PROPS:
  - name: "sources"
    type: "AgentSource[]"
    description: "Citation sources. publisher, date, icon and iconSrc customize the source card. Multiple sources can be paged with Previous/Next. Only absolute HTTP and HTTPS links are enabled."
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

@[code{23-30}](../.vuepress/components/inline-citations/default.vue)

</template>

<template #script>

@[code{1-21}](../.vuepress/components/inline-citations/default.vue)

</template>

<template #style>

@[code{32-45}](../.vuepress/components/inline-citations/default.vue)

</template>

</card>
