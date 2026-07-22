---
PROPS:
  - name: href
    type: String
    values: URL
    description: 链接目标。
    default: null
  - name: type / status
    type: String
    values: primary | success | warning | danger | info
    description: 语义颜色；`status` 为 VXE 兼容别名。
    default: primary
description: "兼容 VXE Link 语义状态的文本链接。"
---

# Link 链接

<card><template #example><link-default /></template><template #template>

@[code{1-9}](../../.vuepress/components/link/default.vue)

</template></card>
