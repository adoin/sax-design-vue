---
PROPS:
  - name: model-value/v-model
    type: Boolean
    values: true | false
    description: Drawer visibility.
    default: false
  - name: placement
    type: String
    values: left | right | top | bottom
    description: Drawer edge.
    default: right
  - name: size
    type: String | Number
    values: CSS size
    description: Drawer width or height.
    default: 360px
  - name: mask-closable
    type: Boolean
    values: true | false
    description: Allows backdrop closing.
    default: true
description: "VXE-compatible directional drawer."
---
# Drawer
<card><template #example><drawer-default /></template><template #template>

@[code{1-12}](../.vuepress/components/drawer/default.vue)

</template></card>
