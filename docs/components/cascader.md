---
PROPS:
  - name: model-value/v-model
    type: Array
    values: CascaderValue[]
    description: Selected option value path.
    default: '[]'
  - name: options
    type: Array
    values: '{ value, label, children?, disabled? }[]'
    description: Hierarchical option definitions.
    default: '[]'
  - name: check-strictly
    type: Boolean
    values: true / false
    description: Allow selecting non-leaf options.
    default: 'false'
  - name: clearable
    type: Boolean
    values: true / false
    description: Show clear control after selection.
    default: 'false'
EVENTS:
  - name: change
    description: Fired with selected path and option.
description: "VXE-compatible hierarchical cascader."
---

# Cascader

<card><template #example><cascader-default /></template><template #template>

@[code{1-19}](../.vuepress/components/cascader/default.vue)

</template></card>
