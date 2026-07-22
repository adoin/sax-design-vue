---
PROPS:
  - name: content
    type: String | Number
    values: text
    description: 未传默认插槽时的文本。
    default: null
  - name: ellipsis
    type: Boolean
    values: true | false
    description: 单行省略。
    default: false
  - name: line-clamp
    type: Number
    values: lines
    description: 多行省略行数。
    default: null
description: "带 VXE 风格省略能力的语义文本。"
---

# Text 文本

<card><template #example><text-default /></template><template #template>

@[code{1-10}](../../.vuepress/components/text/default.vue)

</template></card>
