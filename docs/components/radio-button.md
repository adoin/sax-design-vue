---
PROPS:
  - name: label
    type: String | Number | Boolean
    values: option value
    description: Value contributed to the containing radio group.
    default: '-'
  - name: v-model
    type: String | Number | Boolean
    values: Radio value
    description: Current selected value.
    default: null
  - name: value
    type: String | Number | Boolean
    values: Radio value
    description: This button value.
    default: "''"
  - name: disabled
    type: Boolean
    values: true / false
    description: Disable selection.
    default: 'false'
EVENTS:
  - name: change
    description: Fires after selecting the button.
description: "Radio button."
---

# Radio button

<card><template #example><radio-button-default /></template><template #template>

@[code{1-2}](../.vuepress/components/radio-button/default.vue)

</template></card>
