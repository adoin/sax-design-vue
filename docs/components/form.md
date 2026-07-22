---
PROPS:
  - name: model
    type: Object
    values: form model
    description: Reactive form data.
    default: —
  - name: rules
    type: Object
    values: '{ [prop]: FormRule | FormRule[] }'
    description: Required and custom validation rules.
    default: '{}'
  - name: label-width
    type: String | Number
    values: CSS width
    description: Default label width for form items.
    default: '96'
  - name: inline
    type: Boolean
    values: true / false
    description: Render items in an inline flow.
    default: 'false'
METHODS:
  - name: validate / validateField
    description: Return a Promise<boolean> after running rules.
  - name: clearValidate / resetFields
    description: Clear errors or restore initial model values.
description: "VXE-compatible form validation container."
---

# Form

<card><template #example><form-default /></template><template #template>

@[code{1-19}](../.vuepress/components/form/default.vue)

</template></card>
