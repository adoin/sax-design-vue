---
PROPS:
  - name: model-value/v-model
    type: String | String[]
    values: YYYY-MM-DD
    description: 当前日期或日期范围。
    default: "''"
  - name: range
    type: Boolean
    values: true / false
    description: 选择日期范围。
    default: 'false'
  - name: first-day-of-week
    type: Number
    values: 0 - 6
    description: 每周起始日，0 为周日，1 为周一。
    default: '1'
  - name: disabled-date
    type: Function
    values: '(date) => boolean'
    description: 禁用匹配的日期。
    default: —
  - name: show-week-number
    type: Boolean
    values: true / false
    description: 显示 ISO 周序号。
    default: 'false'
EVENTS:
  - name: change / panel-change
    description: 选择或浏览月份变化事件。
SLOTS:
  - name: date-cell
    description: 自定义日期单元格，接收 CalendarCell。
description: "兼容 VXE 的独立日历。"
---

# Calendar 日历

<card><template #example><calendar-default /></template><template #template>

@[code{1-14}](../../.vuepress/components/calendar/default.vue)

</template></card>
