---
PROPS:
  - name: model-value/v-model
    type: String | Number
    values: node key
    description: Selected tree node key.
    default: null
  - name: data
    type: Array
    values: TreeNode[]
    description: Tree node definitions.
    default: '[]'
  - name: check-strictly
    type: Boolean
    values: true / false
    description: Allow selecting a non-leaf node.
    default: 'false'
  - name: clearable
    type: Boolean
    values: true / false
    description: Show clear action after selection.
    default: 'false'
EVENTS:
  - name: change / clear
    description: Selection and clear events.
description: "VXE-compatible tree select."
---

# Tree select

<card><template #example><tree-select-default /></template><template #template>

@[code{1-18}](../.vuepress/components/tree-select/default.vue)

</template></card>
