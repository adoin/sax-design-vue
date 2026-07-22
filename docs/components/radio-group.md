---
PROPS:
  - name: v-model
    type: String | Number | Boolean
    values: Radio value
    description: Selected option value.
    default: "''"
  - name: options
    type: Array
    values: RadioOption[]
    description: Declarative radio options.
    default: '[]'
  - name: type
    type: String
    values: default / button
    description: Standard or button presentation.
    default: default
EVENTS:
  - name: change
    description: Fires on selection.
description: "VXE-style radio group."
---

# Radio group

<card><template #example><radio-group-default /></template><template #template>

@[code{1-2}](../.vuepress/components/radio-group/default.vue)

</template></card>
