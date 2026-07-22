---
PROPS:
  - name: content
    type: String | Number
    values: text
    description: Text when no default slot is supplied.
    default: null
  - name: ellipsis
    type: Boolean
    values: true | false
    description: Single-line ellipsis.
    default: false
  - name: line-clamp
    type: Number
    values: lines
    description: Multi-line truncation count.
    default: null
description: "Semantic text with VXE-style ellipsis support."
---

# Text

<card><template #example><text-default /></template><template #template>

@[code{1-10}](../.vuepress/components/text/default.vue)

</template></card>
