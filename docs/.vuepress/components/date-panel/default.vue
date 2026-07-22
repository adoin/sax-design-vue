<template>
  <s-date-panel
    picker-type="date"
    :model-value="today"
    @pick="picked = $event"
  />
  <p v-if="picked">Picked: {{ picked.format('YYYY-MM-DD') }}</p>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import dayjs, { type Dayjs } from 'dayjs'
const today = dayjs()
const picked = ref<Dayjs>()
</script>
