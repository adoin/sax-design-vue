---
PROPS:
  - name: active
    type: Number
    values: "index"
    description: Current step index. Supports v-model:active.
    default: '0'
  - name: items
    type: StepItem[]
    values: "{ key?, title, description?, meta?, status?, statusLabel?, disabled?, clickable?, icon? }[]"
    description: Step data.
    default: '[]'
  - name: variant
    type: String
    values: "rail / timeline"
    description: Focus rail or contextual timeline.
    default: rail
  - name: direction
    type: String
    values: "horizontal / vertical"
    description: Layout direction. Timeline defaults to vertical.
    default: inferred from variant
  - name: size
    type: String
    values: "small / default / large"
    description: Step size.
    default: default
  - name: finish-status
    type: StepStatus
    values: "wait / process / finish / success / error / loading / disabled"
    description: Status used for completed steps.
    default: finish
  - name: process-status
    type: StepStatus
    values: "wait / process / finish / success / error / loading / disabled"
    description: Status used for the current step.
    default: process
  - name: status-labels
    type: Partial<Record<StepStatus, string>>
    values: "object"
    description: Overrides the built-in localized label for each status.
    default: '{}'
  - name: clickable
    type: Boolean
    values: "true / false"
    description: Allow selecting steps by click.
    default: 'true'
  - name: show-progress
    type: Boolean
    values: "true / false"
    description: Show the connecting progress rail.
    default: 'true'
  - name: show-step-index
    type: Boolean
    values: "true / false"
    description: Show the position on the active step.
    default: 'true'
  - name: responsive
    type: Boolean
    values: "true / false"
    description: Stack a horizontal rail on small screens.
    default: 'true'
  - name: simple
    type: Boolean
    values: "true / false"
    description: Remove the rail for full item-slot layouts.
    default: 'false'
  - name: aria-label
    type: String
    values: "text"
    description: Accessible name for the step navigation.
    default: null
EVENTS:
  - name: update:active
    description: Fired when the active step changes. Supports v-model:active.
  - name: change
    description: Fired with the next index and step item after a change.
  - name: click
    description: Fired with the index and item when an enabled step is clicked.
SLOTS:
  - name: item
    description: Replaces a whole step. Receives item, index, status, statusLabel, icon, active, disabled, and interactive.
  - name: icon
    description: Custom marker icon. Receives the item slot props.
  - name: title
    description: Custom text regions. Receive the item slot props.
  - name: description
    description: Custom text regions. Receive the item slot props.
  - name: meta
    description: Custom text regions. Receive the item slot props.
  - name: content
    description: Context content for the active timeline step.
  - name: actions
    description: Action region for the active timeline step.
description: 'Steps with a focus rail, contextual timeline, semantic states, and composable content.'
---

# Steps

<card>

## Focus rail

For linear flows such as onboarding and configuration, with a strong active-step focus.

<template #example><steps-default /></template>

<template #template>

@[code{85-101}](../.vuepress/components/steps/default.vue)

</template>

<template #script>

@[code{1-83}](../.vuepress/components/steps/default.vue)

</template>

<template #style>

@[code{103-115}](../.vuepress/components/steps/default.vue)

</template>

</card>

<card>

## Context timeline

The active step can reveal details and actions for longer operational flows.

<template #example><steps-timeline /></template>

<template #template>

@[code{70-88}](../.vuepress/components/steps/timeline.vue)

</template>

<template #script>

@[code{1-68}](../.vuepress/components/steps/timeline.vue)

</template>

<template #style>

@[code{90-96}](../.vuepress/components/steps/timeline.vue)

</template>

</card>

<card>

## Custom item

Use the `item` slot to replace each step with a tile or another custom layout.

<template #example><steps-custom-item /></template>

<template #template>

@[code{53-79}](../.vuepress/components/steps/custom-item.vue)

</template>

<template #script>

@[code{1-51}](../.vuepress/components/steps/custom-item.vue)

</template>

<template #style>

@[code{81-155}](../.vuepress/components/steps/custom-item.vue)

</template>

</card>

<card>

## States

Wait, process, loading, finish, success, error, and disabled states are built in.

<template #example><steps-states /></template>

<template #template>

@[code{37-45}](../.vuepress/components/steps/states.vue)

</template>

<template #script>

@[code{1-35}](../.vuepress/components/steps/states.vue)

</template>

</card>
