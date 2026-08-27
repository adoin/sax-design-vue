---
PROPS:
  - name: size
    type: "'small' | 'medium' | 'large'"
    values: small / medium / large
    description: 日历视觉密度。默认 medium；large 保留原本较宽松的单元格尺寸。
    default: medium
  - name: events
    type: CalendarEvent[]
    values: '{ id, title, start, end?, allDay?, color?, display?, data? }[]'
    description: 日程数据。支持全天日期和本地 ISO 时间段。`display` 可覆盖单条日程的紧凑时间标识或分段类型。
    default: '[]'
  - name: event-data
    type: unknown[]
    values: 业务自有日程数据
    description: 不透明的业务日程记录；通过 event-adapter 映射为展示事件。
    default: '[]'
  - name: event-adapter
    type: Function
    values: '(data, { view, start, end }) => CalendarEvent[]'
    description: 将 event-data 映射为 Calendar 渲染的扁平事件，重复规则与业务逻辑仍留在应用侧。
    default: —
  - name: event-display
    type: Function
    values: '(event, { date, view, allDay, segment }) => string | { title?, time?, segment? }'
    description: 自定义紧凑日程标签。默认区分时间点、当天时间段、连续时间段开头（`08:00~`）和结尾（`~18:00`）。
    default: —
  - name: event-limit
    type: Number
    values: 0+
    description: 月视图/全天格直接展示的日程数。默认只展示最早一条，剩余日程通过 `+n` 打开。
    default: '1'
  - name: date / v-model:date
    type: String
    values: YYYY-MM-DD
    description: 控制当前展示的月、周、日，不影响日期选中值。
    default: 当前日期
  - name: view / v-model:view
    type: month | week | day
    values: month / week / day
    description: 当前日程视图。
    default: month
  - name: views
    type: Array
    values: month / week / day
    description: 可用视图。仅传一个视图时锁定该视图并隐藏切换器。
    default: "['month', 'week', 'day']"
  - name: editable
    type: Boolean
    values: true / false
    description: 开启后可将定时日程拖拽至新的日期和时间。
    default: 'false'
  - name: hour-start / hour-end
    type: Number
    values: 0 - 24
    description: 周视图和日视图的时间网格范围。
    default: '0 / 24'
  - name: hour-format
    type: "'12' | '24'"
    values: 12 / 24
    description: 周、日视图的小时显示格式；保存值始终使用本地 ISO 时间。
    default: '24'
  - name: schedule-height
    type: Number
    values: pixels
    description: 周、日视图的可滚动高度；设为 0 时直接展示全部小时。
    default: '640'
  - name: event-color
    type: String
    values: CSS color
    description: 日程未指定颜色时使用的默认颜色。
    default: primary
  - name: context-menu-items
    type: ContextMenuItem[]
    values: '{ label, value?, icon?, disabled?, divided? }[]'
    description: 事件、日期、时间格共用的静态右键菜单项。
    default: '[]'
  - name: get-context-menu-items
    type: Function
    values: '(context) => ContextMenuItem[]'
    description: 根据被右键的事件、日期或时间动态返回菜单项。参数为 { type, date, event? }。
    default: —
  - name: context-menu-min-width
    type: Number
    values: pixels
    description: 右键菜单面板最小宽度。
    default: '184'
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
  - name: multiple
    type: Boolean
    values: true / false
    description: 任意日期可点击选中或取消；拖拽和 Shift 点击会追加连续日期区间。
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
  - name: event-click
    description: 点击日程时返回对应 CalendarEvent。
  - name: event-edit
    description: 双击日程时返回对应 CalendarEvent。保存编辑仍由业务侧数据处理。
  - name: event-delete
    description: 点击 `+n` 溢出面板中的删除操作时返回对应 CalendarEvent。业务侧可据此删除完整源记录。
  - name: event-overflow
    description: 月视图/全天格的溢出面板打开时返回 { date, events }。
  - name: event-change
    description: 拖拽定时日程后返回 { event, start, end, source }。
  - name: cell-click
    description: 点击空白日期/时间格返回 YYYY-MM-DD 或 YYYY-MM-DDTHH:mm。
  - name: view-change / panel-change
    description: 当前视图和展示日期变更。
  - name: context-menu / context-menu-select
    description: 菜单打开上下文与菜单项选中事件。选中事件返回 { item, context }；context.dates 为当前选中的日期范围。
EXPOSES:
  - name: clearSelection
    description: 清空当前单日、范围或多日期选区，并同步 v-model。
SLOTS:
  - name: date-cell
    description: 自定义日期单元格，接收 CalendarCell。
  - name: event
    description: 自定义月视图和全天日程内容，接收 { event, date, display, allDay }。
  - name: event-overflow
    description: 自定义溢出日程行，接收 { event, date, display, allDay, edit, remove }。
  - name: time-event
    description: 自定义周、日视图的定时日程内容，接收 { event, date, display }。
  - name: context-menu
    description: 自定义右键菜单内容，接收 { context, close }。
description: '支持月、周、日视图的日程日历。'
---

# Calendar 日历

<card>

## 展示

### 默认可切换视图

<template #example><calendar-default /></template><template #template>

@[code{1-14}](../../.vuepress/components/calendar/default.vue)

</template></card>

<card>

### 固定视图

仅传入一个 `views` 项即可固定某一种展示形态，并隐藏视图切换器。

<template #example><calendar-locked-view /></template><template #template>

@[code{1-27}](../../.vuepress/components/calendar/locked-view.vue)

</template></card>

<card>

## 日程数据

通过外部表单构造扁平 `events`。示例支持编辑已有日程；Calendar 只发出交互意图，业务侧更新自己的数据。

<template #example><calendar-adding-events /></template><template #template>

@[code{1-212}](../../.vuepress/components/calendar/adding-events.vue)

</template></card>

<card>

## 业务日程数据与选区操作

Calendar 只渲染扁平 `CalendarEvent[]`，业务侧可保留任意日程数据结构。将原始记录传给 `event-data`，再通过 `event-adapter` 映射。单元格默认展示最早一条日程和 `+n`；悬停时 `+n` 变为溢出图标，点击后展示当天全部日程。默认操作会携带原始 `CalendarEvent` 发出编辑/删除意图；本示例据此反查完整业务源记录，因此编辑和删除影响的是完整日程数据，而非当前单日的渲染项。紧凑日程标签会标识时间点、当天时间段、连续时间段的开头（`08:00~`）和结尾（`~18:00`）；可通过 `event-display` 或事件插槽自定义输出。

<template #example><calendar-schedule-adapter /></template><template #template>

@[code{1-852}](../../.vuepress/components/calendar/schedule-adapter.vue)

</template></card>
