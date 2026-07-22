---
PROPS:
  - name: picker-type
    type: String
    values: date / month / quarter / year / week
    description: 面板选择模式。
    default: date
  - name: model-value
    type: Dayjs
    values: Dayjs 实例
    description: 面板参考日期。
    default: 当前日期
  - name: selected-dates
    type: Array
    values: Dayjs[]
    description: 用于高亮的已选日期。
    default: '[]'
EVENTS:
  - name: pick / panel-change
    description: 选择日期或切换面板日期。
description: "DatePicker 使用的独立日历面板。"
---

# 日期面板

<card><template #example><date-panel-default /></template><template #template>

@[code{1-2}](../../.vuepress/components/date-panel/default.vue)

</template></card>
