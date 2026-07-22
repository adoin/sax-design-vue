---
PROPS:
  - name: picker-type
    type: String
    values: date / month / quarter / year / week
    description: Panel selection mode.
    default: date
  - name: model-value
    type: Dayjs
    values: Dayjs instance
    description: Panel reference date.
    default: current date
  - name: selected-dates
    type: Array
    values: Dayjs[]
    description: Selected dates used for highlighting.
    default: '[]'
EVENTS:
  - name: pick / panel-change
    description: Pick a date or navigate to another panel date.
description: "Standalone calendar panel used by DatePicker."
---

# Date panel

<card><template #example><date-panel-default /></template><template #template>

@[code{1-2}](../.vuepress/components/date-panel/default.vue)

</template></card>
