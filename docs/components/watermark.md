---
PROPS:
  - name: content
    type: String
    values: text
    description: Text repeated across the content.
    default: —
  - name: gap
    type: Number
    values: pixels
    description: Spacing between watermark marks.
    default: '96'
  - name: opacity
    type: Number
    values: 0 - 1
    description: Watermark transparency.
    default: '0.12'
  - name: rotate
    type: Number
    values: degrees
    description: Rotation angle of the watermark layer.
    default: '-18'
description: "VXE-compatible content watermark."
---

# Watermark

<card><template #example><watermark-default /></template><template #template>

@[code{1-18}](../.vuepress/components/watermark/default.vue)

</template></card>
