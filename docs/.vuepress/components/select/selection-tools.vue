<template>
  <s-select
    v-model="value"
    multiple
    filterable
    multiple-display-mode="text"
    :options="options"
    :selection-tools="['all', 'invert', 'clear']"
    :get-display-value="getDisplayValue"
    :placeholder="t('vs.select.placeholder')"
    :search-placeholder="t('vs.select.search')"
  >
    <template #footer="{ selectedCount, totalCount }">
      <div class="select-selection-summary">
        <span>{{
          t('vs.select.selectedCount', { count: selectedCount })
        }}</span>
        <span>{{ t('vs.select.totalCount', { count: totalCount }) }}</span>
      </div>
    </template>
  </s-select>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useLocale } from '@vuesax-alpha/hooks'

const { t } = useLocale()
const value = ref<string[]>(['ada'])
const options = [
  { value: 'ada', label: 'Ada Lovelace' },
  { value: 'grace', label: 'Grace Hopper' },
  { value: 'linus', label: 'Linus Torvalds' },
  { value: 'margaret', label: 'Margaret Hamilton' },
]

const getDisplayValue = ({ labels }: { labels: string[] }) =>
  labels.length
    ? t('vs.select.selectedSummary', {
        count: labels.length,
        labels: labels.join(', '),
      })
    : ''
</script>

<style scoped>
.select-selection-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
</style>
