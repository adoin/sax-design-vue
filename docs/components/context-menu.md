---
PROPS:
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
description: "VXE-style right-click context menu."
---

# Context menu

<card><template #example><context-menu-default /></template><template #template>

@[code{1-19}](../.vuepress/components/context-menu/default.vue)

</template></card>
