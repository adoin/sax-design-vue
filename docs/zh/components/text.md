---
PROPS:
  - name: tag / status
    type: String / String
    values: 语义 HTML 标签 / 主题状态
    description: 选择渲染元素和语义颜色状态。
    default: 'span / -'
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
description: "支持省略能力的语义文本。"
---

# Text 文本

<card><template #example><text-default /></template><template #template>

@[code{1-10}](../../.vuepress/components/text/default.vue)

</template></card>
