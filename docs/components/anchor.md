---
PROPS:
  - name: model-value/v-model
    type: String
    values: href
    description: Active anchor href.
    default: "''"
  - name: items
    type: Array
    values: '{ href, title, disabled? }[]'
    description: Anchor navigation items.
    default: '[]'
  - name: offset
    type: Number
    values: pixels
    description: Scroll offset used to determine the active anchor.
    default: '88'
  - name: direction
    type: String
    values: vertical / horizontal
    description: Anchor layout direction.
    default: vertical
EVENTS:
  - name: change
    description: Fired when the active anchor changes.
description: "VXE-compatible page anchor navigation."
---

# Anchor

<card><template #example><anchor-default /></template><template #template>

@[code{1-13}](../.vuepress/components/anchor/default.vue)

</template></card>
