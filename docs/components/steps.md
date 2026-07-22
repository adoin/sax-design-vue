---
PROPS:
  - name: active
    type: Number
    values: index
    description: Current active step index.
    default: '0'
  - name: items
    type: Array
    values: '{ title, description?, status?, disabled? }[]'
    description: Step item definitions.
    default: '[]'
  - name: direction
    type: String
    values: horizontal / vertical
    description: Steps layout direction.
    default: horizontal
  - name: simple
    type: Boolean
    values: true / false
    description: Use compact presentation.
    default: 'false'
EVENTS:
  - name: click
    description: Fired with the clicked item index and item.
description: "VXE-compatible progress steps."
---

# Steps

<card><template #example><steps-default /></template><template #template>

@[code{1-15}](../.vuepress/components/steps/default.vue)

</template></card>
