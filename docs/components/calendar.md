---
PROPS:
  - name: size
    type: "'small' | 'medium' | 'large'"
    values: small / medium / large
    description: Calendar visual density. Medium is the default; large preserves the original spacious cells.
    default: medium
  - name: events
    type: CalendarEvent[]
    values: '{ id, title, start, end?, allDay?, color?, display?, data? }[]'
    description: Schedule data. Accepts all-day dates and local ISO time ranges. `display` can override one event's compact time marker or segment.
    default: '[]'
  - name: event-data
    type: unknown[]
    values: application-owned schedule data
    description: Opaque schedule records. Use event-adapter to map any domain model into display events.
    default: '[]'
  - name: event-adapter
    type: Function
    values: '(data, { view, start, end }) => CalendarEvent[]'
    description: Translates event-data into the flat events Calendar renders. Keeps recurrence and business rules outside Calendar.
    default: —
  - name: event-display
    type: Function
    values: '(event, { date, view, allDay, segment }) => string | { title?, time?, segment? }'
    description: Customizes compact event labels. Defaults distinguish time points, same-day ranges, range starts (`08:00~`), and range ends (`~18:00`).
    default: —
  - name: event-limit
    type: Number
    values: 0+
    description: Number of events shown directly in a month/all-day cell. The default keeps the earliest event plus a `+n` overflow trigger.
    default: '1'
  - name: date / v-model:date
    type: String
    values: YYYY-MM-DD
    description: Controls the visible month, week, or day without changing selection.
    default: current date
  - name: view / v-model:view
    type: month | week | day
    values: month / week / day
    description: Active scheduler view.
    default: month
  - name: views
    type: Array
    values: month / week / day
    description: Allowed views. A single item locks the calendar to that view and hides the switcher.
    default: "['month', 'week', 'day']"
  - name: editable
    type: Boolean
    values: true / false
    description: Enables dragging timed events to a new day and time.
    default: 'false'
  - name: hour-start / hour-end
    type: Number
    values: 0 - 24
    description: Time grid bounds for week and day views.
    default: '0 / 24'
  - name: hour-format
    type: "'12' | '24'"
    values: 12 / 24
    description: Hour labels for week and day views. Stored values always remain local ISO time.
    default: '24'
  - name: schedule-height
    type: Number
    values: pixels
    description: Scrollable height for week and day schedules. Set 0 to render every hour without an internal scroll area.
    default: '640'
  - name: event-color
    type: String
    values: CSS color
    description: Default event color when an event has no color.
    default: primary
  - name: context-menu-items
    type: ContextMenuItem[]
    values: '{ label, value?, icon?, disabled?, divided? }[]'
    description: Static right-click menu for events, dates, and time slots.
    default: '[]'
  - name: get-context-menu-items
    type: Function
    values: '(context) => ContextMenuItem[]'
    description: Resolve menu items for the right-clicked event, date, or time. Receives { type, date, event? }.
    default: —
  - name: context-menu-min-width
    type: Number
    values: pixels
    description: Minimum width of the context menu panel.
    default: '184'
  - name: model-value/v-model
    type: String | String[]
    values: YYYY-MM-DD
    description: Selected date or selected date range.
    default: "''"
  - name: range
    type: Boolean
    values: true / false
    description: Select a date range.
    default: 'false'
  - name: multiple
    type: Boolean
    values: true / false
    description: Toggle arbitrary dates. Dragging and Shift-click append continuous date ranges.
    default: 'false'
  - name: first-day-of-week
    type: Number
    values: 0 - 6
    description: Week start day, 0 for Sunday and 1 for Monday.
    default: '1'
  - name: disabled-date
    type: Function
    values: '(date) => boolean'
    description: Disable matching dates.
    default: —
  - name: show-week-number
    type: Boolean
    values: true / false
    description: Show ISO week numbers.
    default: 'false'
EVENTS:
  - name: event-click
    description: Emits the clicked CalendarEvent.
  - name: event-edit
    description: Emits the double-clicked CalendarEvent. Persisting edits remains application-owned.
  - name: event-delete
    description: Emits the CalendarEvent selected for deletion in the `+n` overflow menu. Remove its full source record in application data when appropriate.
  - name: event-overflow
    description: Emits { date, events } when a month/all-day cell overflow menu opens.
  - name: event-change
    description: Emits { event, start, end, source } after a timed-event drag.
  - name: cell-click
    description: Emits YYYY-MM-DD or YYYY-MM-DDTHH:mm for an empty cell click.
  - name: view-change / panel-change
    description: Active view and visible date changes.
  - name: context-menu / context-menu-select
    description: Open context and selected menu item. Selection returns { item, context }; context.dates is the selected date range.
EXPOSES:
  - name: clearSelection
    description: Clears the current date, range, or multiple-date selection and synchronizes v-model.
SLOTS:
  - name: date-cell
    description: Custom cell content. Receives CalendarCell.
  - name: event
    description: Custom month/all-day event content. Receives { event, date, display, allDay }.
  - name: event-overflow
    description: Custom overflow row. Receives { event, date, display, allDay, edit, remove }.
  - name: time-event
    description: Custom week/day timed-event content. Receives { event, date, display }.
  - name: context-menu
    description: Custom menu content. Receives { context, close }.
description: 'Event calendar with month, week, and day schedules.'
---

# Calendar

<card>

## Display

### Switchable views

<template #example><calendar-default /></template>

<template #template>

@[code{1-20}](../.vuepress/components/calendar/default.vue)

</template>

<template #script>

@[code{22-110}](../.vuepress/components/calendar/default.vue)

</template>

<template #style>

@[code{112-118}](../.vuepress/components/calendar/default.vue)

</template>

</card>

<card>

### Locked view

Pass one item to `views` when a calendar should keep a single presentation and hide the view switcher.

<template #example><calendar-locked-view /></template>

<template #template>

@[code{1-10}](../.vuepress/components/calendar/locked-view.vue)

</template>

<template #script>

@[code{12-27}](../.vuepress/components/calendar/locked-view.vue)

</template>

</card>

<card>

## Schedule data

Create flat `events` from an external form. Existing events can be edited from the demo; Calendar emits intent while the application updates its own data.

<template #example><calendar-adding-events /></template>

<template #template>

@[code{1-59}](../.vuepress/components/calendar/adding-events.vue)

</template>

<template #script>

@[code{61-149}](../.vuepress/components/calendar/adding-events.vue)

</template>

<template #style>

@[code{151-212}](../.vuepress/components/calendar/adding-events.vue)

</template>

</card>

<card>

## Domain schedule data and selection actions

Calendar renders flat `CalendarEvent[]`, but your application can retain any schedule model. Pass raw records through `event-data`, then use `event-adapter` to map them. A cell shows its earliest event and `+n`; hover changes `+n` to an overflow icon, and click opens every event for that date. The default row emits edit/delete intent with the original `CalendarEvent`; this demo resolves it back to the complete source record, so editing or deleting affects the full schedule rather than only one rendered day. Compact markers show a point/range time, a range start (`08:00~`), or a range end (`~18:00`); use `event-display` or event slots for custom output.

<template #example><calendar-schedule-adapter /></template>

<template #template>

@[code{1-139}](../.vuepress/components/calendar/schedule-adapter.vue)

</template>

<template #script>

@[code{141-785}](../.vuepress/components/calendar/schedule-adapter.vue)

</template>

<template #style>

@[code{787-852}](../.vuepress/components/calendar/schedule-adapter.vue)

</template>

</card>
