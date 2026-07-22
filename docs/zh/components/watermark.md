---
PROPS:
  - name: content
    type: String
    values: text
    description: 重复展示的水印文字。
    default: —
  - name: gap
    type: Number
    values: pixels
    description: 水印之间的间隔。
    default: '96'
  - name: opacity
    type: Number
    values: 0 - 1
    description: 水印透明度。
    default: '0.12'
  - name: rotate
    type: Number
    values: degrees
    description: 水印层旋转角度。
    default: '-18'
description: "兼容 VXE 的内容水印。"
---

# Watermark 水印

<card><template #example><watermark-default /></template><template #template>

@[code{1-18}](../../.vuepress/components/watermark/default.vue)

</template></card>
