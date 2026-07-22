---
PROPS:
  - name: model
    type: Object
    values: form model
    description: 响应式表单数据。
    default: —
  - name: rules
    type: Object
    values: '{ [prop]: FormRule | FormRule[] }'
    description: 必填和自定义校验规则。
    default: '{}'
  - name: label-width
    type: String | Number
    values: CSS width
    description: 表单项默认标签宽度。
    default: '96'
  - name: inline
    type: Boolean
    values: true / false
    description: 行内布局表单项。
    default: 'false'
METHODS:
  - name: validate / validateField
    description: 执行校验并返回 Promise<boolean>。
  - name: clearValidate / resetFields
    description: 清除错误或恢复初始表单值。
description: "兼容 VXE 的表单校验容器。"
---

# Form 表单

<card><template #example><form-default /></template><template #template>

@[code{1-19}](../../.vuepress/components/form/default.vue)

</template></card>
