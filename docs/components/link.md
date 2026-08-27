---
PROPS:
  - name: href
    type: String
    values: URL
    description: Link destination.
    default: null
  - name: type / status
    type: String
    values: primary | success | warning | danger | info
    description: Semantic color. `status` is an alias.
    default: primary
  - name: underline
    type: Boolean
    values: true | false
    description: Shows an underline on hover or keyboard focus.
    default: true
  - name: underline-effect
    type: String
    values: default | slide | center | double | highlight
    description: Underline effect with slide, center-out, double-line, and highlight variants. All variants support wrapped text.
    default: default
description: 'Text link with semantic status.'
EVENTS:
  - name: click
    type: MouseEvent
    description: Fires when an enabled link is activated.
---

# Link

<card><template #example><link-default /></template><template #template>

@[code](../.vuepress/components/link/default.vue)

</template></card>
