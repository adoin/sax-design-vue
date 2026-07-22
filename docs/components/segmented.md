---
PROPS:
  - name: model-value/v-model
    type: String | Number
    values: option value
    description: Selected option value.
    default: null
  - name: options
    type: Array
    values: '{ label, value, disabled? }[]'
    description: Segment definitions.
    default: '[]'
EVENTS:
  - name: change
    description: Fired when selection changes.
description: "VXE-compatible segmented single choice."
---
# Segmented
<card><template #example><segmented-default /></template><template #template>

@[code{1-7}](../.vuepress/components/segmented/default.vue)

</template></card>
