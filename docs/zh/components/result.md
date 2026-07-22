---
PROPS:
  - name: status
    type: String
    values: success | warning | error | info
    description: 语义结果状态。
    default: info
  - name: title
    type: String
    values: text
    description: 结果标题。
    default: null
  - name: description / content
    type: String
    values: text
    description: 结果辅助说明。
    default: null
description: "兼容 VXE 的结果反馈状态。"
---

# Result 结果

<card><template #example><result-default /></template><template #template>

@[code{1-5}](../../.vuepress/components/result/default.vue)

</template></card>
