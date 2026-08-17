<template>
  <s-calendar
    v-model="selectedDate"
    v-model:date="date"
    v-model:view="view"
    :events="events"
    :get-context-menu-items="getContextMenuItems"
    editable
    @cell-click="activity = `Selected: ${$event}`"
    @event-click="activity = $event.title"
    @event-change="moveEvent"
    @context-menu-select="
      activity = `${$event.item.label}: ${$event.context.date}`
    "
  />
  <p class="value">
    Selected date: {{ selectedDate }} ·
    {{ activity || 'Click a date, event, or drag an event in week/day view.' }}
  </p>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import type { CalendarContextMenuContext, CalendarEvent } from 'sax-design-vue'

const date = ref('2026-07-22')
const view = ref<'month' | 'week' | 'day'>('month')
const selectedDate = ref('2026-07-22')
const activity = ref('')
const events = ref<CalendarEvent[]>([
  {
    id: 1,
    title: 'Product planning',
    start: '2026-07-20T09:00',
    end: '2026-07-20T10:30',
    color: '#6366f1',
  },
  {
    id: 2,
    title: 'Design review',
    start: '2026-07-22T13:30',
    end: '2026-07-22T15:00',
    color: '#a855f7',
  },
  {
    id: 3,
    title: 'Release window',
    start: '2026-07-24',
    end: '2026-07-24',
    allDay: true,
    color: '#0ea5e9',
  },
  {
    id: 4,
    title: 'Team sync',
    start: '2026-07-25T10:00',
    end: '2026-07-25T11:00',
    color: '#10b981',
  },
])

const moveEvent = ({
  event,
  start,
  end,
}: {
  event: CalendarEvent
  start: string
  end?: string
}) => {
  events.value = events.value.map((item) =>
    item.id === event.id ? { ...item, start, end } : item,
  )
}

const isZh =
  typeof window !== 'undefined' && window.location.pathname.startsWith('/zh/')
const menuLabels = computed(() =>
  isZh
    ? {
        edit: '编辑日程',
        duplicate: '复制日程',
        remove: '删除日程',
        create: '创建日程',
        block: '占用该时间',
      }
    : {
        edit: 'Edit event',
        duplicate: 'Duplicate',
        remove: 'Delete',
        create: 'Create event',
        block: 'Block this time',
      },
)
const getContextMenuItems = (context: CalendarContextMenuContext) =>
  context.type === 'event'
    ? [
        { label: menuLabels.value.edit, icon: 'edit' },
        { label: menuLabels.value.duplicate, icon: 'content_copy' },
        {
          label: menuLabels.value.remove,
          icon: 'delete',
          divided: true,
        },
      ]
    : [
        { label: menuLabels.value.create, icon: 'add' },
        { label: menuLabels.value.block, icon: 'block' },
      ]
</script>

<style scoped>
.value {
  margin: 10px 2px 0;
  color: var(--sax-text-color-secondary);
  font-size: 12px;
}
</style>
