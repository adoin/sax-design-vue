<template>
  <s-select
    v-model="value"
    filterable
    clearable
    :options="currentPage"
    :cached-options="selectedCache"
    placeholder="Remote result"
  >
    <template #header>Current search page</template>
    <template #footer="{ selectedCount, totalCount }">
      {{ selectedCount ? 'Selection restored from cache' : 'No selection' }} ·
      {{ totalCount }} current options
    </template>
  </s-select>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const value = ref('archived-user')
const currentPage = [
  { value: 'current-user', label: 'Current page result' },
  { value: 'next-user', label: 'Another result' },
]
const selectedCache = [
  { value: 'archived-user', label: 'Cached selected user' },
]
</script>
