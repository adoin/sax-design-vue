---
PROPS:
  - name: title
    type: String
    values: Document title
    description: Print window title.
    default: document title
  - name: print-style
    type: String
    values: CSS text
    description: Extra CSS added to the print window.
    default: "''"
  - name: auto-close
    type: Boolean
    values: true / false
    description: Close the print window after printing.
    default: 'true'
METHODS:
  - name: print
    description: Open a print window containing default slot content.
EVENTS:
  - name: before-print / after-print / error
    description: Print lifecycle events.
description: "VXE-style scoped print container."
---

# Print

<card><template #example><print-default /></template><template #template>

@[code{1-3}](../.vuepress/components/print/default.vue)

</template></card>
