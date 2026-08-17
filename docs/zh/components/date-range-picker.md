---
PROPS:
  - name: v-model / model-value
    type: '[DateLike, DateLike] | null'
    values: 日期范围
    description: 选中的开始和结束值。
    default: 'null'
  - name: label-format / value-format
    type: String
    values: Day.js 格式令牌
    description: 分别控制输入框文本和输出值格式。
    default: 按类型决定
  - name: min-date / max-date / start-date / end-date
    type: Date | string | number
    values: 日期值
    description: 限制可选日期和初始面板范围。
    default: '-'
  - name: show-clear-button / show-confirm-button
    type: Boolean
    values: true | false
    description: 控制底部操作按钮显示。
    default: true
  - name: popup-config
    type: Object
    values: placement | transfer | width | height | zIndex | className
    description: 配置弹层位置、挂载、尺寸、层级和类名。
    default: '-'
EVENTS:
  - name: change
    description: 选择或确认完整日期范围后触发。
  - name: focus / blur / clear
    description: 转发输入框的聚焦、失焦和清空事件。
description: '固定为日期范围模式的 Date picker 快捷入口。'
---

# Date range picker 日期范围选择器

`s-date-range-picker` 复用 Date picker 的能力，并固定
`type="daterange"`。完整的共享属性请查看 [Date picker](./date-picker.md)。

<card><template #example><date-range-picker-default /></template><template #template>

@[code{1-5}](../../.vuepress/components/date-range-picker/default.vue)

</template></card>
