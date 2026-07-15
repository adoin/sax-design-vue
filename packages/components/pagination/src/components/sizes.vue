<template>
  <span :class="ns.e('sizes')">
    <s-select
      :model-value="innerPageSize"
      :disabled="disabled"
      @change="handleChange"
    >
      <s-option
        v-for="item in innerPageSizes"
        :key="item"
        :value="item"
        :label="`${item} / page`"
      />
    </s-select>
  </span>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { isEqual } from 'lodash-unified'
import SSelect, { SOption } from '@vuesax-alpha/components/select'
import { useNamespace } from '@vuesax-alpha/hooks'
import { usePagination } from '../usePagination'
import { paginationSizesEmits, paginationSizesProps } from './sizes'

defineOptions({
  name: 'SPaginationSizes',
})

const props = defineProps(paginationSizesProps)
const emit = defineEmits(paginationSizesEmits)
const ns = useNamespace('pagination')

const { disabled, handleSizeChange } = usePagination()

const innerPageSize = ref<number>(props.pageSize)

watch(
  () => props.pageSizes,
  (newVal, oldVal) => {
    if (isEqual(newVal, oldVal)) return
    if (Array.isArray(newVal)) {
      const pageSize = newVal.includes(props.pageSize!)
        ? props.pageSize
        : props.pageSizes[0]
      emit('page-size-change', pageSize)
    }
  }
)

watch(
  () => props.pageSize,
  (newVal) => {
    innerPageSize.value = newVal!
  }
)

const innerPageSizes = computed(() => props.pageSizes)

/**
 * @param val Number
 */
function handleChange(val: any): any {
  if (val !== innerPageSize.value && typeof val === 'number') {
    innerPageSize.value = val
    handleSizeChange(Number(val))
  }
}
</script>
