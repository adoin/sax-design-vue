---
PROPS:
  - name: v-model
    type: Boolean
    values: true / false
    description: Controls dropdown visibility.
    default: 'false'
  - name: trigger
    type: String
    values: click / hover / focus / contextmenu
    description: Open trigger.
    default: click
  - name: placement
    type: String
    values: Popper placement
    description: Dropdown position.
    default: bottom-start
EVENTS:
  - name: show / hide
    description: Visibility lifecycle events.
description: "VXE-style generic dropdown container."
---

# Pulldown

<card><template #example><pulldown-default /></template><template #template>

@[code{1-4}](../.vuepress/components/pulldown/default.vue)

</template></card>
