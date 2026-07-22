---
PROPS:
  - name: active
    type: Number
    values: index
    description: 当前激活步骤下标。
    default: '0'
  - name: items
    type: Array
    values: '{ title, description?, status?, disabled? }[]'
    description: 步骤项定义。
    default: '[]'
  - name: direction
    type: String
    values: horizontal / vertical
    description: 步骤布局方向。
    default: horizontal
  - name: simple
    type: Boolean
    values: true / false
    description: 使用紧凑展示。
    default: 'false'
EVENTS:
  - name: click
    description: 点击步骤时触发，返回下标和步骤项。
description: "兼容 VXE 的步骤条。"
---

# Steps 步骤条

<card><template #example><steps-default /></template><template #template>

@[code{1-15}](../../.vuepress/components/steps/default.vue)

</template></card>
