import { computed, nextTick, onBeforeUnmount, reactive, shallowRef } from 'vue'
import { cloneDeep, isEqual } from 'lodash-unified'
import type { FormInstance, FormModel } from '@vuesax-alpha/components/form'
import type {
  TableFilters,
  TablePagerConfig,
  TableSort,
} from '@vuesax-alpha/components/table'
import type {
  TableGridEmitFn,
  TableGridProps,
  TableGridQueryContext,
} from './table-grid'

/** Query orchestration only; STable remains responsible for the actual row pipeline. */
export function useGridQuery(
  props: TableGridProps,
  emit: TableGridEmitFn,
  form: () => FormInstance | undefined,
) {
  const emptyModel = reactive<FormModel>({})
  const queryConfig = computed(() =>
    typeof props.queryConfig === 'object' ? props.queryConfig : {},
  )
  const model = computed(() => queryConfig.value.model ?? emptyModel)
  const enabled = computed(
    () => Boolean(props.queryConfig) && queryConfig.value.enabled !== false,
  )
  const innerPager = shallowRef<TablePagerConfig>({
    currentPage: 1,
    pageSize: 10,
  })
  const innerSorts = shallowRef<TableSort[]>([])
  const innerFilters = shallowRef<TableFilters>({})
  const pager = computed<TablePagerConfig | false>(() => {
    if (!props.pagerConfig) return false
    const config =
      typeof props.pagerConfig === 'object' ? props.pagerConfig : {}
    return {
      ...config,
      currentPage: config.currentPage ?? innerPager.value.currentPage,
      pageSize: config.pageSize ?? innerPager.value.pageSize,
    }
  })
  const sorts = computed(() => props.sortBy ?? innerSorts.value)
  const filters = computed(() => props.filters ?? innerFilters.value)
  const busy = shallowRef(false)
  let sequence = 0
  let disposed = false
  let cancelValidation: (() => void) | undefined
  const context = (
    reason: TableGridQueryContext['reason'] = 'submit',
  ): TableGridQueryContext => ({
    reason,
    form: cloneDeep(model.value),
    pager: cloneDeep(pager.value),
    sortBy: cloneDeep(sorts.value),
    filters: cloneDeep(filters.value),
  })
  const updatePager = (value: TablePagerConfig) => {
    innerPager.value = value
  }
  const updateSorts = (value: TableSort[]) => {
    innerSorts.value = value
  }
  const updateFilters = (value: TableFilters) => {
    innerFilters.value = value
  }
  const run = async (reason: TableGridQueryContext['reason']) => {
    if (disposed || props.loading || busy.value || queryConfig.value.disabled)
      return false
    const request = ++sequence
    const activeModel = model.value
    const activeConfig = props.queryConfig
    const values = cloneDeep(activeModel)
    busy.value = true
    try {
      if (reason === 'reset') form()?.resetFields()
      if (reason === 'submit' && enabled.value) {
        const valid = await new Promise<boolean>((resolve, reject) => {
          cancelValidation = () => resolve(false)
          Promise.resolve(form()?.validate()).then(
            (value) => resolve(Boolean(value)),
            reject,
          )
        })
        if (!valid) return false
      }
      if (disposed || request !== sequence || props.loading) return false
      if (
        reason === 'submit' &&
        (model.value !== activeModel ||
          props.queryConfig !== activeConfig ||
          !isEqual(model.value, values))
      )
        return false
      if (
        reason !== 'refresh' &&
        pager.value &&
        pager.value.enabled !== false &&
        pager.value.currentPage !== 1
      ) {
        const next = { ...pager.value, currentPage: 1 }
        updatePager(next)
        emit('update:pagerConfig', next)
        await nextTick()
        if (
          disposed ||
          request !== sequence ||
          !pager.value ||
          pager.value.currentPage !== 1
        )
          return false
      }
      if (
        props.loading ||
        queryConfig.value.disabled ||
        (reason === 'submit' &&
          (model.value !== activeModel ||
            props.queryConfig !== activeConfig ||
            !isEqual(model.value, values)))
      )
        return false
      emit('query', context(reason))
      return true
    } catch (error) {
      if (!disposed && request === sequence) emit('queryError', error)
      return false
    } finally {
      cancelValidation = undefined
      if (request === sequence) busy.value = false
    }
  }
  onBeforeUnmount(() => {
    disposed = true
    sequence++
    cancelValidation?.()
  })
  return {
    enabled,
    model,
    queryConfig,
    pager,
    sorts,
    filters,
    busy,
    context,
    run,
    updatePager,
    updateSorts,
    updateFilters,
  }
}
