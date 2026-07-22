---
PROPS:
  - name: title / description
    type: String
    values: Text
    description: Group heading content.
    default: "''"
  - name: collapsible
    type: Boolean
    values: true / false
    description: Allow folding group content.
    default: 'false'
  - name: v-model:collapsed
    type: Boolean
    values: true / false
    description: Collapsed state.
    default: 'false'
description: "VXE-style form field group."
---

# Form group

<card><template #example><form-group-default /></template><template #template>

@[code{1-1}](../.vuepress/components/form-group/default.vue)

</template></card>
