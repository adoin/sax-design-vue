---
PROPS:
  - name: model-value/v-model
    type: Array
    values: CascaderValue[]
    description: 当前选项值路径。
    default: '[]'
  - name: options
    type: Array
    values: '{ value, label, children?, disabled? }[]'
    description: 层级选项定义。
    default: '[]'
  - name: check-strictly
    type: Boolean
    values: true / false
    description: 允许选择非叶子节点。
    default: 'false'
  - name: clearable
    type: Boolean
    values: true / false
    description: 选中后显示清空操作。
    default: 'false'
EVENTS:
  - name: change
    description: 选择时触发，返回路径和选项。
description: "兼容 VXE 的级联选择器。"
---

# Cascader 级联选择器

<card><template #example><cascader-default /></template><template #template>

@[code{1-19}](../../.vuepress/components/cascader/default.vue)

</template></card>
