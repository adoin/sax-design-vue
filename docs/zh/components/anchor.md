---
PROPS:
  - name: model-value/v-model
    type: String
    values: href
    description: 当前激活锚点 href。
    default: "''"
  - name: items
    type: Array
    values: '{ href, title, disabled? }[]'
    description: 锚点导航项。
    default: '[]'
  - name: offset
    type: Number
    values: pixels
    description: 判定激活锚点使用的滚动偏移。
    default: '88'
  - name: direction
    type: String
    values: vertical / horizontal
    description: 锚点布局方向。
    default: vertical
EVENTS:
  - name: change
    description: 激活锚点变化时触发。
description: "兼容 VXE 的页面锚点导航。"
---

# Anchor 锚点

<card><template #example><anchor-default /></template><template #template>

@[code{1-13}](../../.vuepress/components/anchor/default.vue)

</template></card>
