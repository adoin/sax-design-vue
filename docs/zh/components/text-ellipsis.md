---
PROPS:
  - name: content
    type: String
    values: text
    description: 未提供默认插槽时的截断文本。
    default: "''"
  - name: line-clamp
    type: Number
    values: lines
    description: 收起时显示的行数。
    default: '1'
  - name: expandable
    type: Boolean
    values: true / false
    description: 显示展开和收起操作。
    default: 'false'
description: "兼容 VXE 的可展开文本省略。"
---

# Text ellipsis 文本省略

<card><template #example><text-ellipsis-default /></template><template #template>

@[code{1-6}](../../.vuepress/components/text-ellipsis/default.vue)

</template></card>
