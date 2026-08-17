<template>
  <s-select
    v-model="value"
    filterable
    highlight-search
    show-selected-mark
    search-placeholder="Search a city"
    placeholder="Choose a city"
    :options="options"
    :filter-option="filterOption"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const value = ref('')
const options = [
  { value: 'shanghai', label: 'Shanghai' },
  { value: 'shenzhen', label: 'Shenzhen' },
  { value: 'hangzhou', label: 'Hangzhou' },
]

const filterOption = (query: string, option: (typeof options)[number]) =>
  option.label.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())
</script>
