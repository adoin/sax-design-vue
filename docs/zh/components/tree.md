---
PROPS:
  - name: model-value/v-model
    type: String | Number
    values: node key
    description: 当前节点键值。
    default: null
  - name: data
    type: Array
    values: TreeNode[]
    description: 树数据，节点支持 key、label、children、disabled。
    default: '[]'
  - name: show-checkbox
    type: Boolean
    values: true / false
    description: 显示复选框。
    default: 'false'
  - name: check-strictly
    type: Boolean
    values: true / false
    description: 禁用父子勾选联动。
    default: 'false'
  - name: default-expand-all
    type: Boolean
    values: true / false
    description: 初始化时展开全部节点。
    default: 'false'
EVENTS:
  - name: node-click / node-expand / node-collapse
    description: 节点交互事件。
  - name: update:checked-keys / check-change
    description: 勾选状态事件。
SLOTS:
  - name: node
    description: 自定义节点文本，接收 node 和 depth。
description: "兼容 VXE 的树形控件。"
---

# Tree 树形控件

<card><template #example><tree-default /></template><template #template>

@[code{1-27}](../../.vuepress/components/tree/default.vue)

</template></card>
