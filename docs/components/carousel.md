---
PROPS:
  - name: model-value/v-model
    type: Number
    values: index
    description: Active slide index.
    default: '0'
  - name: items
    type: Array
    values: '{ src?, alt?, title?, description?, disabled? }[]'
    description: Slide definitions. Use the item slot for custom content.
    default: '[]'
  - name: autoplay
    type: Boolean
    values: true / false
    description: Automatically advance slides.
    default: 'true'
  - name: interval
    type: Number
    values: milliseconds
    description: Autoplay interval.
    default: '4000'
  - name: arrow
    type: String
    values: always / hover / never
    description: Arrow visibility behavior.
    default: hover
  - name: indicator-position
    type: String
    values: inside / outside / none
    description: Indicator placement.
    default: inside
EVENTS:
  - name: change
    description: Fired with current and previous indexes.
SLOTS:
  - name: item
    description: Custom slide content. Receives item, index, and active.
description: "VXE-compatible carousel with controlled state."
---

# Carousel

<card><template #example><carousel-default /></template><template #template>

@[code{1-24}](../.vuepress/components/carousel/default.vue)

</template></card>
