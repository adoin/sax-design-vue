<template>
  <button
    type="button"
    class="btn-next"
    :disabled="internalDisabled && !infinite"
    :aria-disabled="internalDisabled && !infinite"
    :aria-label="t('vs.pagination.next')"
  >
    <span v-if="nextText">{{ nextText }}</span>
    <s-icon v-else-if="typeof nextIcon === 'string'" :name="nextIcon" />
    <s-icon v-else>
      <component :is="nextIcon" />
    </s-icon>
  </button>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { SIcon } from '@vuesax-alpha/components/icon'
import { useLocale } from '@vuesax-alpha/hooks'
import { usePagination } from '../usePagination'
import { paginationNextProps } from './next'

defineOptions({
  name: 'SPaginationNext',
})

defineProps(paginationNextProps)

const { pageCount, disabled, currentPage, infinite } = usePagination()
const { t } = useLocale()

const internalDisabled = computed(
  () =>
    disabled.value ||
    currentPage.value === pageCount.value ||
    pageCount.value === 0,
)
</script>
