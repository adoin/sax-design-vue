---
PROPS:
  - name: v-model / model-value
    type: '[DateLike, DateLike] | null'
    values: date range
    description: Selected start and end values.
    default: 'null'
  - name: label-format / value-format
    type: String
    values: Day.js format tokens
    description: Format input text and emitted values independently.
    default: type-based
  - name: min-date / max-date / start-date / end-date
    type: Date | string | number
    values: date-like
    description: Restrict selectable dates and the initial panel range.
    default: '-'
  - name: show-clear-button / show-confirm-button
    type: Boolean
    values: true | false
    description: Control footer action visibility.
    default: true
  - name: popup-config
    type: Object
    values: placement | transfer | width | height | zIndex | className
    description: Configure popup placement, mounting, size, layer and class.
    default: '-'
EVENTS:
  - name: change
    description: Fired after a complete range is selected or confirmed.
  - name: focus / blur / clear
    description: Forwarded input focus, blur and clear events.
description: 'A focused Date picker entry that always selects a start and end date.'
---

# Date range picker

`s-date-range-picker` forwards Date picker capabilities while fixing
`type="daterange"`. Use [Date picker](./date-picker.md) for the complete shared
property reference.

<card><template #example><date-range-picker-default /></template><template #template>

@[code{1-5}](../.vuepress/components/date-range-picker/default.vue)

</template></card>
