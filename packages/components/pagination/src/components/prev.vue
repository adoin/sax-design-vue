<template>
  <button
    type="button"
    class="btn-prev"
    :disabled="internalDisabled && !infinite"
    :aria-disabled="internalDisabled && !infinite"
    :aria-label="t('vs.pagination.previous')"
  >
    <span v-if="prevText">{{ prevText }}</span>
    <s-icon v-else-if="typeof prevIcon === 'string'" :name="prevIcon" />
    <s-icon v-else>
      <component :is="prevIcon" />
    </s-icon>
  </button>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { SIcon } from '@vuesax-alpha/components/icon'
import { useLocale } from '@vuesax-alpha/hooks'
import { usePagination } from '../usePagination'
import { paginationPrevProps } from './prev'

defineOptions({
  name: 'SPaginationPrev',
})

const { disabled, currentPage, infinite } = usePagination()
const { t } = useLocale()
defineProps(paginationPrevProps)

const internalDisabled = computed(
  () => disabled.value || currentPage.value <= 1,
)
</script>
