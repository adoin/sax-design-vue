<template>
  <span :class="ns.e('total')" :disabled="disabled">
    {{ t('vs.pagination.total', { total: total ?? 0 }) }}
  </span>
</template>

<script lang="ts" setup>
import { useLocale, useNamespace } from '@vuesax-alpha/hooks'
import { usePagination } from '../usePagination'
import { paginationTotalProps } from './total'

defineOptions({
  name: 'SPaginationTotal',
})
defineProps(paginationTotalProps)

const ns = useNamespace('pagination')
const { t } = useLocale()
const { disabled } = usePagination()
</script>
