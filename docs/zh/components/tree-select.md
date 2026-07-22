---
PROPS:
  - name: model-value/v-model
    type: String | Number
    values: node key
    description: 选中的树节点键值。
    default: null
  - name: data
    type: Array
    values: TreeNode[]
    description: 树节点定义。
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
  - name: change / clear
    description: 选择和清空事件。
description: "兼容 VXE 的树形选择器。"
---

# Tree select 树形选择器

<card><template #example><tree-select-default /></template><template #template>

@[code{1-18}](../../.vuepress/components/tree-select/default.vue)

</template></card>
