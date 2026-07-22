---
PROPS:
  - name: v-model
    type: String | Number | Boolean
    values: 单选值
    description: 选中项值。
    default: "''"
  - name: options
    type: Array
    values: RadioOption[]
    description: 声明式单选项。
    default: '[]'
  - name: type
    type: String
    values: default / button
    description: 标准或按钮形态。
    default: default
EVENTS:
  - name: change
    description: 选择时触发。
description: "VXE 风格单选组。"
---

# 单选组

<card><template #example><radio-group-default /></template><template #template>

@[code{1-2}](../../.vuepress/components/radio-group/default.vue)

</template></card>
