---
PROPS:
  - name: model-value/v-model
    type: Boolean
    values: true | false
    description: 抽屉可见状态。
    default: false
  - name: placement
    type: String
    values: left | right | top | bottom
    description: 抽屉出现方向。
    default: right
  - name: size
    type: String | Number
    values: CSS size
    description: 抽屉宽度或高度。
    default: 360px
  - name: mask-closable
    type: Boolean
    values: true | false
    description: 是否允许点击遮罩关闭。
    default: true
description: "兼容 VXE 的方向抽屉。"
---
# Drawer 抽屉
<card><template #example><drawer-default /></template><template #template>

@[code{1-12}](../../.vuepress/components/drawer/default.vue)

</template></card>
