<script setup lang="ts">
import {
  computed,
  onBeforeUnmount,
  onMounted,
  shallowRef,
  useTemplateRef,
} from 'vue'
import { useLocale, useNamespace } from '@vuesax-alpha/hooks'
import { SIcon } from '@vuesax-alpha/components/icon'
import { SButton } from '@vuesax-alpha/components/button'

import { STextarea } from '@vuesax-alpha/components/textarea'
import { pickUploadFiles } from '@vuesax-alpha/components/upload'
import ChatAttachments from './chat-attachments.vue'
import ChatModelSelector from './chat-model-selector.vue'
import ChatVoiceWave from './chat-voice-wave.vue'
import { useChatAudioMeter } from './use-chat-audio-meter'
import { useChatVoice } from './use-chat-voice'
import { chatInputEmits, chatInputProps } from './chat-input'
import type { AgentAttachment } from '../../agent-editor/src/agent-shared/types'

defineOptions({ name: 'SChatInput' })
const props = defineProps(chatInputProps)
const emit = defineEmits(chatInputEmits)
const ns = useNamespace('chat-input')
const { t } = useLocale()
const input = useTemplateRef<InstanceType<typeof STextarea>>('input')
const host = useTemplateRef<HTMLElement>('host')
const multiline = shallowRef(false)
let resize: ResizeObserver | undefined
onMounted(() => {
  const textarea = host.value?.querySelector('textarea')
  if (textarea && typeof ResizeObserver !== 'undefined') {
    const row = host.value?.querySelector<HTMLElement>('.s-agent-composer-row')
    resize = new ResizeObserver(() => {
      multiline.value =
        textarea.clientHeight > 46 || (row?.clientHeight ?? 0) > 46
    })
    resize.observe(textarea)
    if (row) resize.observe(row)
  }
})
const picking = shallowRef(false)
const fileError = shallowRef(false)
const picker = new AbortController()
onBeforeUnmount(() => {
  resize?.disconnect()
  picker.abort()
})
const pick = async () => {
  if (props.disabled || props.loading || picking.value) return
  emit('attach')
  if (!props.filePicker) return
  picking.value = true
  fileError.value = false
  try {
    const files = await pickUploadFiles({
      multiple: true,
      accept: props.accept,
      limitSize: props.fileLimitSize,
      signal: picker.signal,
    })
    if (!files || picker.signal.aborted || props.disabled || props.loading)
      return
    const additions = files.map((file, index) => ({
      id: `${Date.now()}-${index}-${file.name}`,
      name: file.name,
      file,
      type: file.type,
    }))
    emit('update:attachments', [...props.attachments, ...additions])
    emit('files-selected', files)
  } catch (reason) {
    if (!picker.signal.aborted) {
      fileError.value = true
      emit('file-error', reason)
    }
  } finally {
    picking.value = false
  }
}
const remove = (attachment: AgentAttachment) => {
  if (props.disabled || props.loading || attachment.disabled) return
  emit(
    'update:attachments',
    props.attachments.filter((item) => item.id !== attachment.id),
  )
  emit('remove-attachment', attachment)
}
const voice = useChatVoice(
  props,
  (text) => emit('update:modelValue', text),
  (event, reason) => {
    if (event === 'voice-error') emit('voice-error', reason)
    else if (event === 'voice-start') emit('voice-start')
    else emit('voice-end')
  },
)
const levels = useChatAudioMeter(voice.listening)
const hasDraft = computed(
  () => !!props.modelValue.trim() || props.attachments.length > 0,
)
const canSubmit = computed(
  () =>
    !props.disabled &&
    !props.loading &&
    !voice.listening.value &&
    hasDraft.value,
)
const submit = () => {
  if (canSubmit.value)
    emit('submit', props.modelValue, props.attachments.slice())
}
const keydown = (event: KeyboardEvent) => {
  if (event.key !== 'Enter' || event.isComposing || event.keyCode === 229)
    return
  if (
    (props.submitOnEnter && !event.shiftKey && !event.altKey) ||
    event.ctrlKey ||
    event.metaKey
  ) {
    event.preventDefault()
    submit()
  }
}
const primaryMode = computed(() =>
  props.loading
    ? 'stop'
    : voice.listening.value
      ? 'voice-stop'
      : hasDraft.value || !props.voiceInput
        ? 'send'
        : 'voice',
)
const primaryLabel = computed(() =>
  t(
    {
      stop: 'vs.agent.stop',
      'voice-stop': 'vs.agent.stopVoice',
      send: 'vs.agent.send',
      voice: 'vs.agent.startVoice',
    }[primaryMode.value],
  ),
)
const primaryIcon = computed(() =>
  primaryMode.value === 'send'
    ? 'cb:arrow-up'
    : primaryMode.value === 'voice'
      ? 'cb:waveform'
      : 'cb:stop',
)
const primaryAction = () => {
  if (primaryMode.value === 'stop') emit('stop')
  else if (primaryMode.value === 'voice-stop') voice.stop()
  else if (primaryMode.value === 'send') submit()
  else voice.start()
}
defineExpose({
  focus: () => input.value?.focus(),
  submit,
  startVoice: voice.start,
  stopVoice: voice.stop,
})
</script>
<template>
  <section
    ref="host"
    :class="[
      ns.b(),
      's-agent-surface',
      { 'is-expanded': attachments.length || multiline },
    ]"
    :aria-busy="loading"
    role="group"
    :aria-label="label || t('vs.agent.inputLabel')"
  >
    <slot name="attachments" :attachments="attachments">
      <ChatAttachments
        v-if="attachments.length"
        :attachments="attachments"
        :disabled="disabled || loading"
        @remove="remove"
      />
    </slot>
    <div class="s-agent-composer-row">
      <SButton
        icon
        size="small"
        type="flat"
        shape="rounded"
        :aria-label="t('vs.agent.attach')"
        :disabled="disabled || loading || picking"
        @click="pick"
        ><SIcon name="cb:add" :size="28" /><span class="s-agent-sr-only">{{
          t('vs.agent.attach')
        }}</span></SButton
      >
      <STextarea
        ref="input"
        :model-value="modelValue"
        :aria-label="label || t('vs.agent.inputLabel')"
        :placeholder="placeholder || t('vs.agent.placeholder')"
        shape="rounded"
        :disabled="disabled"
        :readonly="loading || voice.listening.value"
        :max-length="maxLength"
        :auto-size="{ minRows: 1, maxRows: 8 }"
        :rows="1"
        @update:model-value="emit('update:modelValue', $event)"
        @keydown="keydown"
      />
      <div class="s-agent-actions s-chat-input__tools">
        <slot name="tools" />
        <ChatModelSelector
          v-if="models.length"
          :model="model"
          :models="models"
          :fast="fast"
          :reasoning="reasoning"
          :disabled="disabled || loading"
          @update:model="emit('update:model', $event)"
          @update:fast="emit('update:fast', $event)"
          @update:reasoning="emit('update:reasoning', $event)"
        />
        <SButton
          v-if="voiceInput"
          icon
          size="small"
          type="flat"
          shape="rounded"
          :aria-label="
            t(voice.listening.value ? 'vs.agent.stopVoice' : 'vs.agent.dictate')
          "
          :aria-pressed="voice.listening.value"
          :disabled="disabled || loading"
          @click="voice.start"
          ><SIcon
            :size="24"
            :name="
              voice.listening.value ? 'cb:microphone-off' : 'cb:microphone'
            "
        /></SButton>
      </div>
      <SButton
        icon
        size="small"
        shape="rounded"
        :aria-label="primaryLabel"
        :disabled="disabled || (primaryMode === 'send' && !canSubmit)"
        @click="primaryAction"
        ><ChatVoiceWave
          v-if="primaryMode === 'voice' || primaryMode === 'voice-stop'"
          :active="voice.listening.value"
          :levels="levels"
        /><SIcon v-else :name="primaryIcon" :size="20" /><span
          class="s-agent-sr-only"
          >{{ primaryLabel }}</span
        ></SButton
      >
    </div>
    <p
      v-if="voice.error.value || fileError"
      class="s-chat-input__voice-error"
      role="status"
    >
      {{
        t(
          fileError
            ? 'vs.agent.fileFailed'
            : voice.error.value === 'unsupported'
              ? 'vs.agent.voiceUnsupported'
              : 'vs.agent.voiceFailed',
        )
      }}
    </p>
    <slot />
  </section>
</template>
