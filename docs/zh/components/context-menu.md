---
PROPS:
  - name: min-width
    type: Number | String
    values: CSS 长度
    description: 设置菜单最小宽度。
    default: '160'
  - name: items
    type: Array
    values: ContextMenuItem[]
    description: 菜单项配置。
    default: '[]'
  - name: v-model
    type: Boolean
    values: true / false
    description: 控制菜单显示状态。
    default: 'false'
  - name: disabled
    type: Boolean
    values: true / false
    description: 禁用右键触发。
    default: 'false'
EVENTS:
  - name: select / open / close
    description: 选择菜单项与显示状态事件。
description: "右键菜单。"
---

# 右键菜单

<card><template #example><context-menu-default /></template><template #template>

@[code{1-147}](../../.vuepress/components/context-menu/default.vue)

</template></card>
