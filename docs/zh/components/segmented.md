---
PROPS:
  - name: model-value/v-model
    type: String | Number
    values: option value
    description: 当前选中的选项值。
    default: null
  - name: options
    type: Array
    values: '{ label, value, disabled? }[]'
    description: 分段选项定义。
    default: '[]'
EVENTS:
  - name: change
    description: 选项变化时触发。
description: "兼容 VXE 的分段单选控件。"
---
# Segmented 分段控制
<card><template #example><segmented-default /></template><template #template>

@[code{1-7}](../../.vuepress/components/segmented/default.vue)

</template></card>
