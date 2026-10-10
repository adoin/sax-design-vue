<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import { useLocale, useNamespace, useShape } from '@vuesax-alpha/hooks'
import { SButton } from '@vuesax-alpha/components/button'

import { STextarea } from '@vuesax-alpha/components/textarea'
import { STag } from '@vuesax-alpha/components/tag'
import { chatInputEmits, chatInputProps } from './chat-input'

defineOptions({ name: 'SChatInput' })
const props = defineProps(chatInputProps)
const emit = defineEmits(chatInputEmits)
const ns = useNamespace('chat-input')
const shape = useShape()
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
    :class="[ns.b(), 's-agent-surface', `is-${shape}`]"
    :aria-busy="loading"
    role="group"
    :aria-label="label || t('vs.agent.inputLabel')"
  >
    <slot name="attachments" :attachments="attachments"
      ><div v-if="attachments.length" class="s-agent-actions">
        <STag
          v-for="attachment in attachments"
          :key="attachment.id"
          closable
          :shape="shape"
          :disabled="disabled || loading || attachment.disabled"
          @close="emit('remove-attachment', attachment)"
          >{{ attachment.name }}</STag
        >
      </div></slot
    ><STextarea
      ref="input"
      :model-value="modelValue"
      :label="label || t('vs.agent.inputLabel')"
      :placeholder="placeholder || t('vs.agent.placeholder')"
      :shape="shape"
      :disabled="disabled"
      :readonly="loading"
      :max-length="maxLength"
      :auto-size="{ minRows: 2, maxRows: 8 }"
      @update:model-value="emit('update:modelValue', $event)"
      @keydown="keydown"
    />
    <div class="s-agent-heading">
      <div class="s-agent-actions">
        <SButton
          type="flat"
          :shape="shape"
          :disabled="disabled || loading"
          @click="emit('attach')"
          >{{ t('vs.agent.attach') }}</SButton
        ><slot name="tools" />
      </div>
      <SButton
        v-if="loading"
        :shape="shape"
        :disabled="disabled"
        @click="emit('stop')"
        >{{ t('vs.agent.stop') }}</SButton
      ><SButton v-else :shape="shape" :disabled="!canSubmit" @click="submit">{{
        t('vs.agent.send')
      }}</SButton>
    </div>
    <slot />
  </section>
</template>
