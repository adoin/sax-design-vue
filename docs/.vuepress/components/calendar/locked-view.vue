<template>
  <s-calendar
    v-model:date="visibleDate"
    view="week"
    :views="['week']"
    hour-format="24"
    :events="events"
    :schedule-height="380"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { CalendarEvent } from 'sax-design-vue'

const visibleDate = ref('2026-07-22')
const events: CalendarEvent[] = [
  {
    id: 'focus',
    title: 'Focus time',
    content: 'A locked week-only calendar',
    start: '2026-07-22T09:00',
    end: '2026-07-22T11:00',
    color: '#2563ff',
  },
]
</script>
