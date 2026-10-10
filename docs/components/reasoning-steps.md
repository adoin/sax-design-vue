---
description: "Collapsible reasoning stages with controlled process state and sources."
PROPS:
  - name: reasoning
    type: "string[]"
    description: "Incrementally appended reasoning paragraphs. Replaces source chips while running; expands from the completed summary."
    default: "[]"
    usage: '#default'
  - name: duration
    type: "Number"
    description: "Elapsed seconds in the completed summary. Omit to measure the current run locally."
    default: null
    usage: '#default'
  - name: "steps"
    type: "AgentTask[]"
    description: "Ordered steps with stable ids and externally controlled status."
    default: "[]"
    usage: "#default"
  - name: "v-model:expanded"
    type: "Boolean"
    description: "Controlled disclosure state. Use v-model:expanded to respond to toggles."
    default: "false"
    usage: "#default"
  - name: "expanded"
    type: "Boolean"
    description: "Controlled disclosure state. Use v-model:expanded to respond to toggles."
    default: "false"
    usage: "#default"
  - name: "title"
    type: "String"
    description: "Summary override; otherwise shows the running step, failed step, or final step."
    default: null
    usage: "#default"
  - name: "sources"
    type: "AgentSource[]"
    description: "Source chips. icon accepts an SIcon name; iconSrc accepts a PNG/SVG URL and takes precedence. Only absolute HTTP and HTTPS links are enabled."
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
  - name: source-icon
    type: Slot
    scope: '{ source: AgentSource }'
    description: 'Custom source icon; takes precedence over source iconSrc and icon.'
  - name: "default"
    description: "Replace the default content."
  - name: "step"
    type: "{ step: AgentTask }"
    description: "Customize a step description."
---

# Reasoning Steps

<card>

## Default

Shows the current stage and source chips, then displays incoming reasoning paragraphs. Once all steps complete, the body collapses into a duration summary; select it to review the reasoning. This replayable local demo updates data on a schedule; applications supply real process state and content.

<template #example><reasoning-steps-default /></template>

<template #template>

@[code{73-83}](../.vuepress/components/reasoning-steps/default.vue)

</template>

<template #script>

@[code{1-71}](../.vuepress/components/reasoning-steps/default.vue)

</template>

<template #style>

@[code{85-95}](../.vuepress/components/reasoning-steps/default.vue)

</template>

</card>

<card>

## Shape

Compare rounded and square geometry side by side. Both previews share controlled state so the same content and actions can be compared. Omitting shape follows the global configuration.

<template #example><reasoning-steps-shape /></template>

<template #template>

@[code{31-58}](../.vuepress/components/reasoning-steps/shape.vue)

</template>

<template #script>

@[code{1-29}](../.vuepress/components/reasoning-steps/shape.vue)

</template>

<template #style>

@[code{60-79}](../.vuepress/components/reasoning-steps/shape.vue)

</template>

</card>
