---
PROPS:
  - name: expand-text / collapse-text
    type: String
    values: action labels
    description: Customize labels used to expand and collapse content.
    default: 'Expand / Collapse'
  - name: content
    type: String
    values: text
    description: Text to truncate when no default slot is supplied.
    default: "''"
  - name: line-clamp
    type: Number
    values: lines
    description: Number of visible lines when collapsed.
    default: '1'
  - name: expandable
    type: Boolean
    values: true / false
    description: Show expand and collapse action.
    default: 'false'
description: "Expandable text ellipsis."
---

# Text ellipsis

<card><template #example><text-ellipsis-default /></template><template #template>

@[code{1-6}](../.vuepress/components/text-ellipsis/default.vue)

</template></card>
