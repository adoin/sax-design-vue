<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  watch,
} from 'vue'
import { SPopper } from '@vuesax-alpha/components/popper'
import { SFocusTrap } from '@vuesax-alpha/components/focus-trap'
import { useId, useLocale, useNamespace, useShape } from '@vuesax-alpha/hooks'
import { aiEditorEmits, aiEditorProps } from './ai-editor'
import { useAiEditorDocument } from './use-ai-editor-document'
import { useAiEditorAssistant } from './use-ai-editor-assistant'
import AiEditorToolbar from './ai-editor-toolbar.vue'
import type {
  AiEditorFormat,
  AiEditorSelection,
  AiEditorStatus,
} from './ai-editor'
import type { PopperInstance } from '@vuesax-alpha/components/popper'

defineOptions({ name: 'SAiEditor' })
defineSlots<{
  'ai-icon'(props: { status: AiEditorStatus; busy: boolean }): unknown
  title(): unknown
  toolbar(props: {
    selection: AiEditorSelection
    format: (format: AiEditorFormat) => void
    activeFormats: AiEditorFormat[]
  }): unknown
  answer(props: {
    text: string
    status: AiEditorStatus
    selection: AiEditorSelection
    apply: (mode: 'replace' | 'insert') => void
  }): unknown
}>()
const props = defineProps(aiEditorProps)
const initialContent = props.modelValue
const emit = defineEmits(aiEditorEmits)
const { t } = useLocale()
const ns = useNamespace('ai-editor')
const shape = useShape()
const root = ref<HTMLElement>()
const documentId = useId()
const outsideClickIgnore = computed(() => [`[id="${documentId.value}"]`])
const popper = ref<PopperInstance>()
const visible = ref(false)
const asking = ref(false)
const prompt = ref('')
const document = useAiEditorDocument(props, emit, root)
const assistant = useAiEditorAssistant(props, emit, () => document.text.value)
const { busy, status, response, error, sources, statusLabel } = assistant
const canAsk = computed(
  () =>
    !props.disabled && (Boolean(props.request) || props.answer !== undefined),
)
const reference = shallowRef({
  contextElement: undefined as HTMLElement | undefined,
  getBoundingClientRect: () => {
    const selected = document.selection.value
    const range = selected && document.rangeFor(selected.start, selected.end)
    return (
      range?.getBoundingClientRect?.() ??
      root.value?.getBoundingClientRect() ??
      new DOMRect()
    )
  },
})
let selectionFrame: number | undefined
let positionFrame: number | undefined
let ownerDocument: Document | undefined
let dismissedSelection: AiEditorSelection | null = null

const close = (restoreFocus = false) => {
  dismissedSelection = document.selection.value
  assistant.cancel()
  visible.value = false
  asking.value = false
  prompt.value = ''
  const highlighted = document.highlighted.value
  const caret =
    root.value?.ownerDocument.activeElement === root.value
      ? document.readSelection()
      : null
  document.highlighted.value = false
  if (highlighted) document.render()
  if (restoreFocus && document.selection.value) {
    root.value?.focus({ preventScroll: true })
    document.restore(
      document.selection.value.start,
      document.selection.value.end,
    )
  } else if (highlighted && caret) {
    document.restore(caret.start, caret.end)
  }
}
const updateSelection = () => {
  if (
    asking.value ||
    busy.value ||
    popper.value?.contentRef?.contains(ownerDocument?.activeElement ?? null)
  )
    return
  if (props.disabled) {
    visible.value = false
    return
  }
  const selected = document.captureSelection()
  if (!selected) dismissedSelection = null
  const dismissed =
    selected &&
    dismissedSelection &&
    selected.start === dismissedSelection.start &&
    selected.end === dismissedSelection.end &&
    selected.text === dismissedSelection.text
  visible.value = Boolean(selected?.text.trim()) && !dismissed
  if (visible.value) nextTick(() => popper.value?.updatePopper())
}
const scheduleSelection = () => {
  if (selectionFrame !== undefined) return
  selectionFrame = requestAnimationFrame(() => {
    selectionFrame = undefined
    updateSelection()
  })
}
const select = (start: number, end: number) => {
  if (props.disabled) return false
  close()
  dismissedSelection = null
  const selected = document.setSelection(start, end)
  root.value?.focus({ preventScroll: true })
  if (selected) document.restore(selected.start, selected.end)
  updateSelection()
  return Boolean(selected)
}
const enterAsk = () => {
  if (!canAsk.value || !document.selection.value) return
  dismissedSelection = null
  visible.value = true
  asking.value = true
  document.highlighted.value = true
  document.render()
  nextTick(() =>
    popper.value?.contentRef?.querySelector<HTMLInputElement>('input')?.focus(),
  )
}
const ask = (query = prompt.value) => {
  if (!document.selection.value) return Promise.resolve(false)
  prompt.value = query
  enterAsk()
  return assistant.ask(query, document.selection.value)
}
const apply = (mode: 'replace' | 'insert') => {
  const selected = document.selection.value
  if (
    !selected ||
    props.readonly ||
    props.disabled ||
    status.value !== 'complete'
  )
    return false
  const answer = response.value
  if (mode === 'replace')
    document.replaceRange(selected.start, selected.end, answer)
  else {
    const lineEnd = document.text.value.indexOf('\n', selected.end)
    const end = lineEnd < 0 ? document.text.value.length : lineEnd
    document.replaceRange(end, end, `\n${answer}`)
  }
  close()
  emit('apply', answer, mode)
  return true
}
const copy = async () => {
  try {
    await navigator.clipboard.writeText(response.value)
  } catch (reason) {
    error.value = t('vs.aiEditor.copyError')
    emit('error', reason)
  }
}
const onKeydown = (event: KeyboardEvent) => {
  if (event.isComposing || props.disabled) return
  if (event.key === 'Escape') {
    event.preventDefault()
    close(true)
    return
  }
  if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
    event.preventDefault()
    enterAsk()
    return
  }
  if (props.readonly || busy.value) return
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z') {
    event.preventDefault()
    document.undo(event.shiftKey)
    return
  }
  const shortcuts: Record<string, AiEditorFormat> = {
    b: 'bold',
    i: 'italic',
    u: 'underline',
  }
  const format = shortcuts[event.key.toLowerCase()]
  if ((event.ctrlKey || event.metaKey) && format) {
    event.preventDefault()
    updateSelection()
    document.format(format)
  }
}
const onBeforeInput = (event: InputEvent) => {
  if (props.readonly || props.disabled || busy.value) {
    event.preventDefault()
    return
  }
  if (
    !event.isComposing &&
    ['insertParagraph', 'insertLineBreak'].includes(event.inputType)
  ) {
    event.preventDefault()
    document.insert('\n')
  }
}
const onPaste = (event: ClipboardEvent) => {
  event.preventDefault()
  const value = event.clipboardData?.getData('text/plain')
  if (value && !props.readonly && !props.disabled && !busy.value)
    document.insert(value)
}
const onDrop = (event: DragEvent) => {
  event.preventDefault()
  const value = event.dataTransfer?.getData('text/plain')
  if (value && !props.readonly && !props.disabled && !busy.value)
    document.insert(value)
}
watch(document.text, () => close())
watch([visible, asking, status, response, error, sources], () => {
  if (!visible.value || positionFrame !== undefined) return
  positionFrame = requestAnimationFrame(() => {
    positionFrame = undefined
    nextTick(() => popper.value?.updatePopper())
  })
})
watch(
  () => props.disabled,
  (disabled) => {
    if (disabled) close()
  },
)
onMounted(() => {
  reference.value = { ...reference.value, contextElement: root.value }
  ownerDocument = root.value?.ownerDocument
  ownerDocument?.addEventListener('selectionchange', scheduleSelection)
})
onBeforeUnmount(() => {
  ownerDocument?.removeEventListener('selectionchange', scheduleSelection)
  if (selectionFrame !== undefined) cancelAnimationFrame(selectionFrame)
  if (positionFrame !== undefined) cancelAnimationFrame(positionFrame)
})
defineExpose({
  focus: () => root.value?.focus(),
  select,
  format: document.format,
  ask,
  cancel: assistant.cancel,
  close,
  apply,
})
</script>

<template>
  <section
    :class="[
      ns.b(),
      ns.is(shape),
      ns.is('disabled', disabled),
      ns.is('animated', animate),
    ]"
  >
    <header v-if="title || $slots.title" :class="ns.e('title')">
      <slot name="title">{{ title }}</slot>
    </header>
    <div
      :id="documentId"
      ref="root"
      :class="[ns.e('document'), ns.is('empty', !document.text.value)]"
      :contenteditable="!disabled && !readonly && !busy"
      role="textbox"
      aria-multiline="true"
      dir="auto"
      :aria-label="label || title || t('vs.aiEditor.document')"
      :aria-readonly="readonly || busy"
      :aria-disabled="disabled"
      :aria-busy="busy"
      :tabindex="disabled ? -1 : 0"
      :data-placeholder="placeholder || t('vs.aiEditor.placeholder')"
      spellcheck="false"
      @input="document.handleInput"
      @beforeinput="onBeforeInput"
      @paste="onPaste"
      @dragover.prevent
      @drop="onDrop"
      @keydown="onKeydown"
      @pointerup="updateSelection"
      @keyup="scheduleSelection"
      @compositionstart="document.startComposition"
      @compositionend="document.endComposition"
    >
      {{ initialContent }}
    </div>
    <SPopper
      ref="popper"
      :visible="visible"
      virtual-triggering
      :virtual-ref="reference"
      :trigger="[]"
      :outside-click-ignore="outsideClickIgnore"
      :show-arrow="false"
      :offset="10"
      :close-on-reference-hidden="true"
      :persistent="false"
      :popper-class="[ns.e('popper'), ns.is(shape)]"
      :shift="{ padding: 12 }"
      :flip="{ padding: 12 }"
      @update:visible="
        (value) => {
          if (!value) close()
        }
      "
    >
      <template #content>
        <SFocusTrap
          :trapped="asking && visible"
          :focus-trap-el="popper?.contentRef"
          @focus-after-trapped.prevent
          @focus-after-released.prevent
          @focusout-prevented.prevent
        >
          <AiEditorToolbar
            v-if="document.selection.value"
            v-model:prompt="prompt"
            :asking="asking"
            :ai-icon="aiIcon"
            :busy="busy"
            :status="status"
            :status-label="statusLabel"
            :response="response"
            :error="error"
            :sources="sources"
            :selection="document.selection.value"
            :formats="formats"
            :active-formats="document.activeFormats.value"
            :readonly="readonly"
            :can-ask="canAsk"
            :prompt-placeholder="promptPlaceholder"
            :animated="animate"
            :shape="shape"
            @ask="enterAsk"
            @submit="ask()"
            @close="close(true)"
            @stop="assistant.cancel()"
            @format="document.format"
            @apply="apply"
            @copy="copy"
            @resize="nextTick(() => popper?.updatePopper())"
            @keydown.esc.stop.prevent="close(true)"
          >
            <template v-if="$slots['ai-icon']" #ai-icon="slotProps">
              <slot name="ai-icon" v-bind="slotProps" />
            </template>
            <template v-if="$slots.toolbar" #toolbar="slotProps"
              ><slot name="toolbar" v-bind="slotProps"
            /></template>
            <template v-if="$slots.answer" #answer="slotProps"
              ><slot name="answer" v-bind="slotProps"
            /></template>
          </AiEditorToolbar>
        </SFocusTrap>
      </template>
    </SPopper>
  </section>
</template>
