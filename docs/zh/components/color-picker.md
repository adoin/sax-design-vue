---
PROPS:
  - name: model-value/v-model
    type: String
    values: hex / rgb / rgba
    description: 当前颜色值。
    default: '#5667f4'
  - name: show-alpha
    type: Boolean
    values: true / false
    description: 开启透明度调节。
    default: 'false'
  - name: predefine
    type: Array
    values: string[]
    description: 预设颜色值。
    default: '[]'
  - name: format
    type: String
    values: hex / rgb
    description: 输出格式。
    default: hex
EVENTS:
  - name: change
    description: 选择或修改颜色时触发。
description: "兼容 VXE 的颜色选择器。"
---

# Color picker 颜色选择器

<card><template #example><color-picker-default /></template><template #template>

@[code{1-15}](../../.vuepress/components/color-picker/default.vue)

</template></card>
