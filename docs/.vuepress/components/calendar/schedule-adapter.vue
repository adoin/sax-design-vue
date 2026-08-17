<template>
  <div class="calendar-schedule-demo">
    <div class="calendar-schedule-demo__toolbar">
      <p>{{ labels.selection(selectedDates.length) }}</p>
      <s-button size="small" @click="openEditor()">
        {{ labels.openEditor }}
      </s-button>
    </div>

    <s-calendar
      ref="calendarRef"
      v-model="selectedDates"
      v-model:date="visibleDate"
      v-model:view="view"
      multiple
      editable
      :event-data="scheduleData"
      :event-adapter="toCalendarEvents"
      :get-context-menu-items="getContextMenuItems"
      :schedule-height="460"
      @event-click="editSchedule"
      @event-edit="editSchedule"
      @event-delete="deleteSchedule"
      @context-menu-select="handleContextMenu"
    />

    <p class="calendar-schedule-demo__hint">
      {{ labels.hint }}
    </p>
  </div>

  <s-dialog v-model="editorOpen" auto-width>
    <template #header>
      <h4>{{ editingEvent ? labels.editDialogTitle : labels.dialogTitle }}</h4>
    </template>

    <div class="calendar-schedule-editor">
      <s-select
        v-if="!editingEvent"
        v-model="draft.kind"
        block
        fit
        :label="labels.kind"
      >
        <s-option :label="labels.dailyMoment" value="daily-moment" />
        <s-option :label="labels.dailyRange" value="daily-range" />
        <s-option :label="labels.mergedRange" value="merged-range" />
        <s-option :label="labels.holidaySource" value="holiday" />
        <s-option :label="labels.workdayMoment" value="workday-moment" />
        <s-option :label="labels.workdayRange" value="workday-range" />
      </s-select>

      <template v-if="showMetadata">
        <s-input v-model="draft.title" block :label="labels.title" />
        <s-input v-model="draft.content" block :label="labels.content" />
      </template>

      <p
        v-if="editingEvent && editingWholeRecord"
        class="calendar-schedule-editor__scope"
      >
        {{ labels.editScope(editingOccurrenceCount) }}
      </p>

      <div
        v-if="editingEvent && !editingWholeRecord"
        class="calendar-schedule-editor__dates"
      >
        <label class="calendar-schedule-editor__field">
          <span>{{ labels.date }}</span>
          <s-date-picker
            v-model="draft.date"
            format="YYYY.MM.DD"
            value-format="YYYY-MM-DD"
            :clearable="false"
          />
        </label>
        <label
          v-if="editingRecord?.type === 'range'"
          class="calendar-schedule-editor__field"
        >
          <span>{{ labels.endDate }}</span>
          <s-date-picker
            v-model="draft.endDate"
            format="YYYY.MM.DD"
            value-format="YYYY-MM-DD"
            :clearable="false"
          />
        </label>
      </div>

      <template v-if="requiresDetails">
        <div class="calendar-schedule-editor__times">
          <label class="calendar-schedule-editor__field">
            <span>{{ labels.start }}</span>
            <s-time-picker
              v-model="draft.start"
              format="HH:mm"
              value-format="HH:mm"
              :clearable="false"
            />
          </label>
          <label
            v-if="draft.kind !== 'daily-moment'"
            class="calendar-schedule-editor__field"
          >
            <span>{{ labels.end }}</span>
            <s-time-picker
              v-model="draft.end"
              format="HH:mm"
              value-format="HH:mm"
              :clearable="false"
            />
          </label>
        </div>
      </template>

      <p v-if="sourceDescription" class="calendar-schedule-editor__source">
        {{ sourceDescription }}
      </p>
    </div>

    <template #footer>
      <div class="calendar-schedule-editor__footer">
        <span v-if="sourceStatus">{{ sourceStatus }}</span>
        <s-button transparent @click="closeEditor">
          {{ labels.cancel }}
        </s-button>
        <s-button
          :loading="sourceLoading"
          :disabled="!canSubmit"
          @click="saveSchedule"
        >
          {{ editingEvent ? labels.save : labels.create }}
        </s-button>
      </div>
    </template>
  </s-dialog>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'
import type {
  CalendarContextMenuContext,
  CalendarEvent,
  CalendarInstance,
} from 'sax-design-vue'

type DailyMoment = {
  id: string
  title: string
  content: string
  type: 'daily-moment'
  value: Array<{ day: string; time: string }>
}
type DailyRange = {
  id: string
  title: string
  content: string
  type: 'daily-range'
  value: Array<{ day: string; value: [string, string] }>
}
type Moment = {
  id: string
  title: string
  content: string
  type: 'moment'
  value: string
}
type Range = {
  id: string
  title: string
  content: string
  type: 'range'
  value: Array<{ start: string; end: string }>
}
type Holiday = {
  id: string
  title: string
  content: string
  type: 'holiday'
  value: Array<{ day: string; name: string }>
}
type ScheduleRecord = DailyMoment | DailyRange | Moment | Range | Holiday
type DraftKind = ScheduleRecord['type'] | 'workday-moment' | 'workday-range'

const isZh =
  typeof window !== 'undefined' && window.location.pathname.startsWith('/zh/')
const labels = computed(() =>
  isZh
    ? {
        selection: (count: number) => `已选 ${count} 天`,
        openEditor: '添加日程',
        hint: '单击日期可选中或取消；Shift 或拖拽可追加连续日期。右键已选日期后添加、删除日程。',
        dialogTitle: '创建日程',
        editDialogTitle: '编辑日程',
        kind: '创建方式',
        dailyMoment: '当前选区 · 每天固定时间',
        dailyRange: '当前选区 · 每天固定时间段',
        mergedRange: '当前选区 · 合并连续日为时间段',
        holidaySource: '数据源 · 中国法定节假日（全天）',
        workdayMoment: '数据源 · 中国工作日 · 每天固定时间',
        workdayRange: '数据源 · 中国工作日 · 每天固定时间段',
        title: '标题',
        content: '内容',
        date: '日期',
        endDate: '结束日期',
        start: '开始时间',
        end: '结束时间',
        holidayDescription:
          '不使用当前选区。读取当前展示年份的中国法定节假日，生成全天日程。',
        workdayDescription:
          '不使用当前选区。读取当年节假日数据，自动排除法定节假日并包含调休工作日。',
        cancel: '取消',
        create: '创建',
        save: '保存',
        editScope: (count: number) =>
          `正在编辑完整日程数据，保存后同步更新 ${count} 个日程项。`,
        add: (count: number) => `为已选 ${count} 天添加日程`,
        clear: '删除已选日期内的日程',
        loading: '正在读取中国日历数据…',
        loaded: (count: number) => `已创建 ${count} 条数据源日程`,
        failed: '中国日历数据源暂时不可用',
      }
    : {
        selection: (count: number) => `${count} day(s) selected`,
        openEditor: 'Add schedule',
        hint: 'Click dates to toggle them. Use Shift or drag to add a continuous range, then right-click selected dates to add or remove schedules.',
        dialogTitle: 'Create schedule',
        editDialogTitle: 'Edit schedule',
        kind: 'Creation mode',
        dailyMoment: 'Selected dates · Fixed time each day',
        dailyRange: 'Selected dates · Fixed time range each day',
        mergedRange: 'Selected dates · Merge continuous days into ranges',
        holidaySource: 'Data source · China public holidays (all day)',
        workdayMoment: 'Data source · China workdays · Fixed time each day',
        workdayRange:
          'Data source · China workdays · Fixed time range each day',
        title: 'Title',
        content: 'Content',
        date: 'Date',
        endDate: 'End date',
        start: 'Start time',
        end: 'End time',
        holidayDescription:
          'Ignores the current selection. Loads China public holidays for the visible year as all-day schedules.',
        workdayDescription:
          'Ignores the current selection. Uses China holiday data to exclude holidays and include adjusted workdays.',
        cancel: 'Cancel',
        create: 'Create',
        save: 'Save changes',
        editScope: (count: number) =>
          `Editing the complete schedule record. Saving updates ${count} schedule item(s).`,
        add: (count: number) => `Add schedule for ${count} selected day(s)`,
        clear: 'Remove schedules in selected days',
        loading: 'Loading China calendar data…',
        loaded: (count: number) => `Created ${count} data-source schedules`,
        failed: 'China calendar source is temporarily unavailable',
      },
)

const visibleDate = ref('2026-07-22')
const view = ref<'month' | 'week' | 'day'>('month')
const selectedDates = ref<string[]>([])
const calendarRef = ref<CalendarInstance>()
const editorOpen = ref(false)
const editingEvent = ref<CalendarEvent>()
const sourceLoading = ref(false)
const sourceStatus = ref('')
const draft = reactive({
  kind: 'daily-range' as DraftKind,
  title: isZh ? '工作安排' : 'Work block',
  content: isZh ? '通过日程配置器创建' : 'Created from the schedule editor',
  date: '2026-07-22',
  endDate: '2026-07-22',
  start: '08:00',
  end: '18:00',
})
const isWorkdaySource = computed(
  () => draft.kind === 'workday-moment' || draft.kind === 'workday-range',
)
const sourceDescription = computed(() => {
  if (draft.kind === 'holiday') return labels.value.holidayDescription
  if (isWorkdaySource.value) return labels.value.workdayDescription
  return ''
})
const scheduleData = ref<ScheduleRecord[]>([
  {
    id: 'work',
    title: isZh ? '上班' : 'Work',
    content: isZh ? '为了赚钱' : 'Working hours',
    type: 'daily-range',
    value: [
      { day: '2026-07-20', value: ['09:00', '18:00'] },
      { day: '2026-07-21', value: ['09:00', '18:00'] },
      { day: '2026-07-22', value: ['09:00', '18:00'] },
      { day: '2026-07-23', value: ['09:00', '18:00'] },
      { day: '2026-07-24', value: ['09:00', '18:00'] },
    ],
  },
  {
    id: 'errand',
    title: isZh ? '办事' : 'Errand',
    content: isZh ? '记得带身份证' : 'Bring your ID',
    type: 'moment',
    value: '2026-07-25 10:00',
  },
  {
    id: 'lunch',
    title: isZh ? '午饭' : 'Lunch order',
    content: isZh ? '工作日提醒' : 'Weekday reminder',
    type: 'daily-moment',
    value: [
      { day: '2026-07-22', time: '11:00' },
      { day: '2026-07-23', time: '11:00' },
    ],
  },
  {
    id: 'review',
    title: isZh ? '方案评审' : 'Design review',
    content: isZh ? '检查交付内容' : 'Review delivery',
    type: 'daily-range',
    value: [{ day: '2026-07-22', value: ['15:00', '16:00'] }],
  },
  {
    id: 'leave',
    title: isZh ? '请假' : 'Leave',
    content: isZh ? '去玩' : 'Time off',
    type: 'range',
    value: [
      { start: '2026-07-28 09:00', end: '2026-07-30 18:00' },
      { start: '2026-08-02 09:00', end: '2026-08-04 18:00' },
    ],
  },
])

const editingRecord = computed(() => {
  const recordId = editingEvent.value?.data?.recordId
  return typeof recordId === 'string'
    ? scheduleData.value.find((record) => record.id === recordId)
    : undefined
})
const editingAllDay = computed(() => editingRecord.value?.type === 'holiday')
const editingWholeRecord = computed(() => {
  const type = editingRecord.value?.type
  return type === 'daily-moment' || type === 'daily-range' || type === 'range'
})
const editingOccurrenceCount = computed(() => {
  const record = editingRecord.value
  if (!record) return 0
  return record.type === 'moment' ? 1 : record.value.length
})
const requiresDetails = computed(() =>
  editingEvent.value ? !editingAllDay.value : draft.kind !== 'holiday',
)
const showMetadata = computed(
  () => Boolean(editingEvent.value) || requiresDetails.value,
)

const iso = (value: string) => value.replace(' ', 'T')
const plusMinutes = (value: string, minutes: number) => {
  const date = new Date(iso(value))
  date.setMinutes(date.getMinutes() + minutes)
  const pad = (part: number) => String(part).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

// Calendar only renders these flat events. The business schedule records stay app-owned.
const toCalendarEvents = (data: unknown[]): CalendarEvent[] =>
  (data as ScheduleRecord[]).flatMap((record) => {
    if (record.type === 'daily-moment') {
      return record.value.map(({ day, time }, entryIndex) => ({
        id: `${record.id}-${day}`,
        title: record.title,
        content: record.content,
        start: `${day}T${time}`,
        end: plusMinutes(`${day} ${time}`, 30),
        color: '#2563ff',
        display: { segment: 'point' },
        data: { recordId: record.id, entryIndex },
      }))
    }
    if (record.type === 'daily-range') {
      return record.value.map(({ day, value }, entryIndex) => ({
        id: `${record.id}-${day}`,
        title: record.title,
        content: record.content,
        start: `${day}T${value[0]}`,
        end: `${day}T${value[1]}`,
        color: '#2563ff',
        data: { recordId: record.id, entryIndex },
      }))
    }
    if (record.type === 'moment') {
      return [
        {
          id: record.id,
          title: record.title,
          content: record.content,
          start: iso(record.value),
          end: plusMinutes(record.value, 30),
          color: '#8b5cf6',
          display: { segment: 'point' },
          data: { recordId: record.id },
        },
      ]
    }
    if (record.type === 'holiday') {
      return record.value.map(({ day, name }, entryIndex) => ({
        id: `${record.id}-${day}`,
        title: name,
        content: record.content,
        start: day,
        allDay: true,
        color: '#ef4444',
        data: { recordId: record.id, entryIndex },
      }))
    }
    return record.value.map((item, index) => ({
      id: `${record.id}-${index}`,
      title: record.title,
      content: record.content,
      start: iso(item.start),
      end: iso(item.end),
      color: '#10b981',
      data: { recordId: record.id, entryIndex: index },
    }))
  })

const selectedDayRanges = (dates: string[]) => {
  const sorted = [...new Set(dates)].sort()
  return sorted.reduce<Array<{ start: string; end: string }>>((ranges, day) => {
    const previous = ranges[ranges.length - 1]
    const expected = previous ? new Date(`${previous.end}T00:00:00`) : undefined
    if (expected) expected.setDate(expected.getDate() + 1)
    const isContinuous =
      expected &&
      `${expected.getFullYear()}-${String(expected.getMonth() + 1).padStart(2, '0')}-${String(expected.getDate()).padStart(2, '0')}` ===
        day
    if (previous && isContinuous) previous.end = day
    else ranges.push({ start: day, end: day })
    return ranges
  }, [])
}

const openEditor = (dates = selectedDates.value) => {
  editingEvent.value = undefined
  selectedDates.value = dates
  sourceStatus.value = ''
  editorOpen.value = true
}
const readLocalParts = (value: string) => {
  const normalized = iso(value)
  return {
    date: normalized.slice(0, 10),
    time: normalized.slice(11, 16) || '00:00',
  }
}
const editSchedule = (event: CalendarEvent) => {
  const recordId = event.data?.recordId
  if (typeof recordId !== 'string') return

  const record = scheduleData.value.find((item) => item.id === recordId)
  if (!record) return

  const start = readLocalParts(event.start)
  const end = readLocalParts(event.end || event.start)
  editingEvent.value = event
  draft.kind =
    record.type === 'moment'
      ? 'daily-moment'
      : record.type === 'range'
        ? 'merged-range'
        : record.type
  draft.title = event.title
  draft.content = event.content || ''
  draft.date = start.date
  draft.endDate = end.date
  draft.start = start.time
  draft.end = end.time
  sourceStatus.value = ''
  editorOpen.value = true
}
const deleteSchedule = (event: CalendarEvent) => {
  const recordId = event.data?.recordId
  if (typeof recordId !== 'string') return

  // Calendar only receives flattened occurrences. Deletion targets the
  // application-owned record so every occurrence of this schedule disappears.
  scheduleData.value = scheduleData.value.filter(
    (record) => record.id !== recordId,
  )
  if (editingRecord.value?.id === recordId) closeEditor()
}
const closeEditor = () => {
  editorOpen.value = false
  editingEvent.value = undefined
  sourceStatus.value = ''
}
const getContextMenuItems = (context: CalendarContextMenuContext) => [
  {
    label: labels.value.add(context.dates.length),
    value: 'configure-schedule',
    icon: 'add',
  },
  {
    label: labels.value.clear,
    value: 'clear-days',
    icon: 'delete',
    divided: true,
  },
]
const clearSchedules = (dates: string[]) => {
  scheduleData.value = scheduleData.value.flatMap((record) => {
    if (record.type === 'daily-moment') {
      const value = record.value.filter((item) => !dates.includes(item.day))
      return value.length ? [{ ...record, value }] : []
    }
    if (record.type === 'daily-range') {
      const value = record.value.filter((item) => !dates.includes(item.day))
      return value.length ? [{ ...record, value }] : []
    }
    if (record.type === 'moment') {
      return dates.includes(record.value.slice(0, 10)) ? [] : [record]
    }
    if (record.type === 'holiday') {
      const value = record.value.filter((item) => !dates.includes(item.day))
      return value.length ? [{ ...record, value }] : []
    }
    const value = record.value.filter(
      (item) =>
        !dates.some(
          (day) =>
            new Date(iso(item.start)).getTime() <=
              new Date(`${day}T23:59:59`).getTime() &&
            new Date(iso(item.end)).getTime() >=
              new Date(`${day}T00:00:00`).getTime(),
        ),
    )
    return value.length ? [{ ...record, value }] : []
  })
}
const handleContextMenu = ({
  item,
  context,
}: {
  item: { value?: string | number }
  context: CalendarContextMenuContext
}) => {
  if (item.value === 'configure-schedule') openEditor(context.dates)
  if (item.value === 'clear-days') clearSchedules(context.dates)
}
const canCreate = computed(() => {
  const isSourceMode = draft.kind === 'holiday' || isWorkdaySource.value
  const hasValidTime =
    draft.kind === 'daily-moment' || draft.kind === 'workday-moment'
      ? Boolean(draft.start)
      : Boolean(draft.start && draft.start < draft.end)
  return Boolean(
    (isSourceMode || selectedDates.value.length) &&
    (draft.kind === 'holiday' || draft.title.trim()) &&
    (draft.kind === 'holiday' || hasValidTime),
  )
})
const canSubmit = computed(() => {
  if (!editingEvent.value) return canCreate.value
  if (!draft.title.trim()) return false
  if (editingAllDay.value) return Boolean(draft.date)
  if (!draft.start) return false
  if (editingRecord.value?.type === 'daily-moment') return true
  if (!editingWholeRecord.value && !draft.date) return false
  return Boolean(
    draft.end &&
    draft.start < draft.end &&
    (editingWholeRecord.value ||
      editingRecord.value?.type !== 'range' ||
      draft.date <= draft.endDate),
  )
})
type ChinaCalendarDay = {
  holiday?: boolean
  date?: string
  name?: string
}
const toDayValue = (date: Date) => {
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}
const datesInYear = (year: number) => {
  const dates: string[] = []
  const date = new Date(year, 0, 1)
  while (date.getFullYear() === year) {
    dates.push(toDayValue(date))
    date.setDate(date.getDate() + 1)
  }
  return dates
}
const clearDateSelection = () => {
  calendarRef.value?.clearSelection()
  selectedDates.value = []
}
const saveExistingSchedule = () => {
  const event = editingEvent.value
  const record = editingRecord.value
  if (!event || !record || !canSubmit.value) return

  const entryIndex = Number(event.data?.entryIndex ?? 0)
  const title = draft.title.trim()
  const content = draft.content.trim()

  scheduleData.value = scheduleData.value.map((item) => {
    if (item.id !== record.id) return item

    if (item.type === 'daily-moment') {
      return {
        ...item,
        title,
        content,
        value: item.value.map((value) => ({ ...value, time: draft.start })),
      }
    }
    if (item.type === 'daily-range') {
      return {
        ...item,
        title,
        content,
        value: item.value.map((value) => ({
          ...value,
          value: [draft.start, draft.end],
        })),
      }
    }
    if (item.type === 'moment') {
      return { ...item, title, content, value: `${draft.date} ${draft.start}` }
    }
    if (item.type === 'holiday') {
      return {
        ...item,
        title,
        content,
        value: item.value.map((value, index) =>
          index === entryIndex
            ? { ...value, day: draft.date, name: title }
            : value,
        ),
      }
    }
    return {
      ...item,
      title,
      content,
      value: item.value.map((value) => ({
        start: `${readLocalParts(value.start).date} ${draft.start}`,
        end: `${readLocalParts(value.end).date} ${draft.end}`,
      })),
    }
  })

  closeEditor()
}
const createFromChinaCalendar = async () => {
  sourceLoading.value = true
  sourceStatus.value = labels.value.loading
  try {
    const year = new Date(`${visibleDate.value}T00:00:00`).getFullYear()
    const response = await fetch(
      `https://holiday.ailcc.com/api/holiday/year/${year}`,
    )
    const payload = (await response.json()) as {
      code?: number
      holiday?: Record<string, ChinaCalendarDay>
    }
    if (!response.ok || payload.code !== 0 || !payload.holiday)
      throw new Error('holiday source failed')
    const sourceByDay = new Map(
      Object.entries(payload.holiday).map(([key, item]) => [
        item.date || (key.length === 5 ? `${year}-${key}` : key),
        item,
      ]),
    )
    if (draft.kind === 'holiday') {
      const value = [...sourceByDay.entries()]
        .filter(([, item]) => item.holiday)
        .map(([day, item]) => ({
          day,
          name: item.name || (isZh ? '法定节假日' : 'Public holiday'),
        }))
      scheduleData.value = scheduleData.value.filter(
        (record) => record.type !== 'holiday',
      )
      scheduleData.value.push({
        id: `holiday-${year}`,
        title: isZh ? '中国法定节假日' : 'China public holidays',
        content: isZh ? '公开节假日数据源' : 'Public holiday source',
        type: 'holiday',
        value,
      })
      sourceStatus.value = labels.value.loaded(value.length)
    } else {
      const workdays = datesInYear(year).filter((day) => {
        const sourceDay = sourceByDay.get(day)
        if (sourceDay?.holiday === true) return false
        if (sourceDay?.holiday === false) return true
        const weekday = new Date(`${day}T00:00:00`).getDay()
        return weekday !== 0 && weekday !== 6
      })
      const base = {
        id: `workday-${Date.now()}`,
        title: draft.title.trim(),
        content: draft.content.trim(),
      }
      if (draft.kind === 'workday-moment') {
        scheduleData.value.push({
          ...base,
          type: 'daily-moment',
          value: workdays.map((day) => ({ day, time: draft.start })),
        })
      } else {
        scheduleData.value.push({
          ...base,
          type: 'daily-range',
          value: workdays.map((day) => ({
            day,
            value: [draft.start, draft.end],
          })),
        })
      }
      sourceStatus.value = labels.value.loaded(workdays.length)
    }
    editorOpen.value = false
    clearDateSelection()
  } catch {
    sourceStatus.value = labels.value.failed
  } finally {
    sourceLoading.value = false
  }
}
const createSchedule = async () => {
  if (!canCreate.value) return
  if (draft.kind === 'holiday' || isWorkdaySource.value) {
    await createFromChinaCalendar()
    return
  }
  const id = `schedule-${Date.now()}`
  const base = {
    id,
    title: draft.title.trim(),
    content: draft.content.trim(),
  }
  if (draft.kind === 'daily-moment') {
    scheduleData.value.push({
      ...base,
      type: 'daily-moment',
      value: selectedDates.value.map((day) => ({ day, time: draft.start })),
    })
  } else if (draft.kind === 'daily-range') {
    scheduleData.value.push({
      ...base,
      type: 'daily-range',
      value: selectedDates.value.map((day) => ({
        day,
        value: [draft.start, draft.end],
      })),
    })
  } else {
    scheduleData.value.push({
      ...base,
      type: 'range',
      value: selectedDayRanges(selectedDates.value).map((item) => ({
        start: `${item.start} ${draft.start}`,
        end: `${item.end} ${draft.end}`,
      })),
    })
  }
  editorOpen.value = false
  clearDateSelection()
}
const saveSchedule = async () => {
  if (editingEvent.value) {
    saveExistingSchedule()
    return
  }
  await createSchedule()
}
</script>

<style scoped>
.calendar-schedule-demo {
  display: grid;
  gap: 12px;
}

.calendar-schedule-demo__toolbar,
.calendar-schedule-editor__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.calendar-schedule-demo__toolbar p,
.calendar-schedule-demo__hint,
.calendar-schedule-editor__source,
.calendar-schedule-editor__scope,
.calendar-schedule-editor__footer span {
  margin: 0;
  color: var(--sax-text-color-secondary);
  font-size: 12px;
}

.calendar-schedule-editor {
  display: grid;
  min-width: min(520px, calc(100vw - 56px));
  gap: 12px;
}

.calendar-schedule-editor__times {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.calendar-schedule-editor__dates {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.calendar-schedule-editor__field {
  display: grid;
  min-width: 0;
  gap: 6px;
  color: var(--sax-text-color-secondary);
  font-size: 12px;
  font-weight: 600;
}

.calendar-schedule-editor__field :deep(.s-time-picker) {
  width: 100%;
}

.calendar-schedule-editor__field :deep(.s-date-picker) {
  width: 100%;
}

@media (max-width: 560px) {
  .calendar-schedule-editor__times,
  .calendar-schedule-editor__dates {
    grid-template-columns: 1fr;
  }
}
</style>
