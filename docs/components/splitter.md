---
PROPS:
  - name: model-value/v-model
    type: Number
    values: percent
    description: First panel size as a percentage.
    default: '50'
  - name: direction
    type: String
    values: horizontal / vertical
    description: Split direction.
    default: horizontal
  - name: min / max
    type: Number
    values: percent
    description: Minimum and maximum first-panel size.
    default: 10 / 90
  - name: disabled
    type: Boolean
    values: true / false
    description: Disable dragging.
    default: 'false'
EVENTS:
  - name: change
    description: Fired after drag completes.
SLOTS:
  - name: first / second
    description: Content for the two split panels.
description: "VXE-compatible resizable split layout."
---

# Splitter

<card><template #example><splitter-default /></template><template #template>

@[code{1-16}](../.vuepress/components/splitter/default.vue)

</template></card>
