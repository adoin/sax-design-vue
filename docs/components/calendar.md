---
PROPS:
  - name: model-value/v-model
    type: String | String[]
    values: YYYY-MM-DD
    description: Selected date or selected date range.
    default: "''"
  - name: range
    type: Boolean
    values: true / false
    description: Select a date range.
    default: 'false'
  - name: first-day-of-week
    type: Number
    values: 0 - 6
    description: Week start day, 0 for Sunday and 1 for Monday.
    default: '1'
  - name: disabled-date
    type: Function
    values: '(date) => boolean'
    description: Disable matching dates.
    default: —
  - name: show-week-number
    type: Boolean
    values: true / false
    description: Show ISO week numbers.
    default: 'false'
EVENTS:
  - name: change / panel-change
    description: Selection and viewed month change events.
SLOTS:
  - name: date-cell
    description: Custom cell content. Receives CalendarCell.
description: "VXE-compatible standalone calendar."
---

# Calendar

<card><template #example><calendar-default /></template><template #template>

@[code{1-14}](../.vuepress/components/calendar/default.vue)

</template></card>
