---
PROPS:
  - name: model-value/v-model
    type: Number
    values: percent
    description: 第一个面板的百分比尺寸。
    default: '50'
  - name: direction
    type: String
    values: horizontal / vertical
    description: 分割方向。
    default: horizontal
  - name: min / max
    type: Number
    values: percent
    description: 第一个面板最小和最大尺寸。
    default: 10 / 90
  - name: disabled
    type: Boolean
    values: true / false
    description: 禁止拖拽。
    default: 'false'
EVENTS:
  - name: change
    description: 拖拽结束后触发。
SLOTS:
  - name: first / second
    description: 两个分割面板内容。
description: "兼容 VXE 的可拖拽分割面板。"
---

# Splitter 分割面板

<card><template #example><splitter-default /></template><template #template>

@[code{1-16}](../../.vuepress/components/splitter/default.vue)

</template></card>
