<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onUpdated,
  shallowRef,
  watch,
} from 'vue'
import { SIcon } from '@vuesax-alpha/components/icon'
import { SPopper } from '@vuesax-alpha/components/popper'
import { useLocale, useNamespace } from '@vuesax-alpha/hooks'
import { tableValidationId } from './validation-utils'
import type { TableValidation } from './composables/use-table-validation'
import type { PopperInstance } from '@vuesax-alpha/components/popper'

defineOptions({ name: 'STableValidationOverlay' })

const props = defineProps<{
  validation: TableValidation
  selectionName?: string
}>()

const ns = useNamespace('table')
const { t } = useLocale()
const popper = shallowRef<PopperInstance>()
const anchor = shallowRef<HTMLElement>()
const appendTo = shallowRef<HTMLElement>()
const temporarilyVisible = shallowRef(false)
let anchorFrame: number | undefined
let hideTimer: ReturnType<typeof setTimeout> | undefined
let disposed = false
const temporaryDuration = 2000

const activeError = computed(() => props.validation.activeError.value)
const errorCount = computed(() => props.validation.errorCount.value)
const errorCountTruncated = computed(
  () => props.validation.errorCountTruncated.value,
)
const activePosition = computed(
  () => props.validation.activeErrorIndex.value + 1,
)
const countThreshold = computed(() => Math.max(1, errorCount.value - 1))
const totalLabel = computed(() =>
  errorCountTruncated.value
    ? `${countThreshold.value}+`
    : String(errorCount.value),
)
const positionLabel = computed(() =>
  errorCountTruncated.value && activePosition.value > countThreshold.value
    ? totalLabel.value
    : String(activePosition.value),
)
const visible = computed(
  () =>
    Boolean(activeError.value) &&
    Boolean(appendTo.value) &&
    (props.validation.activeErrorPreviewed.value ||
      (props.validation.navigationVisible.value && temporarilyVisible.value)),
)

const hideTemporary = () => {
  if (hideTimer !== undefined) clearTimeout(hideTimer)
  hideTimer = undefined
  temporarilyVisible.value = false
}
const showTemporarily = () => {
  hideTemporary()
  temporarilyVisible.value = true
  hideTimer = setTimeout(() => {
    hideTimer = undefined
    temporarilyVisible.value = false
  }, temporaryDuration)
}

const findAnchor = () => {
  const error = activeError.value
  if (!error || typeof document === 'undefined') return undefined
  const id = `${tableValidationId(
    props.selectionName,
    error.rowKey,
    error.field,
    error.columnIndex,
  )}-cell`
  return document.querySelector<HTMLElement>(`[id="${id}"]`) ?? undefined
}

const scheduleAnchor = async (attempt = 0) => {
  await nextTick()
  if (disposed) return
  if (typeof requestAnimationFrame === 'undefined') {
    const target = findAnchor()
    anchor.value = target
    if (target) popper.value?.updatePopper()
    return
  }
  if (anchorFrame !== undefined) cancelAnimationFrame(anchorFrame)
  anchorFrame = requestAnimationFrame(() => {
    anchorFrame = undefined
    if (disposed) return
    const target = findAnchor()
    anchor.value = target
    if (target) popper.value?.updatePopper()
    else if (activeError.value && attempt < 5) scheduleAnchor(attempt + 1)
  })
}

const navigate = async (step: -1 | 1) => {
  await props.validation.navigate(step)
  await scheduleAnchor()
}

watch(
  () => [
    activeError.value?.rowKey,
    activeError.value?.field,
    activeError.value?.columnIndex,
    props.validation.navigationVisible.value,
  ],
  () => scheduleAnchor(),
  { immediate: true, flush: 'post' },
)
watch(
  () => props.validation.presentationRevision.value,
  () => {
    if (activeError.value) showTemporarily()
    else hideTemporary()
  },
  { immediate: true, flush: 'post' },
)
onUpdated(() => scheduleAnchor())
onBeforeUnmount(() => {
  disposed = true
  hideTemporary()
  if (anchorFrame !== undefined && typeof cancelAnimationFrame !== 'undefined')
    cancelAnimationFrame(anchorFrame)
})
</script>

<template>
  <div ref="appendTo" :class="ns.e('validation-overlay-host')" />

  <SPopper
    v-if="activeError"
    ref="popper"
    :visible="visible"
    :virtual-ref="anchor"
    virtual-triggering
    :trigger="[]"
    placement="top"
    :offset="10"
    :flip="{ padding: 12 }"
    :shift="{ padding: 12 }"
    :interactivity="false"
    :popper-class="ns.e('validation-popover')"
    :append-to="appendTo"
    persistent
  >
    <template #content>
      <div :class="ns.e('validation-popover-content')" aria-hidden="true">
        <SIcon name="cb:warning-alt-filled" />
        <span>{{ activeError?.message }}</span>
      </div>
    </template>
  </SPopper>

  <div
    v-if="validation.navigationVisible.value && errorCount > 1"
    :class="ns.e('validation-navigator')"
    role="toolbar"
    :aria-label="t('vs.table.validationNavigation')"
    @keydown.left.prevent="navigate(-1)"
    @keydown.right.prevent="navigate(1)"
  >
    <span :class="ns.e('validation-count')" aria-hidden="true">
      {{ totalLabel }}
    </span>
    <span :class="ns.e('validation-position')" role="status" aria-live="polite">
      {{
        t('vs.table.validationPosition', {
          current: positionLabel,
          total: totalLabel,
        })
      }}
    </span>
    <button
      type="button"
      :class="ns.e('validation-navigation-action')"
      :aria-label="t('vs.table.validationPrevious')"
      @click="navigate(-1)"
    >
      <SIcon name="cb:chevron-left" aria-hidden="true" />
    </button>
    <button
      type="button"
      :class="ns.e('validation-navigation-action')"
      :aria-label="t('vs.table.validationNext')"
      @click="navigate(1)"
    >
      <SIcon name="cb:chevron-right" aria-hidden="true" />
    </button>
    <span :class="ns.e('validation-navigation-divider')" aria-hidden="true" />
    <button
      type="button"
      :class="ns.e('validation-navigation-action')"
      :aria-label="t('vs.table.validationClose')"
      @click="validation.closeNavigation"
    >
      <SIcon name="cb:close" aria-hidden="true" />
    </button>
  </div>
</template>
