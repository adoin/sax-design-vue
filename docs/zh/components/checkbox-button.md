---
PROPS:
  - name: label
    type: String | Number | Boolean
    values: 选项值
    description: 作为 Checkbox group 中的选项值。
    default: '-'
  - name: v-model
    type: Boolean | Array
    values: 选中状态或选中值。
    description: 按钮复选值。
    default: 'false'
  - name: value
    type: String | Number
    values: 复选值
    description: 数组模型中追加的值。
    default: "''"
EVENTS:
  - name: change
    description: 切换后触发。
description: "按钮复选。"
---

# 按钮复选

<card><template #example><checkbox-button-default /></template><template #template>

@[code{1-2}](../../.vuepress/components/checkbox-button/default.vue)

</template></card>
