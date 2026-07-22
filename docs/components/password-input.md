---
PROPS:
  - name: model-value/v-model
    type: String
    values: password
    description: Password value.
    default: "''"
  - name: show-password
    type: Boolean
    values: true / false
    description: Show visibility toggle.
    default: 'true'
  - name: clearable
    type: Boolean
    values: true / false
    description: Show clear action.
    default: 'false'
EVENTS:
  - name: change / clear
    description: Value changes and clear action.
description: "VXE-compatible password input."
---

# Password input

<card><template #example><password-input-default /></template><template #template>

@[code{1-5}](../.vuepress/components/password-input/default.vue)

</template></card>
