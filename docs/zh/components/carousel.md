---
PROPS:
  - name: model-value/v-model
    type: Number
    values: index
    description: 当前轮播项下标。
    default: '0'
  - name: items
    type: Array
    values: '{ src?, alt?, title?, description?, disabled? }[]'
    description: 轮播项定义；复杂内容使用 item 插槽。
    default: '[]'
  - name: autoplay
    type: Boolean
    values: true / false
    description: 自动切换轮播项。
    default: 'true'
  - name: interval
    type: Number
    values: milliseconds
    description: 自动播放间隔。
    default: '4000'
  - name: arrow
    type: String
    values: always / hover / never
    description: 箭头展示方式。
    default: hover
  - name: indicator-position
    type: String
    values: inside / outside / none
    description: 指示器位置。
    default: inside
EVENTS:
  - name: change
    description: 切换时触发，返回当前和上一个下标。
SLOTS:
  - name: item
    description: 自定义轮播内容，接收 item、index、active。
description: "兼容 VXE 的可控轮播组件。"
---

# Carousel 轮播图

<card><template #example><carousel-default /></template><template #template>

@[code{1-24}](../../.vuepress/components/carousel/default.vue)

</template></card>
