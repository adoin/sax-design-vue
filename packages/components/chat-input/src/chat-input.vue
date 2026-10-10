<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import { useLocale, useNamespace } from '@vuesax-alpha/hooks'
import { SIcon } from '@vuesax-alpha/components/icon'
import { SButton } from '@vuesax-alpha/components/button'

import { STextarea } from '@vuesax-alpha/components/textarea'
import { STag } from '@vuesax-alpha/components/tag'
import { chatInputEmits, chatInputProps } from './chat-input'

defineOptions({ name: 'SChatInput' })
const props = defineProps(chatInputProps)
const emit = defineEmits(chatInputEmits)
const ns = useNamespace('chat-input')
const { t } = useLocale()
const input = useTemplateRef<InstanceType<typeof STextarea>>('input')
const canSubmit = computed(
  () =>
    !props.disabled &&
    !props.loading &&
    (!!props.modelValue.trim() || props.attachments.length > 0),
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
defineExpose({ focus: () => input.value?.focus(), submit })
</script>
<template>
  <section
    :class="[ns.b(), 's-agent-surface']"
    :aria-busy="loading"
    role="group"
    :aria-label="label || t('vs.agent.inputLabel')"
  >
    <slot name="attachments" :attachments="attachments">
      <div v-if="attachments.length" class="s-agent-actions">
        <STag
          v-for="attachment in attachments"
          :key="attachment.id"
          closable
          shape="rounded"
          :disabled="disabled || loading || attachment.disabled"
          @close="emit('remove-attachment', attachment)"
          >{{ attachment.name }}</STag
        >
      </div>
    </slot>
    <div class="s-agent-composer-row">
      <SButton
        icon
        size="small"
        type="flat"
        shape="rounded"
        :aria-label="t('vs.agent.attach')"
        :disabled="disabled || loading"
        @click="emit('attach')"
        ><SIcon name="cb:add" /><span class="s-agent-sr-only">{{
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
        :readonly="loading"
        :max-length="maxLength"
        :auto-size="{ minRows: 1, maxRows: 8 }"
        :rows="1"
        @update:model-value="emit('update:modelValue', $event)"
        @keydown="keydown"
      />
      <div class="s-agent-actions"><slot name="tools" /></div>
      <SButton
        v-if="loading"
        icon
        size="small"
        shape="rounded"
        :aria-label="t('vs.agent.stop')"
        :disabled="disabled"
        @click="emit('stop')"
        ><SIcon name="cb:stop" /><span class="s-agent-sr-only">{{
          t('vs.agent.stop')
        }}</span></SButton
      >
      <SButton
        v-else
        icon
        size="small"
        shape="rounded"
        :aria-label="t('vs.agent.send')"
        :disabled="!canSubmit"
        @click="submit"
        ><SIcon name="cb:arrow-up" /><span class="s-agent-sr-only">{{
          t('vs.agent.send')
        }}</span></SButton
      >
    </div>
    <slot />
  </section>
</template>
