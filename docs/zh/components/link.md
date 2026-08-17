---
PROPS:
  - name: underline
    type: Boolean
    values: true | false
    description: 控制链接文字是否始终显示下划线。
    default: false
  - name: href
    type: String
    values: URL
    description: 链接目标。
    default: null
  - name: type / status
    type: String
    values: primary | success | warning | danger | info
    description: 语义颜色；`status` 为别名。
    default: primary
description: "支持语义状态的文本链接。"
---

# Link 链接

<card><template #example><link-default /></template><template #template>

@[code{1-9}](../../.vuepress/components/link/default.vue)

</template></card>
