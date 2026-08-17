---
PROPS:
  - name: placeholder
    type: String
    values: 输入框提示
    description: 配置空状态提示文字。
    default: '-'
  - name: v-model
    type: String
    values: Iconify 名称（`prefix:name`）
    description: 当前选中的图标名称。
    default: "''"
  - name: icon-list
    type: Array
    values: string[]
    description: 可选择图标名。
    default: 常用 Carbon 图标
  - name: searchable
    type: Boolean
    values: true / false
    description: 显示图标搜索框。
    default: 'true'
EVENTS:
  - name: change / clear
    description: 选择与清空事件。
description: "图标选择器。"
---

# 图标选择器

<card><template #example><icon-picker-default /></template><template #template>

@[code{1-3}](../../.vuepress/components/icon-picker/default.vue)

</template></card>
