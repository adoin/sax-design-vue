---
PROPS:
  - name: title / description
    type: String
    values: 文本
    description: 分组标题内容。
    default: "''"
  - name: collapsible
    type: Boolean
    values: true / false
    description: 允许折叠分组内容。
    default: 'false'
  - name: v-model:collapsed
    type: Boolean
    values: true / false
    description: 折叠状态。
    default: 'false'
description: "VXE 风格表单字段分组。"
---

# 表单分组

<card><template #example><form-group-default /></template><template #template>

@[code{1-1}](../../.vuepress/components/form-group/default.vue)

</template></card>
