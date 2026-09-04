<script setup lang="ts">
import { computed, nextTick, shallowRef, watch } from 'vue'
import { SButton } from '@vuesax-alpha/components/button'
import { SInput } from '@vuesax-alpha/components/input'
import { SCheckbox } from '@vuesax-alpha/components/checkbox'
import { SSelect } from '@vuesax-alpha/components/select'
import { useId, useLocale, useNamespace, useShape } from '@vuesax-alpha/hooks'
import type { ButtonInstance } from '@vuesax-alpha/components/button'
import type { TableFindController } from './composables/use-table-find'
import type { TableFindScope } from './table-find'

const props = defineProps<{ finder: TableFindController }>()
const ns = useNamespace('table')
const shape = useShape()
const { t } = useLocale()
const id = useId()
const trigger = shallowRef<ButtonInstance>()
const panel = shallowRef<HTMLElement>()
const opened = shallowRef(false)
const text = shallowRef('')
const replacement = shallowRef('')
const caseSensitive = shallowRef(false)
const wholeCell = shallowRef(false)
const scope = shallowRef<TableFindScope>(
  props.finder.config.value.scope ?? 'view',
)
const message = shallowRef('')
let sequence = 0
const state = computed(() => props.finder.getFindState())
watch(
  [() => props.finder.query.value, () => props.finder.scan.value],
  () => {
    message.value = ''
  },
  { flush: 'sync' },
)
const busy = computed(() => Boolean(state.value.pending))
const scopes = computed(() =>
  ['view', 'selection', 'data'].map((value) => ({
    value,
    label: t(`vs.table.findScope_${value}`),
  })),
)
const status = computed(() => {
  if (busy.value) return t('vs.table.findWorking')
  if (message.value) return message.value
  if (!state.value.query.text) return t('vs.table.findHint')
  if (state.value.limit)
    return t('vs.table.findLimited', {
      count: state.value.matches.length,
      visited: state.value.visited,
    })
  return t('vs.table.findCount', {
    current: state.value.activeIndex + 1,
    total: state.value.matches.length,
  })
})
const clearResults = () => {
  sequence++
  message.value = ''
  props.finder.clearFind()
}
const open = async (replace = false) => {
  if (!props.finder.enabled.value) return false
  message.value = ''
  const current = state.value
  text.value = current.query.text
  caseSensitive.value = current.query.caseSensitive ?? false
  wholeCell.value = current.query.wholeCell ?? false
  scope.value = current.scope
  opened.value = true
  await nextTick()
  const input = panel.value?.querySelector<HTMLInputElement>(
    replace ? '[data-find-replacement] input' : '[data-find-query] input',
  )
  input?.focus()
  input?.select()
  return Boolean(input)
}
const close = () => {
  sequence++
  props.finder.cancelFind()
  const ownFocus = panel.value?.contains(
    panel.value.ownerDocument.activeElement,
  )
  opened.value = false
  if (ownFocus) trigger.value?.$el.focus()
}
const search = async () => {
  const request = ++sequence
  message.value = ''
  const result = await props.finder.findCells(
    {
      text: text.value,
      caseSensitive: caseSensitive.value,
      wholeCell: wholeCell.value,
    },
    { scope: scope.value },
  )
  if (request !== sequence) return
  if (!result.success) message.value = t(`vs.table.findReason_${result.reason}`)
  else if (result.state.matches.length)
    await props.finder.findNext({ focus: false })
}
const navigate = async (backwards = false) => {
  message.value = ''
  const located = await (
    backwards ? props.finder.findPrevious : props.finder.findNext
  )({ focus: false })
  if (!located) message.value = t('vs.table.findUnavailable')
}
const replace = async (all: boolean) => {
  const request = ++sequence
  const result = await (
    all ? props.finder.replaceAll : props.finder.replaceMatch
  )(replacement.value)
  if (request !== sequence) return
  message.value = result.applied
    ? t('vs.table.findReplaced', { count: result.changedCells })
    : t(`vs.table.findReason_${result.reason}`)
}
const enterSearch = (input: Event | KeyboardEvent) => {
  const event = input as KeyboardEvent
  if (!event.isComposing && !event.ctrlKey && !event.metaKey) {
    event.preventDefault()
    search()
  }
}
const keydown = (event: KeyboardEvent) => {
  if (event.defaultPrevented || event.isComposing) return
  const target = event.target as HTMLElement
  const wrapper = trigger.value?.$el.closest(`.${ns.b('wrapper')}`)
  if (!wrapper || target.closest(`.${ns.b('wrapper')}`) !== wrapper) return
  const ownPanel = panel.value?.contains(target)
  if (
    props.finder.config.value.keyboard === false &&
    !(ownPanel && event.key === 'Escape')
  )
    return
  if (
    !ownPanel &&
    target.closest(
      'input,textarea,select,button,a[href],[contenteditable]:not([contenteditable="false"]),[role="combobox"],[role="switch"]',
    )
  )
    return
  if (
    (event.ctrlKey || event.metaKey) &&
    ['f', 'h'].includes(event.key.toLowerCase())
  ) {
    event.preventDefault()
    event.stopPropagation()
    open(event.key.toLowerCase() === 'h')
  } else if (event.key === 'F3' && state.value.matches.length) {
    event.preventDefault()
    event.stopPropagation()
    if (ownPanel) navigate(event.shiftKey)
    else (event.shiftKey ? props.finder.findPrevious : props.finder.findNext)()
  } else if (event.key === 'Escape' && (opened.value || busy.value)) {
    event.preventDefault()
    event.stopPropagation()
    if (busy.value) {
      sequence++
      props.finder.cancelFind()
      message.value = t('vs.table.findReason_cancelled')
    } else close()
  }
}
defineExpose({ open, close, keydown })
</script>

<template>
  <div :class="ns.e('find')">
    <s-button
      ref="trigger"
      size="small"
      flat
      :aria-expanded="opened"
      :aria-controls="id"
      @click="opened ? close() : open()"
    >
      {{ t('vs.table.findTitle') }}
    </s-button>
    <div
      v-if="opened"
      :id="id"
      ref="panel"
      :class="[ns.e('find-panel'), ns.is('square', shape === 'square')]"
      role="search"
      :aria-label="t('vs.table.findTitle')"
      :aria-busy="busy"
    >
      <div :class="ns.e('find-fields')">
        <div data-find-query>
          <label :for="`${id}-query`">{{ t('vs.table.findText') }}</label>
          <s-input
            :id="`${id}-query`"
            v-model="text"
            block
            @update:model-value="clearResults"
            @keydown.enter="enterSearch"
          />
        </div>
        <div data-find-replacement>
          <label :for="`${id}-replacement`">{{
            t('vs.table.findReplacement')
          }}</label>
          <s-input :id="`${id}-replacement`" v-model="replacement" block />
        </div>
        <div>
          <span :id="`${id}-scope`">{{ t('vs.table.findScope') }}</span>
          <s-select
            v-model="scope"
            :aria-labelledby="`${id}-scope`"
            :options="scopes"
            block
            @update:model-value="clearResults"
          />
        </div>
      </div>
      <div :class="ns.e('find-actions')">
        <s-checkbox
          v-model="caseSensitive"
          @update:model-value="clearResults"
          >{{ t('vs.table.findCase') }}</s-checkbox
        >
        <s-checkbox v-model="wholeCell" @update:model-value="clearResults">{{
          t('vs.table.findWhole')
        }}</s-checkbox>
        <s-button size="small" :disabled="busy" @click="search">{{
          t('vs.table.findSearch')
        }}</s-button>
        <s-button
          size="small"
          flat
          :disabled="busy || !state.matches.length"
          @click="navigate(true)"
          >{{ t('vs.table.findPrevious') }}</s-button
        >
        <s-button
          size="small"
          flat
          :disabled="busy || !state.matches.length"
          @click="navigate()"
          >{{ t('vs.table.findNext') }}</s-button
        >
        <s-button
          size="small"
          flat
          :disabled="busy || state.activeIndex < 0"
          @click="replace(false)"
          >{{ t('vs.table.findReplace') }}</s-button
        >
        <s-button
          size="small"
          flat
          :disabled="busy || !state.complete || !state.matches.length"
          @click="replace(true)"
          >{{ t('vs.table.findReplaceAll') }}</s-button
        >
        <s-button v-if="busy" size="small" flat @click="finder.cancelFind()">{{
          t('vs.table.findCancel')
        }}</s-button>
        <s-button size="small" flat @click="close">{{
          t('vs.table.findClose')
        }}</s-button>
      </div>
      <p role="status" aria-live="polite" aria-atomic="true">{{ status }}</p>
    </div>
  </div>
</template>
