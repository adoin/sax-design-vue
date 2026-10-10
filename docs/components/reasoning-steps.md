---
description: "Collapsible reasoning stages with controlled process state and sources."
PROPS:
  - name: "steps"
    type: "AgentTask[]"
    description: "Ordered steps with stable ids and externally controlled status."
    default: "[]"
    usage: "#default"
  - name: "v-model:expanded"
    type: "Boolean"
    description: "Controlled disclosure state. Use v-model:expanded to respond to toggles."
    default: "true"
    usage: "#default"
  - name: "expanded"
    type: "Boolean"
    description: "Controlled disclosure state. Use v-model:expanded to respond to toggles."
    default: "true"
    usage: "#default"
  - name: "title"
    type: "String"
    description: "Heading text; process lists use a localized fallback."
    default: null
    usage: "#default"
  - name: "sources"
    type: "AgentSource[]"
    description: "Citation sources. Only absolute HTTP and HTTPS links are enabled."
    default: "[]"
    usage: "#default"
  - name: "shape"
    type: "'rounded' | 'square'"
    description: "Geometry resolved from the component and SConfigProvider."
    default: null
    usage: "#shape"
EVENTS:
  - name: "update:expanded"
    type: "(value: boolean) => void"
    description: "Disclosure toggle requested."
  - name: "step-click"
    type: "(step: AgentTask) => void"
    description: "Step selected."
SLOTS:
  - name: "default"
    description: "Replace the default content."
  - name: "step"
    type: "{ step: AgentTask }"
    description: "Customize a step description."
---

# Reasoning Steps

<card>

## Default

Update step status as work proceeds. Expansion is controlled and selecting a step emits its descriptor. Sources use safe absolute links.

<template #example><reasoning-steps-default /></template>

<template #template>

@[code{31-36}](../.vuepress/components/reasoning-steps/default.vue)

</template>

<template #script>

@[code{1-29}](../.vuepress/components/reasoning-steps/default.vue)

</template>

<template #style>

@[code{38-51}](../.vuepress/components/reasoning-steps/default.vue)

</template>

</card>

<card>

## Shape

Compare rounded and square geometry side by side. Both previews share controlled state so the same content and actions can be compared. Omitting shape follows the global configuration.

<template #example><reasoning-steps-shape /></template>

<template #template>

@[code{31-52}](../.vuepress/components/reasoning-steps/shape.vue)

</template>

<template #script>

@[code{1-29}](../.vuepress/components/reasoning-steps/shape.vue)

</template>

<template #style>

@[code{54-73}](../.vuepress/components/reasoning-steps/shape.vue)

</template>

</card>
