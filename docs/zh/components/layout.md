---
PROPS:
  - name: direction
    type: String
    values: horizontal | vertical
    description: 容器 Flex 方向。
    default: horizontal
  - name: size
    type: String | Number
    values: CSS size
    description: Header/Footer 高度或 Aside 宽度。
    default: null
description: "兼容 VXE 的应用布局原语。"
---

# Layout 布局

<card><template #example><layout-default /></template><template #template>

@[code{1-12}](../../.vuepress/components/layout/default.vue)

</template></card>
