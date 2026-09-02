---
PROPS:
  - name: color
    type: String
    values: Sax Design theme color / RGB / HEX / HSL
    description: Accent color for selected and interactive panel states.
    default: primary
  - name: picker-type
    type: String
    values: 'date / month / quarter / year / week'
    description: Panel selection mode.
    default: date
  - name: model-value
    type: Dayjs
    values: 'Dayjs instance'
    description: Panel reference date.
    default: current date
  - name: selected-dates
    type: Array
    values: 'Dayjs[]'
    description: Selected dates used for highlighting.
    default: '[]'
EVENTS:
  - name: pick
    description: Pick a date or navigate to another panel date.
  - name: panel-change
    description: Pick a date or navigate to another panel date.
description: 'Standalone calendar panel used by DatePicker.'
---

# Date panel

<card><template #example><date-panel-default /></template>

<template #template>

@[code{1-8}](../.vuepress/components/date-panel/default.vue)

</template>

<template #script>

@[code{9-14}](../.vuepress/components/date-panel/default.vue)

</template>

</card>
