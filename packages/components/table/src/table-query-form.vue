<script setup lang="ts">
import { computed, ref, shallowRef, useSlots, watch } from 'vue'
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
