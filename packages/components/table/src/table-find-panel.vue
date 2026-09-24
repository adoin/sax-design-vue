<script setup lang="ts">
import {
  computed,
  inject,
  nextTick,
  onBeforeUnmount,
  onMounted,
  shallowRef,
  watch,
} from 'vue'
import { debounce as debounceFn } from 'lodash-unified'
import { SButton } from '@vuesax-alpha/components/button'
import { SInput } from '@vuesax-alpha/components/input'
import { SCheckbox } from '@vuesax-alpha/components/checkbox'
import { SSelect } from '@vuesax-alpha/components/select'
import { SPopper } from '@vuesax-alpha/components/popper'
import { STooltip } from '@vuesax-alpha/components/tooltip'
import { SIcon } from '@vuesax-alpha/components/icon'
import {
  useId,
  useLocale,
  useNamespace,
  useShape,
  useSize,
  useZIndex,
} from '@vuesax-alpha/hooks'
import { tableFindRuntimeKey } from './table-find-context'
import TableFindActionMark from './table-find-action-mark.vue'
import type { InputValue } from '@vuesax-alpha/components/input'
import type { TableFindScope } from './table-find'
import type { ComponentSize } from '@vuesax-alpha/constants'
import type { TableSize } from './table-business'

defineOptions({ name: 'STableFindPanel' })

const props = defineProps<{
  disabled?: boolean
  content?: string
  label?: string
  size?: ComponentSize
}>()
const runtime = inject(tableFindRuntimeKey)
if (!runtime) throw new Error('STableFindPanel must be rendered inside STable')
const finder = runtime.finder
const ns = useNamespace('table')
const shape = useShape()
const inheritedSize = useSize()
const resolvedSize = computed<TableSize>(() =>
  inheritedSize.value === 'small' || inheritedSize.value === 'large'
    ? inheritedSize.value
    : 'default',
)
const { t } = useLocale()
const { currentZIndex } = useZIndex()
const tooltipZIndex = computed(() => currentZIndex.value + 1)
const id = useId()
const trigger = shallowRef<SVGSVGElement | HTMLElement>()
const panel = shallowRef<HTMLElement>()
const opened = shallowRef(false)
const compact = shallowRef(false)
const text = shallowRef('')
const replacement = shallowRef('')
const previewReplacement = shallowRef('')
const schedulePreviewReplacement = debounceFn((value: string) => {
  previewReplacement.value = value
}, 200)
const flushPreviewReplacement = () => {
  schedulePreviewReplacement.cancel()
  previewReplacement.value = replacement.value
}
watch(replacement, (value) => {
  schedulePreviewReplacement(value)
})
const caseSensitive = shallowRef(false)
const wholeCell = shallowRef(false)
const scope = shallowRef<TableFindScope>(finder.config.value.scope ?? 'view')
const message = shallowRef('')
let sequence = 0
let pendingReplaceFocus = false
const autofillInputTypes = new Set([
  'insertReplacementText',
  'insertFromAutocomplete',
])
const state = computed(() => finder.getFindState())
watch(
  () => [
    finder.query.value.text,
    finder.query.value.caseSensitive,
    finder.query.value.wholeCell,
  ],
  () => {
    message.value = ''
  },
)
watch(
  () => finder.scan.value,
  (scan, previous) => {
    if (!scan && previous) message.value = ''
  },
)
watch(
  () => finder.query.value,
  (query) => {
    if (!opened.value) return
    text.value = query.text
    caseSensitive.value = query.caseSensitive ?? false
    wholeCell.value = query.wholeCell ?? false
  },
)
watch(
  () => finder.selected.value.scope,
  (value) => {
    if (opened.value && value) scope.value = value
  },
)
watch(opened, (isOpen, wasOpen) => {
  if (!wasOpen || isOpen) return
  compact.value = false
  sequence++
  const ownFocus = Boolean(
    panel.value?.contains(panel.value.ownerDocument.activeElement),
  )
  if (ownFocus && !props.disabled) trigger.value?.focus({ preventScroll: true })
})
const triggerText = computed(() => props.content || props.label || '')
const triggerLocked = computed(() => props.disabled || !finder.enabled.value)
const onTriggerKeydown = (event: KeyboardEvent) => {
  if (event.key !== 'Enter' && event.key !== ' ') return
  event.preventDefault()
  togglePanel()
}
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
  const current = state.value
  if (
    !current.matches.length &&
    current.activeIndex < 0 &&
    !current.limit &&
    !current.visited
  )
    return ''
  if (current.limit)
    return t('vs.table.findLimited', {
      count: current.matches.length,
      visited: current.visited,
    })
  return t('vs.table.findCount', {
    current: current.activeIndex + 1,
    total: current.matches.length,
  })
})
type FindTool = {
  key: string
  label: string
  icon?: string
  mark?: 'replace' | 'replace-all'
  disabled: boolean
  primary?: boolean
  run: () => void
}
const navigationDisabled = computed(
  () => busy.value || !state.value.matches.length,
)
const replaceDisabled = computed(() => {
  const current = state.value
  return (
    busy.value ||
    current.activeIndex < 0 ||
    !finder.acceptsReplacement(previewReplacement.value, current.activeIndex)
  )
})
const replaceAllDisabled = computed(() => {
  const current = state.value
  return (
    busy.value ||
    !current.complete ||
    !finder.hasAcceptableReplacement(previewReplacement.value)
  )
})
const cancelTool = (): FindTool => ({
  key: 'cancel',
  label: t('vs.table.findCancel'),
  icon: 'cb:close',
  disabled: false,
  run: () => finder.cancelFind(),
})
const resetSession = () => {
  sequence++
  compact.value = false
  message.value = ''
  text.value = ''
  replacement.value = ''
  flushPreviewReplacement()
  caseSensitive.value = false
  wholeCell.value = false
  scope.value = finder.config.value.scope ?? 'view'
  finder.clearFind()
}
const focusInput = async (replace = false) => {
  await nextTick()
  const input = panel.value?.querySelector<HTMLInputElement>(
    replace ? '[data-find-replacement] input' : '[data-find-query] input',
  )
  input?.focus({ preventScroll: true })
  input?.select()
  return Boolean(input)
}
const clearResults = () => {
  sequence++
  message.value = ''
  finder.clearFind()
}
const open = async (replace = false) => {
  if (props.disabled || !finder.enabled.value) return false
  pendingReplaceFocus = replace
  if (!opened.value) {
    resetSession()
    opened.value = true
    await nextTick()
  }
  return focusInput(replace)
}
const shown = () => {
  const replace = pendingReplaceFocus
  pendingReplaceFocus = false
  if (compact.value) return
  const active = panel.value?.ownerDocument.activeElement
  if (active instanceof HTMLElement && panel.value?.contains(active)) return
  return focusInput(replace)
}
const expand = async () => {
  compact.value = false
  return focusInput()
}
const togglePanel = () => {
  if (triggerLocked.value) return
  if (opened.value) close()
  else {
    resetSession()
    opened.value = true
  }
}
const close = () => {
  opened.value = false
}
const hidden = () => {
  finder.cancelFind()
}
const revealFirstReplaceable = async () => {
  if (!(await finder.findNext({ focus: false }))) return
  const first = finder.getFindState().activeIndex
  while (!finder.acceptsReplacement(replacement.value)) {
    await finder.findNext({ focus: false })
    if (finder.getFindState().activeIndex === first) break
  }
}
const search = async () => {
  flushPreviewReplacement()
  const request = ++sequence
  message.value = ''
  const result = await finder.findCells(
    {
      text: text.value,
      caseSensitive: caseSensitive.value,
      wholeCell: wholeCell.value,
    },
    { scope: scope.value },
  )
  if (request !== sequence) return
  if (!result.success) message.value = t(`vs.table.findReason_${result.reason}`)
  else if (result.state.matches.length) {
    await revealFirstReplaceable()
    if (request !== sequence) return
    compact.value = true
    await nextTick()
    if (request !== sequence) return
    panel.value
      ?.querySelector<HTMLElement>(`.${ns.e('find-results')} button`)
      ?.focus({ preventScroll: true })
  }
}
const navigate = async (backwards = false) => {
  message.value = ''
  const located = await (backwards ? finder.findPrevious : finder.findNext)({
    focus: false,
  })
  if (!located) message.value = t('vs.table.findUnavailable')
}
const replace = async (all: boolean) => {
  flushPreviewReplacement()
  const request = ++sequence
  const result = await (all ? finder.replaceAll : finder.replaceMatch)(
    replacement.value,
  )
  if (request !== sequence) return
  message.value = result.applied
    ? t('vs.table.findReplaced', { count: result.changedCells })
    : t(`vs.table.findReason_${result.reason}`)
}
const formTools = computed((): FindTool[] => {
  const tools: FindTool[] = [
    {
      key: 'search',
      label: t('vs.table.findSearch'),
      icon: 'cb:search',
      disabled: busy.value,
      primary: true,
      run: () => {
        search()
      },
    },
    {
      key: 'previous',
      label: t('vs.table.findPrevious'),
      icon: 'cb:chevron-up',
      disabled: navigationDisabled.value,
      run: () => {
        navigate(true)
      },
    },
    {
      key: 'next',
      label: t('vs.table.findNext'),
      icon: 'cb:chevron-down',
      disabled: navigationDisabled.value,
      run: () => {
        navigate()
      },
    },
    {
      key: 'replace',
      label: t('vs.table.findReplace'),
      mark: 'replace',
      disabled: replaceDisabled.value,
      run: () => {
        replace(false)
      },
    },
    {
      key: 'replace-all',
      label: t('vs.table.findReplaceAll'),
      mark: 'replace-all',
      disabled: replaceAllDisabled.value,
      run: () => {
        replace(true)
      },
    },
  ]
  if (busy.value) tools.push(cancelTool())
  return tools
})
const resultTools = computed((): FindTool[] => {
  const tools: FindTool[] = [
    {
      key: 'previous',
      label: t('vs.table.findPrevious'),
      icon: 'cb:chevron-left',
      disabled: navigationDisabled.value,
      run: () => {
        navigate(true)
      },
    },
    {
      key: 'next',
      label: t('vs.table.findNext'),
      icon: 'cb:chevron-right',
      disabled: navigationDisabled.value,
      run: () => {
        navigate()
      },
    },
    {
      key: 'replace',
      label: t('vs.table.findReplace'),
      mark: 'replace',
      disabled: replaceDisabled.value,
      run: () => {
        replace(false)
      },
    },
    {
      key: 'replace-all',
      label: t('vs.table.findReplaceAll'),
      mark: 'replace-all',
      disabled: replaceAllDisabled.value,
      run: () => {
        replace(true)
      },
    },
  ]
  if (busy.value) tools.push(cancelTool())
  tools.push(
    {
      key: 'expand',
      label: t('vs.table.findExpand'),
      icon: 'cb:chevron-down',
      disabled: false,
      run: () => {
        expand()
      },
    },
    {
      key: 'close',
      label: t('vs.table.findClose'),
      icon: 'cb:close',
      disabled: false,
      run: close,
    },
  )
  return tools
})
const enterSearch = (input: Event | KeyboardEvent) => {
  const event = input as KeyboardEvent
  if (!event.isComposing && !event.ctrlKey && !event.metaKey) {
    event.preventDefault()
    search()
  }
}
const setReplacement = (value: InputValue) => {
  if (compact.value) return
  replacement.value = value == null ? '' : String(value)
}
const ignoreBrowserFill = (event: Event) => {
  const inputEvent = event as InputEvent
  if (!autofillInputTypes.has(inputEvent.inputType)) return
  event.stopImmediatePropagation()
  const target = event.target as HTMLInputElement | null
  if (!target) return
  target.value = target.closest('[data-find-replacement]')
    ? replacement.value
    : text.value
}
const keydown = (event: KeyboardEvent) => {
  if (event.defaultPrevented || event.isComposing) return
  const target = event.target as HTMLElement
  const wrapper = trigger.value?.closest(`.${ns.b('wrapper')}`)
  const ownPanel = Boolean(panel.value?.contains(target))
  if (
    !ownPanel &&
    (!wrapper || target.closest(`.${ns.b('wrapper')}`) !== wrapper)
  )
    return
  if (
    finder.config.value.keyboard === false &&
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
    else (event.shiftKey ? finder.findPrevious : finder.findNext)()
  } else if (event.key === 'Escape' && (opened.value || busy.value)) {
    event.preventDefault()
    event.stopPropagation()
    if (busy.value) {
      sequence++
      finder.cancelFind()
      message.value = t('vs.table.findReason_cancelled')
    } else close()
  }
}
const api = { open, close, keydown }
onMounted(() => {
  runtime.panel.value = api
})
onBeforeUnmount(() => {
  schedulePreviewReplacement.cancel()
  if (runtime.panel.value === api) runtime.panel.value = undefined
})
defineExpose(api)
</script>

<template>
  <div :class="ns.e('find')">
    <SPopper
      v-model:visible="opened"
      :trigger="[]"
      placement="bottom-start"
      animation="none"
      :disabled="disabled || !finder.enabled.value"
      :show-arrow="false"
      :offset="8"
      :hide-after="0"
      persistent
      :close-on-click-outside="false"
      :close-on-reference-hidden="false"
      :show-close="!compact"
      :shift="{ padding: 8, crossAxis: true }"
      :outside-click-ignore="['.s-select__content']"
      :popper-class="[
        ns.e('find-panel'),
        ns.is('square', shape === 'square'),
        ns.is('compact', compact),
      ]"
      @show="shown"
      @hide="hidden"
    >
      <svg
        ref="trigger"
        :class="[
          ns.e('find-trigger'),
          ns.em('find-trigger', resolvedSize),
          ns.is('icon-only', !triggerText),
        ]"
        viewBox="0 0 128 128"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="button"
        :tabindex="triggerLocked ? -1 : 0"
        :aria-disabled="triggerLocked || undefined"
        :aria-expanded="opened"
        :aria-controls="id"
        :aria-label="triggerText || t('vs.table.findTitle')"
        aria-haspopup="dialog"
        focusable="true"
        @click="togglePanel"
        @keydown="onTriggerKeydown"
      >
        <path
          :class="ns.e('find-mark-stroke')"
          d="M31 73L17 87"
          stroke-width="8"
          stroke-linecap="round"
        />
        <circle
          :class="ns.e('find-mark-lens')"
          cx="49"
          cy="51"
          r="28"
          stroke-width="7"
        />
        <text
          :class="ns.e('find-mark-letter')"
          x="49"
          y="52"
          font-family="Arial, Helvetica, sans-serif"
          font-size="25"
          font-weight="700"
          text-anchor="middle"
          dominant-baseline="middle"
        >
          Aa
        </text>
        <path
          :class="ns.e('find-mark-forward')"
          d="M82 43C89 39 97 39 104 42"
          stroke-width="6"
          stroke-linecap="round"
        />
        <path
          :class="ns.e('find-mark-forward-head')"
          d="M101 32L112 41L101 50Z"
          stroke-width="3"
          stroke-linejoin="round"
        />
        <path
          :class="ns.e('find-mark-back')"
          d="M108 67C101 71 93 71 86 68"
          stroke-width="6"
          stroke-linecap="round"
        />
        <path
          :class="ns.e('find-mark-back-head')"
          d="M89 61L78 69L89 78Z"
          stroke-width="3"
          stroke-linejoin="round"
        />
      </svg>
      <template #content>
        <div
          :id="id"
          ref="panel"
          role="search"
          :class="ns.e('find-body')"
          :aria-label="t('vs.table.findTitle')"
          :aria-busy="busy"
          @keydown="keydown"
        >
          <div v-show="!compact" :inert="compact" :class="ns.e('find-form')">
            <div :class="ns.e('find-autofill-shield')" aria-hidden="true">
              <input tabindex="-1" type="text" autocomplete="username" />
              <input
                tabindex="-1"
                type="password"
                autocomplete="current-password"
              />
            </div>
            <div :class="ns.e('find-fields')">
              <div data-find-query @input.capture="ignoreBrowserFill">
                <label :for="`${id}-find-q`">{{
                  t('vs.table.findText')
                }}</label>
                <SInput
                  :id="`${id}-find-q`"
                  v-model="text"
                  :name="`${id}-find-q`"
                  auto-complete="off"
                  data-1p-ignore
                  data-lpignore="true"
                  data-form-type="other"
                  :spellcheck="false"
                  :disabled="compact"
                  :size="resolvedSize"
                  block
                  @update:model-value="clearResults"
                  @keydown.enter="enterSearch"
                />
              </div>
              <div data-find-replacement @input.capture="ignoreBrowserFill">
                <label :for="`${id}-find-s`">{{
                  t('vs.table.findReplacement')
                }}</label>
                <SInput
                  :id="`${id}-find-s`"
                  :model-value="replacement"
                  :name="`${id}-find-s`"
                  auto-complete="off"
                  data-1p-ignore
                  data-lpignore="true"
                  data-form-type="other"
                  :spellcheck="false"
                  :disabled="compact"
                  :size="resolvedSize"
                  block
                  @update:model-value="setReplacement"
                />
              </div>
              <div>
                <span :id="`${id}-scope`">{{ t('vs.table.findScope') }}</span>
                <SSelect
                  v-model="scope"
                  :aria-labelledby="`${id}-scope`"
                  :options="scopes"
                  :disabled="compact"
                  block
                  @update:model-value="clearResults"
                />
              </div>
            </div>
            <div :class="ns.e('find-actions')">
              <SCheckbox
                v-model="caseSensitive"
                @update:model-value="clearResults"
                >{{ t('vs.table.findCase') }}</SCheckbox
              >
              <SCheckbox
                v-model="wholeCell"
                @update:model-value="clearResults"
                >{{ t('vs.table.findWhole') }}</SCheckbox
              >
              <div :class="ns.e('find-tools')">
                <STooltip
                  v-for="tool in formTools"
                  :key="tool.key"
                  placement="top"
                  :z-index="tooltipZIndex"
                  :show-after="200"
                  :hide-after="80"
                >
                  <span :class="ns.e('find-tool')">
                    <SButton
                      icon
                      :size="resolvedSize"
                      :flat="!tool.primary"
                      :debounce="false"
                      :disabled="tool.disabled"
                      :aria-label="tool.label"
                      @click="tool.run"
                    >
                      <TableFindActionMark v-if="tool.mark" :kind="tool.mark" />
                      <SIcon v-else :name="tool.icon" />
                    </SButton>
                  </span>
                  <template #content>{{ tool.label }}</template>
                </STooltip>
              </div>
            </div>
            <p
              v-if="status"
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              {{ status }}
            </p>
          </div>
          <div v-show="compact" :inert="!compact" :class="ns.e('find-results')">
            <span role="status" aria-live="polite" aria-atomic="true">{{
              status
            }}</span>
            <STooltip
              v-for="tool in resultTools"
              :key="tool.key"
              placement="top"
              :z-index="tooltipZIndex"
              :show-after="200"
              :hide-after="80"
            >
              <span :class="ns.e('find-tool')">
                <SButton
                  icon
                  :size="resolvedSize"
                  flat
                  :debounce="false"
                  :disabled="tool.disabled"
                  :aria-label="tool.label"
                  @click="tool.run"
                >
                  <TableFindActionMark v-if="tool.mark" :kind="tool.mark" />
                  <SIcon v-else :name="tool.icon" />
                </SButton>
              </span>
              <template #content>{{ tool.label }}</template>
            </STooltip>
          </div>
        </div>
      </template>
    </SPopper>
    <span v-if="triggerText" :class="ns.e('find-caption')" @click="togglePanel">
      {{ triggerText }}
    </span>
  </div>
</template>
