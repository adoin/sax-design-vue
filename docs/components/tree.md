---
PROPS:
  - name: node-key / label / children
    type: String
    values: data field names
    description: Map node identity, label and child fields from custom tree data.
    default: 'id / label / children'
  - name: default-checked-keys / default-expanded-keys / highlight-current
    type: Array / Boolean
    values: node keys / true | false
    description: Configure initial selection, expansion and current-node highlighting.
    default: '[] / [] / false'
  - name: empty-text / indent / expand-on-click-node
    type: String / Number / Boolean
    values: empty copy / pixels / true | false
    description: Configure empty state text, nesting indent and expansion behavior.
    default: '-'
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
description: "Hierarchical tree control."
---

# Tree

<card><template #example><tree-default /></template>

<template #template>

@[code{1-13}](../.vuepress/components/tree/default.vue)

</template>

<template #script>

@[code{15-34}](../.vuepress/components/tree/default.vue)

</template>

<template #style>

@[code{36-42}](../.vuepress/components/tree/default.vue)

</template>

</card>
