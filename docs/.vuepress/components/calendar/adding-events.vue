<template>
  <div class="calendar-event-editor">
    <div class="calendar-event-editor__form">
      <s-input v-model="draft.title" :label="labels.title" />
      <label
        class="calendar-event-editor__field calendar-event-editor__field--date"
      >
        <span>{{ labels.date }}</span>
        <s-date-picker
          v-model="draft.date"
          format="YYYY.MM.DD"
          value-format="YYYY-MM-DD"
          :clearable="false"
        />
      </label>
      <label
        class="calendar-event-editor__field calendar-event-editor__field--time"
      >
        <span>{{ labels.start }}</span>
        <s-time-picker
          v-model="draft.start"
          format="HH:mm"
          value-format="HH:mm"
          :clearable="false"
        />
      </label>
      <label
        class="calendar-event-editor__field calendar-event-editor__field--time"
      >
        <span>{{ labels.end }}</span>
        <s-time-picker
          v-model="draft.end"
          format="HH:mm"
          value-format="HH:mm"
          :clearable="false"
        />
      </label>
      <div class="calendar-event-editor__actions">
        <s-button :disabled="!canAdd" @click="saveEvent">
          {{ editingId ? labels.save : labels.add }}
        </s-button>
        <s-button v-if="editingId" transparent @click="cancelEdit">
          {{ labels.cancel }}
        </s-button>
      </div>
    </div>

    <s-calendar
      v-model:date="visibleDate"
      v-model:view="view"
      :events="events"
      :schedule-height="420"
      @event-click="editEvent"
      @event-edit="editEvent"
      @event-delete="deleteEvent"
    />
    <p class="calendar-event-editor__hint">{{ labels.hint }}</p>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'
import type { CalendarEvent } from 'sax-design-vue'

const visibleDate = ref('2026-07-22')
const view = ref<'month' | 'week' | 'day'>('month')
const isZh =
  typeof window !== 'undefined' && window.location.pathname.startsWith('/zh/')
const labels = isZh
  ? {
      add: '添加日程',
      save: '保存修改',
      cancel: '取消编辑',
      title: '标题',
      date: '日期',
      start: '开始时间',
      end: '结束时间',
      hint: '点击已有日程可编辑；双击同样会触发 event-edit。',
    }
  : {
      add: 'Add event',
      save: 'Save changes',
      cancel: 'Cancel edit',
      title: 'Title',
      date: 'Date',
      start: 'Start',
      end: 'End',
      hint: 'Click an existing event to edit it. Double-clicking also emits event-edit.',
    }
const events = ref<CalendarEvent[]>([
  {
    id: 'handoff',
    title: isZh ? '设计交接' : 'Design handoff',
    start: '2026-07-22T14:00',
    end: '2026-07-22T15:00',
    color: '#6366f1',
  },
])
const editingId = ref<CalendarEvent['id']>()
const draft = reactive({
  title: 'Design handoff',
  date: '2026-07-22',
  start: '14:00',
  end: '15:00',
})
const canAdd = computed(
  () =>
    Boolean(draft.title.trim() && draft.date && draft.start && draft.end) &&
    draft.start < draft.end,
)

const saveEvent = () => {
  if (!canAdd.value) return
  const nextEvent: CalendarEvent = {
    id: editingId.value ?? `${Date.now()}-${events.value.length}`,
    title: draft.title.trim(),
    start: `${draft.date}T${draft.start}`,
    end: `${draft.date}T${draft.end}`,
    color: '#6366f1',
  }
  events.value = editingId.value
    ? events.value.map((event) =>
        event.id === editingId.value ? { ...event, ...nextEvent } : event,
      )
    : [...events.value, nextEvent]
  visibleDate.value = draft.date
  editingId.value = undefined
}
const editEvent = (event: CalendarEvent) => {
  const start = new Date(event.start)
  const end = new Date(event.end || event.start)
  const time = (value: Date) =>
    `${String(value.getHours()).padStart(2, '0')}:${String(value.getMinutes()).padStart(2, '0')}`
  const date = (value: Date) =>
    `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`
  editingId.value = event.id
  draft.title = event.title
  draft.date = date(start)
  draft.start = time(start)
  draft.end = time(end)
}
const cancelEdit = () => {
  editingId.value = undefined
}
const deleteEvent = (event: CalendarEvent) => {
  events.value = events.value.filter((item) => item.id !== event.id)
  if (editingId.value === event.id) cancelEdit()
}
</script>

<style scoped>
.calendar-event-editor {
  display: grid;
  gap: 16px;
}

.calendar-event-editor__form {
  display: grid;
  grid-template-columns: minmax(150px, 1fr) 152px repeat(2, 112px);
  align-items: end;
  justify-content: start;
  gap: 10px;
}

.calendar-event-editor__field {
  display: grid;
  min-width: 0;
  gap: 6px;
  color: var(--sax-text-color-secondary);
  font-size: 12px;
  font-weight: 600;
}

.calendar-event-editor__field :deep(.s-date-picker),
.calendar-event-editor__field :deep(.s-time-picker) {
  min-width: 0;
  width: 100%;
}

.calendar-event-editor__field :deep(.s-input),
.calendar-event-editor__field :deep(.s-input__wrapper),
.calendar-event-editor__field :deep(.s-input__original) {
  min-width: 0;
}

.calendar-event-editor__field--date {
  max-width: 152px;
}

.calendar-event-editor__field--time {
  max-width: 112px;
}

.calendar-event-editor__actions {
  display: flex;
  align-items: center;
  gap: 8px;
  grid-column: 1 / -1;
}

.calendar-event-editor__hint {
  margin: 0;
  color: var(--sax-text-color-secondary);
  font-size: 12px;
}

@media (max-width: 720px) {
  .calendar-event-editor__form {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
