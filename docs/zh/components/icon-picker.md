---
PROPS:
  - name: v-model
    type: String
    values: Material 图标名
    description: 已选图标名。
    default: "''"
  - name: icon-list
    type: Array
    values: string[]
    description: 可选择图标名。
    default: 常用 Material 图标
  - name: searchable
    type: Boolean
    values: true / false
    description: 显示图标搜索框。
    default: 'true'
EVENTS:
  - name: change / clear
    description: 选择与清空事件。
description: "VXE 风格图标选择器。"
---

# 图标选择器

<card><template #example><icon-picker-default /></template><template #template>

@[code{1-3}](../../.vuepress/components/icon-picker/default.vue)

</template></card>
