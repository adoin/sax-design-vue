---
PROPS:
  - name: direction
    type: String
    values: horizontal | vertical
    description: Container flex direction.
    default: horizontal
  - name: size
    type: String | Number
    values: CSS size
    description: Header/Footer height or Aside width.
    default: null
description: "VXE-compatible application layout primitives."
---

# Layout

<card><template #example><layout-default /></template><template #template>

@[code{1-12}](../.vuepress/components/layout/default.vue)

</template></card>
