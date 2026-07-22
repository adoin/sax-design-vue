---
PROPS:
  - name: v-model
    type: String | Number
    values: 菜单键
    description: 选中菜单键。
    default: null
  - name: options
    type: Array
    values: MenuOption[]
    description: 菜单树数据。
    default: '[]'
  - name: mode
    type: String
    values: vertical / horizontal
    description: 主布局方向。
    default: vertical
  - name: default-openeds
    type: Array
    values: MenuKey[]
    description: 初始展开分支。
    default: '[]'
EVENTS:
  - name: select / open / close
    description: 选择与展开状态事件。
description: "VXE 风格嵌套导航菜单。"
---

# 菜单

<card><template #example><menu-default /></template><template #template>

@[code{1-6}](../../.vuepress/components/menu/default.vue)

</template></card>
