---
PROPS:
  - name: min-width
    type: Number | String
    values: CSS length
    description: Set the minimum menu width.
    default: '160'
  - name: items
    type: Array
    values: ContextMenuItem[]
    description: Menu item definitions.
    default: '[]'
  - name: v-model
    type: Boolean
    values: true / false
    description: Controls menu visibility.
    default: 'false'
  - name: disabled
    type: Boolean
    values: true / false
    description: Disable the context trigger.
    default: 'false'
EVENTS:
  - name: select / open / close
    description: Item selection and visibility events.
description: "Right-click context menu."
---

# Context menu

<card><template #example><context-menu-default /></template><template #template>

@[code{1-147}](../.vuepress/components/context-menu/default.vue)

</template></card>
