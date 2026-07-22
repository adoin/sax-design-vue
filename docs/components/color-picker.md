---
PROPS:
  - name: model-value/v-model
    type: String
    values: hex / rgb / rgba
    description: Selected color value.
    default: '#5667f4'
  - name: show-alpha
    type: Boolean
    values: true / false
    description: Enable opacity adjustment.
    default: 'false'
  - name: predefine
    type: Array
    values: string[]
    description: Preset color values.
    default: '[]'
  - name: format
    type: String
    values: hex / rgb
    description: Emitted output format.
    default: hex
EVENTS:
  - name: change
    description: Fired when a color is selected or changed.
description: "VXE-compatible color picker."
---

# Color picker

<card><template #example><color-picker-default /></template><template #template>

@[code{1-15}](../.vuepress/components/color-picker/default.vue)

</template></card>
