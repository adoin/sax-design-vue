---
PROPS:
  - name: v-model
    type: String | Number | Boolean
    values: 单选值
    description: 当前选中值。
    default: null
  - name: value
    type: String | Number | Boolean
    values: 单选值
    description: 当前按钮值。
    default: "''"
  - name: disabled
    type: Boolean
    values: true / false
    description: 禁用选择。
    default: 'false'
EVENTS:
  - name: change
    description: 选中按钮后触发。
description: "VXE 风格按钮单选。"
---

# 按钮单选

<card><template #example><radio-button-default /></template><template #template>

@[code{1-2}](../../.vuepress/components/radio-button/default.vue)

</template></card>
