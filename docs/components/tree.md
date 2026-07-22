---
PROPS:
  - name: model-value/v-model
    type: String | Number
    values: node key
    description: Current node key.
    default: null
  - name: data
    type: Array
    values: TreeNode[]
    description: Tree data; nodes support key, label, children and disabled.
    default: '[]'
  - name: show-checkbox
    type: Boolean
    values: true / false
    description: Show checkbox selection.
    default: 'false'
  - name: check-strictly
    type: Boolean
    values: true / false
    description: Disable parent/child check linkage.
    default: 'false'
  - name: default-expand-all
    type: Boolean
    values: true / false
    description: Expand all nodes at initialization.
    default: 'false'
EVENTS:
  - name: node-click / node-expand / node-collapse
    description: Node interaction events.
  - name: update:checked-keys / check-change
    description: Checkbox state events.
SLOTS:
  - name: node
    description: Custom node label. Receives node and depth.
description: "VXE-compatible hierarchical tree control."
---

# Tree

<card><template #example><tree-default /></template><template #template>

@[code{1-27}](../.vuepress/components/tree/default.vue)

</template></card>
