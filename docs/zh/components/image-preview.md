---
PROPS:
  - name: v-model
    type: Boolean
    values: true / false
    description: 控制预览显示状态。
    default: 'false'
  - name: url-list
    type: Array
    values: string[]
    description: 图片地址列表。
    default: '[]'
  - name: initial-index
    type: Number
    values: '0+'
    description: 初始展示图片下标。
    default: '0'
  - name: infinite
    type: Boolean
    values: true / false
    description: 是否循环切换图片。
    default: 'true'
EVENTS:
  - name: close / switch
    description: 关闭预览或切换图片事件。
description: "VXE 风格全屏图片预览。"
---

# 图片预览

<card><template #example><image-preview-default /></template><template #template>

@[code{1-17}](../../.vuepress/components/image-preview/default.vue)

</template></card>
