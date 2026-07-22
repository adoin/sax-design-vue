---
PROPS:
  - name: v-model
    type: String | Number
    values: Menu key
    description: Selected menu key.
    default: null
  - name: options
    type: Array
    values: MenuOption[]
    description: Menu tree data.
    default: '[]'
  - name: mode
    type: String
    values: vertical / horizontal
    description: Main layout direction.
    default: vertical
  - name: default-openeds
    type: Array
    values: MenuKey[]
    description: Initially expanded branches.
    default: '[]'
EVENTS:
  - name: select / open / close
    description: Select or expand state events.
description: "VXE-style nested navigation menu."
---

# Menu

<card><template #example><menu-default /></template><template #template>

@[code{1-6}](../.vuepress/components/menu/default.vue)

</template></card>
