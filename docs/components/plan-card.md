---
description: "Review a structured plan and approve or reject it explicitly."
PROPS:
  - name: "auto-approve"
    type: "Number"
    description: "Automatic approval delay in seconds; 0 disables it. Cancelling stops the timer without rejecting the plan. Configuration or plan changes restart it."
    default: "0"
    usage: "#automatic-approval"
  - name: "title"
    type: "String"
    description: "Heading text; process lists use a localized fallback."
    default: "''"
    usage: "#default"
  - name: "description"
    type: "String"
    description: "Supporting plan text."
    default: null
    usage: "#default"
  - name: "tasks"
    type: "AgentTask[]"
    description: "Tasks with stable ids, status and optional progress."
    default: "[]"
    usage: "#default"
  - name: "content"
    type: "String"
    description: "Additional plan text included in the download; View plan does not reveal it."
    default: null
    usage: "#default"
  - name: "v-model:expanded"
    type: "Boolean"
    description: "Controlled task list disclosure; View plan and more tasks share this state."
    default: "false"
    usage: "#default"
  - name: "expanded"
    type: "Boolean"
    description: "Controlled task list disclosure; View plan and more tasks share this state."
    default: "false"
    usage: "#default"
  - name: "status"
    type: "'pending' | 'approved' | 'rejected'"
    description: "Controlled process or review state."
    default: "pending"
    usage: "#default"
  - name: "disabled"
    type: "Boolean"
    description: "Disable component actions."
    default: "false"
    usage: "#default"
EVENTS:
  - name: "cancel-auto-approve"
    type: "() => void"
    description: "The user cancelled the automatic approval countdown."
  - name: "auto-approve"
    type: "() => void"
    description: "The countdown requests approval and also emits approve."
  - name: "update:expanded"
    type: "(value: boolean) => void"
    description: "Disclosure toggle requested."
  - name: "approve"
    type: "() => void"
    description: "Approve the pending plan."
  - name: "reject"
    type: "() => void"
    description: "Reject the proposed changes or plan."
  - name: "download"
    type: "() => void"
    description: "Download action requested; image results provide their URL."
SLOTS:
  - name: "default"
    description: "Always-visible supplementary content, independent of task disclosure."
  - name: "actions"
    type: "{ status: 'pending' | 'approved' | 'rejected' }"
    description: "Customize the action row."
---

# Plan Card

<card>

## Default

A plan remains pending until the consumer changes its status. View plan and more tasks expand the same task list through v-model:expanded. Use approve or reject to connect your execution policy. Download exports the provided plan text; approval never starts a service inside the component.

<template #example><plan-card-default /></template>

<template #template>

@[code{15-30}](../.vuepress/components/plan-card/default.vue)

</template>

<template #script>

@[code{1-13}](../.vuepress/components/plan-card/default.vue)

</template>

<template #style>

@[code{32-45}](../.vuepress/components/plan-card/default.vue)

</template>

</card>

<card>

## Automatic approval

Set auto-approve to show a circular countdown and emit approve when it finishes. Click the countdown to cancel it. Manual approval, rejection, disabling and unmounting stop the timer. The application owns status and execution; the component does not call services.

<template #example><plan-card-auto-approve /></template>

<template #template>

@[code{20-38}](../.vuepress/components/plan-card/auto-approve.vue)

</template>

<template #script>

@[code{1-19}](../.vuepress/components/plan-card/auto-approve.vue)

</template>

<template #style>

@[code{39-51}](../.vuepress/components/plan-card/auto-approve.vue)

</template>

</card>
