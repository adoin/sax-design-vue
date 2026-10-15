<script setup lang="ts">
import {
  computed,
  onActivated,
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  useSlots,
  watch,
} from 'vue'
import { pick } from 'lodash-unified'
import { SForm, formProps } from '@vuesax-alpha/components/form'
import { SButton } from '@vuesax-alpha/components/button'
import { useLocale } from '@vuesax-alpha/hooks'
import type {
  FormInstance,
  FormItemConfig,
  FormModel,
} from '@vuesax-alpha/components/form'
import type {
  TableQueryActionsState,
  TableQueryConfig,
  TableQueryFixedButton,
  TableSize,
} from './table-business'

const props = defineProps<{
  config: TableQueryConfig
  model: FormModel
  busy: boolean
  size: TableSize
}>()
const emit = defineEmits<{ query: []; reset: [] }>()
const slots = useSlots()
const { t } = useLocale()
const form = ref<FormInstance>()
const layout = ref<HTMLDivElement>()
const actions = ref<HTMLDivElement>()
const actionsOffset = shallowRef(0)
let resizeObserver: ResizeObserver | undefined
let observedControl: HTMLElement | undefined
let alignmentFrame: number | undefined
let mounted = false

const alignActions = () => {
  const container = layout.value
  const buttons = actions.value
  const formElement = container?.querySelector<HTMLElement>(
    '.s-table-shell__query-form',
  )
  if (!container || !buttons || !(formElement instanceof HTMLElement)) return
  const candidates = formElement.querySelectorAll<HTMLElement>(
    '.s-form-item:not(.is-nested) > .s-form-item__body > .s-form-item__content',
  )
  const control =
    [...candidates].find((element) => {
      const rect = element.getBoundingClientRect()
      return rect.width > 0 && rect.height > 0
    }) ??
    formElement.querySelector<HTMLElement>(
      '.s-input, .s-select, input, select, textarea',
    ) ??
    undefined
  if (observedControl !== control) {
    if (observedControl) resizeObserver?.unobserve(observedControl)
    observedControl = control
    if (control) resizeObserver?.observe(control)
  }
  // The fixed area occupies its own row below the form on narrow containers.
  const columns = getComputedStyle(container)
    .gridTemplateColumns.trim()
    .split(/\s+/)
  if (!control || columns.length < 2) {
    actionsOffset.value = 0
    return
  }
  const rect = control.getBoundingClientRect()
  const offset =
    rect.top +
    rect.height / 2 -
    container.getBoundingClientRect().top -
    buttons.getBoundingClientRect().height / 2
  actionsOffset.value = Math.max(0, Math.round(offset * 100) / 100)
}
const scheduleAlignment = () => {
  if (!mounted || alignmentFrame !== undefined) return
  if (typeof requestAnimationFrame !== 'function') {
    alignActions()
    return
  }
  alignmentFrame = requestAnimationFrame(() => {
    alignmentFrame = undefined
    alignActions()
  })
}
const options = computed(() => pick(props.config, Object.keys(formProps)))
const expanded = shallowRef(false)
const containsHiddenItem = (items: readonly FormItemConfig[] = []): boolean =>
  items.some(
    (item) => item.visible === false || containsHiddenItem(item.children ?? []),
  )
const hasMore = computed(() => containsHiddenItem(props.config.items ?? []))
const revealHiddenItems = (
  items: readonly FormItemConfig[] = [],
): FormItemConfig[] =>
  items.map((item) => ({
    ...item,
    ...(item.visible === false ? { visible: true } : {}),
    ...(item.children?.length
      ? { children: revealHiddenItems(item.children) }
      : {}),
  }))
const items = computed(() =>
  expanded.value
    ? revealHiddenItems(props.config.items ?? [])
    : (props.config.items ?? []),
)
const defaultFixedButtons: TableQueryFixedButton[] = ['submit', 'reset']
const fixedButtons = computed(() => {
  if (props.config.fixedButtons) return [...new Set(props.config.fixedButtons)]
  return props.config.showActions === false ? [] : defaultFixedButtons
})
const visibleFixedButtons = computed(() =>
  fixedButtons.value.filter((button) => button !== 'more' || hasMore.value),
)
const hasFixedRegion = computed(
  () => visibleFixedButtons.value.length > 0 || Boolean(slots.actions),
)
const toggleMore = () => {
  if (hasMore.value) expanded.value = !expanded.value
}
const actionsState = computed<TableQueryActionsState>(() => ({
  expanded: expanded.value,
  hasMore: hasMore.value,
  toggleMore,
}))
watch(hasMore, (value) => {
  if (!value) expanded.value = false
})
watch(
  () => [props.config, props.model, props.size, expanded.value],
  scheduleAlignment,
  { deep: true, flush: 'post' },
)
onMounted(() => {
  mounted = true
  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(scheduleAlignment)
    if (layout.value) resizeObserver.observe(layout.value)
    const formElement = layout.value?.querySelector(
      '.s-table-shell__query-form',
    )
    if (formElement) resizeObserver.observe(formElement)
    if (actions.value) resizeObserver.observe(actions.value)
  }
  alignActions()
})
watch(
  actions,
  (element, previous) => {
    if (previous) resizeObserver?.unobserve(previous)
    if (element) resizeObserver?.observe(element)
    scheduleAlignment()
  },
  { flush: 'post' },
)
onActivated(scheduleAlignment)
onBeforeUnmount(() => {
  mounted = false
  resizeObserver?.disconnect()
  if (alignmentFrame !== undefined) cancelAnimationFrame(alignmentFrame)
})
const onSubmit = (event: Event) => {
  event.preventDefault()
  event.stopImmediatePropagation()
  emit('query')
}
defineExpose({ getForm: () => form.value })
</script>

<template>
  <div class="s-table-shell__query" @submit.capture="onSubmit">
    <div
      ref="layout"
      :style="{ '--s-table-query-actions-offset': `${actionsOffset}px` }"
      :class="[
        's-table-shell__query-layout',
        { 'is-with-fixed-buttons': hasFixedRegion },
      ]"
    >
      <SForm
        ref="form"
        v-bind="options"
        class="s-table-shell__query-form"
        :model="model"
        :items="items"
        :size="size"
        :disabled="busy || config.disabled"
      >
        <template
          v-for="name in Object.keys($slots).filter(
            (name) => name !== 'default' && name !== 'actions',
          )"
          #[name]="params"
          ><slot :name="name" v-bind="params || {}"
        /></template>
        <template #default>
          <slot />
        </template>
      </SForm>
      <div
        v-if="hasFixedRegion"
        ref="actions"
        class="s-table-shell__query-actions s-table-shell__query-fixed-buttons"
      >
        <slot name="actions" v-bind="actionsState">
          <template v-for="button in visibleFixedButtons" :key="button">
            <SButton
              v-if="button === 'submit'"
              :debounce="false"
              :size="size"
              data-query-action="submit"
              :disabled="busy || config.disabled"
              @click.prevent="emit('query')"
              >{{ config.submitText ?? t('vs.table.query') }}</SButton
            >
            <SButton
              v-else-if="button === 'reset'"
              :debounce="false"
              :size="size"
              data-query-action="reset"
              flat
              :disabled="busy || config.disabled"
              @click.prevent="emit('reset')"
              >{{ config.resetText ?? t('vs.table.reset') }}</SButton
            >
            <SButton
              v-else
              :debounce="false"
              :size="size"
              data-query-action="more"
              flat
              :disabled="busy || config.disabled"
              :aria-expanded="expanded"
              @click.prevent="toggleMore"
              >{{
                expanded ? t('vs.table.queryLess') : t('vs.table.queryMore')
              }}</SButton
            >
          </template>
        </slot>
      </div>
    </div>
  </div>
</template>
