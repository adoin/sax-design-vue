---
PROPS:
  - name: label
    type: String | Number | Boolean
    values: option value
    description: Value contributed to the containing checkbox group.
    default: '-'
  - name: v-model
    type: Boolean | Array
    values: Checked state or selected values.
    description: Button checkbox value.
    default: 'false'
  - name: value
    type: String | Number
    values: Checkbox value
    description: Value appended to array models.
    default: "''"
EVENTS:
  - name: change
    description: Fires after toggling.
description: "Checkbox button."
---

# Checkbox button

<card><template #example><checkbox-button-default /></template><template #template>

@[code{1-2}](../.vuepress/components/checkbox-button/default.vue)

</template></card>
