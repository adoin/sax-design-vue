---
PROPS:
  - name: href
    type: String
    values: URL
    description: Link destination.
    default: null
  - name: type / status
    type: String
    values: primary | success | warning | danger | info
    description: Semantic color. `status` is the VXE-compatible alias.
    default: primary
  - name: underline
    type: Boolean
    values: true | false
    description: Shows underline on hover.
    default: true
description: "Text link compatible with VXE Link semantic status."
---

# Link

<card><template #example><link-default /></template><template #template>

@[code{1-9}](../.vuepress/components/link/default.vue)

</template></card>
