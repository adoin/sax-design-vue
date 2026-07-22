---
PROPS:
  - name: v-model
    type: String
    values: Material icon name
    description: Selected icon name.
    default: "''"
  - name: icon-list
    type: Array
    values: string[]
    description: Available icon names.
    default: common Material icons
  - name: searchable
    type: Boolean
    values: true / false
    description: Show icon search field.
    default: 'true'
EVENTS:
  - name: change / clear
    description: Selection and clear events.
description: "VXE-style icon picker."
---

# Icon picker

<card><template #example><icon-picker-default /></template><template #template>

@[code{1-3}](../.vuepress/components/icon-picker/default.vue)

</template></card>
